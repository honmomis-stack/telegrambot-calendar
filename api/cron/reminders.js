// api/cron/reminders.js
// រត់ដោយ Vercel Cron (ឬ external cron) → ផ្ញើ reminder មុនព្រឹត្តិការណ៍។
//
// សុវត្ថិភាព៖ ផ្ទៀងផ្ទាត់ header Authorization: Bearer <CRON_SECRET>។
// Vercel បញ្ជូន header នេះដោយស្វ័យប្រវត្តិពេលមាន env CRON_SECRET។
// External cron (cron-job.org / GitHub Actions) ត្រូវផ្ញើ header ដូចគ្នា។
//
// Logic៖ សម្រាប់ user ម្នាក់ៗ → list events ក្នុង window [now, now+reminder_minutes]
//        បើ event ចូល window ហើយមិនទាន់ផ្ញើ → ផ្ញើ reminder ម្ដង (idempotent)។

import { config } from '../../lib/config.js';
import { listConnectedUsers, getRefreshToken, disconnectUser, wasReminderSent, markReminderSent, getDueReminders, markScheduledSent, getHolidaysInRange, wasDailySent, markDailySent , listLocalEvents, listAllUsers} from '../../lib/db.js';
import { refreshAccessToken, listEvents } from '../../lib/google.js';
import { eventStartDate, formatEventTime, ymdInTz } from '../../lib/datetime.js';
import { sendMessage, esc } from '../../lib/telegram.js';
import { khmerLunar, silaLabel } from '../../lib/khmercal.js';

