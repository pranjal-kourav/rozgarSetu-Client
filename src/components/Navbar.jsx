import { useApp } from "../context/AppContext";
import { T } from "../data/theme";

export default function Navbar() {
  const { page, nav, user, role, logout, setAuthMode } = useApp();

  const hirerLinks = [
    {id:"hirer-dash",l:"Dashboard"},
    {id:"post-job",l:"Post Job"},
    {id:"applications",l:"Applications"},
    {id:"hirer-gigs",l:"Gigs"},
    {id:"profile",l:"Profile"}
  ];

  const seekerLinks = [
    {id:"seeker-dash",l:"Dashboard"},
    {id:"jobs",l:"Find Jobs"},
    {id:"seeker-gigs",l:"Gigs"},
    {id:"app-status",l:"My Status"},
    {id:"profile",l:"Profile"}
  ];

  const links = role==="hirer"?hirerLinks:role==="seeker"?seekerLinks:[];

  return (
    <nav style={{position:"sticky",top:0,zIndex:200,background:"rgba(255,255,255,.96)",backdropFilter:"blur(12px)",borderBottom:`1px solid ${T.border}`}}>
      <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",height:62,gap:16}}>
        
        <button onClick={()=>nav(user?(role==="hirer"?"hirer-dash":"seeker-dash"):"landing")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:8,padding:0}}>
          <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.saffron},${T.saffronD})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"#fff",fontSize:18}}>🌱</span>
          </div>
          <span className="df" style={{fontSize:20,fontWeight:800,color:T.ink}}>Rozgar<span style={{color:T.saffron}}>setu</span></span>
        </button>

        {user && (
          <div className="hm" style={{display:"flex",gap:4,marginLeft:12,flex:1}}>
            {links.map(l=>(
              <button key={l.id} onClick={()=>nav(l.id)}
                style={{
                  background:page===l.id?T.saffronL:"none",
                  border:"none",
                  cursor:"pointer",
                  padding:"6px 14px",
                  borderRadius:8,
                  fontFamily:"'Baloo 2',cursive",
                  fontWeight:700,
                  fontSize:14,
                  color:page===l.id?T.saffron:T.inkM
                }}>
                {l.l}
              </button>
            ))}
          </div>
        )}

        <div style={{marginLeft:"auto",display:"flex",gap:10}}>
          {user ? (
            <button onClick={logout} className="btn bg sm">Logout</button>
          ) : (
            <>
              <button className="btn bg sm" onClick={()=>{setAuthMode("login");nav("auth");}}>Login</button>
              <button className="btn bp sm" onClick={()=>{setAuthMode("signup");nav("auth");}}>Register</button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}