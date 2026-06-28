// api/app.js
// បម្រើ Admin Mini App (Telegram Web App) ជា HTML។
// សុវត្ថិភាព៖ UI នេះ​ជា​សាធារណៈ ប៉ុន្តែ​រាល់ action ហៅ /api/admin ដែល​ផ្ទៀង initData + admin id។

export default function handler(req, res) {
  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.status(200).send(HTML);
}

const HTML = `<!doctype html>
<html lang="km"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Admin Dashboard</title>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<style>

  :root {
    --bg-grad: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
    --card: rgba(255, 255, 255, 0.75);
    --card-blur: blur(20px);
    --text: #1d1d1f; 
    --hint: #86868b;
    --btn: #007AFF; --btnt: #fff;
    --link: #007AFF;
    --shadow: 0 10px 40px rgba(0,0,0,0.06);
    --line: rgba(0,0,0,0.08);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg-grad: linear-gradient(135deg, #1c1c1e 0%, #000000 100%);
      --card: rgba(44, 44, 46, 0.65);
      --text: #f5f5f7;
      --hint: #98989d;
      --line: rgba(255,255,255,0.1); --shadow: 0 10px 40px rgba(0,0,0,0.3);
      --btn: #0A84FF; --link: #0A84FF;
    }
  }
  *{box-sizing:border-box}
  body{font-family:'Outfit','Noto Sans Khmer',system-ui,sans-serif;margin:0;background:var(--bg-grad);color:var(--text);padding:20px;line-height:1.6;font-size:15px;min-height:100vh;background-attachment:fixed;}
  h1{font-size:24px;margin:0 0 6px;letter-spacing:-0.5px;font-weight:700} 
  h2{font-size:17px;margin:0 0 12px;font-weight:600}
  .hint{color:var(--hint);font-size:14px;font-weight:500}
  .card{background:var(--card);backdrop-filter:var(--card-blur);-webkit-backdrop-filter:var(--card-blur);border-radius:24px;padding:20px;margin:16px 0;box-shadow:var(--shadow);border:1px solid rgba(255,255,255,0.15)}
  .stats{display:flex;gap:16px}
  .stat{flex:1;text-align:center;background:rgba(120,120,128,0.05);padding:16px 10px;border-radius:18px} 
  .stat .n{font-size:32px;font-weight:700;letter-spacing:-1px} .stat .l{color:var(--hint);font-size:14px;margin-top:4px;font-weight:500}
  textarea,input{width:100%;border:none;border-radius:14px;padding:14px;font:inherit;background:rgba(120,120,128,0.06);color:var(--text);outline:none;border:1px solid transparent;transition:border-color 0.2s, background 0.2s}
  textarea:focus,input:focus{border-color:var(--btn);background:transparent}
  textarea{min-height:100px;resize:vertical}
  button{background:var(--btn);color:var(--btnt);border:none;border-radius:14px;padding:14px 16px;font:inherit;font-weight:600;font-size:15px;cursor:pointer;width:100%;margin-top:12px;transition:transform 0.15s, opacity 0.2s;box-shadow:0 4px 12px rgba(0,122,255,0.25)}
  button:active{transform:scale(0.97);opacity:0.9}
  button.sec{background:transparent;color:var(--link);border:1px solid rgba(0,122,255,0.3);width:auto;padding:8px 16px;margin:0;box-shadow:none}
  button.sec:active{background:rgba(0,122,255,0.1)}
  .row{display:flex;gap:12px;align-items:center}
  .hol{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}
  .hol:last-child{border:none}
  .hol .d{color:var(--hint);font-size:14px}
  .msg{font-size:14px;margin-top:8px;min-height:20px;font-weight:500}
  .err{color:#FF3B30}
  #gate{text-align:center;padding:60px 0;font-size:16px}
  .hidden{display:none}
</style></head>
<body>
<div id="gate" class="hint">កំពុងផ្ទៀងផ្ទាត់...</div>

<div id="app" class="hidden">
  <h1>🛠 ផ្ទាំងគ្រប់គ្រង</h1>
  <p class="hint">ផ្សាយដំណឹង · ថ្ងៃឈប់សម្រាក · ស្ថិតិ</p>

  <div class="card">
    <div class="stats">
      <div class="stat"><div class="n" id="s-users">–</div><div class="l">👥 អ្នកប្រើ</div></div>
      <div class="stat"><div class="n" id="s-hol">–</div><div class="l">🎉 ថ្ងៃឈប់</div></div>
    </div>
  </div>

  <div class="card">
    <h2>📢 ផ្សាយដំណឹង</h2>
    <textarea id="bc" placeholder="សារផ្ញើទៅអ្នកប្រើទាំងអស់..."></textarea>
    <button id="bc-btn">ផ្ញើទៅអ្នកប្រើទាំងអស់</button>
    <div class="msg" id="bc-msg"></div>
  </div>

  <div class="card">
    <h2>💎 Sponsor / អ្នកឧបត្ថម្ភ</h2>
    <textarea id="sp" placeholder="សារ (ឧ. ដើម្បីឲ្យ App ដំណើរការរលូន សូមអរគុណដល់ ...)"></textarea>
    <input id="sp-img" placeholder="URL រូបភាព (ស្រេចចិត្ត)" style="margin-top:8px">
    <label class="row" style="margin-top:8px;font-size:14px;color:var(--hint)">ចេញ ដង/សប្ដាហ៍៖
      <input type="number" id="sp-pw" min="0" max="14" value="2" style="width:64px;margin-left:8px"> <span class="hint">(0=បិទ)</span>
    </label>
    <button id="sp-btn">រក្សាទុក</button>
    <div class="msg" id="sp-msg"></div>
  </div>

  <div class="card">
    <h2>🖼 ផ្ទាំងពាណិជ្ជកម្ម (App Banner)</h2>
    <input id="ab-name" placeholder="ចំណងជើង (ឧ. Reankh.org)" style="margin-bottom:8px">
    <input id="ab-desc" placeholder="ការពិពណ៌នា (ឧ. សិក្សា · សៀវភៅ...)" style="margin-bottom:8px">
    <input id="ab-btn" placeholder="អក្សរលើប៊ូតុង (ឧ. ចូលទស្សនា →)" style="margin-bottom:8px">
    <input id="ab-url" placeholder="តំណភ្ជាប់ (URL)" style="margin-bottom:8px">
    <label style="display:flex;gap:8px;margin-bottom:8px;align-items:center;font-size:14px;color:var(--hint)">
      <input type="checkbox" id="ab-hide" style="width:auto"> លាក់ផ្ទាំងនេះ
    </label>
    <button id="ab-save">រក្សាទុក</button>
    <div class="msg" id="ab-msg"></div>
  </div>

  <div class="card">
    <h2>🎉 ថ្ងៃឈប់សម្រាក</h2>
    <div class="row"><input type="date" id="h-date"><input id="h-name" placeholder="ឈ្មោះ"></div>
    <button id="h-add">បន្ថែម</button>
    <div class="msg" id="h-msg"></div>
    <div id="h-list" style="margin-top:8px"></div>
  </div>
</div>

<script>
  const tg = window.Telegram?.WebApp;
  tg?.ready(); tg?.expand();
  const initData = tg?.initData || '';

  async function api(action, payload={}){
    const r = await fetch('/api/admin', { method:'POST',
      headers:{ 'content-type':'application/json', 'x-telegram-init-data': initData },
      body: JSON.stringify({ action, ...payload }) });
    if(!r.ok){ const e = await r.json().catch(()=>({})); throw new Error(e.error||('HTTP '+r.status)); }
    return r.json();
  }
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  async function loadStats(){ const d = await api('stats'); $('s-users').textContent=d.users; $('s-hol').textContent=d.holidays; }
  async function loadSponsor(){ const d = await api('getSponsorConfig'); $('sp').value=d.sponsor||''; $('sp-img').value=d.image||''; $('sp-pw').value=(d.perWeek!=null?d.perWeek:2); }
  async function loadAppBanner(){
    const d = await api('getAppBanner');
    if(d.banner){
      $('ab-name').value = d.banner.name || '';
      $('ab-desc').value = d.banner.desc || '';
      $('ab-btn').value = d.banner.btn || '';
      $('ab-url').value = d.banner.url || '';
      $('ab-hide').checked = !!d.banner.hidden;
    }
  }
  async function loadHolidays(){
    const d = await api('listHolidays');
    $('h-list').innerHTML = d.holidays.map(h =>
      '<div class="hol"><div><div>'+esc(h.name)+'</div><div class="d">'+h.holiday_date+'</div></div>'+
      '<button class="sec" data-del="'+h.holiday_date+'">លុប</button></div>').join('') || '<div class="hint">គ្មាន</div>';
    document.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
      b.disabled=true; try{ await api('deleteHoliday',{date:b.dataset.del}); await loadHolidays(); }catch(e){ alert(e.message); } });
  }

  $('bc-btn').onclick = async () => {
    const text = $('bc').value.trim(); if(!text) return;
    if(!confirm('ផ្ញើទៅអ្នកប្រើទាំងអស់?')) return;
    $('bc-btn').disabled=true; $('bc-msg').textContent='កំពុងផ្ញើ...';
    try{ const d = await api('broadcast',{text}); $('bc-msg').textContent='✅ ផ្ញើ '+d.sent+'/'+d.total; $('bc').value=''; }
    catch(e){ $('bc-msg').innerHTML='<span class="err">'+esc(e.message)+'</span>'; }
    finally{ $('bc-btn').disabled=false; }
  };
  $('sp-btn').onclick = async () => {
    $('sp-btn').disabled=true; $('sp-msg').textContent='';
    try{ await api('setSponsorConfig',{sponsor:$('sp').value,image:$('sp-img').value.trim(),perWeek:parseInt($('sp-pw').value,10)||0}); $('sp-msg').textContent='✅ រក្សាទុករួច'; }
    catch(e){ $('sp-msg').innerHTML='<span class="err">'+esc(e.message)+'</span>'; }
    finally{ $('sp-btn').disabled=false; }
  };
  $('ab-save').onclick = async () => {
    $('ab-save').disabled=true; $('ab-msg').textContent='';
    const banner = {
      name: $('ab-name').value.trim(),
      desc: $('ab-desc').value.trim(),
      btn: $('ab-btn').value.trim(),
      url: $('ab-url').value.trim(),
      hidden: $('ab-hide').checked
    };
    try{ await api('setAppBanner',{banner}); $('ab-msg').textContent='✅ រក្សាទុករួច'; }
    catch(e){ $('ab-msg').innerHTML='<span class="err">'+esc(e.message)+'</span>'; }
    finally{ $('ab-save').disabled=false; }
  };
  $('h-add').onclick = async () => {
    const date=$('h-date').value, name=$('h-name').value.trim();
    if(!date||!name){ $('h-msg').innerHTML='<span class="err">បំពេញ​ថ្ងៃ​និង​ឈ្មោះ</span>'; return; }
    $('h-add').disabled=true;
    try{ await api('addHoliday',{date,name}); $('h-name').value=''; $('h-msg').textContent='✅ បន្ថែមរួច'; await loadHolidays(); await loadStats(); }
    catch(e){ $('h-msg').innerHTML='<span class="err">'+esc(e.message)+'</span>'; }
    finally{ $('h-add').disabled=false; }
  };

  (async () => {
    try{
      await loadStats();
      $('gate').classList.add('hidden'); $('app').classList.remove('hidden');
      await Promise.all([loadSponsor(), loadAppBanner(), loadHolidays()]);
    }catch(e){
      $('gate').innerHTML = e.message==='Forbidden'
        ? '🔒 មិនមានសិទ្ធិ។ <br><br><a href="/api/admin/login" style="display:inline-block;background:var(--btn);color:var(--btnt);text-decoration:none;padding:10px 16px;border-radius:10px;font-weight:600">Login ជាមួយ Google Admin</a>' : '⚠️ ' + esc(e.message);
    }
  })();
</script>
</body></html>`;
