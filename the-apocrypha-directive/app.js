const STORAGE_KEY = "black-meridian-v4-state";

const terms = [
  "NODE_43B","WITNESS_DETECTED","OMEGA_BLACK","GRAVESIGNAL","ROOK_NULL",
  "MERIDIAN/03","APOCRYPHA","PRESSURE_FUTURE","NO_FLAGS","VERIFY_NOTHING",
  "SIGNAL_BURIAL","MEMORY_CLEAN","DEAD_DROP","LEARN_FEAR","GLASS_PSALM"
];

const els = {};
const state = loadState();

function loadState(){
  try { return Object.assign({ index:0, unlocked:0, done:{}, evidence:[], muted:false }, JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")); }
  catch { return { index:0, unlocked:0, done:{}, evidence:[], muted:false }; }
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }

function init(){
  ["boot","app","beginBtn","resumeBtn","fileList","nodeKicker","nodeTitle","nodeSubtitle","chapterTag","heroImage","storyBody","gateBox","evidenceList","signalStatus","progressBar","narrateBtn","muteBtn","resetBtn","turnOverlay","codeRain"].forEach(id=>els[id]=$(id));
  buildRain();
  initNet();
  els.beginBtn.addEventListener("click",()=>start(false));
  els.resumeBtn.addEventListener("click",()=>start(true));
  els.narrateBtn.addEventListener("click", narrate);
  els.muteBtn.addEventListener("click",()=>{ state.muted=!state.muted; save(); render(); });
  els.resetBtn.addEventListener("click",()=>{ if(confirm("Reset archive progress?")){ localStorage.removeItem(STORAGE_KEY); location.reload(); }});
}
function start(resume){
  els.boot.classList.add("hidden");
  els.app.classList.remove("hidden");
  if(!resume){ state.index=0; }
  render();
}
function render(){
  const page = STORY[state.index] || STORY[0];
  els.nodeKicker.textContent = page.kicker || "CLASSIFIED";
  els.nodeTitle.textContent = page.title;
  els.nodeSubtitle.textContent = page.subtitle || "";
  els.chapterTag.textContent = page.chapter || "";
  els.heroImage.src = page.image || "assets/images/seal.svg";
  els.heroImage.alt = page.title + " visual";
  renderBody(page);
  renderGate(page);
  renderNav();
  renderEvidence();
  els.muteBtn.textContent = state.muted ? "UNMUTE FX" : "MUTE FX";
  const pct = STORY.length <= 1 ? 100 : Math.round(((state.unlocked+1)/STORY.length)*100);
  els.progressBar.style.width = pct + "%";
  els.signalStatus.textContent = state.done[page.id] ? "File verified. Signal stabilized." : "Awaiting witness action.";
  save();
  window.scrollTo({top:0, behavior:"smooth"});
}
function renderBody(page){
  const paras = String(page.body||"").split(/\n\s*\n/).filter(Boolean);
  els.storyBody.innerHTML = paras.map(p => `<p>${esc(p)}</p>`).join("");
}
function renderGate(page){
  const g = page.gate || {type:"button",label:"VERIFY FILE",unlockText:"FILE VERIFIED"};
  if(state.done[page.id]){
    els.gateBox.innerHTML = `<div class="gate-title">FILE VERIFIED</div><p>${esc(g.unlockText || "ACCESS GRANTED")}</p><button class="primary-btn" id="nextBtn">${state.index >= STORY.length-1 ? "ARCHIVE COMPLETE" : "CONTINUE"}</button>`;
    $("nextBtn").addEventListener("click", nextFile);
    return;
  }
  if(g.type === "redaction"){
    els.gateBox.innerHTML = `<div class="gate-title">REDACTION GATE</div><p>${esc(g.prompt)}</p><button class="redaction-btn" id="redactBtn">████████████</button><p class="fineprint">Click the blackout to reveal what authority tried to remove.</p>`;
    $("redactBtn").addEventListener("click",()=>{ $("redactBtn").textContent=g.secret; $("redactBtn").classList.add("revealed"); complete(page); });
  } else if(g.type === "terminal"){
    els.gateBox.innerHTML = `<div class="gate-title">TERMINAL GATE</div><p>${esc(g.prompt)}<strong>${esc(g.command)}</strong></p><input class="terminal-input" id="termInput" autocomplete="off" placeholder="enter command"/><p class="fineprint">Required command: ${esc(g.command)}</p>`;
    $("termInput").addEventListener("keydown", e=>{ if(e.key==="Enter"){ if(e.target.value.trim().toLowerCase()===g.command.toLowerCase()) complete(page); else { e.target.value=""; els.signalStatus.textContent="Command rejected. The archive disliked your certainty."; } }});
  } else if(g.type === "choice"){
    els.gateBox.innerHTML = `<div class="gate-title">${esc(g.prompt)}</div><div class="choice-grid">${g.choices.map((c,i)=>`<button class="ghost-btn choice" data-i="${i}">${esc(c)}</button>`).join("")}</div><p class="fineprint">Every answer is accepted. None are sufficient.</p>`;
    els.gateBox.querySelectorAll(".choice").forEach(btn=>btn.addEventListener("click",()=>complete(page)));
  } else {
    els.gateBox.innerHTML = `<div class="gate-title">WITNESS ACTION</div><button class="primary-btn" id="openBtn">${esc(g.label || "VERIFY FILE")}</button>`;
    $("openBtn").addEventListener("click",()=>complete(page));
  }
}
function complete(page){
  state.done[page.id] = true;
  if(page.evidence && !state.evidence.includes(page.evidence)) state.evidence.push(page.evidence);
  if(state.index >= state.unlocked && state.unlocked < STORY.length-1) state.unlocked = state.index + 1;
  pulseTurn();
  render();
}
function nextFile(){
  if(state.index < STORY.length-1 && state.index < state.unlocked){
    state.index++;
    pulseTurn();
    render();
  }
}
function renderNav(){
  els.fileList.innerHTML = STORY.map((p,i)=>{
    const locked = i > state.unlocked;
    const active = i === state.index;
    const done = !!state.done[p.id];
    return `<button class="file-btn ${locked?"locked":""} ${active?"active":""} ${done?"done":""}" data-i="${i}" ${locked?"disabled":""}><strong>${esc(p.chapter||"FILE")}</strong><br>${esc(p.title)}</button>`;
  }).join("");
  els.fileList.querySelectorAll(".file-btn").forEach(btn=>btn.addEventListener("click",()=>{ state.index=Number(btn.dataset.i); pulseTurn(); render(); }));
}
function renderEvidence(){
  els.evidenceList.innerHTML = state.evidence.length ? state.evidence.map(e=>`<div class="evidence-item">${esc(e)}</div>`).join("") : `<p class="fineprint">No evidence secured.</p>`;
}
function narrate(){
  if(!("speechSynthesis" in window)){ els.signalStatus.textContent="Narration unsupported in this browser."; return; }
  window.speechSynthesis.cancel();
  const page = STORY[state.index];
  const text = `${page.title}. ${page.narration || page.body.slice(0,1200)}`;
  const u = new SpeechSynthesisUtterance(text);
  u.rate=.84; u.pitch=.72; u.volume=.88;
  speechSynthesis.speak(u);
}
function pulseTurn(){
  els.turnOverlay.classList.remove("active");
  void els.turnOverlay.offsetWidth;
  els.turnOverlay.classList.add("active");
}
function buildRain(){
  for(let i=0;i<55;i++){
    const s=document.createElement("span");
    const term=terms[Math.floor(Math.random()*terms.length)];
    const h=Math.floor(Math.random()*0xffffff).toString(16).toUpperCase().padStart(6,"0");
    s.textContent = Math.random()<.5 ? `${term} // 0x${h}` : `${term} [${String(i).padStart(2,"0")}]`;
    s.style.setProperty("--x", Math.random()*100+"vw");
    s.style.setProperty("--dur", (8+Math.random()*15)+"s");
    s.style.setProperty("--delay", (-Math.random()*25)+"s");
    s.style.setProperty("--op", (.16+Math.random()*.45));
    els.codeRain.appendChild(s);
  }
}
function initNet(){
  const c = $("netCanvas"), ctx = c.getContext("2d", {alpha:true});
  let w,h,dpr,nodes=[];
  const ptr={x:0,y:0,active:false};
  function resize(){
    dpr=Math.min(devicePixelRatio||1,2); w=innerWidth; h=innerHeight;
    c.width=w*dpr; c.height=h*dpr; c.style.width=w+"px"; c.style.height=h+"px"; ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.max(44,Math.min(110,Math.floor(w*h/16000)));
    nodes=Array.from({length:count},(_,i)=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2,r:1+Math.random()*2.4,red:Math.random()<.25,phase:Math.random()*6.28,label:terms[i%terms.length]}));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    nodes.forEach(n=>{ n.x+=n.vx; n.y+=n.vy; n.phase+=.015; if(n.x<-30)n.x=w+30;if(n.x>w+30)n.x=-30;if(n.y<-30)n.y=h+30;if(n.y>h+30)n.y=-30; if(ptr.active){const dx=n.x-ptr.x,dy=n.y-ptr.y,d=Math.sqrt(dx*dx+dy*dy)||1;if(d<170){n.x+=(dx/d)*(170-d)/360;n.y+=(dy/d)*(170-d)/360;}}});
    const max=w<720?115:160;
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);if(d<max){const alpha=(1-d/max)*.24,red=a.red||b.red;ctx.strokeStyle=red?`rgba(255,43,53,${alpha})`:`rgba(139,245,181,${alpha})`;ctx.lineWidth=red?.75:.55;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}
    nodes.forEach(n=>{const p=.5+Math.sin(n.phase)*.5,col=n.red?"255,43,53":"139,245,181";ctx.fillStyle=`rgba(${col},${.3+p*.48})`;ctx.shadowBlur=n.red?14:10;ctx.shadowColor=`rgba(${col},.5)`;ctx.beginPath();ctx.arc(n.x,n.y,n.r+p*.8,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;});
    ctx.font="10px ui-monospace,monospace";
    for(let k=0;k<6;k++){const n=nodes[(k*17+Math.floor(Date.now()/2200))%nodes.length];if(n){ctx.fillStyle=n.red?"rgba(255,43,53,.32)":"rgba(139,245,181,.28)";ctx.fillText(n.label,n.x+8,n.y-8)}}
    requestAnimationFrame(draw);
  }
  addEventListener("resize",resize,{passive:true});
  addEventListener("pointermove",e=>{ptr.x=e.clientX;ptr.y=e.clientY;ptr.active=true},{passive:true});
  addEventListener("pointerleave",()=>ptr.active=false,{passive:true});
  resize(); draw();
}
document.addEventListener("DOMContentLoaded", init);
