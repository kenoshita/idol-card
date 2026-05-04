import { useState, useEffect } from "react";

const SONGS = {
  "Mina Kwon":   { title:"Candy Signal", duration:"3:24" },
  "Sia Moon":  { title:"Moonlight Crush",    duration:"4:02" },
  "Hana Lee":{ title:"Bubble Wave",    duration:"3:51" },
  "Yuna Star":  { title:"Starlit Pop", duration:"3:18" },
};


const MEMBER_PROFILES = {
  "Mina Kwon": { role:"LEADER / VOCAL", initials:"MK", catch:"Sweet leader" },
  "Sia Moon": { role:"MAIN DANCER", initials:"SM", catch:"Moon crush" },
  "Hana Lee": { role:"RAP / MOOD", initials:"HL", catch:"Bubble energy" },
  "Yuna Star": { role:"CENTER", initials:"YS", catch:"Glitter center" },
};

function getProfile(name) {
  const base = String(name).replace(/\s20\d{2}$/g, "");
  return MEMBER_PROFILES[base] || { role:"SPECIAL CARD", initials:base.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase(), catch:"Limited drop" };
}

const COLLECTIONS = [
  { id:"spring2026", title:"NEON HEARTS Debut Set", season:"DEBUT ERA 2026", color:"#ff2e9a", icon:"🌸", deadline:"2026.6.30まで",
    reward:{ label:'メンバー全員のSpecial Thanks動画', icon:"🎬" },
    cards:[
      { id:"s1", name:"Mina Kwon",    emoji:"💗", rarity:"SSR", type:"seasonal", owned:true  },
      { id:"s2", name:"Sia Moon",  emoji:"🌙", rarity:"SR",  type:"seasonal", owned:true  },
      { id:"s3", name:"Hana Lee",emoji:"🫧", rarity:"SR",  type:"seasonal", owned:false },
      { id:"s4", name:"Yuna Star",  emoji:"✨", rarity:"R",   type:"seasonal", owned:false },
    ] },
  { id:"live0504", title:"SHOWCASE SEOUL 会場限定", season:"SHOWCASE ONLY", color:"#ffe45c", icon:"🏟", deadline:"当日のみ入手可",
    reward:{ label:"次回ショーケース先行アクセス", icon:"🎫" },
    cards:[
      { id:"l1", name:"Mina Kwon",   emoji:"💗", rarity:"SSR", type:"live", owned:true  },
      { id:"l2", name:"Sia Moon", emoji:"🌙", rarity:"SSR", type:"live", owned:false },
    ] },
  { id:"bday_rin", title:"Mina Kwon BIRTHDAY DROP", season:"BIRTHDAY", color:"#b967ff", icon:"🎂", deadline:"6.15限定",
    reward:{ label:"Birthday Live抽選パス", icon:"🎪" },
    cards:[
      { id:"b1", name:"Mina 2026", emoji:"💗", rarity:"SSR", type:"birthday", owned:true  },
      { id:"b2", name:"Mina 2025", emoji:"💗", rarity:"SR",  type:"birthday", owned:true  },
      { id:"b3", name:"Mina 2024", emoji:"💗", rarity:"R",   type:"birthday", owned:false },
    ] },
];

const MARKET_CARDS = [
  { id:1, name:"Mina Kwon",    emoji:"💗", rarity:"SSR", color:"#ff2e9a", type:"seasonal", serial:"001/010", price:98000,  seller:"@mina_bias",  history:3 },
  { id:2, name:"Yuna Star",  emoji:"✨", rarity:"SSR", color:"#ffe45c", type:"live",     serial:"007/010", price:145000, seller:"@yuna_pop",   history:5 },
  { id:3, name:"Sia Moon",  emoji:"🌙", rarity:"SR",  color:"#7dd3fc", type:"seasonal", serial:"003/050", price:15000,  seller:"@moon_sia", history:2 },
  { id:4, name:"Hana Lee",emoji:"🫧", rarity:"SR",  color:"#00f5d4", type:"birthday", serial:"凛2024",  price:28000,  seller:"@bubble_hana",  history:1 },
  { id:5, name:"Mina Kwon",    emoji:"💗", rarity:"R",   color:"#ff2e9a", type:"normal",   serial:"088/200", price:3200,   seller:"@neon_col",  history:1 },
];

// ランキング = アイドル（メンバー）が何位か
// ファンがそのメンバーのカードを買うほど順位が上がる
const MEMBER_RANKING = [
  { name:"Mina Kwon",    emoji:"💗", color:"#ff2e9a", weekly:3847, myBuy:12, prev:2, isMyOshi:true  },
  { name:"Yuna Star",  emoji:"✨", color:"#ffe45c", weekly:3612, myBuy:0,  prev:1, isMyOshi:false },
  { name:"Sia Moon",  emoji:"🌙", color:"#7dd3fc", weekly:1984, myBuy:5,  prev:3, isMyOshi:false },
  { name:"Hana Lee",emoji:"🫧", color:"#00f5d4", weekly:831,  myBuy:0,  prev:4, isMyOshi:false },
];

