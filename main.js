
let heat=0,dead=0,T_WARM=4,T_HOT=7,T_COLD=12;let logs=[];
const ids=['cb_scatter','cb_multiplier','cb_connect','cb_free','cb_back2back','cb_big_tumble','cb_dead','cb_loss_buy'];
const $=id=>document.getElementById(id);
function now(){return new Date().toLocaleTimeString();}
function load(){try{const s=JSON.parse(localStorage.getItem('HeatPro')||'{}');
  heat=s.h||0;dead=s.d||0;logs=s.l||[];T_WARM=s.w??4;T_HOT=s.ho??7;T_COLD=s.c??12;
  $('twarm').value=T_WARM;$('thot').value=T_HOT;$('tcold').value=T_COLD;
  (s.ck||[]).forEach((v,i)=>ids[i]&&($(ids[i]).checked=!!v));}catch{}}
function save(){const ck=ids.map(id=>$(id).checked);
  localStorage.setItem('HeatPro',JSON.stringify({h:heat,d:dead,w:T_WARM,ho:T_HOT,c:T_COLD,l:logs,ck}));}
function setStatus(txt,cls){const st=$('status');st.textContent=txt;st.className='pill '+cls;
  const mini=$('mini');mini.className='mini '+cls;$('miniText').textContent=txt;
  if(navigator.vibrate){navigator.vibrate(cls==='s-hot'?[220,60,60]:cls==='s-warm'?120:[180,50,50]);}}
function influence(){let s=heat;
  if($('cb_scatter').checked)s+=2; if($('cb_multiplier').checked)s+=1;
  if($('cb_connect').checked)s+=1; if($('cb_free').checked)s+=3;
  if($('cb_back2back').checked)s+=1; if($('cb_big_tumble').checked)s+=2;
  if($('cb_loss_buy').checked)s-=2; if($('cb_dead').checked)s-=2; return s;}
function refresh(){ $('heat').textContent=heat; $('dead').textContent=dead;
  const sc=influence(); let cls='s-ok',txt='OK';
  if(dead>=T_COLD){cls='s-cold';txt='COLD';}
  else if(sc>=T_HOT){cls='s-hot';txt='HOT';}
  else if(sc>=T_WARM){cls='s-warm';txt='WARM';}
  setStatus(txt,cls); renderLog(); save();}
function push(type,delta){logs.push({t:now(),type,delta,heat,dead}); if(logs.length>200)logs.shift();}
function renderLog(){const el=$('log'); el.innerHTML='';
  logs.slice().reverse().forEach(v=>{const r=document.createElement('div');r.className='logrow';
    const label=v.type==='dead'?'Dead +'+v.delta:(v.delta===2?'+2 Scatter':'+1 Connect');
    r.innerHTML=`<span>${v.t} — ${label}</span><span class="${v.type==='dead'?'bad':'good'}">H:${v.heat} D:${v.dead}</span>`; el.appendChild(r);});}
function mark(kind,delta){ if(kind==='dead'){dead+=delta; heat=Math.max(0,heat-1);} else {heat+=delta; dead=Math.max(0,dead-1);} push(kind,delta); refresh();}
function resetRun(){heat=0;dead=0;push('reset',0);refresh();}
function saveCfg(){T_WARM=+$('twarm').value||4;T_HOT=+$('thot').value||7;T_COLD=+$('tcold').value||12;refresh();}
function exportCSV(){const header='time,type,delta,heat,dead\n'; const rows=logs.map(v=>[v.t,v.type,v.delta,v.heat,v.dead].join(','));
  const blob=new Blob([header+rows.join('\n')],{type:'text/csv'}); const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='heatpro_session.csv'; a.click(); URL.revokeObjectURL(url);}
document.addEventListener('DOMContentLoaded',()=>{load();refresh();});
