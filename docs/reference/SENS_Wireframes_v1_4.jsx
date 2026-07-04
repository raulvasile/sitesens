import { useState } from "react";

const C = {
  gd:"#003827", gm:"#004B24", gl:"#49BF07", or:"#D89302",
  bg:"#F7FAF6", card:"#FFFFFF", tx:"#1A1A1A", txm:"#6B7280", bd:"#E5E7EB",
};

const WB = ({ w="100%", h="40px", label, bg="#E8EEE6", r="8px", children, s={}, onClick }) => (
  <div onClick={onClick} style={{ width:w, height:h, background:bg, borderRadius:r, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", color:C.txm, border:`1px dashed ${C.bd}`, flexShrink:0, boxSizing:"border-box", padding:"4px 8px", textAlign:"center", cursor:onClick?"pointer":"default", ...s }}>{children||label}</div>
);

const Btn = ({ label, primary, small, ghost, outline, s={}, onClick }) => (
  <div onClick={onClick} style={{ padding:small?"6px 12px":"10px 20px", background:ghost?"transparent":primary?C.or:outline?"transparent":"transparent", color:ghost?"#fff":primary?"#fff":outline?C.gd:C.gd, border:ghost?"1px solid rgba(255,255,255,0.3)":primary?"none":outline?`1.5px solid ${C.gd}`:`2px solid ${C.gd}`, borderRadius:"24px", fontSize:small?"11px":"13px", fontWeight:600, display:"inline-flex", alignItems:"center", gap:"6px", cursor:onClick?"pointer":"default", whiteSpace:"nowrap", userSelect:"none", ...s }}>{label}</div>
);

const Card = ({ children, s={}, onClick }) => (
  <div onClick={onClick} style={{ background:C.card, borderRadius:"12px", border:`1px solid ${C.bd}`, padding:"16px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)", cursor:onClick?"pointer":"default", ...s }}>{children}</div>
);

const SL = ({ children }) => (
  <div style={{ fontSize:"9px", textTransform:"uppercase", letterSpacing:"1.5px", color:C.or, fontWeight:700, padding:"8px 12px 4px", borderTop:`1px solid ${C.bd}`, marginTop:"16px" }}>{children}</div>
);

const PhoneFrame = ({ children, title }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"8px" }}>
    <span style={{ fontSize:"10px", color:C.txm, fontWeight:600, textTransform:"uppercase", letterSpacing:"1px" }}>{title}</span>
    <div style={{ width:"280px", height:"580px", border:`3px solid ${C.gd}`, borderRadius:"32px", overflow:"hidden", background:C.bg, display:"flex", flexDirection:"column", position:"relative" }}>
      <div style={{ height:"28px", background:C.gd, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:"60px", height:"6px", background:"#004B24", borderRadius:"3px" }} />
      </div>
      <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>{children}</div>
      <div style={{ height:"12px", background:C.gd, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:"100px", height:"4px", background:"#555", borderRadius:"2px" }} />
      </div>
    </div>
  </div>
);

const DeskFrame = ({ children, title }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", flex:1, minWidth:0 }}>
    <span style={{ fontSize:"10px", color:C.txm, fontWeight:600, textTransform:"uppercase", letterSpacing:"1px" }}>{title}</span>
    <div style={{ width:"100%", maxWidth:"720px", minHeight:"480px", border:`2px solid ${C.gd}`, borderRadius:"8px", overflow:"hidden", background:C.bg, display:"flex", flexDirection:"column" }}>
      <div style={{ height:"24px", background:C.gd, display:"flex", alignItems:"center", padding:"0 10px", gap:"5px" }}>
        {["#FF5F57","#FFBD2E","#28C840"].map((c,i)=><div key={i} style={{ width:"8px", height:"8px", borderRadius:"50%", background:c }} />)}
        <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
          <div style={{ background:"#004B24", borderRadius:"3px", padding:"1px 24px", fontSize:"9px", color:"#8BDBAD" }}>cusens.eu</div>
        </div>
      </div>
      <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>{children}</div>
    </div>
  </div>
);

const A11yIcon = () => (
  <div style={{ position:"absolute", bottom:16, right:12, width:"28px", height:"28px", borderRadius:"50%", background:C.gd, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 6px rgba(0,0,0,0.2)", zIndex:50 }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="4.5" r="2.5"/><path d="M12 7.5v5M8 10h8M10 12.5l-2 7M14 12.5l2 7"/></svg>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.5)" }}>
    <div style={{ background:"#fff", borderRadius:"12px", margin:"16px", maxWidth:"90%", maxHeight:"80%", overflow:"auto", boxShadow:"0 8px 32px rgba(0,0,0,0.2)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", borderBottom:`1px solid ${C.bd}` }}>
        <span style={{ fontSize:"13px", fontWeight:700, color:C.gd }}>{title}</span>
        <div onClick={onClose} style={{ width:"24px", height:"24px", borderRadius:"50%", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:"12px", color:C.txm }}>×</div>
      </div>
      <div style={{ padding:"16px" }}>{children}</div>
    </div>
  </div>
);