const POOL = [
  { name:"Mina Kwon",    emoji:"💗", rarity:"SSR", color:"#ff2e9a", type:"seasonal" },
  { name:"Sia Moon",  emoji:"🌙", rarity:"SR",  color:"#7dd3fc", type:"seasonal" },
  { name:"Hana Lee",emoji:"🫧", rarity:"R",   color:"#00f5d4", type:"normal"   },
  { name:"Yuna Star",  emoji:"✨", rarity:"SSR", color:"#ffe45c", type:"live"     },
  { name:"Mina Kwon",    emoji:"💗", rarity:"SR",  color:"#ff2e9a", type:"birthday" },
  { name:"Sia Moon",  emoji:"🌙", rarity:"SR",  color:"#7dd3fc", type:"seasonal" },
  { name:"Hana Lee",emoji:"🫧", rarity:"R",   color:"#00f5d4", type:"normal"   },
];

const RC = { SSR:{ bg:"linear-gradient(135deg,#f59e0b,#ef4444)" }, SR:{ bg:"linear-gradient(135deg,#8b5cf6,#ec4899)" }, R:{ bg:"linear-gradient(135deg,#3b82f6,#06b6d4)" } };

const TYPE_BADGE = {
  seasonal:{ label:"💖 ERA限定", color:"#ff2e9a" },
  live:    { label:"🎤 SHOWCASE限定", color:"#ffe45c" },
  birthday:{ label:"🎂 BIRTHDAY",   color:"#b967ff" },
  normal:  { label:"BASIC",        color:"#666"    },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700;900&family=Bebas+Neue&family=Orbitron:wght@400;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.phone{width:390px;height:780px;background:linear-gradient(180deg,#17021f 0%,#070816 48%,#03151f 100%);border-radius:44px;overflow:hidden;position:relative;box-shadow:0 0 0 2px #2b1642,0 0 90px rgba(0,245,255,.16),0 0 70px rgba(255,46,154,.18),0 50px 100px rgba(0,0,0,.9);font-family:'Noto Sans JP',sans-serif}
.scr{width:100%;height:100%;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;padding-bottom:84px}
.scr::-webkit-scrollbar{display:none}
.sb{display:flex;justify-content:space-between;padding:14px 28px 0;font-size:11px;color:#444;font-family:'Orbitron',sans-serif}
.nav{position:absolute;bottom:0;left:0;right:0;background:rgba(9,9,15,.97);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,.05);display:flex;padding:10px 0 22px;z-index:100}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer}
.ni-lbl{font-size:7px;color:#444;font-family:'Orbitron',sans-serif;letter-spacing:.04em}
.ni.on .ni-lbl{color:#ff2e9a}
.ni.on .ni-ico{filter:drop-shadow(0 0 8px #ff2e9a)}
.colcard{border-radius:16px;margin:0 16px 12px;padding:14px;position:relative;overflow:hidden;cursor:pointer;transition:transform .2s}
.colcard:active{transform:scale(.98)}
.prog{height:4px;background:rgba(255,255,255,.08);border-radius:2px;margin-top:10px}
.bar{height:4px;border-radius:2px;transition:width .8s cubic-bezier(.4,0,.2,1)}
.rrow{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid rgba(255,255,255,.04);animation:slideUp .3s ease both}
.rrow.me{background:linear-gradient(90deg,rgba(255,110,180,.08),transparent)}
.rbar-w{height:3px;background:rgba(255,255,255,.06);border-radius:2px;margin-top:5px}
.rbar{height:3px;border-radius:2px;transition:width .8s}
.mitem{display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid rgba(255,255,255,.04);cursor:pointer;transition:background .15s}
.mitem:active{background:rgba(255,255,255,.03)}
.orb{width:140px;height:140px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ff2e9a,#8b5cf6,#1e1040);display:flex;align-items:center;justify-content:center;font-size:52px;cursor:pointer;animation:orbGlow 2s ease-in-out infinite;transition:transform .15s}
.orb:active{transform:scale(.92)!important}
.gbtn{width:calc(100% - 40px);margin:0 20px;padding:14px;border-radius:14px;border:none;background:linear-gradient(135deg,#ff2e9a,#8b5cf6);color:#fff;font-family:'Bebas Neue',sans-serif;font-size:21px;letter-spacing:.12em;cursor:pointer;box-shadow:0 8px 30px rgba(255,110,180,.4)}
.gbtn:active{transform:scale(.97)}
.gbtn.ten{background:linear-gradient(135deg,#ffe45c,#ef4444);margin-top:10px}
.np{position:absolute;bottom:86px;left:16px;right:16px;background:rgba(8,8,18,.95);backdrop-filter:blur(20px);border-radius:16px;border:1px solid rgba(255,255,255,.08);padding:11px 13px;z-index:90;animation:slideUp .4s cubic-bezier(.175,.885,.32,1.275)}
.overlay{position:absolute;inset:0;background:rgba(4,4,10,.97);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:200;animation:fadeIn .3s}
.back-btn{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;color:#aaa}
@keyframes orbGlow{0%,100%{box-shadow:0 0 60px rgba(255,110,180,.6),0 0 120px rgba(255,110,180,.2)}50%{box-shadow:0 0 100px rgba(255,110,180,.9),0 0 200px rgba(255,110,180,.35)}}
@keyframes cardFly{0%{transform:translateY(-200px) scale(.2) rotate(20deg);opacity:0}70%{transform:translateY(8px) scale(1.08);opacity:1}100%{transform:translateY(0) scale(1);opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
@keyframes waveBar{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes confetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(300px) rotate(720deg);opacity:0}}
@keyframes spinRecord{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes pop{0%{transform:scale(0) rotate(-15deg);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
@keyframes countBounce{0%{transform:scale(2);opacity:0}60%{opacity:1}100%{transform:scale(1)}}
`;

function TypeTag({ type }) {
  const t = TYPE_BADGE[type] || TYPE_BADGE.normal;
  return <div style={{ display:"inline-block", fontSize:8, color:t.color, background:`${t.color}18`, border:`1px solid ${t.color}44`, padding:"2px 7px", borderRadius:5, fontFamily:"'Orbitron'", letterSpacing:".05em" }}>{t.label}</div>;
}

function CardThumb({ card, size=52, height=74 }) {
  const profile = getProfile(card.name);
  return (
    <div style={{ width:size, height, borderRadius:8, position:"relative", overflow:"hidden", background:`linear-gradient(135deg,${card.color||"#666"}33,${card.color||"#666"}11)`, border:`1px solid ${card.color||"#666"}44`, flexShrink:0 }}>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2 }}>
        <div style={{ width:size*.46, height:size*.46, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"\'Bebas Neue\'", fontSize:size*.28, color:"#fff", background:`linear-gradient(135deg,${card.color||"#666"},#111)`, boxShadow:`0 0 18px ${card.color||"#666"}55` }}>{profile.initials}</div>
        <div style={{ fontSize:height>90?9:6, color:"rgba(255,255,255,.7)", fontFamily:"\'Orbitron\'", letterSpacing:".04em" }}>{profile.role.split(" /")[0]}</div>
      </div>
      <div style={{ position:"absolute", top:3, right:3, fontFamily:"'Orbitron'", fontSize:6, background:RC[card.rarity].bg, color:"#fff", padding:"1px 4px", borderRadius:3, fontWeight:700 }}>{card.rarity}</div>
      {card.owned === false && <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,.45)", fontSize:14 }}>🔒</div>}
    </div>
  );
}

function CollectionScreen({ onComplete }) {
  return (
    <div>
      <div className="sb"><span>9:41</span><span>▐▐ ▌</span></div>
      <div style={{ padding:"14px 20px 16px", background:"linear-gradient(to bottom,rgba(255,110,180,.06),transparent)" }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:38, color:"#fff", letterSpacing:".08em", lineHeight:1 }}>NEON <span style={{ color:"#ff2e9a" }}>HEARTS</span></div>
        <div style={{ fontSize:9, color:"#666", fontFamily:"'Orbitron'", marginTop:5, letterSpacing:".1em" }}>全部集めるとメンバーから限定リアクション</div>
      </div>
      {COLLECTIONS.map(col => {
        const total = col.cards.length;
        const owned = col.cards.filter(c=>c.owned).length;
        const done  = owned === total;
        return (
          <div key={col.id} className="colcard" style={{ background:done?`linear-gradient(135deg,${col.color}1a,rgba(17,17,34,.9))`:"rgba(17,17,34,.8)", border:`1px solid ${done?col.color+"55":col.color+"22"}`, boxShadow:done?`0 0 24px ${col.color}28`:undefined }} onClick={()=>done&&onComplete(col)}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:10 }}>
              <div style={{ fontSize:22, lineHeight:1 }}>{col.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:done?"#fff":col.color, lineHeight:1.3 }}>{col.title}</div>
                <div style={{ fontSize:8, color:"#666", fontFamily:"'Orbitron'", marginTop:3 }}>{col.season} · {col.deadline}</div>
              </div>
              <div style={{ fontFamily:"'Orbitron'", fontSize:13, fontWeight:700, color:done?col.color:"#555", flexShrink:0 }}>{owned}<span style={{ fontSize:9, color:"#555" }}>/{total}</span></div>
            </div>
            <div style={{ display:"flex", gap:6, marginBottom:10 }}>
              {col.cards.map(c=><CardThumb key={c.id} card={c} size={50} height={70}/>)}
              {done&&<div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:50, height:70, fontSize:9, color:col.color, fontFamily:"'Orbitron'", fontWeight:700, textAlign:"center", lineHeight:1.4 }}>COMP<br/>LETE!</div>}
            </div>
            <div className="prog"><div className="bar" style={{ width:`${(owned/total)*100}%`, background:`linear-gradient(90deg,${col.color},${col.color}88)` }}/></div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:9, padding:"7px 10px", borderRadius:8, background:"rgba(0,0,0,.25)", border:"1px solid rgba(255,255,255,.06)" }}>
              <div style={{ fontSize:16 }}>{col.reward.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:8, color:"#555", fontFamily:"'Orbitron'", letterSpacing:".05em" }}>REWARD</div>
                <div style={{ fontSize:10, color:done?"#fff":"#777", fontWeight:done?700:400 }}>{col.reward.label}</div>
              </div>
              {done?<div style={{ fontSize:9, background:col.color, color:"#fff", padding:"4px 10px", borderRadius:7, fontFamily:"'Orbitron'", fontWeight:700 }}>受取る</div>
                   :<div style={{ fontSize:9, color:"#444", fontFamily:"'Orbitron'" }}>LOCKED</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CompleteOverlay({ col, onClose }) {
  const [step, setStep] = useState(0);
  useEffect(()=>{ const t=setTimeout(()=>setStep(1),1800); return()=>clearTimeout(t); },[]);
  const pieces = Array.from({length:20},(_,i)=>({ left:`${Math.random()*100}%`, color:["#ff2e9a","#ffe45c","#8b5cf6","#00f5d4","#fff"][i%5], delay:`${Math.random()*.5}s`, dur:`${1.2+Math.random()*.8}s` }));
  return (
    <div className="overlay" onClick={onClose}>
      {pieces.map((p,i)=><div key={i} style={{ position:"absolute", top:-10, left:p.left, width:8, height:8, borderRadius:2, background:p.color, animation:`confetti ${p.dur} ${p.delay} ease forwards` }}/>)}
      {step===0?(
        <>
          <div style={{ width:120, height:120, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:52, background:`radial-gradient(circle,${col.color}44,${col.color}11)`, border:`2px solid ${col.color}66`, animation:"pop .5s cubic-bezier(.175,.885,.32,1.275)" }}>{col.icon}</div>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:46, color:col.color, letterSpacing:".1em", marginTop:16, animation:"countBounce .5s ease" }}>COMPLETE!</div>
          <div style={{ fontSize:12, color:"#999", marginTop:4 }}>{col.title}</div>
          <div style={{ marginTop:20, fontSize:10, color:"#555", fontFamily:"'Orbitron'", animation:"pulse 1.2s infinite" }}>tap to claim reward →</div>
        </>
      ):(
        <div style={{ width:"100%", padding:"0 24px", animation:"slideUp .4s ease" }}>
          <div style={{ background:"rgba(255,255,255,.04)", borderRadius:20, padding:20, border:`1px solid ${col.color}44` }}>
            <div style={{ fontSize:40, textAlign:"center", marginBottom:8 }}>🎬</div>
            <div style={{ fontFamily:"'Orbitron'", fontSize:8, color:col.color, letterSpacing:".1em", textAlign:"center", marginBottom:8 }}>REWARD UNLOCKED</div>
            <div style={{ fontSize:17, fontWeight:700, color:"#fff", textAlign:"center", marginBottom:4 }}>全員から「ありがとう！」</div>
            <div style={{ fontSize:10, color:"#777", textAlign:"center", marginBottom:14 }}>StarBloom × NeonPop 限定メッセージ動画</div>
            <div style={{ background:"#000", borderRadius:12, aspectRatio:"16/9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, border:"1px solid #222" }}>▶</div>
            <div style={{ marginTop:14, padding:"10px 14px", background:`${col.color}18`, borderRadius:12, border:`1px solid ${col.color}44`, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ fontSize:18 }}>{col.reward.icon}</div>
              <div style={{ fontSize:10, color:col.color, fontWeight:700 }}>{col.reward.label}</div>
            </div>
            <div style={{ marginTop:12, fontSize:9, color:"#555", textAlign:"center", fontFamily:"'Orbitron'" }}>tap to close</div>
          </div>
        </div>
      )}
    </div>
  );
}

function GachaScreen() {
  const [phase, setPhase] = useState("ready");
  const [result, setResult] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const pull = () => {
    if(phase!=="ready") return;
    setPhase("spin"); setNowPlaying(null);
    setTimeout(()=>{ const card=POOL[Math.floor(Math.random()*POOL.length)]; setResult(card); setPhase("reveal"); if(card.rarity==="SSR") setConfetti(true); setTimeout(()=>{ setNowPlaying(card); setConfetti(false); },800); },900);
  };
  const reset = ()=>{ setPhase("ready"); setResult(null); setNowPlaying(null); };
  const song = result ? SONGS[result.name] : null;
  const pieces = confetti ? Array.from({length:18},(_,i)=>({ left:`${Math.random()*100}%`, color:["#ff2e9a","#ffe45c","#8b5cf6","#00f5d4","#fff"][i%5], delay:`${Math.random()*.5}s`, dur:`${1+Math.random()}s` })) : [];
  return (
    <div style={{ minHeight:"100%", background:"radial-gradient(ellipse at 50% 20%,rgba(168,85,247,.1) 0%,transparent 65%)" }}>
      <div className="sb"><span>9:41</span><span>▐▐ ▌</span></div>
      <div style={{ padding:"12px 20px 0" }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:38, color:"#fff", letterSpacing:".08em", lineHeight:1 }}><span style={{ color:"#ff2e9a" }}>FAN PULL</span></div>
        <div style={{ display:"flex", gap:6, marginTop:7, flexWrap:"wrap" }}>
          {[{l:"BASIC",c:"#888"},{l:"🌸 春限定",c:"#ff2e9a"},{l:"🎤 SHOWCASE限定",c:"#ffe45c"},{l:"🎂 BIRTHDAY",c:"#b967ff"}].map(t=>(
            <div key={t.l} style={{ fontSize:8, fontFamily:"'Orbitron'", color:t.c, background:"rgba(255,255,255,.04)", padding:"2px 8px", borderRadius:5, border:`1px solid ${t.c}33` }}>{t.l}</div>
          ))}
        </div>
      </div>
      <div style={{ height:285, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
        {pieces.map((p,i)=><div key={i} style={{ position:"absolute", top:-10, left:p.left, width:8, height:8, borderRadius:2, background:p.color, animation:`confetti ${p.dur} ${p.delay} ease forwards` }}/>)}
        {phase==="ready"&&<div className="orb" onClick={pull}>✨</div>}
        {phase==="spin"&&<div style={{ fontSize:64, animation:"pulse .25s infinite" }}>🌀</div>}
        {phase==="reveal"&&result&&(
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            {result.rarity==="SSR"&&<div style={{ fontFamily:"'Orbitron'", fontSize:10, color:"#ffe45c", letterSpacing:".2em" }}>✨ SSR GET ✨</div>}
            <div style={{ width:155, height:224, borderRadius:18, position:"relative", overflow:"hidden", background:`linear-gradient(135deg,${result.color}33,${result.color}11)`, border:`1px solid ${result.color}55`, boxShadow:`0 0 40px ${result.color}44`, animation:"cardFly .6s cubic-bezier(.175,.885,.32,1.275)" }}>
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}><div style={{ width:78, height:78, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"\'Bebas Neue\'", fontSize:34, color:"#fff", background:`linear-gradient(135deg,${result.color},#111)`, boxShadow:`0 0 30px ${result.color}66` }}>{getProfile(result.name).initials}</div><div style={{ fontFamily:"\'Orbitron\'", fontSize:9, color:"rgba(255,255,255,.75)", letterSpacing:".08em" }}>{getProfile(result.name).role}</div></div>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 55%)" }}/>
              <div style={{ position:"absolute", top:7, right:7, fontFamily:"'Orbitron'", fontSize:8, fontWeight:700, padding:"2px 6px", borderRadius:4, background:RC[result.rarity].bg, color:"#fff" }}>{result.rarity}</div>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"8px 10px", background:"linear-gradient(to top,rgba(0,0,0,.9),transparent)" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#fff", marginBottom:3 }}>{result.name}</div>
                <TypeTag type={result.type}/>
              </div>
            </div>
          </div>
        )}
      </div>
      {phase==="ready"&&(<>
        <button className="gbtn" onClick={pull}>1 PULL — ¥500</button>
        <button className="gbtn ten" onClick={pull}>10 PULLS — ¥4,500</button>
        <div style={{ textAlign:"center", marginTop:8, fontFamily:"'Orbitron'", fontSize:8, color:"#555" }}>Daily Free 1回 | 3日連続→+1回 | FAN PASS ¥3,000</div>
      </>)}
      {phase==="reveal"&&(<div style={{ display:"flex", gap:10, padding:"0 20px" }}>
        <button className="gbtn" style={{ flex:1 }} onClick={pull}>AGAIN ¥500</button>
        <button className="gbtn" style={{ flex:1, background:"rgba(255,255,255,.07)", boxShadow:"none" }} onClick={reset}>BACK</button>
      </div>)}
      {nowPlaying&&song&&(
        <div className="np">
          <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:7, fontFamily:"'Orbitron'", fontSize:7, color:"#666", letterSpacing:".08em" }}>
            <div style={{ width:13, height:13, background:"linear-gradient(135deg,#fa233b,#fb5c74)", borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, flexShrink:0 }}>♪</div>
            NEON HEARTS Official Soundで再生中
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${nowPlaying.color}44,${nowPlaying.color}22)`, border:`1px solid ${nowPlaying.color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0, animation:"spinRecord 3s linear infinite" }}>{nowPlaying.emoji}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{song.title}</div>
              <div style={{ fontSize:9, color:"#777", marginTop:1 }}>{nowPlaying.name}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:2 }}>
              {[.4,.9,.6,1,.7,.5,.85].map((h,i)=><div key={i} style={{ width:3, height:16, background:nowPlaying.color, borderRadius:2, transformOrigin:"bottom", animation:`waveBar ${.6+i*.1}s ease-in-out infinite`, animationDelay:`${i*.08}s` }}/>)}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8, paddingTop:7, borderTop:"1px solid rgba(255,255,255,.06)" }}>
            <div style={{ fontFamily:"'Orbitron'", fontSize:11, fontWeight:700, color:"#ffe45c", animation:"countBounce .6s ease" }} key={nowPlaying.name}>+1</div>
            <div style={{ fontSize:9, color:"#555", fontFamily:"'Orbitron'" }}>再生カウント追加</div>
            <div style={{ marginLeft:"auto", fontSize:9, color:"#555", fontFamily:"'Orbitron'" }}>{song.duration}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function MarketScreen({ onDetail }) {
  const [tab, setTab] = useState("buy");
  return (
    <div>
      <div className="sb"><span>9:41</span><span>▐▐ ▌</span></div>
      <div style={{ padding:"12px 20px 8px" }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:38, color:"#fff", letterSpacing:".08em", lineHeight:1 }}><span style={{ color:"#ffe45c" }}>FAN MARKET</span></div>
        <div style={{ fontSize:9, color:"#555", fontFamily:"'Orbitron'", marginTop:3, letterSpacing:".1em" }}>価格は売り手が決定 · 上限なし · 手数料30%</div>
      </div>
      <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,.06)", marginBottom:4 }}>
        {[["buy","BUY"],["sell","SELL"]].map(([k,l])=>(
          <div key={k} onClick={()=>setTab(k)} style={{ flex:1, padding:"9px 0", textAlign:"center", fontSize:9, fontFamily:"'Orbitron'", letterSpacing:".1em", cursor:"pointer", color:tab===k?"#ffe45c":"#444", borderBottom:`2px solid ${tab===k?"#ffe45c":"transparent"}`, transition:"all .2s" }}>{l}</div>
        ))}
      </div>
      {tab==="buy"&&MARKET_CARDS.map(card=>(
        <div key={card.id} className="mitem" onClick={()=>onDetail(card)}>
          <CardThumb card={card} size={52} height={74}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#eee" }}>{card.name}</div>
              <TypeTag type={card.type}/>
            </div>
            <div style={{ fontSize:8, color:"#555", fontFamily:"'Orbitron'", marginTop:3 }}>{card.serial} · {card.seller}</div>
            <div style={{ fontSize:8, color:"#555", marginTop:2 }}>OWNERS {card.history}回</div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontFamily:"'Orbitron'", fontSize:14, color:"#ffe45c", fontWeight:700 }}>¥{card.price.toLocaleString()}</div>
            <div style={{ fontSize:8, color:"#555", marginTop:2 }}>ON SALE</div>
          </div>
        </div>
      ))}
      {tab==="sell"&&(
        <div style={{ padding:"16px" }}>
          <div style={{ background:"rgba(255,255,255,.03)", borderRadius:14, padding:16, border:"1px solid rgba(255,255,255,.07)", textAlign:"center", marginBottom:12 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🃏</div>
            <div style={{ fontSize:13, color:"#eee", fontWeight:700, marginBottom:4 }}>LIST CARD</div>
            <div style={{ fontSize:10, color:"#666", marginBottom:16 }}>コレクションからLIST CARDメンバーカードを選んでください</div>
            <div style={{ padding:"11px", background:"rgba(255,110,180,.12)", borderRadius:10, border:"1px solid rgba(255,110,180,.3)", cursor:"pointer" }}>
              <div style={{ fontSize:10, color:"#ff2e9a", fontFamily:"'Orbitron'", fontWeight:700 }}>SELECT MEMBER CARD →</div>
            </div>
          </div>
          <div style={{ padding:"12px 14px", background:"rgba(255,255,255,.03)", borderRadius:12, border:"1px solid rgba(255,255,255,.06)" }}>
            <div style={{ fontFamily:"'Orbitron'", fontSize:8, color:"#555", letterSpacing:".1em", marginBottom:8 }}>MARKET FEE</div>
            {[["LIST PRICE（例）","¥100,000","#eee"],["手数料30%","-¥30,000","#ff5555"],["CREATOR / SELLER RECEIVE","¥70,000","#44ee88"]].map(([l,v,c])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid rgba(255,255,255,.04)", fontSize:10 }}>
                <span style={{ color:"#777" }}>{l}</span>
                <span style={{ color:c, fontFamily:"'Orbitron'", fontWeight:700 }}>{v}</span>
              </div>
            ))}
            <div style={{ fontSize:8, color:"#555", marginTop:8 }}>上限なし。プレミアムカードは高額出品も可能。</div>
          </div>
        </div>
      )}
    </div>
  );
}

function CardDetail({ card, onBack }) {
  const fee = Math.round(card.price * 0.3);
  return (
    <div style={{ animation:"slideUp .3s ease" }}>
      <div className="sb"><span>9:41</span><span>▐▐ ▌</span></div>
      <div style={{ display:"flex", alignItems:"center", padding:"12px 18px" }}>
        <div className="back-btn" onClick={onBack}>←</div>
        <div style={{ fontFamily:"'Orbitron'", fontSize:11, color:"#777", letterSpacing:".1em", marginLeft:10 }}>CARD DETAIL</div>
      </div>
      <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 18px", background:`radial-gradient(circle at 50% 50%,${card.color}18 0%,transparent 65%)` }}>
        <div style={{ width:165, height:238, borderRadius:20, position:"relative", overflow:"hidden", background:`linear-gradient(135deg,${card.color}33,${card.color}11)`, border:`1px solid ${card.color}55`, boxShadow:`0 0 40px ${card.color}33` }}>
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}><div style={{ width:84, height:84, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"\'Bebas Neue\'", fontSize:36, color:"#fff", background:`linear-gradient(135deg,${card.color},#111)`, boxShadow:`0 0 32px ${card.color}66` }}>{getProfile(card.name).initials}</div><div style={{ fontFamily:"\'Orbitron\'", fontSize:9, color:"rgba(255,255,255,.75)", letterSpacing:".08em" }}>{getProfile(card.name).role}</div></div>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 55%)" }}/>
          <div style={{ position:"absolute", top:8, right:8, fontFamily:"'Orbitron'", fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:5, background:RC[card.rarity].bg, color:"#fff" }}>{card.rarity}</div>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"10px 12px", background:"linear-gradient(to top,rgba(0,0,0,.9),transparent)" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:3 }}>{card.name}</div>
            <TypeTag type={card.type}/>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.4)", fontFamily:"'Orbitron'", marginTop:3 }}>{card.serial}</div>
          </div>
        </div>
      </div>
      <div style={{ padding:"0 20px" }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:32, color:"#ffe45c" }}>¥{card.price.toLocaleString()} <span style={{ fontSize:12, color:"#555", fontFamily:"'Noto Sans JP'" }}>LIST PRICE</span></div>
        <div style={{ background:"rgba(255,255,255,.03)", borderRadius:12, padding:"10px 14px", margin:"12px 0", border:"1px solid rgba(255,255,255,.06)" }}>
          <div style={{ fontFamily:"'Orbitron'", fontSize:8, color:"#555", letterSpacing:".1em", marginBottom:7 }}>MARKET FEE</div>
          {[["LIST PRICE",`¥${card.price.toLocaleString()}`,"#eee"],["手数料30%",`-¥${fee.toLocaleString()}`,"#ff5555"],["CREATOR / SELLER RECEIVE",`¥${(card.price-fee).toLocaleString()}`,"#44ee88"]].map(([l,v,c])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:"1px solid rgba(255,255,255,.04)", fontSize:10 }}>
              <span style={{ color:"#777" }}>{l}</span><span style={{ color:c, fontFamily:"'Orbitron'", fontWeight:700 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ fontFamily:"'Orbitron'", fontSize:8, color:"#555", letterSpacing:".15em", marginBottom:8 }}>— OWNERSHIP HISTORY</div>
        {Array.from({length:card.history},(_,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,.04)", fontSize:10, color:"#777" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#8b5cf6", flexShrink:0 }}/>
            {i===0?"NEON公式 → First Fan":i===card.history-1?`@prev_fan → ${card.seller}`:`@user${i} → @user${i+1}`}
          </div>
        ))}
        <button style={{ width:"100%", padding:15, borderRadius:14, border:"none", background:"linear-gradient(135deg,#ffe45c,#ef4444)", color:"#000", fontFamily:"'Bebas Neue'", fontSize:22, letterSpacing:".12em", cursor:"pointer", marginTop:18, boxShadow:"0 8px 30px rgba(251,191,36,.3)" }}>BUY NOW</button>
        <div style={{ textAlign:"center", fontSize:8, color:"#444", marginTop:8, fontFamily:"'Orbitron'" }}>購入後、MY BIASMY BIASコレクションに即時反映されます</div>
      </div>
    </div>
  );
}

