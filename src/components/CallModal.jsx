import { useApp } from "../context/AppContext";
import { T } from "../data/theme";

export default function CallModal() {
  const { callModal, closeCall, toast } = useApp();
  if (!callModal) return null;

  const copy = () => {
    navigator.clipboard.writeText(callModal.phone)
      .then(()=>toast("Phone number copied!","success"))
      .catch(()=>toast("Copy failed","danger"));
  };

  return (
    <div className="modal-overlay" onClick={closeCall}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:T.tealL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 12px"}}>📞</div>
          <div className="df" style={{fontSize:22,fontWeight:800,color:T.ink}}>{callModal.name}</div>
          <div style={{fontSize:28,fontWeight:700,color:T.teal,marginTop:8,letterSpacing:2}}>{callModal.phone}</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <a href={`tel:${callModal.phone}`} className="btn bt" style={{flex:1,textDecoration:"none"}}>📞 Call Now</a>
          <button className="btn bg" onClick={copy} style={{flex:1}}>📋 Copy Number</button>
        </div>
        <button onClick={closeCall} style={{width:"100%",marginTop:12,background:"none",border:"none",color:T.inkM,cursor:"pointer",fontSize:14,padding:8}}>Close</button>
      </div>
    </div>
  );
}