/* ---- NAV with login/profile button ---- */
const Nav = ({ mobile, onMenu, menuOpen, nav }) => (
  <div style={{ background:C.gd, padding:mobile?"8px 12px":"8px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
    {mobile ? (
      <>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div onClick={onMenu} style={{ color:"#fff", fontSize:"18px", cursor:"pointer", width:"24px", textAlign:"center" }}>{menuOpen?"×":"≡"}</div>
          <div onClick={()=>nav("home")} style={{ display:"flex", alignItems:"center", gap:"5px", cursor:"pointer" }}>
            <div style={{ width:"18px", height:"18px", borderRadius:"4px", background:C.gl }} />
            <span style={{ color:"#fff", fontWeight:700, fontSize:"13px" }}>SENS</span>
          </div>
        </div>
        <div onClick={()=>nav("dashboard")} style={{ width:"26px", height:"26px", borderRadius:"50%", border:"1.5px solid rgba(255,255,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
      </>
    ) : (
      <>
        <div onClick={()=>nav("home")} style={{ display:"flex", alignItems:"center", gap:"6px", cursor:"pointer" }}>
          <div style={{ width:"20px", height:"20px", borderRadius:"4px", background:C.gl }} />
          <span style={{ color:"#fff", fontWeight:700, fontSize:"14px" }}>SENS</span>
        </div>
        <div style={{ display:"flex", gap:"14px", alignItems:"center" }}>
          {[{l:"Știri",p:"stiri"},{l:"Despre",p:"despre"},{l:"Contact",p:"contact"},{l:"Evenimente",p:"events"}].map(i=>(
            <span key={i.l} onClick={()=>nav(i.p)} style={{ color:"#B8D4C8", fontSize:"11px", cursor:"pointer" }}>{i.l}</span>
          ))}
          <Btn label="Înscrie-te" small s={{ padding:"5px 14px", fontSize:"10px", border:"1.5px solid rgba(255,255,255,0.4)", color:"#fff" }} onClick={()=>nav("inscrie")} />
          <div onClick={()=>nav("dashboard")} style={{ width:"28px", height:"28px", borderRadius:"50%", border:"1.5px solid rgba(255,255,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        </div>
      </>
    )}
  </div>
);

const HamburgerMenu = ({ onClose, nav }) => (
  <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, zIndex:100, display:"flex", flexDirection:"column", background:C.gd }}>
    <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
      <div onClick={onClose} style={{ color:"#fff", fontSize:"18px", cursor:"pointer", width:"28px", height:"28px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"50%", background:"rgba(255,255,255,0.1)" }}>×</div>
      <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
        <div style={{ width:"18px", height:"18px", borderRadius:"4px", background:C.gl }} />
        <span style={{ color:"#fff", fontWeight:700, fontSize:"13px" }}>SENS</span>
      </div>
    </div>
    <div style={{ flex:1, padding:"8px 0", overflowY:"auto" }}>
      {[
        {label:"Acasă",page:"home"},
        {label:"Știri",page:"stiri"},
        {label:"Despre Noi",page:"despre",children:[{l:"Misiune",p:"despre"},{l:"Echipa",p:"despre"},{l:"Program Politic",p:"despre"},{l:"Statut",p:"despre"},{l:"Manifest",p:"despre"}]},
        {label:"Evenimente",page:"events"},
        {label:"Contact",page:"contact"},
        {label:"Donează",page:"doneaza"},
      ].map((item,i)=>(
        <div key={i}>
          <div onClick={()=>{nav(item.page);onClose();}} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px 20px", cursor:"pointer", borderLeft:"3px solid transparent" }}>
            <span style={{ color:"#B8D4C8", fontSize:"14px", fontWeight:500 }}>{item.label}</span>
            {item.children && <span style={{ color:"#6B9C84", fontSize:"10px", marginLeft:"auto" }}>▾</span>}
          </div>
          {item.children && (
            <div style={{ paddingLeft:"24px", background:"rgba(0,0,0,0.15)" }}>
              {item.children.map((ch,j)=>(
                <div key={j} onClick={()=>{nav(ch.p);onClose();}} style={{ padding:"8px 16px", color:"#8BDBAD", fontSize:"12px", borderBottom:"1px solid rgba(255,255,255,0.05)", cursor:"pointer" }}>{ch.l}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
    <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", gap:"8px", borderTop:"1px solid rgba(255,255,255,0.1)" }}>
      <Btn label="Înscrie-te în SENS" primary s={{ width:"100%", justifyContent:"center", padding:"12px", borderRadius:"12px" }} onClick={()=>{nav("inscrie");onClose();}} />
    </div>
    <div style={{ padding:"8px 16px 12px", textAlign:"center" }}>
      <span style={{ fontSize:"8px", color:"#4A7A62" }}>Membru European Greens / EFA</span>
    </div>
  </div>
);

const Footer = ({ mobile, nav }) => (
  <div style={{ background:C.gd, padding:mobile?"12px":"16px 24px", marginTop:"auto" }}>
    <div style={{ display:"flex", gap:"16px", flexWrap:"wrap", justifyContent:mobile?"center":"space-between", alignItems:"center" }}>
      <div style={{ display:"flex", flexDirection:"column", gap:"4px", alignItems:mobile?"center":"flex-start" }}>
        <span style={{ color:"#fff", fontSize:"12px", fontWeight:700 }}>SENS</span>
        <span style={{ color:"#8BDBAD", fontSize:"9px" }}>Sănătate · Educație · Natură · Sustenabilitate</span>
        <span style={{ color:"#4A7A62", fontSize:"8px" }}>Membru al European Greens / EFA</span>
      </div>
      {!mobile && (
        <div style={{ display:"flex", gap:"16px" }}>
          {[{l:"Știri",p:"stiri"},{l:"Despre",p:"despre"},{l:"Contact",p:"contact"},{l:"Donează",p:"doneaza"}].map(i=>(
            <span key={i.l} onClick={()=>nav(i.p)} style={{ color:"#6B9C84", fontSize:"9px", cursor:"pointer" }}>{i.l}</span>
          ))}
        </div>
      )}
    </div>
    <div style={{ borderTop:"1px solid #004B24", marginTop:"8px", paddingTop:"6px", textAlign:"center" }}>
      <span style={{ color:"#6B9C84", fontSize:"8px" }}>CMF: 11240065 · © 2026 Partidul SENS · Politica de confidențialitate</span>
    </div>
  </div>
);

/* ===== NEWS DATA ===== */
const newsData = [
  { id:1, cat:"Comunicat", title:"SENS solicită dezbatere publică pe bugetul verde 2026", date:"23 Feb 2026", excerpt:"Partidul SENS cere Guvernului organizarea unei dezbateri publice privind alocările bugetare pentru protecția mediului în 2026.", body:"Partidul SENS a trimis astăzi o scrisoare deschisă premierului în care solicită organizarea unei dezbateri publice transparente pe tema bugetului alocat protecției mediului pentru anul 2026.\n\nÎn scrisoare se subliniază faptul că bugetul propus alocă doar 1.2% din PIB pentru politici de mediu, sub media europeană de 2.1%.\n\nNu putem vorbi de tranziție verde fără investiții reale. Cerem minim 2% din PIB pentru mediu, conform angajamentelor asumate de România în cadrul Green Deal european, se arată în document.\n\nSENS propune un calendar de dezbateri regionale urmat de o dezbatere națională, cu participarea societății civile, mediului academic și a sectorului privat." },
  { id:2, cat:"Acțiune", title:"200 de copaci plantați în Pădurea SENS — Cluj-Napoca", date:"20 Feb 2026", excerpt:"Voluntarii SENS au plantat 200 de copaci în weekend-ul trecut, contribuind la reîmpădurirea zonei metropolitane Cluj.", body:"În cadrul acțiunii Plantăm Fapte Bune, 85 de voluntari SENS au plantat 200 de puieți de stejar și fag pe un teren de 2 hectare din zona metropolitană Cluj-Napoca.\n\nAcțiunea face parte din programul național de reîmpădurire al partidului, care își propune plantarea a 10.000 de copaci în 2026.\n\nParticipanții au inclus membri din filialele Cluj, Bistrița-Năsăud și Maramureș." },
  { id:3, cat:"Analiză", title:"Impactul schimbărilor climatice asupra agriculturii românești", date:"18 Feb 2026", excerpt:"O analiză SENS arată că seceta din ultimii 3 ani a afectat peste 40% din suprafața agricolă a României.", body:"Un raport elaborat de departamentul de politici publice SENS evidențiază impactul dramatic al schimbărilor climatice asupra agriculturii românești.\n\nPrincipalele concluzii:\n— Seceta severă a afectat 40% din suprafața agricolă în ultimii 3 ani\n— Pierderile economice estimate depășesc 2 miliarde EUR\n— Irigațiile acoperă doar 8% din suprafața arabilă\n\nSENS propune un plan de investiții în infrastructura de irigații, sisteme de captare a apei pluviale și tranziția către culturi rezistente la secetă." },
];

/* ===== PROGRAM DATA ===== */
const programItems = [
  { area:"Sănătate mintală", text:"30 de ședințe de psihoterapie decontate anual de la stat" },
  { area:"Tranziție energetică", text:"10 căi ferate de mare viteză și decarbonizarea sistemului energetic" },
  { area:"Spații verzi", text:"Minim 30 mp de spațiu verde per cetățean în fiecare oraș" },
  { area:"Educație climatică", text:"Introducerea educației climatice în curriculum-ul național" },
  { area:"Drepturi egale", text:"Legislație anti-discriminare completă și parteneriat civil" },
  { area:"Agricultură", text:"Sprijin pentru fermierii care adoptă practici sustenabile" },
];

/* ========== HOME ========== */
const HomePage = ({ mobile, menuOpen, onMenu, nav }) => {
  const [valueModal, setValueModal] = useState(null);
  const [newsIdx, setNewsIdx] = useState(0);
  const values = [
    { title:"Sănătate", desc:"Luptăm pentru ca sănătatea mintală să fie la egalitate cu sănătatea fizică. Cerem 30 de ședințe de terapie decontate și modernizarea spitalelor.", points:["30 ședințe terapie decontate","Modernizare spitale","Dreptul la avort în condiții sigure","Dezincriminarea canabisului medicinal"] },
    { title:"Educație", desc:"Un sistem de educație care valorifică potențialul fiecărui tânăr și îl pregătește pentru provocările viitorului.", points:["Școli moderne, digitalizate","Educație climatică în curriculum","Formare profesională continuă","Acces egal la educație de calitate"] },
    { title:"Natură", desc:"Minimum 30 mp de spațiu verde per cetățean. Protejăm mediul prin reîmpădurire, decarbonizare și agricultură sustenabilă.", points:["30 mp spațiu verde / cetățean","Reîmpădurire la scară națională","Protecție împotriva secetei","Drepturi pentru animale"] },
    { title:"Sustenabilitate", desc:"Tranziție verde echitabilă: energie regenerabilă, transport public modern, economie circulară.", points:["10 căi ferate de mare viteză","Decarbonizare sistem energetic","Facturi de încălzire reduse","Transport public accesibil"] },
  ];
  return (
    <div style={{ position:"relative", flex:1, display:"flex", flexDirection:"column" }}>
      {mobile && menuOpen && <HamburgerMenu onClose={onMenu} nav={nav} />}
      {valueModal !== null && (
        <Modal title={values[valueModal].title} onClose={()=>setValueModal(null)}>
          <p style={{ fontSize:"10px", color:C.tx, lineHeight:1.6, margin:"0 0 10px" }}>{values[valueModal].desc}</p>
          {values[valueModal].points.map((p,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"4px 0" }}>
              <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:C.gl, flexShrink:0 }} />
              <span style={{ fontSize:"10px", color:C.tx }}>{p}</span>
            </div>
          ))}
          <div style={{ marginTop:"12px", paddingTop:"10px", borderTop:`1px solid ${C.bd}` }}>
            <Btn label="Citește Programul Politic complet →" small outline s={{ fontSize:"9px", padding:"5px 10px", borderRadius:"8px" }} onClick={()=>{setValueModal(null);nav("despre");}} />
          </div>
        </Modal>
      )}
      <Nav mobile={mobile} onMenu={onMenu} menuOpen={menuOpen} nav={nav} />
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg, ${C.gd} 0%, #006B3F 100%)`, padding:mobile?"24px 16px":"40px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, width:"200px", height:"200px", background:"radial-gradient(circle, rgba(73,191,7,0.1) 0%, transparent 70%)", borderRadius:"50%" }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:mobile?"100%":"55%" }}>
          <div style={{ color:C.or, fontSize:"9px", fontWeight:700, letterSpacing:"2px", marginBottom:"8px" }}>VIITORUL ARE SENS</div>
          <div style={{ color:"#fff", fontSize:mobile?"22px":"28px", fontWeight:800, lineHeight:1.2, marginBottom:"8px" }}>O Românie verde, echitabilă și modernă.</div>
          <div style={{ color:"#B8D4C8", fontSize:mobile?"11px":"13px", marginBottom:"16px", lineHeight:1.5 }}>Luptăm pentru justiție socială, protecția mediului și drepturi egale pentru toți.</div>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            <Btn label="Înscrie-te" primary onClick={()=>nav("inscrie")} />
            <Btn label="Donează" ghost onClick={()=>nav("doneaza")} />
          </div>
        </div>
      </div>
      {/* Values */}
      <SL>Valorile noastre</SL>
      <div style={{ display:"grid", gridTemplateColumns:mobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:"8px", padding:"8px 12px" }}>
        {values.map((v,idx)=>(
          <Card key={idx} onClick={()=>setValueModal(idx)} s={{ padding:"10px", textAlign:"center" }}>
            <div style={{ fontSize:"11px", fontWeight:700, color:C.gd, marginBottom:"2px" }}>{v.title}</div>
            <div style={{ fontSize:"8px", color:C.txm }}>{v.points[0]}</div>
            <div style={{ fontSize:"8px", color:C.or, marginTop:"4px" }}>Detalii →</div>
          </Card>
        ))}
      </div>
      {/* Program Section — NEW */}
      <SL>Din programul nostru</SL>
      <div style={{ padding:"8px 12px" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
          {programItems.slice(0, mobile?3:6).map((item,i)=>(
            <div key={i} style={{ display:"flex", gap:"10px", alignItems:"flex-start", padding:"8px 10px", background:C.card, borderRadius:"8px", border:`1px solid ${C.bd}` }}>
              <div style={{ width:"3px", height:"28px", borderRadius:"2px", background:C.gl, flexShrink:0, marginTop:"2px" }} />
              <div>
                <div style={{ fontSize:"10px", fontWeight:700, color:C.gd }}>{item.area}</div>
                <div style={{ fontSize:"9px", color:C.txm, lineHeight:1.4 }}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:"8px" }}>
          <Btn label="Vezi programul complet →" small outline s={{ fontSize:"9px", padding:"5px 14px" }} onClick={()=>nav("despre")} />
        </div>
      </div>
      {/* News Carousel */}
      <SL>Ultimele știri</SL>
      <div style={{ padding:"8px 12px" }}>
        {mobile ? (
          <div>
            <Card onClick={()=>nav("articol",newsData[newsIdx].id)} s={{ padding:"0", overflow:"hidden" }}>
              <WB h="140px" label={`Imagine articol`} r="0" />
              <div style={{ padding:"12px" }}>
                <div style={{ fontSize:"8px", color:C.or, fontWeight:600, marginBottom:"3px" }}>{newsData[newsIdx].cat.toUpperCase()}</div>
                <div style={{ fontSize:"12px", fontWeight:700, color:C.gd, marginBottom:"4px", lineHeight:1.3 }}>{newsData[newsIdx].title}</div>
                <div style={{ fontSize:"9px", color:C.txm }}>{newsData[newsIdx].date}</div>
              </div>
            </Card>
            <div style={{ display:"flex", justifyContent:"center", gap:"6px", marginTop:"8px", alignItems:"center" }}>
              <div onClick={()=>setNewsIdx(i=>i>0?i-1:newsData.length-1)} style={{ width:"28px", height:"28px", borderRadius:"50%", border:`1px solid ${C.bd}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:"12px", color:C.txm, background:"#fff" }}>‹</div>
              {newsData.map((_,i)=>(
                <div key={i} style={{ width:newsIdx===i?"16px":"6px", height:"6px", borderRadius:"3px", background:newsIdx===i?C.gd:C.bd, transition:"all 0.2s" }} />
              ))}
              <div onClick={()=>setNewsIdx(i=>i<newsData.length-1?i+1:0)} style={{ width:"28px", height:"28px", borderRadius:"50%", border:`1px solid ${C.bd}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:"12px", color:C.txm, background:"#fff" }}>›</div>
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", gap:"8px" }}>
            {newsData.map((n,i)=>(
              <Card key={i} onClick={()=>nav("articol",n.id)} s={{ flex:1, padding:"0", overflow:"hidden" }}>
                <WB h="80px" label="Thumbnail" r="0" />
                <div style={{ padding:"10px" }}>
                  <div style={{ fontSize:"8px", color:C.or, fontWeight:600, marginBottom:"2px" }}>{n.cat.toUpperCase()}</div>
                  <div style={{ fontSize:"11px", fontWeight:700, color:C.gd, marginBottom:"3px", lineHeight:1.3 }}>{n.title}</div>
                  <div style={{ fontSize:"8px", color:C.txm }}>{n.date}</div>
                </div>
              </Card>
            ))}
          </div>
        )}
        <div style={{ textAlign:"center", marginTop:"8px" }}>
          <Btn label="Toate știrile →" small outline s={{ fontSize:"9px" }} onClick={()=>nav("stiri")} />
        </div>
      </div>
      {/* Events */}
      <SL>Evenimente următoare</SL>
      <div style={{ padding:"8px 12px", display:"flex", flexDirection:"column", gap:"6px" }}>
        {eventsData.filter(e=>!e.past).slice(0,2).map((e,i)=>(
          <Card key={i} onClick={()=>nav("events")} s={{ display:"flex", gap:"10px", alignItems:"center", padding:"10px" }}>
            <div style={{ background:C.gd, borderRadius:"8px", padding:"6px 8px", textAlign:"center", flexShrink:0, minWidth:"36px" }}>
              <div style={{ color:C.or, fontSize:"13px", fontWeight:800, lineHeight:1 }}>{e.date.split(" ")[0]}</div>
              <div style={{ color:"#B8D4C8", fontSize:"8px" }}>{e.date.split(" ")[1]}</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"11px", fontWeight:700, color:C.gd }}>{e.title}</div>
              <div style={{ fontSize:"9px", color:C.txm }}>{e.location}</div>
            </div>
          </Card>
        ))}
        <div style={{ textAlign:"center", marginTop:"4px" }}>
          <Btn label="Toate evenimentele →" small outline s={{ fontSize:"9px" }} onClick={()=>nav("events")} />
        </div>
      </div>
      {/* Social */}
      <SL>Pe rețelele sociale</SL>
      <div style={{ padding:"8px 12px", display:"flex", flexDirection:"column", gap:"8px" }}>
        <Card s={{ padding:"0", overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px" }}>
            <div style={{ width:"22px", height:"22px", borderRadius:"50%", background:"linear-gradient(135deg,#E1306C,#F77737)" }} />
            <div><div style={{ fontSize:"10px", fontWeight:700 }}>@partidulsens</div><div style={{ fontSize:"8px", color:C.txm }}>Instagram · 2h</div></div>
          </div>
          <WB h="100px" label="Imagine postare" r="0" />
          <div style={{ padding:"8px 10px", fontSize:"9px", color:C.tx }}>Am plantat 200 de copaci! #ViitorulAreSens</div>
        </Card>
      </div>
      {/* Newsletter */}
      <div style={{ background:`${C.or}11`, margin:"12px", borderRadius:"12px", padding:"16px", textAlign:"center" }}>
        <div style={{ fontSize:"13px", fontWeight:700, color:C.gd, marginBottom:"4px" }}>Rămâi la curent</div>
        <div style={{ fontSize:"10px", color:C.txm, marginBottom:"10px" }}>Abonează-te la newsletter-ul SENS</div>
        <div style={{ display:"flex", gap:"6px", maxWidth:"300px", margin:"0 auto" }}>
          <WB h="32px" label="email@exemplu.ro" bg="#fff" s={{ flex:1, fontSize:"10px", border:`1px solid ${C.bd}` }} />
          <Btn label="Abonează-te" primary small />
        </div>
      </div>
      <A11yIcon />
      <Footer mobile={mobile} nav={nav} />
    </div>
  );
};

/* ========== STIRI ========== */
const StiriPage = ({ mobile, menuOpen, onMenu, nav }) => {
  const [showCal, setShowCal] = useState(false);
  return (
    <div style={{ position:"relative", flex:1, display:"flex", flexDirection:"column" }}>
      {mobile && menuOpen && <HamburgerMenu onClose={onMenu} nav={nav} />}
      <Nav mobile={mobile} onMenu={onMenu} menuOpen={menuOpen} nav={nav} />
      <div style={{ padding:"16px 12px" }}>
        <div style={{ fontSize:"20px", fontWeight:800, color:C.gd, marginBottom:"12px" }}>Știri</div>
        <div style={{ display:"flex", gap:"6px", marginBottom:"8px", overflowX:"auto" }}>
          {["Toate","Comunicate","Analize","Acțiuni","Media"].map((c,i)=>(
            <div key={c} style={{ padding:"4px 12px", borderRadius:"16px", fontSize:"10px", fontWeight:600, whiteSpace:"nowrap", background:i===0?C.gd:"transparent", color:i===0?"#fff":C.txm, border:i===0?"none":`1px solid ${C.bd}` }}>{c}</div>
          ))}
        </div>
        <div style={{ display:"flex", gap:"6px", marginBottom:"12px" }}>
          <WB h="32px" label="Caută în știri..." bg="#fff" s={{ flex:1, fontSize:"10px", border:`1px solid ${C.bd}` }} />
          <div onClick={()=>setShowCal(!showCal)} style={{ width:"32px", height:"32px", borderRadius:"8px", border:`1px solid ${showCal?C.or:C.bd}`, background:showCal?`${C.or}10`:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={showCal?C.or:C.txm} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          </div>
        </div>
        {showCal && (
          <Card s={{ marginBottom:"12px", padding:"10px" }}>
            <div style={{ fontSize:"10px", fontWeight:600, color:C.gd, marginBottom:"6px", textAlign:"center" }}>Februarie 2026</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"2px", textAlign:"center" }}>
              {["L","M","M","J","V","S","D"].map((d,i)=><div key={i} style={{ fontSize:"8px", color:C.txm, padding:"2px", fontWeight:600 }}>{d}</div>)}
              {Array.from({length:6},(_,i)=><div key={`e${i}`} style={{ padding:"4px" }} />)}
              {Array.from({length:28},(_,i)=>{
                const has=[3,7,12,18,20,23].includes(i+1);
                return <div key={i} style={{ padding:"4px", fontSize:"9px", borderRadius:"4px", background:has?`${C.or}15`:"transparent", color:has?C.or:C.tx, fontWeight:has?700:400, cursor:has?"pointer":"default" }}>{i+1}</div>;
              })}
            </div>
          </Card>
        )}
        {newsData.map((n,i)=>(
          <Card key={i} onClick={()=>nav("articol",n.id)} s={{ display:"flex", gap:"10px", marginBottom:"8px", padding:"10px" }}>
            <WB w="80px" h="60px" label="Img" s={{ flexShrink:0 }} />
            <div style={{ flex:1, minWidth:0 }}>
              <span style={{ fontSize:"8px", background:`${C.or}15`, color:C.or, padding:"1px 6px", borderRadius:"8px", fontWeight:600 }}>{n.cat.toUpperCase()}</span>
              <div style={{ fontSize:"11px", fontWeight:700, color:C.gd, marginTop:"2px", marginBottom:"2px" }}>{n.title}</div>
              <div style={{ fontSize:"9px", color:C.txm, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{n.excerpt}</div>
              <div style={{ fontSize:"8px", color:C.txm, marginTop:"4px" }}>{n.date}</div>
            </div>
          </Card>
        ))}
      </div>
      <Footer mobile={mobile} nav={nav} />
    </div>
  );
};

/* ========== ARTICOL INDIVIDUAL — NEW ========== */
const ArticolPage = ({ mobile, menuOpen, onMenu, nav, articleId }) => {
  const article = newsData.find(n=>n.id===articleId) || newsData[0];
  return (
    <div style={{ position:"relative", flex:1, display:"flex", flexDirection:"column" }}>
      {mobile && menuOpen && <HamburgerMenu onClose={onMenu} nav={nav} />}
      <Nav mobile={mobile} onMenu={onMenu} menuOpen={menuOpen} nav={nav} />
      {/* Hero Image */}
      <WB h={mobile?"160px":"200px"} label="Fotografie articol — full width header" r="0" bg="#D4DDD0" />
      <div style={{ padding:"16px 12px" }}>
        {/* Breadcrumb */}
        <div style={{ display:"flex", gap:"4px", alignItems:"center", marginBottom:"12px", fontSize:"9px" }}>
          <span style={{ color:C.or, cursor:"pointer" }} onClick={()=>nav("home")}>Acasă</span>
          <span style={{ color:C.txm }}>/</span>
          <span style={{ color:C.or, cursor:"pointer" }} onClick={()=>nav("stiri")}>Știri</span>
          <span style={{ color:C.txm }}>/</span>
          <span style={{ color:C.txm }}>{article.cat}</span>
        </div>
        {/* Category + Date */}
        <div style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"8px" }}>
          <span style={{ fontSize:"9px", background:`${C.or}15`, color:C.or, padding:"2px 8px", borderRadius:"10px", fontWeight:600 }}>{article.cat.toUpperCase()}</span>
          <span style={{ fontSize:"9px", color:C.txm }}>{article.date}</span>
        </div>
        {/* Title */}
        <h1 style={{ fontSize:mobile?"18px":"24px", fontWeight:800, color:C.gd, lineHeight:1.3, margin:"0 0 12px" }}>{article.title}</h1>
        {/* Excerpt */}
        <p style={{ fontSize:"11px", color:C.txm, lineHeight:1.5, margin:"0 0 16px", fontStyle:"italic" }}>{article.excerpt}</p>
        {/* Share */}
        <div style={{ display:"flex", gap:"8px", marginBottom:"16px", paddingBottom:"12px", borderBottom:`1px solid ${C.bd}` }}>
          <span style={{ fontSize:"9px", color:C.txm }}>Distribuie:</span>
          {["Facebook","X","LinkedIn","WhatsApp","Copiază link"].map(s=>(
            <span key={s} style={{ fontSize:"9px", color:C.gd, fontWeight:600, cursor:"pointer" }}>{s}</span>
          ))}
        </div>
        {/* Body */}
        <div style={{ fontSize:"11px", color:C.tx, lineHeight:1.8 }}>
          {article.body.split("\n").map((p,i)=>(
            p.trim() ? <p key={i} style={{ margin:"0 0 10px" }}>{p}</p> : null
          ))}
        </div>
        {/* Tags */}
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginTop:"16px", paddingTop:"12px", borderTop:`1px solid ${C.bd}` }}>
          {["buget","mediu","tranziție verde","politici publice"].map(t=>(
            <span key={t} style={{ fontSize:"8px", background:C.bg, padding:"3px 8px", borderRadius:"10px", color:C.txm, border:`1px solid ${C.bd}` }}>#{t}</span>
          ))}
        </div>
        {/* Share bottom */}
        <div style={{ marginTop:"16px", padding:"12px", background:C.bg, borderRadius:"8px", display:"flex", flexDirection:mobile?"column":"row", gap:"8px", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:"10px", fontWeight:600, color:C.gd }}>Distribuie acest articol</span>
          <div style={{ display:"flex", gap:"6px" }}>
            {[{l:"FB",bg:"#1877F2"},{l:"X",bg:"#000"},{l:"in",bg:"#0A66C2"},{l:"WA",bg:"#25D366"}].map(s=>(
              <div key={s.l} style={{ width:"28px", height:"28px", borderRadius:"50%", background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", color:"#fff", fontWeight:700 }}>{s.l}</div>
            ))}
          </div>
        </div>
        {/* Related */}
        <SL>Articole similare</SL>
        <div style={{ display:"flex", flexDirection:mobile?"column":"row", gap:"8px", marginTop:"8px" }}>
          {newsData.filter(n=>n.id!==articleId).slice(0,2).map((n,i)=>(
            <Card key={i} onClick={()=>nav("articol",n.id)} s={{ flex:1, padding:"10px" }}>
              <div style={{ fontSize:"8px", color:C.or, fontWeight:600 }}>{n.cat.toUpperCase()}</div>
              <div style={{ fontSize:"11px", fontWeight:700, color:C.gd, marginTop:"2px", lineHeight:1.3 }}>{n.title}</div>
              <div style={{ fontSize:"8px", color:C.txm, marginTop:"4px" }}>{n.date}</div>
            </Card>
          ))}
        </div>
      </div>
      <Footer mobile={mobile} nav={nav} />
    </div>
  );
};

/* ========== DESPRE ========== */
const DesprePage = ({ mobile, menuOpen, onMenu, nav }) => (
  <div style={{ position:"relative", flex:1, display:"flex", flexDirection:"column" }}>
    {mobile && menuOpen && <HamburgerMenu onClose={onMenu} nav={nav} />}
    <Nav mobile={mobile} onMenu={onMenu} menuOpen={menuOpen} nav={nav} />
    <div style={{ padding:"16px 12px" }}>
      <div style={{ fontSize:"20px", fontWeight:800, color:C.gd, marginBottom:"4px" }}>Despre SENS</div>
      <div style={{ display:"flex", gap:"6px", marginBottom:"16px", overflowX:"auto" }}>
        {["Misiune","Echipa","Program","Statut","Manifest"].map((t,i)=>(
          <div key={t} style={{ padding:"6px 12px", borderRadius:"8px", fontSize:"10px", fontWeight:600, whiteSpace:"nowrap", background:i===0?`${C.gd}11`:"transparent", color:i===0?C.gd:C.txm, borderBottom:i===0?`2px solid ${C.or}`:"none" }}>{t}</div>
        ))}
      </div>
      <Card s={{ marginBottom:"12px" }}><div style={{ fontSize:"13px", fontWeight:700, color:C.gd, marginBottom:"8px" }}>Misiunea noastră</div><WB h="40px" label="Paragraph text — misiune SENS" bg={C.bg} /></Card>
      <Card s={{ marginBottom:"12px", padding:"10px", background:`${C.gl}08`, border:`1px solid ${C.gl}22` }}>
        <div style={{ fontSize:"10px", fontWeight:600, color:C.gd, marginBottom:"2px" }}>Familia Europeană</div>
        <div style={{ fontSize:"9px", color:C.txm, lineHeight:1.5 }}>SENS este membru al European Greens și al grupului Verzi/ALE din Parlamentul European.</div>
      </Card>
      <div style={{ fontSize:"13px", fontWeight:700, color:C.gd, marginBottom:"8px" }}>Echipa</div>
      <div style={{ display:"grid", gridTemplateColumns:mobile?"repeat(2,1fr)":"repeat(3,1fr)", gap:"8px" }}>
        {[{n:"Ana Ciceală",r:"Consilier București"},{n:"Andrei Macsut",r:"Președinte"},{n:"Florina Presadă",r:"Vicepreședintă"},{n:"Cristina V.",r:"Comunicare"}].map((m,i)=>(
          <Card key={i} s={{ textAlign:"center", padding:"10px" }}>
            <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:`${C.gd}15`, margin:"0 auto 6px" }} />
            <div style={{ fontSize:"10px", fontWeight:700, color:C.gd }}>{m.n}</div>
            <div style={{ fontSize:"8px", color:C.txm }}>{m.r}</div>
          </Card>
        ))}
      </div>
    </div>
    <Footer mobile={mobile} nav={nav} />
  </div>
);

/* ========== CONTACT — NEW ========== */
const ContactPage = ({ mobile, menuOpen, onMenu, nav }) => (
  <div style={{ position:"relative", flex:1, display:"flex", flexDirection:"column" }}>
    {mobile && menuOpen && <HamburgerMenu onClose={onMenu} nav={nav} />}
    <Nav mobile={mobile} onMenu={onMenu} menuOpen={menuOpen} nav={nav} />
    <div style={{ padding:"16px 12px" }}>
      <div style={{ fontSize:"20px", fontWeight:800, color:C.gd, marginBottom:"4px" }}>Contact</div>
      <div style={{ fontSize:"10px", color:C.txm, marginBottom:"16px" }}>Scrie-ne sau abonează-te la newsletter</div>
      {/* Contact Form */}
      <Card s={{ marginBottom:"12px" }}>
        <div style={{ fontSize:"12px", fontWeight:700, color:C.gd, marginBottom:"12px" }}>Trimite-ne un mesaj</div>
        {["Nume complet *","Email *","Subiect *"].map(f=>(
          <div key={f} style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"9px", color:C.txm, marginBottom:"3px", fontWeight:500 }}>{f}</div>
            <WB h="32px" bg="#fff" s={{ border:`1px solid ${C.bd}` }} />
          </div>
        ))}
        <div style={{ marginBottom:"10px" }}>
          <div style={{ fontSize:"9px", color:C.txm, marginBottom:"3px", fontWeight:500 }}>Mesaj *</div>
          <WB h="80px" bg="#fff" label="Scrie mesajul tău aici..." s={{ border:`1px solid ${C.bd}`, alignItems:"flex-start", paddingTop:"8px" }} />
        </div>
        <Btn label="Trimite mesajul" primary s={{ width:"100%", justifyContent:"center" }} />
      </Card>
      {/* Newsletter */}
      <Card s={{ marginBottom:"12px", background:`${C.or}08`, borderColor:`${C.or}33` }}>
        <div style={{ fontSize:"12px", fontWeight:700, color:C.gd, marginBottom:"4px" }}>Abonează-te la newsletter</div>
        <div style={{ fontSize:"9px", color:C.txm, marginBottom:"10px", lineHeight:1.5 }}>Primește actualizări despre acțiunile, evenimentele și pozițiile SENS direct în inbox.</div>
        <div style={{ marginBottom:"8px" }}>
          <div style={{ fontSize:"9px", color:C.txm, marginBottom:"3px" }}>Nume (opțional)</div>
          <WB h="32px" bg="#fff" s={{ border:`1px solid ${C.bd}` }} />
        </div>
        <div style={{ marginBottom:"8px" }}>
          <div style={{ fontSize:"9px", color:C.txm, marginBottom:"3px" }}>Email *</div>
          <WB h="32px" bg="#fff" s={{ border:`1px solid ${C.bd}` }} />
        </div>
        <div style={{ display:"flex", alignItems:"flex-start", gap:"6px", marginBottom:"10px" }}>
          <div style={{ width:"14px", height:"14px", borderRadius:"3px", border:`1.5px solid ${C.gl}`, background:C.gl, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"1px" }}>
            <span style={{ color:"#fff", fontSize:"9px" }}>✓</span>
          </div>
          <span style={{ fontSize:"8px", color:C.txm, lineHeight:1.4 }}>Sunt de acord cu prelucrarea datelor conform Politicii de Confidențialitate</span>
        </div>
        <Btn label="Abonează-te" primary small s={{ width:"100%", justifyContent:"center" }} />
      </Card>
      {/* Contact Info */}
      <Card>
        <div style={{ fontSize:"12px", fontWeight:700, color:C.gd, marginBottom:"10px" }}>Date de contact</div>
        {[
          {l:"Email",v:"contact@cusens.eu"},
          {l:"Sediu central",v:"București, Sector 1"},
          {l:"Program",v:"Luni – Vineri, 10:00 – 18:00"},
        ].map((item,i)=>(
          <div key={i} style={{ marginBottom:"8px" }}>
            <div style={{ fontSize:"9px", color:C.txm, fontWeight:500 }}>{item.l}</div>
            <div style={{ fontSize:"10px", color:C.tx, fontWeight:600 }}>{item.v}</div>
          </div>
        ))}
      </Card>
    </div>
    <Footer mobile={mobile} nav={nav} />
  </div>
);

/* ========== INSCRIE-TE ========== */
const InscriePage = ({ mobile, menuOpen, onMenu, nav }) => {
  const [step, setStep] = useState(0);
  const steps = ["Date personale","Adresă","Motivație","Consimțământ","Confirmare"];
  const next = () => setStep(s=>Math.min(s+1,4));
  const prev = () => setStep(s=>Math.max(s-1,0));
  return (
    <div style={{ position:"relative", flex:1, display:"flex", flexDirection:"column" }}>
      {mobile && menuOpen && <HamburgerMenu onClose={onMenu} nav={nav} />}
      <Nav mobile={mobile} onMenu={onMenu} menuOpen={menuOpen} nav={nav} />
      <div style={{ padding:"16px 12px" }}>
        <div style={{ fontSize:"20px", fontWeight:800, color:C.gd, marginBottom:"4px" }}>Înscrie-te în SENS</div>
        <div style={{ fontSize:"10px", color:C.txm, marginBottom:"16px" }}>Fii parte din schimbare</div>
        <div style={{ display:"flex", alignItems:"center", marginBottom:"20px" }}>
          {steps.map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center", flex:i<4?1:"none" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2px" }}>
                <div style={{ width:"22px", height:"22px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", fontWeight:700, background:i<step?C.gl:i===step?C.or:"#E5E7EB", color:i<=step?"#fff":C.txm }}>{i<step?"✓":i+1}</div>
                <span style={{ fontSize:"6px", color:i<=step?C.gd:C.txm, whiteSpace:"nowrap", maxWidth:"50px", textAlign:"center", overflow:"hidden", textOverflow:"ellipsis" }}>{s}</span>
              </div>
              {i<4 && <div style={{ height:"2px", flex:1, background:i<step?C.gl:"#E5E7EB", margin:"0 2px", marginBottom:"10px" }} />}
            </div>
          ))}
        </div>
        <Card>
          <div style={{ fontSize:"12px", fontWeight:700, color:C.gd, marginBottom:"12px" }}>{steps[step]}</div>
          {step===0 && ["Prenume *","Nume *","Email *","Telefon *","Data nașterii *"].map(f=>(<div key={f} style={{ marginBottom:"10px" }}><div style={{ fontSize:"9px", color:C.txm, marginBottom:"3px", fontWeight:500 }}>{f}</div><WB h="32px" bg="#fff" s={{ border:`1px solid ${C.bd}` }} /></div>))}
          {step===1 && ["Județ *","Localitate *","Adresă completă *"].map(f=>(<div key={f} style={{ marginBottom:"10px" }}><div style={{ fontSize:"9px", color:C.txm, marginBottom:"3px", fontWeight:500 }}>{f}</div><WB h="32px" bg="#fff" s={{ border:`1px solid ${C.bd}` }} /></div>))}
          {step===1 && <div style={{ fontSize:"8px", color:C.txm, background:C.bg, padding:"8px", borderRadius:"6px" }}>Adresa este necesară pentru alocarea la filiala locală.</div>}
          {step===2 && (<div><div style={{ marginBottom:"10px" }}><div style={{ fontSize:"9px", color:C.txm, marginBottom:"3px" }}>De ce vrei să te înscrii în SENS?</div><WB h="64px" bg="#fff" label="Motivația ta..." s={{ border:`1px solid ${C.bd}`, alignItems:"flex-start", paddingTop:"8px" }} /></div><div style={{ fontSize:"9px", color:C.txm, marginBottom:"6px" }}>Arii de interes:</div>{["Voluntariat și acțiuni de teren","Comunicare și social media","Politici publice","Organizare filiale","Mediu și sustenabilitate","Drepturile omului"].map((o,i)=>(<div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}><div style={{ width:"14px", height:"14px", borderRadius:"3px", border:`1.5px solid ${i<2?C.gl:C.bd}`, background:i<2?C.gl:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>{i<2&&<span style={{ color:"#fff", fontSize:"9px" }}>✓</span>}</div><span style={{ fontSize:"10px", color:C.tx }}>{o}</span></div>))}</div>)}
          {step===3 && (<div><div style={{ background:C.bg, borderRadius:"8px", padding:"10px", marginBottom:"10px" }}><div style={{ fontSize:"9px", fontWeight:600, color:C.gd, marginBottom:"4px" }}>Declarație de conformitate</div><div style={{ fontSize:"8px", color:C.txm, lineHeight:1.6 }}>Declar pe propria răspundere că nu fac parte din niciun alt partid politic și nu am promovat acțiuni extremiste.</div></div>{["Confirm declarația de mai sus *","Sunt de acord cu prelucrarea datelor personale *","Accept Statutul Partidului SENS *","Doresc comunicări prin email (opțional)"].map((o,i)=>(<div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"8px", marginBottom:"6px" }}><div style={{ width:"14px", height:"14px", borderRadius:"3px", border:`1.5px solid ${i<3?C.gl:C.bd}`, background:i<3?C.gl:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"1px" }}>{i<3&&<span style={{ color:"#fff", fontSize:"9px" }}>✓</span>}</div><span style={{ fontSize:"9px", color:C.tx, lineHeight:1.4 }}>{o}</span></div>))}</div>)}
          {step===4 && (<div style={{ textAlign:"center", padding:"12px 0" }}><div style={{ width:"48px", height:"48px", borderRadius:"50%", background:`${C.gl}15`, margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.gl} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg></div><div style={{ fontSize:"14px", fontWeight:700, color:C.gd, marginBottom:"6px" }}>Cererea ta a fost trimisă!</div><div style={{ fontSize:"10px", color:C.txm, lineHeight:1.6, marginBottom:"12px" }}>Vei fi contactat în max 5 zile lucrătoare de către filiala locală pentru interviul de admitere.</div><Btn label="Înapoi la pagina principală" small outline onClick={()=>nav("home")} s={{ cursor:"pointer" }} /></div>)}
          {step < 4 && (<div style={{ display:"flex", justifyContent:step===0?"flex-end":"space-between", marginTop:"16px", paddingTop:"12px", borderTop:`1px solid ${C.bd}` }}>{step>0 && <Btn label="← Înapoi" small outline onClick={prev} s={{ cursor:"pointer" }} />}{step<3?<Btn label="Continuă →" primary small onClick={next} s={{ cursor:"pointer" }} />:<Btn label="Trimite cererea" primary small onClick={next} s={{ cursor:"pointer" }} />}</div>)}
        </Card>
      </div>
      <Footer mobile={mobile} nav={nav} />
    </div>
  );
};

/* ========== DONEAZA ========== */
const DoneazaPage = ({ mobile, menuOpen, onMenu, nav }) => (
  <div style={{ position:"relative", flex:1, display:"flex", flexDirection:"column" }}>
    {mobile && menuOpen && <HamburgerMenu onClose={onMenu} nav={nav} />}
    <Nav mobile={mobile} onMenu={onMenu} menuOpen={menuOpen} nav={nav} />
    <div style={{ padding:"16px 12px" }}>
      <div style={{ textAlign:"center", marginBottom:"16px" }}>
        <div style={{ fontSize:"20px", fontWeight:800, color:C.gd }}>Donează pentru SENS</div>
        <div style={{ fontSize:"10px", color:C.txm }}>Fiecare leu contează</div>
      </div>
      <Card s={{ marginBottom:"12px" }}>
        <div style={{ fontSize:"11px", fontWeight:700, color:C.gd, marginBottom:"8px" }}>Alege suma</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"6px", marginBottom:"10px" }}>
          {["25","50","100","200"].map((a,i)=>(<div key={a} style={{ padding:"10px 0", borderRadius:"8px", textAlign:"center", background:i===2?C.or:"#fff", color:i===2?"#fff":C.gd, border:`2px solid ${i===2?C.or:C.bd}`, fontWeight:700, fontSize:"14px" }}>{a}<span style={{ fontSize:"9px", fontWeight:400 }}> RON</span></div>))}
        </div>
        <div style={{ display:"flex", gap:"6px", marginBottom:"12px" }}>
          {["Donație unică","Donație lunară"].map((t,i)=>(<div key={t} style={{ flex:1, padding:"8px", borderRadius:"8px", textAlign:"center", fontSize:"10px", fontWeight:600, background:i===0?`${C.gd}11`:"#fff", border:`1px solid ${i===0?C.gd:C.bd}`, color:i===0?C.gd:C.txm }}>{t}</div>))}
        </div>
        {["Nume complet *","CNP * (obligatoriu legal)","Email *"].map(f=>(<div key={f} style={{ marginBottom:"8px" }}><div style={{ fontSize:"9px", color:C.txm, marginBottom:"3px" }}>{f}</div><WB h="32px" bg="#fff" s={{ border:`1px solid ${C.bd}` }} /></div>))}
        <div style={{ display:"flex", gap:"6px", margin:"12px 0" }}>
          {["Card bancar","Transfer bancar"].map((m,i)=>(<div key={m} style={{ flex:1, padding:"10px", borderRadius:"8px", textAlign:"center", fontSize:"10px", background:i===0?`${C.or}12`:"#fff", border:`1.5px solid ${i===0?C.or:C.bd}`, fontWeight:600 }}>{m}</div>))}
        </div>
        <Btn label="Donează 100 RON" primary s={{ width:"100%", justifyContent:"center" }} />
        <div style={{ fontSize:"7px", color:C.txm, textAlign:"center", marginTop:"8px" }}>CMF: 11240065 · Limita anuală: conform Legii 334/2006</div>
      </Card>
    </div>
    <Footer mobile={mobile} nav={nav} />
  </div>
);

/* ========== DASHBOARD ========== */
const DashboardPage = ({ mobile, menuOpen, onMenu, nav }) => (
  <div style={{ position:"relative", flex:1, display:"flex", flexDirection:"column" }}>
    {mobile && menuOpen && <HamburgerMenu onClose={onMenu} nav={nav} />}
    <Nav mobile={mobile} onMenu={onMenu} menuOpen={menuOpen} nav={nav} />
    <div style={{ padding:"12px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"16px" }}>
        <div style={{ width:"40px", height:"40px", borderRadius:"50%", background:`${C.gd}15` }} />
        <div><div style={{ fontSize:"14px", fontWeight:700, color:C.gd }}>Bine ai revenit, Maria!</div><div style={{ fontSize:"9px", color:C.txm }}>Membru activ · Filiala București</div></div>
      </div>
      <div style={{ background:`linear-gradient(135deg, ${C.gd} 0%, #006B3F 100%)`, borderRadius:"12px", padding:"14px", marginBottom:"12px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div><div style={{ color:C.or, fontSize:"8px", fontWeight:700, letterSpacing:"1.5px" }}>CARD MEMBRU</div><div style={{ color:"#fff", fontSize:"14px", fontWeight:700, marginTop:"4px" }}>Maria Popescu</div><div style={{ color:"#B8D4C8", fontSize:"9px", marginTop:"2px" }}>Nr: SENS-2025-00142</div><div style={{ color:"#B8D4C8", fontSize:"9px" }}>Filiala: București · Din: Mar 2025</div></div>
          <div style={{ width:"36px", height:"36px", background:"#fff", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"8px", color:C.gd }}>QR</div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"6px", marginBottom:"12px" }}>
        {[{n:"350 RON",l:"Total donat"},{n:"5",l:"Evenimente"}].map((s,i)=>(<Card key={i} s={{ textAlign:"center", padding:"10px" }}><div style={{ fontSize:"16px", fontWeight:800, color:C.gd }}>{s.n}</div><div style={{ fontSize:"8px", color:C.txm }}>{s.l}</div></Card>))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
        {[{l:"Evenimente",b:"2 viitoare"},{l:"Voluntariat",b:"3 disponibile"},{l:"Donațiile mele"},{l:"Social Feed"},{l:"Setări profil"},{l:"Realizări",b:"Nivel 2"}].map((item,i)=>(<Card key={i} s={{ padding:"12px" }}><div style={{ fontSize:"11px", fontWeight:700, color:C.gd }}>{item.l}</div>{item.b&&<div style={{ fontSize:"8px", color:C.or, fontWeight:600, marginTop:"2px" }}>{item.b}</div>}</Card>))}
      </div>
    </div>
    <Footer mobile={mobile} nav={nav} />
  </div>
);

/* ========== SOCIAL ========== */
/* ========== EVENTS DATA ========== */
const eventsData = [
  { id:1, title:"Town Hall: Buget Verde 2026", date:"28 Feb 2026", time:"18:00", location:"București", type:"town_hall", past:false, desc:"Dezbatere publică despre alocările bugetare pentru protecția mediului în 2026. Participă și pune întrebări direct reprezentanților SENS.", spots:"120 locuri disponibile" },
  { id:2, title:"Plantare Pădurea SENS", date:"05 Mar 2026", time:"09:00", location:"Cluj-Napoca", type:"action", past:false, desc:"Acțiune de reîmpădurire în zona metropolitană Cluj. Vino pregătit cu haine de teren. Unelte și puieți asigurați.", spots:"85 locuri disponibile" },
  { id:3, title:"Workshop: Comunicare Politică pentru Tineri", date:"12 Mar 2026", time:"14:00", location:"Online", type:"online", past:false, desc:"Învață cum să comunici eficient mesaje politice pe social media. Workshop interactiv cu exerciții practice.", spots:"Nelimitat" },
  { id:4, title:"Marș pentru Climă — Ziua Pământului", date:"22 Apr 2026", time:"11:00", location:"Timișoara", type:"protest", past:false, desc:"Alătură-te marșului pentru climă cu ocazia Zilei Pământului. Traseu: Piața Victoriei → Parcul Central.", spots:"Fără limită" },
  { id:5, title:"Dezbatere: Tranziția Verde Echitabilă", date:"10 Feb 2026", time:"17:00", location:"Iași", type:"town_hall", past:true, desc:"Dezbatere cu experți în energie și economie despre cum poate România să facă tranziția verde fără a lăsa pe nimeni în urmă.", spots:"Încheiat" },
  { id:6, title:"Curățenie Parc Herăstrău", date:"02 Feb 2026", time:"10:00", location:"București", type:"action", past:true, desc:"45 de voluntari au colectat peste 200 kg de deșeuri din Parcul Herăstrău.", spots:"Încheiat" },
];

/* ========== EVENIMENTE PAGE ========== */
const EventsPage = ({ mobile, menuOpen, onMenu, nav }) => {
  const [tab, setTab] = useState("upcoming");
  const [locFilter, setLocFilter] = useState("all");
  const [detailId, setDetailId] = useState(null);
  const upcoming = eventsData.filter(e => !e.past);
  const past = eventsData.filter(e => e.past);
  const locations = ["all", ...new Set(eventsData.map(e => e.location))];
  const filtered = (tab === "upcoming" ? upcoming : past).filter(e => locFilter === "all" || e.location === locFilter);
  const detail = detailId ? eventsData.find(e => e.id === detailId) : null;
  const typeLabels = { town_hall:"Dezbatere", action:"Acțiune", protest:"Marș", meeting:"Întâlnire", online:"Online" };
  const typeColors = { town_hall:"#1E40AF", action:"#065F46", protest:"#991B1B", meeting:"#6B21A8", online:"#0E7490" };

  if (detail) return (
    <div style={{ position:"relative", flex:1, display:"flex", flexDirection:"column" }}>
      {mobile && menuOpen && <HamburgerMenu onClose={onMenu} nav={nav} />}
      <Nav mobile={mobile} onMenu={onMenu} menuOpen={menuOpen} nav={nav} />
      <WB h={mobile?"120px":"160px"} label="Fotografie eveniment / locație" r="0" bg="#D4DDD0" />
      <div style={{ padding:"16px 12px" }}>
        <div style={{ display:"flex", gap:"4px", alignItems:"center", marginBottom:"12px", fontSize:"9px" }}>
          <span style={{ color:C.or, cursor:"pointer" }} onClick={()=>nav("home")}>Acasă</span>
          <span style={{ color:C.txm }}>/</span>
          <span style={{ color:C.or, cursor:"pointer" }} onClick={()=>setDetailId(null)}>Evenimente</span>
          <span style={{ color:C.txm }}>/</span>
          <span style={{ color:C.txm }}>{detail.title.substring(0,30)}...</span>
        </div>
        <div style={{ display:"flex", gap:"6px", alignItems:"center", marginBottom:"8px", flexWrap:"wrap" }}>
          <span style={{ fontSize:"8px", padding:"2px 8px", borderRadius:"10px", fontWeight:600, background:`${typeColors[detail.type]}15`, color:typeColors[detail.type] }}>{typeLabels[detail.type]}</span>
          {detail.past && <span style={{ fontSize:"8px", padding:"2px 8px", borderRadius:"10px", background:"#FEE2E2", color:"#991B1B", fontWeight:600 }}>Încheiat</span>}
        </div>
        <h1 style={{ fontSize:mobile?"18px":"22px", fontWeight:800, color:C.gd, lineHeight:1.3, margin:"0 0 12px" }}>{detail.title}</h1>
        <div style={{ display:"flex", flexDirection:"column", gap:"6px", marginBottom:"16px", padding:"12px", background:C.bg, borderRadius:"8px" }}>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.txm} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            <span style={{ fontSize:"10px", color:C.tx }}>{detail.date} · {detail.time}</span>
          </div>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.txm} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span style={{ fontSize:"10px", color:C.tx }}>{detail.location}</span>
          </div>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.txm} strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            <span style={{ fontSize:"10px", color:C.tx }}>{detail.spots}</span>
          </div>
        </div>
        <div style={{ fontSize:"11px", color:C.tx, lineHeight:1.8, marginBottom:"16px" }}>{detail.desc}</div>
        {!detail.past ? (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            <Btn label="Mă înscriu la eveniment" primary s={{ width:"100%", justifyContent:"center" }} />
            <div style={{ display:"flex", gap:"8px" }}>
              <Btn label="Adaugă în calendar" small outline s={{ flex:1, justifyContent:"center", fontSize:"9px" }} />
              <Btn label="Activează reminder" small outline s={{ flex:1, justifyContent:"center", fontSize:"9px" }} />
            </div>
            <div style={{ fontSize:"8px", color:C.txm, textAlign:"center", marginTop:"4px" }}>Vei primi o notificare cu 24h și 1h înainte de eveniment</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize:"11px", fontWeight:700, color:C.gd, marginBottom:"8px" }}>Postări de la acest eveniment</div>
            <Card s={{ padding:"0", overflow:"hidden", marginBottom:"8px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px" }}>
                <div style={{ width:"22px", height:"22px", borderRadius:"50%", background:"linear-gradient(135deg,#E1306C,#F77737)" }} />
                <div><div style={{ fontSize:"10px", fontWeight:700 }}>@partidulsens</div><div style={{ fontSize:"8px", color:C.txm }}>Instagram</div></div>
              </div>
              <WB h="100px" label="Galerie foto eveniment" r="0" />
              <div style={{ padding:"8px 10px", fontSize:"9px", color:C.tx }}>Mulțumim tuturor celor 45 de voluntari care au participat!</div>
            </Card>
            <Card s={{ padding:"10px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
                <div style={{ width:"22px", height:"22px", borderRadius:"50%", background:"#1877F2" }} />
                <div><div style={{ fontSize:"10px", fontWeight:700 }}>Partidul SENS</div><div style={{ fontSize:"8px", color:C.txm }}>Facebook</div></div>
              </div>
              <div style={{ fontSize:"9px", color:C.tx, lineHeight:1.5 }}>Rezultatele dezbaterii de la Iași: 3 propuneri concrete trimise către Guvern.</div>
            </Card>
          </div>
        )}
      </div>
      <Footer mobile={mobile} nav={nav} />
    </div>
  );

  return (
    <div style={{ position:"relative", flex:1, display:"flex", flexDirection:"column" }}>
      {mobile && menuOpen && <HamburgerMenu onClose={onMenu} nav={nav} />}
      <Nav mobile={mobile} onMenu={onMenu} menuOpen={menuOpen} nav={nav} />
      <div style={{ padding:"16px 12px" }}>
        <div style={{ fontSize:"20px", fontWeight:800, color:C.gd, marginBottom:"4px" }}>Evenimente</div>
        <div style={{ fontSize:"10px", color:C.txm, marginBottom:"12px" }}>Participă la acțiunile SENS</div>
        {/* Tabs upcoming/past */}
        <div style={{ display:"flex", gap:"6px", marginBottom:"12px" }}>
          {[{id:"upcoming",l:"Viitoare"},{id:"past",l:"Trecute"}].map(t=>(
            <div key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"6px 16px", borderRadius:"20px", fontSize:"10px", fontWeight:600, cursor:"pointer", background:tab===t.id?C.gd:"transparent", color:tab===t.id?"#fff":C.txm, border:`1px solid ${tab===t.id?C.gd:C.bd}` }}>{t.l}</div>
          ))}
        </div>
        {/* Filters */}
        <div style={{ display:"flex", gap:"6px", marginBottom:"12px", overflowX:"auto" }}>
          {locations.map(loc=>(
            <div key={loc} onClick={()=>setLocFilter(loc)} style={{ padding:"4px 10px", borderRadius:"16px", fontSize:"9px", fontWeight:600, whiteSpace:"nowrap", cursor:"pointer", background:locFilter===loc?`${C.or}15`:"#fff", color:locFilter===loc?C.or:C.txm, border:`1px solid ${locFilter===loc?C.or:C.bd}` }}>{loc==="all"?"Toate locațiile":loc}</div>
          ))}
        </div>
        {/* Event Cards */}
        {filtered.length === 0 && <div style={{ textAlign:"center", padding:"24px", fontSize:"10px", color:C.txm }}>Niciun eveniment găsit cu aceste filtre.</div>}
        {filtered.map((e,i)=>(
          <Card key={e.id} onClick={()=>setDetailId(e.id)} s={{ display:"flex", gap:"10px", alignItems:"flex-start", marginBottom:"8px", padding:"12px" }}>
            <div style={{ background:e.past?"#F3F4F6":C.gd, borderRadius:"8px", padding:"6px 8px", textAlign:"center", flexShrink:0, minWidth:"40px" }}>
              <div style={{ color:e.past?C.txm:C.or, fontSize:"14px", fontWeight:800, lineHeight:1 }}>{e.date.split(" ")[0]}</div>
              <div style={{ color:e.past?"#9CA3AF":"#B8D4C8", fontSize:"8px" }}>{e.date.split(" ")[1]}</div>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", gap:"4px", alignItems:"center", marginBottom:"3px", flexWrap:"wrap" }}>
                <span style={{ fontSize:"8px", padding:"1px 6px", borderRadius:"8px", fontWeight:600, background:`${typeColors[e.type]}12`, color:typeColors[e.type] }}>{typeLabels[e.type]}</span>
                {e.past && <span style={{ fontSize:"8px", padding:"1px 6px", borderRadius:"8px", background:"#FEE2E2", color:"#991B1B", fontWeight:600 }}>Încheiat</span>}
              </div>
              <div style={{ fontSize:"11px", fontWeight:700, color:C.gd, lineHeight:1.3, marginBottom:"2px" }}>{e.title}</div>
              <div style={{ fontSize:"9px", color:C.txm }}>{e.location} · {e.time}</div>
              {!e.past && <div style={{ fontSize:"8px", color:C.gl, fontWeight:600, marginTop:"3px" }}>{e.spots}</div>}
            </div>
          </Card>
        ))}
      </div>
      <Footer mobile={mobile} nav={nav} />
    </div>
  );
};

const SocialPage = ({ mobile, menuOpen, onMenu, nav }) => (
  <div style={{ position:"relative", flex:1, display:"flex", flexDirection:"column" }}>
    {mobile && menuOpen && <HamburgerMenu onClose={onMenu} nav={nav} />}
    <Nav mobile={mobile} onMenu={onMenu} menuOpen={menuOpen} nav={nav} />
    <div style={{ padding:"12px" }}>
      <div style={{ fontSize:"20px", fontWeight:800, color:C.gd, marginBottom:"4px" }}>Social Media</div>
      <div style={{ display:"flex", gap:"6px", marginBottom:"12px", overflowX:"auto" }}>
        {["Toate","Instagram","X","Facebook","TikTok"].map((c,i)=>(<div key={c} style={{ padding:"4px 10px", borderRadius:"16px", fontSize:"9px", fontWeight:600, whiteSpace:"nowrap", background:i===0?C.gd:"#fff", color:i===0?"#fff":C.txm, border:`1px solid ${i===0?C.gd:C.bd}` }}>{c}</div>))}
      </div>
      {[{pl:"Instagram",bg:"linear-gradient(135deg,#E1306C,#F77737)",acc:"@partidulsens",t:"2h",img:true,txt:"Am plantat 200 de copaci! #ViitorulAreSens",lk:"324",cm:"42"},{pl:"TikTok",bg:"#000",acc:"@partidulsens",t:"8h",img:true,txt:"POV: Când afli că SENS luptă pentru 30 de ședințe de terapie decontate",lk:"2.1K",cm:"156"},{pl:"Facebook",bg:"#1877F2",acc:"Partidul SENS",t:"1d",img:false,txt:"Vino la Town Hall despre Bugetul Verde! Joi, 28 feb, București.",lk:"89",cm:"23"}].map((p,i)=>(<Card key={i} s={{ padding:"0", overflow:"hidden", marginBottom:"10px" }}><div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"10px 12px" }}><div style={{ width:"22px", height:"22px", borderRadius:"50%", background:p.bg }} /><div style={{ flex:1 }}><div style={{ fontSize:"10px", fontWeight:700 }}>{p.acc}</div><div style={{ fontSize:"8px", color:C.txm }}>{p.pl} · {p.t}</div></div></div>{p.img&&<WB h="140px" label={`${p.pl} media`} r="0" />}<div style={{ padding:"10px 12px" }}><div style={{ fontSize:"10px", color:C.tx, lineHeight:1.6, marginBottom:"6px" }}>{p.txt}</div><div style={{ display:"flex", gap:"16px", fontSize:"8px", color:C.txm, paddingTop:"6px", borderTop:`1px solid ${C.bd}` }}><span>{p.lk} aprecieri</span><span>{p.cm} comentarii</span></div></div></Card>))}
    </div>
    <Footer mobile={mobile} nav={nav} />
  </div>
);

