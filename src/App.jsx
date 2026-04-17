import { useState, useEffect, useRef } from "react";

const BRANCHES = [
  { id:"ansan",       name:"안산",   full:"안산 관리센터",   color:"#C0785A", bg:"#FDF4F0", dot:"🌸" },
  { id:"namyangju",  name:"남양주", full:"남양주 관리센터", color:"#4A8C7A", bg:"#EFF7F4", dot:"🌿" },
  { id:"pyeongtaek", name:"평택",   full:"평택 관리센터",   color:"#6B6BAE", bg:"#F2F2FB", dot:"💜" },
  { id:"wonju",      name:"원주",   full:"원주 관리센터",   color:"#B07A30", bg:"#FBF5E8", dot:"🍊" },
];
const SPECIES_OPTS = ["강아지","고양이","토끼","거북이","앵무새","기타"];
const ADMIN_PW = "1025";

const makeDogSvg = (bg, fur, ear) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="${bg}"/><ellipse cx="78" cy="78" rx="19" ry="28" fill="${ear}" transform="rotate(-20 78 78)"/><ellipse cx="122" cy="78" rx="19" ry="28" fill="${ear}" transform="rotate(20 122 78)"/><ellipse cx="78" cy="78" rx="12" ry="20" fill="#C07850" transform="rotate(-20 78 78)"/><ellipse cx="122" cy="78" rx="12" ry="20" fill="#C07850" transform="rotate(20 122 78)"/><ellipse cx="100" cy="118" rx="54" ry="52" fill="${fur}"/><ellipse cx="100" cy="112" rx="44" ry="42" fill="#EDD8B8"/><circle cx="84" cy="103" r="10" fill="#1C100A"/><circle cx="116" cy="103" r="10" fill="#1C100A"/><circle cx="87" cy="100" r="3.5" fill="white"/><circle cx="119" cy="100" r="3.5" fill="white"/><circle cx="88.5" cy="101.5" r="1.5" fill="white" opacity="0.7"/><circle cx="120.5" cy="101.5" r="1.5" fill="white" opacity="0.7"/><ellipse cx="100" cy="121" rx="13" ry="9" fill="#C07878"/><path d="M87 121 Q100 133 113 121" stroke="#A05050" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="100" cy="117" rx="7" ry="4.5" fill="#D48888"/><ellipse cx="84" cy="116" rx="8" ry="5" fill="#EDD8B8" opacity="0.5"/><ellipse cx="116" cy="116" rx="8" ry="5" fill="#EDD8B8" opacity="0.5"/></svg>`;

const makeCatSvg = (bg, fur, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="${bg}"/><polygon points="68,82 54,44 90,70" fill="${fur}"/><polygon points="132,82 146,44 110,70" fill="${fur}"/><polygon points="70,80 60,52 88,70" fill="${inner}"/><polygon points="130,80 140,52 112,70" fill="${inner}"/><ellipse cx="100" cy="116" rx="52" ry="50" fill="${fur}"/><ellipse cx="100" cy="110" rx="42" ry="40" fill="#F0DCC8"/><ellipse cx="84" cy="102" rx="12" ry="14" fill="#1A2240"/><ellipse cx="116" cy="102" rx="12" ry="14" fill="#1A2240"/><ellipse cx="84" cy="102" rx="5" ry="13" fill="#080810"/><ellipse cx="116" cy="102" rx="5" ry="13" fill="#080810"/><circle cx="87" cy="98" r="3.5" fill="white"/><circle cx="119" cy="98" r="3.5" fill="white"/><circle cx="88.5" cy="99.5" r="1.5" fill="white" opacity="0.6"/><circle cx="120.5" cy="99.5" r="1.5" fill="white" opacity="0.6"/><ellipse cx="100" cy="121" rx="8" ry="5.5" fill="#D07888"/><path d="M92 121 Q100 130 108 121" stroke="#B05868" stroke-width="1.5" fill="none" stroke-linecap="round"/><line x1="68" y1="113" x2="50" y2="108" stroke="#C0A898" stroke-width="1.3"/><line x1="68" y1="118" x2="49" y2="118" stroke="#C0A898" stroke-width="1.3"/><line x1="68" y1="123" x2="50" y2="128" stroke="#C0A898" stroke-width="1.3"/><line x1="132" y1="113" x2="150" y2="108" stroke="#C0A898" stroke-width="1.3"/><line x1="132" y1="118" x2="151" y2="118" stroke="#C0A898" stroke-width="1.3"/><line x1="132" y1="123" x2="150" y2="128" stroke="#C0A898" stroke-width="1.3"/></svg>`;

