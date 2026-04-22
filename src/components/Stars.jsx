import { T } from "../data/theme";

export default function Stars({ v, sz=14 }) {
  return (
    <span style={{display:"inline-flex",gap:1}}>
      {[1,2,3,4,5].map(i=>(
        <span key={i} style={{fontSize:sz,color:i<=Math.round(v)?T.gold:T.border}}>★</span>
      ))}
    </span>
  );
}