function RankingScreen() {
  const maxWeekly = MEMBER_RANKING[0].weekly;
  const myOshi = MEMBER_RANKING.find(m=>m.isMyOshi);
  const no2 = MEMBER_RANKING[1];
  const gap = myOshi.weekly - no2.weekly;

  return (
    <div>
      <div className="sb"><span>9:41</span><span>▐▐ ▌</span></div>
      <div style={{ padding:"12px 20px 8px" }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:38, color:"#fff", letterSpacing:".08em", lineHeight:1 }}>
          <span style={{ color:"#ffe45c" }}>BIAS RANK</span>
        </div>
        <div style={{ fontSize:9, color:"#555", fontFamily:"'Orbitron'", marginTop:3, letterSpacing:".12em" }}>
          週間メンバーカード購入数 · 毎時更新
        </div>
      </div>

      {/* 仕組み説明 */}
      <div style={{ margin:"0 16px 12px", padding:"10px 12px", background:"rgba(255,255,255,.03)", borderRadius:12, border:"1px solid rgba(255,255,255,.06)" }}>
        <div style={{ fontSize:10, color:"#888", lineHeight:1.8 }}>
          MY BIASメンのカードを買うほど、<span style={{ color:"#ff2e9a", fontWeight:700 }}>そのメンバーの順位が上がる。</span><br/>
          集めることがMY BIASへの応援になる。
        </div>
      </div>

      {/* MY BIASバナー */}
      <div style={{ margin:"0 16px 14px", padding:"14px", background:`linear-gradient(135deg,${myOshi.color}18,rgba(17,17,34,.8))`, borderRadius:14, border:`1px solid ${myOshi.color}44` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <div style={{ fontSize:32 }}>{myOshi.emoji}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#fff" }}>{myOshi.name}</div>
            <div style={{ fontSize:9, color:myOshi.color, fontFamily:"'Orbitron'", marginTop:2 }}>現在 CENTER 1位 🔥</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"'Orbitron'", fontSize:18, fontWeight:700, color:myOshi.color }}>{myOshi.weekly.toLocaleString()}</div>
            <div style={{ fontSize:8, color:"#666", fontFamily:"'Orbitron'" }}>cards / week</div>
          </div>
        </div>
        <div style={{ fontSize:9, color:"#888", marginBottom:10 }}>
          2位との差 <span style={{ color:"#ffe45c", fontWeight:700, fontFamily:"'Orbitron'" }}>{gap.toLocaleString()}枚</span>　
          あなたの応援 <span style={{ color:myOshi.color, fontWeight:700, fontFamily:"'Orbitron'" }}>{myOshi.myBuy}枚</span>
        </div>
        <button style={{ width:"100%", padding:"10px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${myOshi.color},#8b5cf6)`, color:"#fff", fontFamily:"'Bebas Neue'", fontSize:17, letterSpacing:".1em", cursor:"pointer" }}>
          {myOshi.name}のカードを引く
        </button>
      </div>

      {/* メンバーランキング */}
      <div style={{ padding:"0 16px 8px", fontFamily:"'Orbitron'", fontSize:8, color:"#555", letterSpacing:".15em" }}>— WEEKLY MEMBER RANKING</div>

      {MEMBER_RANKING.map((m, i) => {
        const prevIcon = m.prev > i+1 ? "▲" : m.prev < i+1 ? "▼" : "－";
        const prevColor = m.prev > i+1 ? "#44ee88" : m.prev < i+1 ? "#ff5555" : "#555";
        return (
          <div key={m.name} className="rrow" style={{ animationDelay:`${i*.07}s`, background: m.isMyOshi ? `linear-gradient(90deg,${m.color}10,transparent)` : undefined }}>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:i<3?30:22, width:32, textAlign:"center", flexShrink:0, color:i===0?"#ffe45c":i===1?"#94a3b8":i===2?"#b45309":"#555" }}>
              {i===0?"👑":i===1?"🥈":i===2?"🥉":i+1}
            </div>
            <div style={{ fontSize:26, flexShrink:0 }}>{m.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ fontSize:13, fontWeight:700, color: m.isMyOshi ? m.color : "#eee" }}>{m.name}</div>
                {m.isMyOshi && <div style={{ fontSize:8, color:m.color, fontFamily:"'Orbitron'", background:`${m.color}22`, padding:"1px 6px", borderRadius:4 }}>MY BIAS</div>}
                <div style={{ fontSize:9, color:prevColor, fontFamily:"'Orbitron'", marginLeft:2 }}>{prevIcon}</div>
              </div>
              <div className="rbar-w" style={{ marginTop:6 }}>
                <div className="rbar" style={{ width:`${(m.weekly/maxWeekly)*100}%`, background:`linear-gradient(90deg,${m.color},${m.color}88)` }}/>
              </div>
              <div style={{ fontSize:8, color:"#555", fontFamily:"'Orbitron'", marginTop:3 }}>
                {m.myBuy > 0 && <span style={{ color:m.color }}>あなたの貢献 {m.myBuy}枚　</span>}
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontFamily:"'Orbitron'", fontSize:14, color:m.color, fontWeight:700 }}>{m.weekly.toLocaleString()}</div>
              <div style={{ fontSize:8, color:"#555", fontFamily:"'Orbitron'", marginTop:2 }}>cards / week</div>
            </div>
          </div>
        );
      })}

      <div style={{ margin:"16px", padding:"12px 14px", background:"rgba(255,255,255,.03)", borderRadius:12, border:"1px solid rgba(255,255,255,.06)" }}>
        <div style={{ fontSize:9, color:"#666", fontFamily:"'Orbitron'", letterSpacing:".1em", marginBottom:6 }}>HOW IT WORKS</div>
        <div style={{ fontSize:10, color:"#777", lineHeight:1.8 }}>
          ガチャでメンバーカードを引く・マーケットで購入する<br/>
          → そのメンバーの週間カウントが増える<br/>
          → <span style={{ color:"#ff2e9a" }}>MY BIASメンの順位が上がる</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [nav, setNav] = useState("col");
  const [completeCol, setCompleteCol] = useState(null);
  const [marketDetail, setMarketDetail] = useState(null);
  return (
    <div style={{ minHeight:"100vh", background:"#050314", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{CSS}</style>
      <div className="phone">
        <div className="scr">
          {marketDetail ? <CardDetail card={marketDetail} onBack={()=>setMarketDetail(null)}/>
            : nav==="col"    ? <CollectionScreen onComplete={setCompleteCol}/>
            : nav==="gacha"  ? <GachaScreen/>
            : nav==="market" ? <MarketScreen onDetail={setMarketDetail}/>
            : nav==="rank"   ? <RankingScreen/>
            : null}
        </div>
        {!marketDetail&&(
          <div className="nav">
            {[{id:"col",ico:"🃏",lbl:"COLLECTION"},{id:"gacha",ico:"✨",lbl:"GACHA"},{id:"market",ico:"💹",lbl:"MARKET"},{id:"rank",ico:"🏆",lbl:"RANKING"}].map(n=>(
              <div key={n.id} className={`ni ${nav===n.id?"on":""}`} onClick={()=>setNav(n.id)}>
                <div className="ni-ico" style={{ fontSize:20 }}>{n.ico}</div>
                <div className="ni-lbl">{n.lbl}</div>
              </div>
            ))}
          </div>
        )}
        {completeCol&&<CompleteOverlay col={completeCol} onClose={()=>setCompleteCol(null)}/>}
      </div>
    </div>
  );
}