const makeRabbitSvg = (bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="${bg}"/><ellipse cx="80" cy="64" rx="13" ry="34" fill="#E8E0D8"/><ellipse cx="120" cy="64" rx="13" ry="34" fill="#E8E0D8"/><ellipse cx="80" cy="66" rx="7" ry="28" fill="#F0A8B8"/><ellipse cx="120" cy="66" rx="7" ry="28" fill="#F0A8B8"/><ellipse cx="100" cy="124" rx="52" ry="50" fill="#E8E0D8"/><ellipse cx="100" cy="116" rx="42" ry="42" fill="#F5F0EC"/><circle cx="85" cy="108" r="10" fill="#1A1830"/><circle cx="115" cy="108" r="10" fill="#1A1830"/><circle cx="88" cy="105" r="3.5" fill="white"/><circle cx="118" cy="105" r="3.5" fill="white"/><circle cx="89.5" cy="106.5" r="1.5" fill="white" opacity="0.6"/><circle cx="119.5" cy="106.5" r="1.5" fill="white" opacity="0.6"/><ellipse cx="100" cy="125" rx="9" ry="6" fill="#E09090"/><path d="M91 125 Q100 135 109 125" stroke="#C07070" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cx="85" cy="118" rx="8" ry="5" fill="#EDD8D8" opacity="0.7"/><ellipse cx="115" cy="118" rx="8" ry="5" fill="#EDD8D8" opacity="0.7"/></svg>`;

const makeTurtleSvg = (bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="${bg}"/><ellipse cx="100" cy="112" rx="62" ry="54" fill="#5A8C60"/><ellipse cx="100" cy="108" rx="52" ry="44" fill="#68A870"/><path d="M70 90 L100 68 L130 90 L130 128 L100 146 L70 128 Z" fill="#3D6B44" opacity="0.45"/><line x1="100" y1="68" x2="100" y2="146" stroke="#3D6B44" stroke-width="2" opacity="0.45"/><line x1="70" y1="90" x2="130" y2="128" stroke="#3D6B44" stroke-width="2" opacity="0.45"/><line x1="130" y1="90" x2="70" y2="128" stroke="#3D6B44" stroke-width="2" opacity="0.45"/><ellipse cx="100" cy="84" rx="20" ry="18" fill="#78B870"/><circle cx="92" cy="80" r="6" fill="#1C281C"/><circle cx="108" cy="80" r="6" fill="#1C281C"/><circle cx="93.5" cy="78" r="2" fill="white"/><circle cx="109.5" cy="78" r="2" fill="white"/><ellipse cx="100" cy="90" rx="6" ry="4" fill="#C09060"/><path d="M94 90 Q100 95 106 90" stroke="#A07040" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`;

const makeParrotSvg = (bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="${bg}"/><ellipse cx="100" cy="118" rx="44" ry="52" fill="#2EAA6C"/><ellipse cx="100" cy="95" rx="36" ry="40" fill="#38C47C"/><ellipse cx="100" cy="84" rx="30" ry="34" fill="#3DD888"/><ellipse cx="100" cy="70" rx="14" ry="16" fill="#FF6B60"/><ellipse cx="100" cy="66" rx="9" ry="11" fill="#FF4444"/><circle cx="89" cy="76" r="10" fill="#1A1A30"/><circle cx="111" cy="76" r="10" fill="#1A1A30"/><circle cx="91.5" cy="73" r="3.5" fill="white"/><circle cx="113.5" cy="73" r="3.5" fill="white"/><circle cx="93" cy="74.5" r="1.5" fill="white" opacity="0.6"/><circle cx="115" cy="74.5" r="1.5" fill="white" opacity="0.6"/><ellipse cx="100" cy="94" rx="11" ry="8" fill="#F0C030"/><path d="M91 92 Q100 98 109 92" fill="#D8A810"/></svg>`;

const getPetSvg = (species, idx, brBg) => {
  const bg = brBg || "#FDF4F0";
  const dogs = [
    makeDogSvg(bg, "#D4A882", "#A07050"),
    makeDogSvg(bg, "#E8C490", "#C09060"),
    makeDogSvg(bg, "#C8B090", "#906840"),
  ];
  const cats = [
    makeCatSvg(bg, "#C8A880", "#E8A0A8"),
    makeCatSvg(bg, "#D0C0A0", "#F0B8B8"),
    makeCatSvg(bg, "#B8A890", "#E8C0A0"),
  ];
  if (species==="강아지") return "data:image/svg+xml;utf8," + encodeURIComponent(dogs[idx%3]);
  if (species==="고양이") return "data:image/svg+xml;utf8," + encodeURIComponent(cats[idx%3]);
  if (species==="토끼")   return "data:image/svg+xml;utf8," + encodeURIComponent(makeRabbitSvg(bg));
  if (species==="거북이") return "data:image/svg+xml;utf8," + encodeURIComponent(makeTurtleSvg(bg));
  if (species==="앵무새") return "data:image/svg+xml;utf8," + encodeURIComponent(makeParrotSvg(bg));
  return null;
};

const SAMPLES = [
  { id:"s1", name:"코코",  breed:"말티즈",        species:"강아지", age:"2살",   gender:"암컷", branch:"ansan",      notes:"사람을 무척 좋아하는 순한 아이예요 🥰",       neutered:true,  vaccinated:true,  photo:null, svgIdx:0, status:"입양대기", createdAt:5 },
  { id:"s2", name:"나비",  breed:"코리안숏헤어",   species:"고양이", age:"3살",   gender:"수컷", branch:"namyangju",  notes:"조용하고 독립적인 성격이에요",                  neutered:true,  vaccinated:true,  photo:null, svgIdx:0, status:"입양대기", createdAt:4 },
  { id:"s3", name:"복실이",breed:"포메라니안",      species:"강아지", age:"1살",   gender:"암컷", branch:"pyeongtaek", notes:"에너지 넘치는 개구쟁이예요 ⚡",               neutered:false, vaccinated:true,  photo:null, svgIdx:1, status:"입양대기", createdAt:3 },
  { id:"s4", name:"솜이",  breed:"네덜란드드워프", species:"토끼",   age:"6개월", gender:"암컷", branch:"wonju",      notes:"조용하고 얌전한 아이예요",                     neutered:false, vaccinated:false, photo:null, svgIdx:0, status:"입양완료", createdAt:2 },
  { id:"s5", name:"두부",  breed:"비글",           species:"강아지", age:"4살",   gender:"수컷", branch:"ansan",      notes:"산책을 엄청 좋아해요! 활발한 아이예요",       neutered:true,  vaccinated:true,  photo:null, svgIdx:2, status:"입양대기", createdAt:1 },
  { id:"s6", name:"하늘이",breed:"페르시안",        species:"고양이", age:"5살",   gender:"암컷", branch:"wonju",      notes:"조용한 환경을 좋아하는 우아한 고양이예요",    neutered:true,  vaccinated:true,  photo:null, svgIdx:1, status:"입양대기", createdAt:6 },
  { id:"s7", name:"몽이",  breed:"골든리트리버",   species:"강아지", age:"3살",   gender:"수컷", branch:"namyangju",  notes:"온순하고 애교가 넘쳐요 🐾",                   neutered:true,  vaccinated:true,  photo:null, svgIdx:1, status:"입양대기", createdAt:7 },
  { id:"s8", name:"치즈",  breed:"먼치킨",         species:"고양이", age:"2살",   gender:"수컷", branch:"pyeongtaek", notes:"동글동글 귀여운 눈망울이 매력이에요 😻",     neutered:true,  vaccinated:true,  photo:null, svgIdx:2, status:"입양완료", createdAt:8 },
];

const emptyForm = () => ({ name:"", breed:"", species:"강아지", age:"", gender:"암컷", branch:"ansan", notes:"", neutered:false, vaccinated:false, photo:null, svgIdx:0, status:"입양대기" });
const spEmoji = s => ({강아지:"🐶",고양이:"🐱",토끼:"🐰",거북이:"🐢",앵무새:"🦜",기타:"🐾"}[s]||"🐾");
const getBranch = id => BRANCHES.find(b=>b.id===id)||BRANCHES[0];
const shuffle = arr => [...arr].sort(()=>Math.random()-0.5);

async function compressImg(dataUrl) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      const r = Math.min(600/img.width, 600/img.height, 1);
      c.width = Math.round(img.width*r); c.height = Math.round(img.height*r);
      c.getContext("2d").drawImage(img,0,0,c.width,c.height);
      resolve(c.toDataURL("image/jpeg",0.75));
    };
    img.src = dataUrl;
  });
}

export default function App() {
  const [screen, setScreen]     = useState("list");
  const [animals, setAnimals]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [branchF, setBranchF]   = useState("전체");
  const [speciesF, setSpeciesF] = useState("전체");
  const [isAdmin, setIsAdmin]   = useState(false);
  const [pw, setPw]             = useState("");
  const [pwErr, setPwErr]       = useState(false);
  const [form, setForm]         = useState(emptyForm());
  const [branchOpen, setBranchOpen]   = useState(false);
  const [speciesOpen, setSpeciesOpen] = useState(false);
  const tapRef   = useRef(0);
  const tapTimer = useRef(null);

  useEffect(() => { loadAll(); }, []);

  function loadAll() {
    try {
      const idx = JSON.parse(localStorage.getItem("sh_idx") || "null");
      if (!idx) {
        localStorage.setItem("sh_idx", JSON.stringify(SAMPLES.map(a=>a.id)));
        for (const a of SAMPLES) localStorage.setItem(`sh_${a.id}`, JSON.stringify(a));
        setAnimals([...SAMPLES]);
      } else {
        const ids = JSON.parse(idx);
        const loaded = [];
        for (const id of ids) {
          try { const r = localStorage.getItem(`sh_${id}`); if(r) loaded.push(JSON.parse(r)); } catch {}
        }
        setAnimals(loaded);
      }
    } catch { setAnimals([...SAMPLES]); }
    setLoading(false);
  }

  function addAnimal() {
    if (!form.name.trim()) return;
    const a = { ...form, id:`a${Date.now()}`, createdAt:Date.now(), svgIdx:Math.floor(Math.random()*3) };
    setAnimals(prev=>[a,...prev]);
    try {
      localStorage.setItem(`sh_${a.id}`, JSON.stringify(a));
      const idx = JSON.parse(localStorage.getItem("sh_idx") || "null");
      const ids = idx ? JSON.parse(idx) : [];
      localStorage.setItem("sh_idx", JSON.stringify([a.id,...ids]));
    } catch(e){ console.error(e); }
    setForm(emptyForm()); setScreen("list");
  }

  function toggleStatus(id) {
    const updated = animals.map(a => a.id===id ? {...a, status:a.status==="입양대기"?"입양완료":"입양대기"} : a);
    setAnimals(updated);
    const upd = updated.find(a=>a.id===id);
    if (selected?.id===id) setSelected(upd);
    localStorage.setItem(`sh_${id}`, JSON.stringify(upd));
  }

  function deleteAnimal(id) {
    setAnimals(prev=>prev.filter(a=>a.id!==id));
    setSelected(null); setScreen("list");
    try {
      localStorage.removeItem(`sh_${id}`);
      const idx = JSON.parse(localStorage.getItem("sh_idx") || "null");
      if(idx){ const ids=JSON.parse(idx).filter(i=>i!==id); localStorage.setItem("sh_idx",JSON.stringify(ids)); }
    } catch {}
  }

  const handleLogoTap = () => {
    tapRef.current++;
    if(tapTimer.current) clearTimeout(tapTimer.current);
    if(tapRef.current>=5){ setScreen("pwLogin"); tapRef.current=0; return; }
    tapTimer.current = setTimeout(()=>{ tapRef.current=0; }, 2000);
  };

  const submitPw = () => {
    if(pw===ADMIN_PW){ setIsAdmin(true); setScreen("list"); setPw(""); setPwErr(false); }
    else setPwErr(true);
  };

  const handlePhoto = async e => {
    const f=e.target.files[0]; if(!f) return;
    const reader=new FileReader();
    reader.onload=async ev=>{ const c=await compressImg(ev.target.result); setForm(prev=>({...prev,photo:c})); };
    reader.readAsDataURL(f);
  };

  const sortAnimals = list => [...shuffle(list.filter(a=>a.status!=="입양완료")), ...shuffle(list.filter(a=>a.status==="입양완료"))];
  const filtered = sortAnimals(animals.filter(a=>{
    if(branchF!=="전체" && a.branch!==branchF) return false;
    if(speciesF!=="전체" && a.species!==speciesF) return false;
    return true;
  }));

  const F = { fontFamily:"'Noto Sans KR',sans-serif" };
  const P = { fontFamily:"'Sunflower',sans-serif" };
  const page = { ...F, background:"#FAF7F4", minHeight:"100vh" };

  const PetPhoto = ({ animal, rounded=true }) => {
    const br = getBranch(animal.branch);
    const src = animal.photo || getPetSvg(animal.species, animal.svgIdx||0, br.bg);
    return (
      <div style={{width:"100%",aspectRatio:"1",background:br.bg,borderRadius:rounded?0:0,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {src ? <img src={src} alt={animal.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:52}}>{spEmoji(animal.species)}</span>}
      </div>
    );
  };

  /* ── LOADING ── */
  if (loading) return (
    <div style={{...page,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,minHeight:"100vh"}}>
      <div style={{fontSize:44}}>🐾</div>
      <p style={{color:"#C4B8AD",fontWeight:500,fontSize:14,letterSpacing:"0.05em"}}>불러오는 중...</p>
    </div>
  );

  /* ── PW LOGIN ── */
  if (screen==="pwLogin") return (
    <div style={{...page,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:24,boxSizing:"border-box"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sunflower:wght@300;500;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');`}</style>
      <div style={{background:"white",borderRadius:28,padding:"40px 32px",width:"100%",maxWidth:380,boxShadow:"0 20px 60px rgba(0,0,0,0.07)"}}>
        <div style={{fontSize:40,marginBottom:16,textAlign:"center"}}>🔒</div>
        <h2 style={{margin:"0 0 6px",...P,fontWeight:700,fontSize:22,textAlign:"center",color:"#2A2420"}}>관리자 로그인</h2>
        <p style={{margin:"0 0 28px",color:"#B4A89C",fontSize:14,textAlign:"center"}}>관리자 비밀번호를 입력해주세요</p>
        <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setPwErr(false);}} onKeyDown={e=>e.key==="Enter"&&submitPw()} placeholder="비밀번호"
          style={{width:"100%",padding:"14px 18px",borderRadius:14,border:`1.5px solid ${pwErr?"#C07070":"#EDE5DE"}`,...F,fontSize:15,boxSizing:"border-box",outline:"none",color:"#2A2420",background:"#FDFAF8"}}/>
        {pwErr && <p style={{color:"#B05050",fontSize:13,margin:"8px 0 0",fontWeight:500}}>비밀번호가 맞지 않아요</p>}
        <div style={{display:"flex",gap:10,marginTop:20}}>
          <button onClick={()=>{setScreen("list");setPw("");setPwErr(false);}} style={{flex:1,padding:14,borderRadius:14,border:"1.5px solid #EDE5DE",background:"white",cursor:"pointer",fontWeight:500,...F,fontSize:14,color:"#B4A89C"}}>취소</button>
          <button onClick={submitPw} style={{flex:2,padding:14,borderRadius:14,border:"none",background:"#2A2420",color:"white",cursor:"pointer",fontWeight:600,...F,fontSize:14,letterSpacing:"0.03em"}}>입장하기</button>
        </div>
      </div>
    </div>
  );

  /* ── DETAIL ── */
  if (screen==="detail" && selected) {
    const br = getBranch(selected.branch);
    const adopted = selected.status==="입양완료";
    return (
      <div style={{...page,paddingBottom:48}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sunflower:wght@300;500;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');`}</style>
        <div style={{background:"white",padding:"14px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid #EDE5DE",position:"sticky",top:0,zIndex:50}}>
          <button onClick={()=>setScreen("list")} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,padding:4,lineHeight:1,color:"#8A7A70"}}>←</button>
          <span style={{fontWeight:600,fontSize:16,color:"#2A2420",flex:1,...F}}>{selected.name}</span>
          {adopted && <span style={{background:"#EDE5DE",color:"#9A8A80",padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:"0.04em"}}>입양완료</span>}
        </div>

        <div style={{position:"relative",width:"100%",aspectRatio:"4/3",overflow:"hidden"}}>
          <PetPhoto animal={selected} rounded={false}/>
          {adopted && <div style={{position:"absolute",inset:0,background:"rgba(250,247,244,0.7)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{background:"#6A5A50",color:"white",padding:"10px 26px",borderRadius:24,fontSize:13,fontWeight:600,letterSpacing:"0.08em"}}>입양완료</span>
          </div>}
        </div>

        <div style={{padding:"26px 22px 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
            <div>
              <h1 style={{margin:"0 0 6px",...P,fontSize:30,fontWeight:700,color:"#2A2420"}}>{selected.name}</h1>
              <p style={{margin:0,color:"#A89890",fontSize:14,fontWeight:400}}>{selected.breed} · {selected.age} · {selected.gender}</p>
            </div>
            <div style={{background:br.bg,borderRadius:14,padding:"10px 14px",textAlign:"center",minWidth:56}}>
              <div style={{fontSize:18,lineHeight:1,marginBottom:4}}>{br.dot}</div>
              <div style={{fontSize:11,fontWeight:700,color:br.color,letterSpacing:"0.03em"}}>{br.name}</div>
            </div>
          </div>

          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
            {selected.neutered   && <span style={{background:"#E8F4EA",color:"#3A7A48",padding:"7px 14px",borderRadius:20,fontSize:12,fontWeight:600}}>✓ 중성화 완료</span>}
            {selected.vaccinated && <span style={{background:"#E8EEF8",color:"#3A5890",padding:"7px 14px",borderRadius:20,fontSize:12,fontWeight:600}}>✓ 접종 완료</span>}
            {!selected.neutered  && <span style={{background:"#F2EDE8",color:"#C0B0A8",padding:"7px 14px",borderRadius:20,fontSize:12,fontWeight:500}}>중성화 미완료</span>}
          </div>

          {selected.notes && (
            <div style={{background:"white",borderRadius:18,padding:"20px 22px",marginBottom:18,border:"1px solid #EDE5DE",lineHeight:1.85,fontSize:15,color:"#5A4A40"}}>
              {selected.notes}
            </div>
          )}

          <div style={{background:"white",borderRadius:18,padding:"18px 22px",marginBottom:26,border:"1px solid #EDE5DE"}}>
            <p style={{margin:"0 0 4px",fontSize:10,color:"#C4B4A8",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>담당 관리센터</p>
            <p style={{margin:0,fontWeight:600,color:"#2A2420",fontSize:15}}>{br.full}</p>
          </div>

          {isAdmin && (
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>toggleStatus(selected.id)}
                style={{flex:1,padding:16,borderRadius:16,border:"none",cursor:"pointer",fontWeight:600,...F,fontSize:14,background:adopted?"#B07A30":"#4A8C7A",color:"white",letterSpacing:"0.03em"}}>
                {adopted?"입양대기로 변경":"입양완료로 변경"}
              </button>
              <button onClick={()=>{ if(window.confirm(`${selected.name}를 삭제할까요?`)) deleteAnimal(selected.id); }}
                style={{padding:"16px 18px",borderRadius:16,border:"none",cursor:"pointer",fontWeight:600,...F,fontSize:14,background:"#FAECEC",color:"#B05050"}}>
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── ADD FORM ── */
  if (screen==="addForm") return (
    <div style={{...page,paddingBottom:60}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sunflower:wght@300;500;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');`}</style>
      <div style={{background:"white",padding:"14px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid #EDE5DE",position:"sticky",top:0,zIndex:50}}>
        <button onClick={()=>{ setScreen("list"); setForm(emptyForm()); }} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,padding:4,lineHeight:1,color:"#8A7A70"}}>←</button>
        <span style={{...P,fontWeight:700,fontSize:18,color:"#2A2420"}}>새 아이 등록</span>
      </div>
      <div style={{padding:"24px 22px"}}>
        <div onClick={()=>document.getElementById("ph-inp").click()}
          style={{width:"100%",aspectRatio:"4/3",borderRadius:20,background:form.photo?"none":"#F5F0EB",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:26,cursor:"pointer",overflow:"hidden",border:form.photo?"none":"1.5px dashed #D8CECE"}}>
          {form.photo ? <img src={form.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            : <div style={{textAlign:"center",color:"#C4B4A8"}}><div style={{fontSize:32}}>📷</div><div style={{fontSize:13,marginTop:10,fontWeight:500}}>사진 추가하기</div></div>}
          <input id="ph-inp" type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
        </div>

        {[{label:"이름 *",key:"name",placeholder:"예: 코코"},{label:"품종",key:"breed",placeholder:"예: 말티즈"},{label:"나이",key:"age",placeholder:"예: 2살"}].map(({label,key,placeholder})=>(
          <div key={key} style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:10,fontWeight:600,color:"#C4B4A8",marginBottom:6,letterSpacing:"0.1em",textTransform:"uppercase"}}>{label}</label>
            <input value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={placeholder}
              style={{width:"100%",padding:"13px 16px",borderRadius:13,border:"1.5px solid #EDE5DE",...F,fontSize:15,boxSizing:"border-box",outline:"none",background:"white",color:"#2A2420"}}/>
          </div>
        ))}

        <div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:10,fontWeight:600,color:"#C4B4A8",marginBottom:6,letterSpacing:"0.1em",textTransform:"uppercase"}}>특이사항</label>
          <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="예: 사람을 좋아하는 순한 아이예요 🥰"
            style={{width:"100%",padding:"13px 16px",borderRadius:13,border:"1.5px solid #EDE5DE",...F,fontSize:15,boxSizing:"border-box",outline:"none",background:"white",color:"#2A2420",minHeight:80,resize:"vertical"}}/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
          {[{label:"종류",key:"species",opts:SPECIES_OPTS.map(s=>({v:s,l:s}))},{label:"성별",key:"gender",opts:[{v:"암컷",l:"암컷"},{v:"수컷",l:"수컷"}]},{label:"관리센터",key:"branch",opts:BRANCHES.map(b=>({v:b.id,l:b.name}))}].map(({label,key,opts})=>(
            <div key={key}>
              <label style={{display:"block",fontSize:10,fontWeight:600,color:"#C4B4A8",marginBottom:5,letterSpacing:"0.08em",textTransform:"uppercase"}}>{label}</label>
              <select value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                style={{width:"100%",padding:"10px 8px",borderRadius:12,border:"1.5px solid #EDE5DE",...F,fontSize:12,background:"white",outline:"none",color:"#2A2420"}}>
                {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div style={{display:"flex",gap:24,marginBottom:30}}>
          {[{key:"neutered",label:"중성화 완료"},{key:"vaccinated",label:"접종 완료"}].map(({key,label})=>(
            <label key={key} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:14,fontWeight:500,color:"#5A4A40"}}>
              <input type="checkbox" checked={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.checked}))} style={{width:16,height:16,accentColor:"#C0785A",cursor:"pointer"}}/>
              {label}
            </label>
          ))}
        </div>

        <button onClick={addAnimal} disabled={!form.name.trim()}
          style={{width:"100%",padding:18,borderRadius:18,border:"none",background:form.name.trim()?"#2A2420":"#E8DDD5",color:form.name.trim()?"white":"#C4B4A8",fontSize:15,fontWeight:600,cursor:form.name.trim()?"pointer":"default",...F,letterSpacing:"0.04em",transition:"all 0.2s"}}>
          🐾  등록하기
        </button>
      </div>
    </div>
  );

  /* ── MAIN LIST ── */
  const waitingCount = animals.filter(a=>a.status==="입양대기").length;
  return (
    <div style={{...page,paddingBottom:80}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sunflower:wght@300;500;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap'); *{-webkit-tap-highlight-color:transparent;} ::-webkit-scrollbar{display:none;}`}</style>

      {isAdmin && (
        <div style={{background:"#2A2420",color:"#D4C8B8",padding:"10px 22px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontWeight:500,fontSize:12,letterSpacing:"0.06em"}}>🔑  관리자 모드</span>
          <button onClick={()=>setIsAdmin(false)} style={{background:"rgba(255,255,255,0.12)",border:"none",color:"#D4C8B8",padding:"5px 14px",borderRadius:20,cursor:"pointer",fontWeight:500,...F,fontSize:11,letterSpacing:"0.04em"}}>나가기</button>
        </div>
      )}

      {/* Header */}
      <div style={{background:"white",borderBottom:"1px solid #EDE5DE",position:"sticky",top:isAdmin?38:0,zIndex:50}}>
        <div style={{padding:"20px 22px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
            <div onClick={handleLogoTap} style={{cursor:"pointer",userSelect:"none"}}>
              <div style={{...P,fontWeight:700,fontSize:24,color:"#2A2420",lineHeight:1.15,letterSpacing:"-0.01em"}}>사지말고 입양하세요</div>
              <div style={{fontSize:12,color:"#C0785A",fontWeight:500,marginTop:4,letterSpacing:"0.03em"}}>{waitingCount}마리가 새 가족을 기다려요</div>
            </div>
            {isAdmin && (
              <button onClick={()=>setScreen("addForm")}
                style={{background:"#2A2420",color:"white",border:"none",borderRadius:20,padding:"10px 20px",fontWeight:600,cursor:"pointer",...F,fontSize:13,letterSpacing:"0.03em",marginTop:2}}>
                + 등록
              </button>
            )}
          </div>

          {/* Branch dropdown */}
          <div style={{marginBottom:10}}>
            <button onClick={()=>{setBranchOpen(o=>!o);setSpeciesOpen(false);}}
              style={{width:"100%",padding:"12px 16px",borderRadius:14,border:`1.5px solid ${branchOpen||branchF!=="전체"?"#C0785A":"#EDE5DE"}`,background:branchF!=="전체"?"#FDF4F0":"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontWeight:600,...F,fontSize:13,color:branchF!=="전체"?"#C0785A":"#B4A89C",transition:"all 0.15s"}}>
              <span>{branchF==="전체"?"🏠  관리센터 전체":getBranch(branchF).dot+"  "+getBranch(branchF).full}</span>
              <span style={{fontSize:9,display:"inline-block",transform:branchOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s",color:"#C4B4A8"}}>▼</span>
            </button>
            {branchOpen && (
              <div style={{marginTop:6,background:"white",borderRadius:16,border:"1px solid #EDE5DE",overflow:"hidden"}}>
                {[{id:"전체",full:"전체 관리센터",dot:"🏠",color:"#C0785A",bg:"#FDF4F0"}, ...BRANCHES].map((b,i)=>{
                  const active = branchF===b.id;
                  return (
                    <div key={b.id} onClick={()=>{setBranchF(b.id);setBranchOpen(false);}}
                      style={{padding:"13px 18px",cursor:"pointer",background:active?b.bg:"white",borderTop:i>0?"1px solid #F5EEE8":"none",display:"flex",alignItems:"center",gap:12}}>
                      <span style={{fontSize:18}}>{b.dot}</span>
                      <span style={{fontWeight:active?700:400,color:active?b.color:"#8A7A70",fontSize:14,...F}}>{b.full}</span>
                      {active && <span style={{marginLeft:"auto",color:b.color,fontSize:15,fontWeight:700}}>✓</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Species dropdown */}
          <div>
            <button onClick={()=>{setSpeciesOpen(o=>!o);setBranchOpen(false);}}
              style={{width:"100%",padding:"12px 16px",borderRadius:14,border:`1.5px solid ${speciesOpen||speciesF!=="전체"?"#6B6BAE":"#EDE5DE"}`,background:speciesF!=="전체"?"#F2F2FB":"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontWeight:600,...F,fontSize:13,color:speciesF!=="전체"?"#6B6BAE":"#B4A89C",transition:"all 0.15s"}}>
              <span>{speciesF==="전체"?"🐾  종류 전체":spEmoji(speciesF)+"  "+speciesF}</span>
              <span style={{fontSize:9,display:"inline-block",transform:speciesOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s",color:"#C4B4A8"}}>▼</span>
            </button>
            {speciesOpen && (
              <div style={{marginTop:6,background:"white",borderRadius:16,border:"1px solid #EDE5DE",overflow:"hidden"}}>
                {[{s:"전체",label:"전체 종류",color:"#6B6BAE",bg:"#F2F2FB"},...SPECIES_OPTS.map(s=>({s,label:s,color:{강아지:"#C0785A",고양이:"#6B6BAE",토끼:"#4A8C7A",거북이:"#4A7C59",앵무새:"#B07A30",기타:"#8A7A70"}[s]||"#6B6BAE",bg:{강아지:"#FDF4F0",고양이:"#F2F2FB",토끼:"#EFF7F4",거북이:"#EAF4EC",앵무새:"#FBF5E8",기타:"#F5F0EB"}[s]||"#F5F0EB"}))].map((item,i)=>{
                  const active = speciesF===item.s;
                  return (
                    <div key={item.s} onClick={()=>{setSpeciesF(item.s);setSpeciesOpen(false);}}
                      style={{padding:"13px 18px",cursor:"pointer",background:active?item.bg:"white",borderTop:i>0?"1px solid #F5EEE8":"none",display:"flex",alignItems:"center",gap:12}}>
                      <span style={{fontSize:20}}>{item.s==="전체"?"🐾":spEmoji(item.s)}</span>
                      <span style={{fontWeight:active?700:400,color:active?item.color:"#8A7A70",fontSize:14,...F}}>{item.label}</span>
                      {active && <span style={{marginLeft:"auto",color:item.color,fontSize:15,fontWeight:700}}>✓</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Count */}
      <div style={{padding:"14px 22px 6px",fontSize:11,color:"#C4B4A8",fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase"}}>{filtered.length}마리</div>

      {/* Grid */}
      {filtered.length===0 ? (
        <div style={{textAlign:"center",padding:"70px 20px",color:"#D5C8C0"}}>
          <div style={{fontSize:44,marginBottom:14}}>🐾</div>
          <p style={{fontWeight:500,fontSize:14,letterSpacing:"0.03em"}}>해당하는 아이가 없어요</p>
        </div>
      ) : (
        <div style={{padding:"6px 14px 24px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(162px,1fr))",gap:14}}>
          {filtered.map(animal=>{
            const br = getBranch(animal.branch);
            const adopted = animal.status==="입양완료";
            return (
              <div key={animal.id} onClick={()=>{ setSelected(animal); setScreen("detail"); }}
                style={{background:"white",borderRadius:22,overflow:"hidden",cursor:"pointer",border:"1px solid #EDE5DE",opacity:adopted?0.58:1,transition:"transform 0.18s,box-shadow 0.18s"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 14px 36px rgba(0,0,0,0.10)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <div style={{position:"relative"}}>
                  <PetPhoto animal={animal} rounded={false}/>
                  {adopted && (
                    <div style={{position:"absolute",inset:0,background:"rgba(250,247,244,0.65)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{background:"#6A5A50",color:"white",padding:"5px 12px",borderRadius:12,fontSize:10,fontWeight:600,letterSpacing:"0.07em"}}>입양완료</span>
                    </div>
                  )}
                  <div style={{position:"absolute",top:10,left:10,background:"rgba(255,255,255,0.88)",borderRadius:10,padding:"3px 9px",fontSize:11,fontWeight:700,color:br.color,backdropFilter:"blur(4px)"}}>
                    {br.dot} {br.name}
                  </div>
                </div>
                <div style={{padding:"14px 14px 16px"}}>
                  <div style={{...P,fontWeight:700,fontSize:17,color:"#2A2420",marginBottom:4}}>{animal.name}</div>
                  <div style={{fontSize:12,color:"#B4A89C",fontWeight:400,marginBottom:10}}>{animal.breed} · {animal.age}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{fontSize:11,fontWeight:600,color:"#8A7A70",background:"#F2EDE8",padding:"4px 10px",borderRadius:8}}>{animal.gender}</span>
                    {animal.neutered && <span style={{fontSize:11,fontWeight:600,color:"#4A8C7A",background:"#EFF7F4",padding:"4px 10px",borderRadius:8}}>중성화</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
