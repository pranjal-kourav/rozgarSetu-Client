import { T } from "../data/theme";

export default function VerifiedDot() {
  return (
    <div style={{position:"absolute",bottom:-2,right:-2,width:18,height:18,borderRadius:"50%",background:T.teal,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff"}}>
      <span style={{color:"#fff",fontSize:9,fontWeight:800}}>✓</span>
    </div>
  );
}