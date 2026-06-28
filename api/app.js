// api/app.js
// Mini App / Website សាធារណៈ៖ ប្រតិទិនចន្ទគតិខ្មែរ + ថ្ងៃសីល + ថ្ងៃឈប់សម្រាក។
// រចនាដើម (theme ពុទ្ធសាសនា) — ពេញអេក្រង់ គ្មានក្បាលទំព័រ + ប៊ូតុង Copy។
// ទិន្នន័យសាធារណៈពី /api/calendar។ banner ភ្ជាប់ Reankh.org។

import { config } from '../lib/config.js';

export default function handler(req, res) {
  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.setHeader('cache-control', 'public, max-age=300');
  res.status(200).send(html(config.reankhUrl));
}

const html = (reankh) => `<!doctype html>
<html lang="km"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no">
<meta name="theme-color" content="#B45309">
<title>Telegram Calendar - ប្រតិទិនចន្ទគតិខ្មែរ</title>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Moul&family=Kantumruy+Pro:wght@400;500;600;700&family=Noto+Sans+Khmer:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>

  :root {
    --bg-grad: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
    --card: rgba(255, 255, 255, 0.7);
    --card-blur: blur(24px);
    --ink: #1d1d1f;
    --muted: #86868b;
    --saf: #FF9500; --saf2: #FF9500; --maroon: #FF3B30; --gold: #FFD60A; --sila: #34C759;
    --line: rgba(0,0,0,0.08); --shadow: 0 12px 40px rgba(0,0,0,0.08);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg-grad: linear-gradient(135deg, #1c1c1e 0%, #000000 100%);
      --card: rgba(44, 44, 46, 0.65);
      --ink: #f5f5f7;
      --muted: #98989d;
      --line: rgba(255,255,255,0.1); --shadow: 0 12px 40px rgba(0,0,0,0.4);
    }
  }
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  html,body{height:100%}
  body{font-family:'Outfit','Kantumruy Pro','Noto Sans Khmer',system-ui,sans-serif;background:var(--bg-grad);color:var(--ink);line-height:1.55;font-size:15px;background-attachment:fixed;}
  .wrap{max-width:540px;margin:0 auto;min-height:100%;padding-bottom:34px}
  .card{background:var(--card);backdrop-filter:var(--card-blur);-webkit-backdrop-filter:var(--card-blur);margin:16px;border-radius:28px;padding:20px 16px;box-shadow:var(--shadow);border:1px solid rgba(255,255,255,0.15);}
  .ch{display:flex;align-items:center;justify-content:space-between;padding:0 4px 12px}
  .ch .m{font-weight:700;font-size:18px} .ch .lm{font-size:12px;color:var(--muted);font-weight:600}
  .nav{width:44px;height:44px;border-radius:22px;border:none;background:rgba(120,120,128,0.08);color:var(--ink);font-size:22px;cursor:pointer;transition:transform 0.2s, background 0.2s;display:flex;align-items:center;justify-content:center}
  .nav:active{transform:scale(0.9);background:rgba(120,120,128,0.16)}
  .grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
  .wd{text-align:center;font-size:12px;color:var(--muted);font-weight:600;padding:6px 0 10px}
  .wd.sun,.wd.sat{color:var(--maroon)}
  .cell{position:relative;aspect-ratio:.86;border:none;background:transparent;border-radius:18px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-family:inherit;transition:transform 0.15s, background 0.2s}
  .cell:active{transform:scale(0.92);background:rgba(120,120,128,0.08)} .cell.empty{visibility:hidden}
  .cell .g{font-size:17px;font-weight:600;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:50%}
  .cell .lu{font-size:10px;color:var(--muted);line-height:1;font-weight:500}
  .cell.today .g{background:var(--saf);color:#fff;box-shadow:0 4px 12px rgba(255,149,0,0.4)}
  .cell.holi .g{color:var(--maroon)} .cell.holi .lu{color:var(--maroon)}
  .cell.today.holi .g{color:#fff}
  .cell .mk{position:absolute;top:6px;right:8px;width:6px;height:6px;border-radius:50%}
  .cell.sila .mk{background:var(--sila)} .cell.holi .mk{background:var(--maroon)}
  .legend{display:flex;gap:16px;justify-content:center;margin-top:16px;font-size:12px;color:var(--muted);font-weight:500}
  .legend span{display:flex;align-items:center;gap:6px} .legend i{width:8px;height:8px;border-radius:50%}

  .sec{font-family:'Moul',serif;font-size:15px;color:var(--saf2);margin:8px 4px 12px}
  .item{display:flex;gap:14px;align-items:center;padding:12px 6px;border-bottom:1px solid var(--line);transition:background 0.2s;border-radius:12px}
  .item:active{background:rgba(120,120,128,0.05)}
  .item:last-child{border:none}
  .item .dnum{flex:none;width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;background:rgba(120,120,128,0.06);color:var(--ink)}
  .item.h .dnum{background:rgba(255,59,48,0.12);color:var(--maroon)} .item.s .dnum{background:rgba(52,199,89,0.12);color:var(--sila)}
  .item .nm{font-size:15px;line-height:1.4;font-weight:500} .item .nm small{color:var(--muted);font-size:13px}

  .reankh{display:block;margin:16px;border-radius:26px;text-decoration:none;color:#fff;padding:22px 24px;position:relative;overflow:hidden;background:linear-gradient(135deg,#2C4170 0%,#15233F 100%);box-shadow:0 8px 30px rgba(21,35,63,0.3);transition:transform 0.2s}
  .reankh:active{transform:scale(0.97)}
  .reankh::after{content:'📚';position:absolute;right:16px;bottom:-10px;font-size:72px;opacity:.15}
  .reankh .k{font-family:'Moul',serif;font-size:18px;margin-bottom:6px} .reankh .s{font-size:14px;opacity:.9;max-width:80%}
  .reankh .cta{display:inline-block;margin-top:14px;background:var(--gold);color:#15233F;padding:10px 20px;border-radius:999px;font-weight:700;font-size:13px;box-shadow:0 4px 12px rgba(255,214,10,0.2)}
  .reankh .sponsor-tag{position:absolute;top:12px;right:14px;background:rgba(255,255,255,.2);color:#fff;font-size:10px;padding:4px 10px;border-radius:999px;font-weight:600;letter-spacing:.5px;z-index:2;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
  
  .note-in{width:100%;border:1px solid var(--line);border-radius:16px;padding:14px;font:inherit;background:rgba(120,120,128,0.06);color:var(--ink);outline:none;transition:border-color 0.2s, background 0.2s}
  .note-in:focus{border-color:var(--saf);background:transparent}
  .foot{text-align:center;color:var(--muted);font-size:12px;margin-top:24px;font-weight:500}
  .foot a{color:inherit;text-decoration:none;border-bottom:1px solid rgba(134,134,139,.5)}

  .sb{position:fixed;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:none;align-items:flex-end;justify-content:center;z-index:50}
  .sb.on{display:flex}
  .sheet{background:var(--card);backdrop-filter:var(--card-blur);-webkit-backdrop-filter:var(--card-blur);width:100%;max-width:540px;border-radius:32px 32px 0 0;padding:26px 24px calc(env(safe-area-inset-bottom,0px) + 26px);animation:up .35s cubic-bezier(.2,.8,.2,1);box-shadow:0 -10px 40px rgba(0,0,0,0.1);border-top:1px solid rgba(255,255,255,0.2)}
  @keyframes up{from{transform:translateY(100%)}to{transform:translateY(0)}}
  .sheet .sg{text-align:center;font-size:34px;font-weight:700;margin-bottom:6px;letter-spacing:-1px}
  .sheet .sw{text-align:center;color:var(--saf2);font-family:'Moul',serif;font-size:14px;margin-bottom:18px}
  .sheet .full{background:rgba(120,120,128,0.08);border-radius:20px;padding:16px;font-size:16px;line-height:1.7;text-align:center;font-weight:500}
  .sheet .tag{display:inline-block;margin-top:14px;padding:8px 16px;border-radius:999px;font-size:14px;font-weight:600}
  .sheet .tag.h{background:rgba(255,59,48,0.12);color:var(--maroon)} .sheet .tag.s{background:rgba(52,199,89,0.12);color:var(--sila)}
  .sheet .acts{display:flex;gap:12px;margin-top:20px}
  .sheet button{flex:1;border:none;padding:16px;border-radius:18px;font:inherit;font-weight:600;font-size:16px;cursor:pointer;transition:transform 0.15s, opacity 0.2s}
  .sheet button:active{transform:scale(0.96);opacity:0.9}
  .sheet .pri{background:var(--saf2);color:#fff;box-shadow:0 6px 16px rgba(255,149,0,0.3)} .sheet .sec2{background:rgba(120,120,128,0.12);color:var(--ink)}
  
  .toast{position:fixed;left:50%;bottom:40px;transform:translateX(-50%) translateY(20px);background:rgba(30,30,30,0.85);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#fff;padding:12px 24px;border-radius:999px;font-size:15px;font-weight:500;opacity:0;pointer-events:none;transition:all .3s cubic-bezier(.2,.8,.2,1);z-index:99;box-shadow:0 8px 24px rgba(0,0,0,0.2)}
  .toast.on{opacity:1;transform:translateX(-50%) translateY(0)}
  .skel{grid-column:1/-1;text-align:center;color:var(--muted);padding:40px;font-weight:500}
</style></head>
<body>
<div class="wrap">
  <div class="card" style="margin-top:calc(env(safe-area-inset-top,0px) + 16px)">
    <div class="ch">
      <button class="nav" id="prev">‹</button>
      <div style="text-align:center"><div class="m" id="cal-m"></div><div class="lm" id="cal-lm"></div></div>
      <button class="nav" id="next">›</button>
    </div>
    <div class="grid" id="wd"></div>
    <div class="grid" id="grid"><div class="skel">កំពុងផ្ទុក…</div></div>
    <div class="legend">
      <span><i style="background:var(--saf)"></i>ថ្ងៃនេះ</span>
      <span><i style="background:var(--sila)"></i>ថ្ងៃសីល</span>
      <span><i style="background:var(--maroon)"></i>ឈប់សម្រាក</span>
    </div>
  </div>

  <div class="card" id="list-card" style="display:none">
    <div class="sec">🛕 ថ្ងៃសីល & ឈប់សម្រាក ខែនេះ</div>
    <div id="list"></div>
  </div>

  <div class="card" id="note-card" style="display:none">
    <div class="sec">📝 បន្ថែម Note ផ្ទាល់ខ្លួន</div>
    <div style="display:flex;gap:8px"><input id="n-date" type="date" class="note-in" style="flex:1"><input id="n-time" type="time" value="08:00" class="note-in" style="flex:1"></div>
    <input id="n-text" class="note-in" maxlength="200" placeholder="ឈ្មោះព្រឹត្តិការណ៍ (មិនអនុញ្ញាត link)" style="margin-top:8px">
    <button class="nav" id="n-save" style="width:100%;margin-top:8px;height:auto;padding:11px;font-size:14px">រក្សាទុក</button>
    <div class="legend" id="n-msg" style="margin-top:6px;justify-content:flex-start"></div>
  </div>

  <a class="reankh" id="reankh" href="${reankh}" target="_blank" rel="noopener">
    <span class="sponsor-tag">អ្នកឧបត្ថម្ភ</span>
    <div class="k">Reankh.org</div>
    <div class="s">សិក្សា · សៀវភៅ · ផលិតផលអប់រំខ្មែរ</div>
    <span class="cta">ចូលទស្សនា →</span>
  </a>
  <div class="foot">
    ☸️ Telegram Calendar · <a href="/privacy" target="_blank">Privacy</a> · <a href="/terms" target="_blank">Terms</a>
  </div>
</div>

<div class="sb" id="sb"><div class="sheet" id="sheet"></div></div>
<div class="toast" id="toast">បានចម្លង ✓</div>

<script>
  var tg = window.Telegram && window.Telegram.WebApp;
  if(tg){ try{ tg.ready(); tg.expand(); tg.setHeaderColor('#B45309'); tg.setBackgroundColor('#F7F1E6'); }catch(e){} }
  var WD = ['អា','ច','អ','ពុ','ព្រ','សុ','ស'];
  var SM = ['មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា','កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ'];
  var ym=null, cur=null;
  function $(id){return document.getElementById(id);}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function khn(n){return String(n).replace(/[0-9]/g,function(d){return '០១២៣៤៥៦៧៨៩'[+d];});}
  function solarOf(g){return 'ថ្ងៃទី'+khn(g)+' ខែ'+SM[cur.m-1]+' ឆ្នាំ'+khn(cur.y);}

  function showToast(){var t=$('toast');t.classList.add('on');setTimeout(function(){t.classList.remove('on');},1500);}
  function copyText(txt){
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(showToast).catch(function(){fb(txt);});
    } else { fb(txt); }
    function fb(t){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');showToast();}catch(e){}document.body.removeChild(a);}
  }

  $('reankh').addEventListener('click',function(e){ if(tg && tg.openLink){ e.preventDefault(); tg.openLink($('reankh').href); }});
  (function(){var w='';for(var i=0;i<7;i++){var c=(i===0?' sun':(i===6?' sat':''));w+='<div class="wd'+c+'">'+WD[i]+'</div>';}$('wd').innerHTML=w;})();
  function pYm(s){var a=s.split('-'),y=+a[0],m=+a[1];m--;if(m<1){m=12;y--;}return y+'-'+('0'+m).slice(-2);}
  function nYm(s){var a=s.split('-'),y=+a[0],m=+a[1];m++;if(m>12){m=1;y++;}return y+'-'+('0'+m).slice(-2);}

  function itemHtml(x){
    var c=x.holiday?'h':'s'; var nm=x.holiday||('ថ្ងៃសីល '+x.sila);
    var sub=x.holiday&&x.sila?('<small> · សីល '+x.sila+'</small>'):'';
    return '<div class="item '+c+'"><div class="dnum">'+x.g+'</div><div class="nm">'+esc(nm)+sub+'</div></div>';
  }
  var _items=[];
  function renderList(items,expanded){
    _items=items; var N=3;
    var show=expanded?items:items.slice(0,N);
    var h=show.map(itemHtml).join('');
    if(!expanded && items.length>N)
      h+='<button class="nav" style="width:100%;margin-top:8px;height:auto;padding:9px;font-size:13px" onclick="showAllList()">មើលទាំងអស់ ('+items.length+') ▾</button>';
    $('list').innerHTML=h;
  }
  window.showAllList=function(){ renderList(_items,true); };

  function render(d){
    cur=d; ym=d.ym;

    if (d.banner) {
      if (d.banner.hidden) {
        $('reankh').style.display = 'none';
      } else {
        $('reankh').style.display = 'block';
        if (d.banner.url) $('reankh').href = d.banner.url;
        if (d.banner.name) $('reankh').querySelector('.k').textContent = d.banner.name;
        if (d.banner.desc) $('reankh').querySelector('.s').textContent = d.banner.desc;
        if (d.banner.btn) $('reankh').querySelector('.cta').textContent = d.banner.btn;
      }
    }

    $('cal-m').textContent = SM[d.m-1]+' '+d.y;
    var lm=[]; d.days.forEach(function(x){ if(lm.indexOf(x.month)<0) lm.push(x.month); });
    $('cal-lm').textContent = 'ខែ'+lm.join(' – ');

    var cells='';
    for(var i=0;i<d.firstWeekday;i++) cells+='<div class="cell empty"></div>';
    d.days.forEach(function(day){
      var cls='cell'; if(day.date===d.today)cls+=' today'; if(day.holiday)cls+=' holi'; if(day.sila)cls+=' sila';
      cells+='<button class="'+cls+'" data-i="'+day.g+'"><span class="mk"></span><span class="g">'+day.g+'</span><span class="lu">'+esc(day.lunar)+'</span></button>';
    });
    $('grid').innerHTML=cells;
    Array.prototype.forEach.call(document.querySelectorAll('[data-i]'),function(el){
      el.onclick=function(){ openDay(d.days[+el.dataset.i-1]); };
    });

    var items=d.days.filter(function(x){return x.sila||x.holiday;});
    if(items.length){ $('list-card').style.display='block'; renderList(items,false); }
    else $('list-card').style.display='none';
  }

  function openDay(day){
    var copyTxt = day.full+' ត្រូវនឹង '+solarOf(day.g);
    var h='<div class="sg">'+day.g+'</div><div class="sw">'+esc(SM[cur.m-1])+' '+cur.y+'</div>';
    h+='<div class="full">'+esc(day.full)+'<br>ត្រូវនឹង '+esc(solarOf(day.g))+'</div>';
    if(day.sila) h+='<div style="text-align:center"><span class="tag s">🛕 ថ្ងៃសីល '+esc(day.sila)+'</span></div>';
    if(day.holiday) h+='<div style="text-align:center"><span class="tag h">🎉 '+esc(day.holiday)+'</span></div>';
    h+='<div class="acts"><button class="pri" id="sc">⧉ ចម្លង</button><button class="sec2" onclick="closeSheet()">បិទ</button></div>';
    if(cur.sponsor) h+='<div style="text-align:center;margin-top:16px;border-top:1px solid var(--line);padding-top:12px;font-size:12.5px;color:var(--muted)"><div style="font-size:10px;letter-spacing:.4px;margin-bottom:3px">🙏 អ្នកឧបត្ថម្ភ</div>'+esc(cur.sponsor)+'</div>';
    $('sheet').innerHTML=h; $('sb').classList.add('on');
    $('sc').onclick=function(){copyText(copyTxt);};
  }
  window.closeSheet=function(){$('sb').classList.remove('on');};
  $('sb').addEventListener('click',function(e){if(e.target===$('sb'))closeSheet();});

  function load(month){
    fetch('/api/calendar'+(month?('?month='+month):''))
      .then(function(r){return r.json();}).then(render)
      .catch(function(){$('grid').innerHTML='<div class="skel">⚠️ ផ្ទុកមិនបាន</div>';});
  }
  // Note form — Telegram only (initData); link បដិសេធខាង server
  (function(){
    if(!(tg && tg.initData)) return;
    $('note-card').style.display='block';
    $('n-save').onclick=function(){
      var d=$('n-date').value,t=$('n-time').value,x=$('n-text').value.trim(),m=$('n-msg');
      if(!d||!t||!x){ m.textContent='សូមបំពេញគ្រប់'; return; }
      var btn=this; btn.disabled=true; m.textContent='កំពុងរក្សាទុក...';
      fetch('/api/note',{method:'POST',headers:{'content-type':'application/json','x-telegram-init-data':tg.initData},body:JSON.stringify({date:d,time:t,summary:x})})
        .then(function(r){return r.json();}).then(function(j){
          m.textContent=j.ok?'✅ បានរក្សាទុក':('⚠️ '+(j.error||'error'));
          if(j.ok) $('n-text').value='';
        }).catch(function(){m.textContent='⚠️ បរាជ័យ';})['finally'](function(){btn.disabled=false;});
    };
  })();

  $('prev').onclick=function(){load(pYm(ym));};
  $('next').onclick=function(){load(nYm(ym));};
  load();
</script>
</body></html>`;