export default async function handler(req, res) {
  // ផ្ទៀងផ្ទាត់ secret
  const auth = req.headers['authorization'] || '';
  if (auth !== `Bearer ${config.cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const now = Date.now();
  let users = [];
  try {
    users = await listConnectedUsers();
  } catch (err) {
    console.error('[cron] list users failed:', err.message);
    return res.status(500).json({ error: 'db error' });
  }

  let checked = 0;
  let sent = 0;

  for (const user of users) {
    try {
      const reminderMin = user.reminder_minutes ?? config.defaultReminderMinutes;
      const tz = user.timezone || config.defaultTimezone;
      const refresh = getRefreshToken(user);
      if (!refresh) continue;

      let accessToken;
      try {
        accessToken = await refreshAccessToken(refresh);
      } catch (err) {
        if (err.status === 400) {
          // token revoked → ផ្ដាច់ស្ងាត់ៗ (cron មិនផ្ញើសារ spam)
          await disconnectUser(user.telegram_id);
        }
        continue;
      }

      const windowEnd = new Date(now + reminderMin * 60000).toISOString();
      const events = await listEvents(accessToken, {
        timeMin: new Date(now).toISOString(),
        timeMax: windowEnd,
        maxResults: 20,
      });
      checked++;

      for (const ev of events) {
        const startDate = eventStartDate(ev);
        if (!startDate) continue;
        // រំលងព្រឹត្តិការណ៍ដែលចាប់ផ្ដើមរួច
        if (startDate.getTime() < now) continue;
        // bot-created events → handled by scheduled_reminders (កុំ remind ស្ទួន)
        if (ev.extendedProperties?.private?.viaBot === '1') continue;

        const eventStartIso = startDate.toISOString();
        if (await wasReminderSent(user.telegram_id, ev.id, eventStartIso)) continue;

        const minsLeft = Math.max(0, Math.round((startDate.getTime() - now) / 60000));
        const when = formatEventTime(ev, tz);
        const loc = ev.location ? `\n📍 ${esc(ev.location)}` : '';
        await sendMessage(
          user.telegram_id,
          `🔔 <b>រំលឹក</b> (ក្នុង ~${minsLeft} នាទី)\n\n` +
            `<b>${esc(ev.summary || '(គ្មានចំណងជើង)')}</b>\n🕒 ${esc(when)}${loc}`
        );
        await markReminderSent(user.telegram_id, ev.id, eventStartIso);
        sent++;
      }
    } catch (err) {
      console.error('[cron] user', user.telegram_id, 'error:', err.message);
      // បន្តទៅ user បន្ទាប់ — កុំឲ្យ user ម្នាក់ធ្វើឲ្យ cron ទាំងមូលដួល
    }
  }

  // ---- ដំណើរការ scheduled reminders (events បង្កើតតាម bot) ----
  let scheduledSent = 0;
  try {
    const due = await getDueReminders(100);
    for (const r of due) {
      try {
        await sendMessage(
          r.telegram_id,
          `🔔 <b>រំលឹក</b>\n\n<b>${esc(r.summary)}</b>\n🕒 ${esc(r.when_text || '')}`
        );
        await markScheduledSent(r.id);
        scheduledSent++;
      } catch (e) {
        console.error('[cron] scheduled reminder', r.id, 'error:', e.message);
      }
    }
  } catch (e) {
    console.error('[cron] getDueReminders failed:', e.message);
  }

  
  // ---- daily digest ពេលព្រឹក (ថ្ងៃសីល + ថ្ងៃឈប់សម្រាក + ព្រឹត្តិការណ៍) ----
  let dailySent = 0;
  try {
    const nowD = new Date();
    const winStart = new Date(now - 86400000).toISOString().slice(0, 10);
    const winEnd = new Date(now + 2 * 86400000).toISOString().slice(0, 10);
    const holidays = await getHolidaysInRange(winStart, winEnd);
    const holMap = {};
    for (const h of holidays) holMap[h.holiday_date] = h.name;

    // Get ALL users for daily digest (not just connected ones)
    let allUsers = users;
    try {
      if (typeof listAllUsers === 'function') {
        allUsers = await listAllUsers();
      }
    } catch (e) {}

    const quotes = [
      'ពេលវេលាជាមាសប្រាក់ ប្រើវាឲ្យមានន័យ! 🌟',
      'ជោគជ័យកើតចេញពីការខិតខំប្រឹងប្រែងជារៀងរាល់ថ្ងៃ! 💪',
      'ស្នាមញញឹមនៅពេលព្រឹក គឺជាថាមពលសម្រាប់ពេញមួយថ្ងៃ! 😊',
      'កុំខ្លាចនឹងបរាជ័យ ព្រោះវាជាមេរៀនឆ្ពោះទៅរកភាពជោគជ័យ! 🚀',
      'ការគិតល្អ នាំទៅរកលទ្ធផលល្អ! ✨',
      'សេចក្តីព្យាយាមគង់បានសម្រេច! 🎯',
      'អរុណសួស្ដី! ថ្ងៃនេះគឺជាឱកាសថ្មីសម្រាប់អ្នក! 🌅'
    ];

    for (const user of allUsers) {
      try {
        if (user.notify_daily === false) continue;
        const tz = user.timezone || config.defaultTimezone;
        const hour = parseInt(
          new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', hour12: false }).format(nowD),
          10
        );
        if (hour < 7) continue; 

        const todayYmd = ymdInTz(tz, nowD);
        const sila = silaLabel(todayYmd);
        const holToday = holMap[todayYmd];
        
        if (await wasDailySent(user.telegram_id, todayYmd)) continue;

        let localEvents = [];
        try {
          if (typeof listLocalEvents === 'function') {
            localEvents = await listLocalEvents(user.telegram_id, todayYmd, todayYmd);
          }
        } catch (e) {}

        // Send digest to everyone
        const kh = khmerLunar(todayYmd);
        let msg = `🌅 <b>អរុណសួស្ដី!</b>

📅 ${kh.lunar} (${kh.solar})`;
        if (sila) msg += `
🛕 <b>ថ្ងៃសីល៖</b> ${sila} — សូមរក្សាសីល 🙏`;
        if (holToday) msg += `
🎉 <b>ថ្ងៃឈប់សម្រាក៖</b> ${esc(holToday)}`;
        
        if (localEvents && localEvents.length > 0) {
          msg += `

📌 <b>ព្រឹត្តិការណ៍ថ្ងៃនេះ៖</b>`;
          for (const ev of localEvents) {
            msg += `
▫️ ${esc(ev.summary)} (${ev.event_time === '00:00' ? 'ពេញមួយថ្ងៃ' : ev.event_time})`;
          }
        }

        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        msg += `

💬 <i>${quote}</i>`;

        await sendMessage(user.telegram_id, msg);
        await markDailySent(user.telegram_id, todayYmd);
        dailySent++;
      } catch (e) {
        console.error('[cron] daily digest', user.telegram_id, 'error:', e.message);
      }
    }
  } catch (e) {
    console.error('[cron] daily digest block:', e.message);
  }


  
  // ---- Group Auto Report (6 PM) ----
  let dailyGroupReportSent = 0;
  try {
    const tz = config.defaultTimezone;
    const nowD = new Date();
    const hour = parseInt(new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', hour12: false }).format(nowD), 10);
    // Send around 6 PM (18:00)
    if (hour >= 18) {
      const todayYmd = ymdInTz(tz, nowD);
      let allGroups = [];
      try { if (typeof listAllGroups === 'function') allGroups = await listAllGroups(); } catch(e) {}
      
      for (const grp of allGroups) {
        try {
          if (await wasDailySent(grp.chat_id, todayYmd)) continue;

          const startOfMonth = todayYmd.slice(0, 8) + '01';
          let trxs = [];
          try { if (typeof getTransactions === 'function') trxs = await getTransactions(grp.chat_id, startOfMonth, todayYmd); } catch(e){}
          
          if (trxs && trxs.length > 0) {
            let totalInc = 0; let totalExp = 0;
            trxs.forEach(t => { if (t.trx_type === 'income') totalInc += parseFloat(t.amount); else totalExp += parseFloat(t.amount); });
            
            let repMsg = `🌆 <b>របាយការណ៍ហិរញ្ញវត្ថុប្រចាំថ្ងៃ</b>\n\n`;
            repMsg += `💵 <b>ចំណូលសរុបប្រចាំខែ៖</b> ${totalInc.toFixed(2)}$\n`;
            repMsg += `💸 <b>ចំណាយសរុបប្រចាំខែ៖</b> ${totalExp.toFixed(2)}$\n`;
            repMsg += `⚖️ <b>នៅសល់៖</b> ${(totalInc - totalExp).toFixed(2)}$\n`;
            
            await sendMessage(grp.chat_id, repMsg);
            await markDailySent(grp.chat_id, todayYmd);
            dailyGroupReportSent++;
          }
        } catch (e) {
          console.error('[cron] group report error:', e.message);
        }
      }
    }
  } catch (e) {
    console.error('[cron] group report block:', e.message);
  }

  return res.status(200).json({ ok: true, users: users.length, checked, sent, scheduledSent, dailySent });
}
