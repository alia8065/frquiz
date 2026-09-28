/* ---------- QUESTIONS ---------- */
const rnd=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const Q=[];
MV.forEach((m,mi)=>{
  const near=MV.map((o,oi)=>({o,d:Math.abs(oi-mi)})).filter(x=>x.o!==m).sort((a,b)=>a.d-b.d);
  const mvPool=ex=>near.filter(x=>!ex.includes(x.o.id)).map(x=>x.o.n);
  const info=`${m.n} · ${m.p}`;
  Q.push({id:m.id+"-p",type:"mc",mv:m.id,k:"Akım → Dönem",pr:esc(m.n),sub:"Hangi döneme ait?",a:m.p,pref:rnd(PERIODS.filter(p=>p!==m.p)),ex:info,showMv:false});
  m.c.forEach((c,i)=>Q.push({id:`${m.id}-c${i}`,mv:m.id,k:"Özellik → Akım",pr:esc(c[0]),sub:"Bu özellik hangi akıma ait? Akımın adını yaz.",type:"text",a:m.n,pref:mvPool(c[1]).slice(0,4),pool:mvPool(c[1]),ex:`${info} — ${esc(c[0])}`,small:true}));
  m.w.forEach((w,i)=>{
    const [t,y,au]=w, line=`<i>${esc(t)}</i> (${y}) — ${esc(au)} · ${esc(m.n)}`;
    const sameAu=[...new Set(m.w.map(x=>x[2]).concat(near.slice(0,2).flatMap(x=>x.o.w.map(z=>z[2]))))];
    Q.push({id:`${m.id}-w${i}a`,mv:m.id,k:"Eser → Yazar",pr:`<i>${esc(t)}</i> <span class="mono">(${y})</span>`,sub:"Kim yazdı?",type:"text",a:au,pref:rnd(sameAu),pool:ALL_AUTH,ex:line,showMv:true});
    Q.push({id:`${m.id}-w${i}m`,mv:m.id,k:"Eser → Akım",pr:`<i>${esc(t)}</i> — ${esc(au)}`,sub:"Hangi akım?",type:"text",a:m.n,ex:line});
    Q.push({id:`${m.id}-w${i}t`,mv:m.id,k:"Yazar → Eser adı",pr:`${esc(au)} <span class="mono">(${y})</span>`,sub:`${esc(m.n)} — eserin adını yaz.`,type:"text",a:t,ex:line});
    Q.push({id:`${m.id}-w${i}y`,mv:m.id,k:"Eser → Yıl",pr:`<i>${esc(t)}</i> — ${esc(au)}`,sub:"Hangi yıl?",type:"text",num:true,a:String(y),ex:line,showMv:true});
  });
  m.q.forEach((q,i)=>{
    Q.push({id:`${m.id}-q${i}a`,mv:m.id,k:"Alıntı → Kim?",pr:`« ${esc(q[0])} »`,sub:"Kim söyledi?",type:"text",a:q[1],pool:ALL_AUTH,pref:["Montaigne","Kant","Chateaubriand","Zola","Breton","Voltaire","Rousseau","Hugo"].filter(x=>x!==q[1]),ex:`« ${esc(q[0])} » — ${q[1]} · ${esc(m.n)}`,quote:true});
    Q.push({id:`${m.id}-q${i}m`,mv:m.id,k:"Alıntı → Akım",pr:`« ${esc(q[0])} » — ${q[1]}`,sub:"Hangi akımla ilgili?",type:"text",a:m.n,ex:`${q[1]} · ${esc(m.n)}`,quote:true});
  });
  m.x.forEach((x,i)=>Q.push({id:`${m.id}-x${i}`,mv:m.id,k:"Detay",pr:esc(x.q),type:x.t?"text":"mc",num:/^\d+$/.test(x.a),al:x.al,a:x.a,fixed:x.o,ex:`${esc(m.n)} — ${esc(x.q)} → <b>${esc(x.a)}</b>`,showMv:true,small:true}));
});
// chronologie : quel mouvement vient avant
for(let i=0;i<MV.length-1;i++){
  const a=MV[i],b=MV[i+1];
  Q.push({id:`chr-${i}`,mv:a.id,k:"Kronoloji",pr:`${esc(a.n)} → ?`,sub:"Sıradaki akım hangisi? Yaz.",type:"text",a:b.n,pool:MV.filter((m,j)=>j!==i+1&&j!==i).map(m=>m.n),pref:MV.filter((m,j)=>Math.abs(j-i-1)<=2&&j!==i+1&&j!==i).map(m=>m.n),ex:`${i+1}. ${esc(a.n)} → ${i+2}. ${esc(b.n)}`});
}
const QBY=Object.fromEntries(Q.map(q=>[q.id,q]));
const AUTH_AL={"Victor Hugo":["hugo","v hugo"],"Jean de Sponde":["sponde","de sponde"],"Edmond de Goncourt":["goncourt","de goncourt","edmond goncourt"],"Musset":["alfred de musset","de musset"],"Du Bellay":["joachim du bellay","bellay"],"Ronsard":["pierre de ronsard"],"Montaigne":["michel de montaigne"],"Zola":["emile zola"],"Breton":["andre breton"],"Eluard":["paul eluard"],"Sarraute":["nathalie sarraute"],"Butor":["michel butor"]};
const MV_AL={lum:["siecle des lumieres"],abs:["theatre de l absurde"],sur:["surrealiste"]};
function norm(x){
  let s=String(x).toLowerCase().replace(/œ/g,"oe").replace(/æ/g,"ae").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  s=s.replace(/[’'`´]/g," ").replace(/[^a-z0-9]+/g," ").trim();
  s=s.replace(/^(le|la|les|l|un|une|des|du)\s+/,"");
  return s.replace(/\s+/g,"");
}
function lev(a,b){const m=a.length,n=b.length;if(Math.abs(m-n)>2)return 9;let p=[...Array(n+1).keys()];for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[n]}
function accepted(q){
  let list=[q.a].concat(q.al||[]);
  const mv=MV.find(m=>m.n===q.a); if(mv) list=list.concat(MV_AL[mv.id]||[]);
  if(AUTH_AL[q.a]) list=list.concat(AUTH_AL[q.a]);
  list.slice().forEach(x=>{const p=String(x).split(/\s+(?:et|ou)\s+/i);if(p.length===2){list.push(p[1]+" et "+p[0],p[0]+" "+p[1],p[1]+" "+p[0])}});
  return [...new Set(list.map(norm))];
}
function check(q,input){
  const g=norm(input); if(!g) return 0;
  const acc=accepted(q);
  if(acc.includes(g)) return 2;
  if(q.num) return 0;
  for(const a of acc){const tol=a.length>=12?2:a.length>=5?1:0; if(tol&&lev(a,g)<=tol) return 1;}
  return 0;
}

function options(q){
  let d=[];
  if(q.fixed) d=q.fixed.slice();
  else if(q.year){
    const cand=new Set();
    MV.forEach(m=>m.w.forEach(w=>{if(w[1]!==q.year&&Math.abs(w[1]-q.year)<=30)cand.add(w[1])}));
    const other=rnd([...cand]).slice(0,1);
    const nearY=rnd([-11,-8,-6,-5,-4,-3,-2,2,3,4,5,6,8,11].map(k=>q.year+k)).filter(y=>!other.includes(y));
    d=other.concat(nearY).slice(0,3).map(String);
  } else {
    const pref=rnd(q.pref||[]), pool=rnd(q.pool||[]);
    for(const x of pref.concat(pool)){ if(x!==q.a&&!d.includes(x)) d.push(x); if(d.length>=3)break; }
  }
  return rnd([q.a,...d.slice(0,3)]);
}

/* ---------- STATE ---------- */
const KEY="mvt-lit-v1";
let S={lv:{},xp:0,best:0,chronoBest:null};
try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.lv)S=Object.assign(S,s)}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const lv=id=>S.lv[id]||0;
const mastered=ids=>ids.filter(id=>lv(id)>=MASTER).length;