/* ========== STRAPI ========== */
const StrapiPage = ({ nav }) => {
  const [tab, setTab] = useState("collections");
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#F8FAFC" }}>
      <div style={{ background:C.gd, padding:"16px 20px" }}><div style={{ fontSize:"18px", fontWeight:800, color:"#fff" }}>Strapi v5 — Structura API</div><div style={{ fontSize:"11px", color:"#8BDBAD" }}>Content Types, REST Endpoints, Relații, Auth, Plugins</div></div>
      <div style={{ display:"flex", background:"#fff", borderBottom:`1px solid ${C.bd}`, overflowX:"auto" }}>
        {[{id:"collections",l:"Content Types"},{id:"endpoints",l:"REST API"},{id:"relations",l:"ERD"},{id:"auth",l:"Auth"},{id:"plugins",l:"Plugins"}].map(t=>(<div key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"10px 16px", fontSize:"11px", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", borderBottom:tab===t.id?`2px solid ${C.or}`:"2px solid transparent", color:tab===t.id?C.gd:C.txm }}>{t.l}</div>))}
      </div>
      <div style={{ flex:1, overflow:"auto", padding:"16px" }}>
        {tab==="collections" && [
          {name:"Article",f:"title, slug, excerpt, body, cover_image, category→Category(M:1), author→TeamMember(M:1), tags→Tag(M:M), published_at, seo, reading_time"},
          {name:"Category",f:"name, slug, color"},
          {name:"Event",f:"title, slug, description, start_date, end_date, location_name, location_coords, cover_image, max_participants, registration_open, event_type, attendees→User(M:M)"},
          {name:"TeamMember",f:"name, role, bio, photo, social_links, display_order, is_leadership"},
          {name:"Page",f:"title, slug, content(DZ: hero, text_block, cta, gallery, accordion, quote, video, stats), seo"},
          {name:"Donation",f:"amount, donor_name, donor_cnp(AES-256), donor_email, payment_method, payment_reference, status, is_recurring, cmf_reported, user→User"},
          {name:"MemberProfile",f:"user→User(1:1), membership_type, card_number, filial, joined_date, status, gamification_data(JSON)"},
          {name:"VolunteerAction",f:"title, description, date, location, required_volunteers, registered→User(M:M), status"},
          {name:"NewsletterSubscriber",f:"email(unique), name, consent_date, source, status"},
        ].map((ct,i)=>(<Card key={i} s={{ marginBottom:"8px", padding:"12px" }}><div style={{ fontSize:"12px", fontWeight:700, color:C.gd }}>{ct.name}</div><div style={{ fontSize:"9px", fontFamily:"monospace", color:C.tx, lineHeight:1.8, background:"#F1F5F9", borderRadius:"6px", padding:"8px", marginTop:"6px" }}>{ct.f}</div></Card>))}
        {tab==="endpoints" && (<div><div style={{ fontSize:"10px", color:C.txm, marginBottom:"12px", padding:"8px", background:`${C.or}10`, borderRadius:"8px", borderLeft:`3px solid ${C.or}` }}>Base URL: <strong>https://api.cusens.eu/api</strong></div>{[{g:"Articles",eps:[{m:"GET",p:"/articles"},{m:"GET",p:"/articles/:slug"}]},{g:"Events",eps:[{m:"GET",p:"/events"},{m:"POST",p:"/events/:id/register"},{m:"DELETE",p:"/events/:id/unregister"}]},{g:"Donations",eps:[{m:"POST",p:"/donations"},{m:"POST",p:"/donations/webhook"},{m:"GET",p:"/donations/my"}]},{g:"Membership",eps:[{m:"POST",p:"/membership/apply"},{m:"GET",p:"/membership/card"}]},{g:"Social Feed",eps:[{m:"GET",p:"/social-feed"}]},{g:"Auth",eps:[{m:"POST",p:"/auth/local"},{m:"POST",p:"/auth/local/register"},{m:"GET",p:"/auth/:provider/callback"},{m:"GET",p:"/users/me"}]}].map((g,gi)=>(<Card key={gi} s={{ marginBottom:"8px", padding:"12px" }}><div style={{ fontSize:"11px", fontWeight:700, color:C.gd, marginBottom:"6px" }}>{g.g}</div>{g.eps.map((ep,ei)=>(<div key={ei} style={{ display:"flex", gap:"6px", alignItems:"center", marginBottom:"3px" }}><span style={{ fontSize:"8px", fontWeight:700, padding:"2px 6px", borderRadius:"4px", fontFamily:"monospace", background:ep.m==="GET"?"#DBEAFE":ep.m==="POST"?"#D1FAE5":"#FEE2E2", color:ep.m==="GET"?"#1E40AF":ep.m==="POST"?"#065F46":"#991B1B" }}>{ep.m}</span><span style={{ fontSize:"9px", fontFamily:"monospace", color:C.tx }}>{ep.p}</span></div>))}</Card>))}</div>)}
        {tab==="relations" && <Card s={{ background:"#1E293B", padding:"16px" }}><pre style={{ fontFamily:"monospace", fontSize:"9px", lineHeight:1.8, color:"#E2E8F0", whiteSpace:"pre-wrap", margin:0 }}>{"Category ──1:M──> Article <──M:1── TeamMember\n                  Article ──M:M── Tag\nEvent ──M:M── User (attendees)\nUser ──1:1── MemberProfile\nUser ──1:M── Donation\nVolunteerAction ──M:M── User\nPage (Dynamic Zones) — independent\nNewsletterSubscriber — independent"}</pre></Card>}
        {tab==="auth" && (<div><Card s={{ marginBottom:"10px" }}><div style={{ fontSize:"11px", fontWeight:700, color:C.gd, marginBottom:"6px" }}>JWT Flow</div><div style={{ background:"#1E293B", borderRadius:"8px", padding:"10px" }}><pre style={{ fontFamily:"monospace", fontSize:"9px", lineHeight:2, color:"#E2E8F0", whiteSpace:"pre-wrap", margin:0 }}>{"1. POST /api/auth/local → { jwt, user }\n2. Store: httpOnly cookie (web) / Capacitor (mobile)\n3. Authorization: Bearer <jwt>\n4. Silent refresh\n5. Logout → invalidate"}</pre></div></Card><Card><div style={{ fontSize:"11px", fontWeight:700, color:C.gd, marginBottom:"6px" }}>RBAC</div><div style={{ overflowX:"auto" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:"9px" }}><thead><tr style={{ background:C.gd }}>{["Acțiune","Public","Simpat.","Membru","Admin"].map(h=><th key={h} style={{ padding:"5px", color:"#fff", textAlign:"center" }}>{h}</th>)}</tr></thead><tbody>{[["Citire","✓","✓","✓","✓"],["Donează","✓","✓","✓","✓"],["Profil","—","✓","✓","✓"],["Voluntariat","—","—","✓","✓"],["CMS","—","—","—","✓"]].map((r,i)=><tr key={i} style={{ background:i%2===0?"#fff":C.bg }}>{r.map((c,j)=><td key={j} style={{ padding:"4px", textAlign:j===0?"left":"center", fontWeight:j===0?600:400, borderBottom:`1px solid ${C.bd}`, color:c==="✓"?C.gl:c==="—"?"#D1D5DB":C.tx }}>{c}</td>)}</tr>)}</tbody></table></div></Card></div>)}
        {tab==="plugins" && (<div>{["users-permissions — Auth, roluri, OAuth","upload — Media → Cloudflare R2","email — Brevo/Sendgrid","i18n — ro/en","ckeditor — Rich text","slugify — Auto-slug","sitemap — sitemap.xml"].map((p,i)=>(<Card key={i} s={{ marginBottom:"4px", padding:"8px 10px" }}><div style={{ fontSize:"9px", fontFamily:"monospace", color:C.tx }}>{p}</div></Card>))}<div style={{ fontSize:"11px", fontWeight:700, color:C.gd, margin:"12px 0 6px" }}>Custom Extensions</div>{["donation — CNP, Netopia/Stripe, webhook, AES-256","membership — multi-step, card gen, QR","volunteer — join/checkin, gamification","newsletter — double opt-in, Listmonk","social-feed — aggregator, cron 15min"].map((e,i)=>(<Card key={i} s={{ marginBottom:"4px", padding:"8px 10px" }}><div style={{ fontSize:"9px", fontFamily:"monospace", color:C.tx }}>{e}</div></Card>))}</div>)}
      </div>
    </div>
  );
};

/* ========== MAIN APP ========== */
export default function SENSWireframes() {
  const [activePage, setActivePage] = useState("home");
  const [viewMode, setViewMode] = useState("both");
  const [menuOpen, setMenuOpen] = useState(false);
  const [articleId, setArticleId] = useState(1);
  const toggle = () => setMenuOpen(p=>!p);

  const nav = (page, extra) => {
    if(page === "articol") {
      setArticleId(extra || 1);
      setActivePage("articol");
    } else {
      setActivePage(page);
    }
    setMenuOpen(false);
  };

  const isStrapi = activePage === "strapi";
  const pageLabels = [
    {id:"home",l:"Acasă"},{id:"stiri",l:"Știri"},{id:"despre",l:"Despre"},{id:"events",l:"Evenimente"},{id:"contact",l:"Contact"},{id:"inscrie",l:"Înscrie-te"},{id:"doneaza",l:"Donează"},{id:"dashboard",l:"Dashboard"},{id:"social",l:"Social"},{id:"strapi",l:"Strapi API"},
  ];
  if(activePage==="articol" && !pageLabels.find(p=>p.id==="articol")) pageLabels.splice(2,0,{id:"articol",l:"Articol"});

  const renderPage = (mobile) => {
    const p = { mobile, menuOpen:mobile?menuOpen:false, onMenu:toggle, nav };
    switch(activePage) {
      case "home": return <HomePage {...p} />;
      case "stiri": return <StiriPage {...p} />;
      case "articol": return <ArticolPage {...p} articleId={articleId} />;
      case "despre": return <DesprePage {...p} />;
      case "contact": return <ContactPage {...p} />;
      case "events": return <EventsPage {...p} />;
      case "inscrie": return <InscriePage {...p} />;
      case "doneaza": return <DoneazaPage {...p} />;
      case "dashboard": return <DashboardPage {...p} />;
      case "social": return <SocialPage {...p} />;
      default: return <HomePage {...p} />;
    }
  };

  return (
    <div style={{ fontFamily:"Inter, system-ui, sans-serif", background:"#F0F2EE", minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <div style={{ background:C.gd, padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"8px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <div style={{ width:"18px", height:"18px", borderRadius:"4px", background:C.gl }} />
          <span style={{ color:"#fff", fontWeight:800, fontSize:"16px" }}>SENS</span>
          <span style={{ color:C.or, fontSize:"11px", fontWeight:600 }}>Wireframes v1.4</span>
        </div>
        {!isStrapi && (
          <div style={{ display:"flex", gap:"4px" }}>
            {["both","mobile","desktop"].map(m=>(
              <div key={m} onClick={()=>setViewMode(m)} style={{ padding:"4px 12px", borderRadius:"12px", fontSize:"10px", fontWeight:600, cursor:"pointer", background:viewMode===m?C.or:"rgba(255,255,255,0.1)", color:viewMode===m?"#fff":"#B8D4C8" }}>{m==="both"?"M+D":m==="mobile"?"Mobile":"Desktop"}</div>
            ))}
          </div>
        )}
      </div>
      <div style={{ display:"flex", gap:"4px", padding:"8px 16px", overflowX:"auto", background:"#fff", borderBottom:`1px solid ${C.bd}` }}>
        {pageLabels.map(p=>(
          <div key={p.id} onClick={()=>nav(p.id)} style={{ padding:"6px 14px", borderRadius:"20px", fontSize:"11px", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", background:activePage===p.id?C.gd:"transparent", color:activePage===p.id?"#fff":C.txm, border:`1px solid ${activePage===p.id?C.gd:C.bd}` }}>{p.l}</div>
        ))}
      </div>
      {isStrapi ? (
        <div style={{ flex:1, overflow:"auto" }}><StrapiPage nav={nav} /></div>
      ) : (
        <div style={{ flex:1, padding:"20px", display:"flex", gap:"24px", justifyContent:"center", alignItems:"flex-start", flexWrap:"wrap" }}>
          {(viewMode==="both"||viewMode==="mobile") && <PhoneFrame title="Mobile">{renderPage(true)}</PhoneFrame>}
          {(viewMode==="both"||viewMode==="desktop") && <DeskFrame title="Desktop">{renderPage(false)}</DeskFrame>}
        </div>
      )}
    </div>
  );
}