function header(){
  const m=mastered(Q.map(q=>q.id)), t=Q.length, p=Math.round(m/t*100);
  document.getElementById("gbar").style.width=p+"%";
  document.getElementById("glabel").textContent=`${m} / ${t} bilgi ezberlendi`;
  document.getElementById("gpct").textContent=p+"%";
  document.getElementById("xp").textContent=S.xp;
  document.getElementById("best").textContent=S.best;
}

/* ---------- VIEWS ---------- */
const view=document.getElementById("view");
let tab="game";
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{tab=b.dataset.tab;document.querySelectorAll("nav button").forEach(x=>x.setAttribute("aria-selected",x===b));render()});
function render(){header(); ({game:renderMenu,chrono:renderChrono,fiches:renderFiches})[tab]();}

let confirmReset=false;
function renderMenu(){
  G=null;
  const all=Q.map(q=>q.id);
  let h=`<div class="eyebrow" style="margin-bottom:8px">Bölüm seç — her bilgi ${MASTER} kez doğru bilinince ezberlenmiş sayılır</div><p class="muted" style="margin:0 0 10px;font-size:14px">Soruların çoğu yazmalı. Aksan, büyük/küçük harf, noktalama ve baştaki le/la/les önemli değil; küçük bir yazım hatası da kabul edilir.</p><div class="chapters">`;
  h+=chap("all","Tümü · karışık",`${MV.length} akım + kronoloji`,all,true);
  MV.forEach((m,i)=>h+=chap(m.id,m.n,`${i+1}. ${m.p}`,Q.filter(q=>q.mv===m.id&&!q.id.startsWith("chr")).map(q=>q.id)));
  h+=chap("chr","Kronoloji","Hangi akım sonra gelir?",Q.filter(q=>q.id.startsWith("chr")).map(q=>q.id));
  h+=`</div><div class="confirm" style="margin-top:16px">`+(confirmReset?`<span>Tüm ilerleme silinsin mi?</span><button class="btn" id="ry" style="background:var(--bad)">Evet, sıfırla</button><button class="btn ghost" id="rn">Vazgeç</button>`:`<button class="btn ghost" id="rs">İlerlemeyi sıfırla</button>`)+`</div>`;
  view.innerHTML=h;
  view.querySelectorAll(".chap").forEach(b=>b.onclick=()=>start(b.dataset.s));
  const rs=document.getElementById("rs"); if(rs) rs.onclick=()=>{confirmReset=true;renderMenu()};
  const ry=document.getElementById("ry"); if(ry) ry.onclick=()=>{S={lv:{},xp:0,best:0,chronoBest:S.chronoBest};save();confirmReset=false;render()};
  const rn=document.getElementById("rn"); if(rn) rn.onclick=()=>{confirmReset=false;renderMenu()};
}
function chap(s,name,pd,ids,all){
  const m=mastered(ids),t=ids.length;
  return `<button class="chap${all?" all":""}${m===t?" done":""}" data-s="${s}"><span class="nm">${esc(name)}</span><span class="pd">${esc(pd)}</span><span class="mini"><i style="width:${m/t*100}%"></i></span><span class="ct">${m}/${t}</span></button>`;
}

/* ---------- GAME ENGINE ---------- */
let G=null;
function start(scope){
  let ids;
  if(scope==="all") ids=Q.map(q=>q.id);
  else if(scope==="chr") ids=Q.filter(q=>q.id.startsWith("chr")).map(q=>q.id);
  else ids=Q.filter(q=>q.mv===scope&&!q.id.startsWith("chr")).map(q=>q.id);
  let deck=ids.filter(id=>lv(id)<MASTER);
  let review=false;
  if(!deck.length){deck=ids.slice();review=true;}
  // new material grouped by movement order, shuffled inside; "all" fully shuffled among unfinished
  deck=scope==="all"?rnd(deck):rnd(deck);
  G={scope,ids,deck,combo:0,right:0,wrong:0,review,cur:null,answered:false,seenReview:{}};
  next();
}
function next(){
  if(!G.deck.length) return finish();
  G.cur=QBY[G.deck[0]]; G.opts=G.cur.type==="mc"?options(G.cur):null; G.answered=false; G.hint=0; drawQ();
}
function drawQ(){
  const q=G.cur, m=MV.find(x=>x.id===q.mv), L=lv(q.id);
  const done=mastered(G.ids), tot=G.ids.length;
  let h=`<div class="row" style="margin-bottom:10px"><button class="btn ghost" id="back">← Bölümler</button>
    <span class="muted" style="font-size:14px">${G.review?"Tekrar turu · ":""}<span class="mono">${done}/${tot}</span> ezber · kalan <span class="mono">${G.deck.length}</span> · seri <span class="combo" id="cb">×${G.combo}</span></span></div>
  <div class="card" id="card">
    <div class="qhead"><span class="kind">${q.k}</span>
      <span class="pips" title="Ezber seviyesi">${[...Array(MASTER)].map((_,i)=>`<span class="pip${i<L?" on":""}"></span>`).join("")}</span></div>
    ${q.showMv?`<div><span class="tag">${esc(m.n)}</span></div>`:""}
    <div class="prompt${q.quote||q.small?" quote":""}">${q.pr}</div>
    ${q.sub?`<div class="sub">${q.sub}</div>`:""}
    ${G.opts?`<div class="opts">${G.opts.map((o,i)=>`<button class="opt" data-i="${i}"><span class="k">${i+1}</span><span>${esc(o)}</span></button>`).join("")}</div>`:
    `<form class="typed" id="tf" autocomplete="off"><input id="ans" class="inp" type="text" ${q.num?'inputmode="numeric"':''} autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Cevabını yaz…" aria-label="Cevap">
      <div class="row"><span><button type="button" class="btn ghost" id="hint">İpucu</button> <button type="button" class="btn ghost" id="idk">Bilmiyorum</button></span><button class="btn" type="submit">Kontrol et</button></div>
      <div id="hintbox" class="muted mono" style="font-size:14px"></div></form>`}
    <div id="fb"></div>
  </div>`;
  view.innerHTML=h;
  document.getElementById("back").onclick=()=>{G=null;renderMenu()};
  view.querySelectorAll(".opt").forEach(b=>b.onclick=()=>answerMC(+b.dataset.i));
  const tf=document.getElementById("tf");
  if(tf){
    const inp=document.getElementById("ans"); inp.focus({preventScroll:true});
    tf.onsubmit=e=>{e.preventDefault(); if(!G.answered&&inp.value.trim()) answerText(inp.value)};
    inp.addEventListener("keydown",e=>e.stopPropagation());
    document.getElementById("idk").onclick=()=>answerText("");
    document.getElementById("hint").onclick=()=>{ if(G.answered)return; G.hint=Math.min(G.hint+1,3);
      const a=q.a; const show=Math.min(a.length,G.hint*Math.max(1,Math.ceil(a.length/6)));
      document.getElementById("hintbox").textContent=a.split("").map((c,i)=>i<show||/[\s'’\-\/]/.test(c)?c:"_").join("");
      inp.focus({preventScroll:true}); };
  }
}
function answerMC(i){
  if(G.answered) return;
  const q=G.cur;
  view.querySelectorAll(".opt").forEach((b,j)=>{b.disabled=true;
    if(G.opts[j]===q.a) b.classList.add("right"); else if(j===i) b.classList.add("wrong"); else b.classList.add("dim");});
  resolve(G.opts[i]===q.a,"");
}
function answerText(v){
  if(G.answered) return;
  const q=G.cur, r=check(q,v);
  const inp=document.getElementById("ans"); inp.disabled=true; inp.classList.add(r?"right":"wrong");
  document.querySelectorAll("#tf button").forEach(b=>b.disabled=true);
  let note="";
  if(r===1) note=`Küçük bir yazım hatası vardı, kabul ettim. Doğrusu: <b>${esc(q.a)}</b>`;
  else if(r===0) note=v.trim()?`Senin cevabın: <s>${esc(v)}</s> → Doğrusu: <b>${esc(q.a)}</b>`:`Doğrusu: <b>${esc(q.a)}</b>`;
  resolve(r>0,note);
}
function resolve(ok,note){
  G.answered=true;
  const q=G.cur;
  G.deck.shift();
  if(ok){
    G.combo++; G.right++; S.best=Math.max(S.best,G.combo);
    S.xp+=Math.round((10+2*Math.min(G.combo,10))*(q.type==="text"?1.5:1)/(1+G.hint));
    S.lv[q.id]=Math.min(MASTER,lv(q.id)+1);
    if(G.review){ /* review: each once */ }
    else if(lv(q.id)<MASTER) G.deck.splice(Math.min(G.deck.length,5+(Math.random()*4|0)),0,q.id);
  } else {
    G.combo=0; G.wrong++;
    S.lv[q.id]=0;
    G.deck.splice(Math.min(G.deck.length,2),0,q.id);
  }
  save(); header();
  const cb=document.getElementById("cb"); cb.textContent="×"+G.combo; if(ok&&G.combo>1) cb.classList.add("pop");
  const justM=ok&&lv(q.id)>=MASTER&&!G.review;
  document.getElementById("fb").innerHTML=`<div class="fb ${ok?"ok":"no"}"><span class="v">${ok?(justM?"Doğru — bu bilgi ezberlendi!":"Doğru! Bir kez daha soracağım."):"Yanlış — birazdan tekrar soracağım."}</span>${note?`<span class="ex">${note}</span>`:""}<span class="ex">${q.ex}</span></div>
    <div class="row" style="margin-top:12px"><span class="muted" style="font-size:13px">Enter = devam</span><button class="btn" id="nx">Devam →</button></div>`;
  if(!ok) document.getElementById("card").classList.add("shake");
  const nx=document.getElementById("nx"); nx.onclick=next; nx.focus({preventScroll:true});
}
function finish(){
  const t=G.right+G.wrong, acc=t?Math.round(G.right/t*100):0;
  const name=G.scope==="all"?"Tümü":G.scope==="chr"?"Kronoloji":MV.find(m=>m.id===G.scope).n;
  view.innerHTML=`<div class="card" style="align-items:flex-start">
    <span class="kind">Bölüm tamam</span>
    <div class="big">${esc(name)}</div>
    <p style="margin:0">Bu bölümdeki <b class="mono">${G.ids.length}</b> bilginin hepsi ezberlendi. ${t} cevap, <b class="mono">%${acc}</b> doğru.</p>
    <p class="muted" style="margin:0">Birkaç saat sonra “Tümü · karışık” ile tekrar et: tamamlanmış bölümler tekrar turu olarak açılır.</p>
    <div class="row" style="width:100%"><button class="btn ghost" id="again">Bu bölümü tekrar et</button><button class="btn" id="menu">Bölümlere dön</button></div></div>`;
  const sc=G.scope;
  document.getElementById("again").onclick=()=>start(sc);
  document.getElementById("menu").onclick=()=>{G=null;renderMenu()};
}
document.addEventListener("keydown",e=>{
  if(tab!=="game"||!G||!G.cur) return;
  if(!G.answered&&G.opts&&/^[1-4]$/.test(e.key)){ if(+e.key<=G.opts.length) answerMC(+e.key-1); }
  else if(G.answered&&(e.key==="Enter"||e.key===" ")){ e.preventDefault(); next(); }
});

/* ---------- CHRONOLOGIE ---------- */
let C=null;
function renderChrono(){
  G=null;
  if(!C) C={order:rnd(MV.map((_,i)=>i)),placed:0,err:0,t0:Date.now(),done:false};
  let h=`<div class="card"><span class="kind">Sıralama oyunu</span>
    <p style="margin:0">12 akıma sırayla dokun: en eskiden en yeniye. ${S.chronoBest!=null?`<span class="muted">En iyi: ${S.chronoBest} hata</span>`:""}</p>
    <div class="row"><span>Hata: <b class="mono" id="cerr">${C.err}</b></span><button class="btn ghost" id="crs">Yeniden karıştır</button></div>
    <div class="tl"><ol>${MV.slice(0,C.placed).map((m,i)=>`<li><span class="n">${i+1}</span><span style="font-family:var(--f-display);font-size:18px">${esc(m.n)}</span><span class="p">${esc(m.p)}</span></li>`).join("")}</ol></div>
    ${C.done?`<div class="fb ok"><span class="v">Tamamlandı — ${C.err} hata, ${Math.round((C.tEnd-C.t0)/1000)} sn.</span></div>`:
    `<div class="chrono">${C.order.filter(i=>i>=C.placed).map(i=>`<button class="chip" data-i="${i}">${esc(MV[i].n)}</button>`).join("")}</div>`}
  </div>`;
  view.innerHTML=h;
  document.getElementById("crs").onclick=()=>{C=null;renderChrono()};
  view.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{
    const i=+b.dataset.i;
    if(i===C.placed){C.placed++; if(C.placed===MV.length){C.done=true;C.tEnd=Date.now();S.chronoBest=S.chronoBest==null?C.err:Math.min(S.chronoBest,C.err);S.xp+=Math.max(20,120-C.err*10);save();header();} renderChrono();}
    else {C.err++; document.getElementById("cerr").textContent=C.err; b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake");}
  });
}

/* ---------- FICHES ---------- */
function renderFiches(){
  G=null;
  view.innerHTML=`<div style="display:flex;flex-direction:column;gap:12px">`+MV.map((m,i)=>{
    const ids=Q.filter(q=>q.mv===m.id&&!q.id.startsWith("chr")).map(q=>q.id);
    const extra={
      bar:"<li>Noir : tensions / angoisses — Blanc : ornemental / exubérant</li>",
      cla:"<li>3 unités : 1 jour / 1 action / 1 lieu</li><li>Vraisemblance : semble réel / plausible</li><li>Bienséance : respect des conventions / ne pas choquer</li><li>La Fontaine → réf. aux Fables d'Ésope</li>",
      lum:"<li>→ 1789, Révolution française</li>",
      hum:"<li>Montaigne → remise en question de l'éducation</li>",
      rea:"<li>« Le Réalisme » écrit par Champfleury (1857)</li><li>2 grands initiateurs : Stendhal et Balzac</li><li>La Comédie humaine (Balzac) = 93 textes, portrait exhaustif de la société ; personnages récurrents (Le Père Goriot)</li><li>Flaubert refuse absolument l'étiquette</li>",
      abs:"<li>Ionesco et Beckett préfèrent parler d'insolite ou de vacuité du monde</li>",
      sur:"<li>Breton : « Automatisme psychique pur… Dictée de la pensée en l'absence de tout contrôle exercé par la raison, en dehors de toute préoccupation esthétique ou morale… réalité supérieure de certaines formes d'associations négligées… toute puissance du rêve, jeu désintéressé de la pensée. »</li>"
    }[m.id]||"";
    return `<div class="card fiche"><div class="row"><span class="fnum">${String(i+1).padStart(2,"0")} / 12</span><span class="fnum">${mastered(ids)}/${ids.length} ezber</span></div>
      <h2>${esc(m.n)}</h2><div class="pd">${esc(m.p)}</div>
      <ul>${m.c.map(c=>`<li>${esc(c[0])}</li>`).join("")}${extra}</ul>
      <div class="wk">${m.w.map(w=>`<span class="y">${w[1]}</span><span><i>${esc(w[0])}</i> — ${esc(w[2])}</span>`).join("")}</div>
      ${m.q.map(q=>`<blockquote>« ${esc(q[0])} »<cite>— ${esc(q[1])}</cite></blockquote>`).join("")}
    </div>`}).join("")+`</div>`;
}

render();
