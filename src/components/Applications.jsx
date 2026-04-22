import {T} from "../data/theme.js";
import { useApp } from "../context/AppContext.jsx";
import Stars from "./Stars.jsx";

const Applications = () => {
  const { nav, applicants, updateApp, openCall, viewProfile } = useApp();
  return (
    <div className="pw fi">
      <h1 className="pt">Applications Received</h1><p className="pst">Review and manage candidates</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {applicants.map(a => (
          <div key={a.id} className="card" style={{ cursor: "default" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: T.saffronL, color: T.saffron, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Baloo 2',cursive", fontWeight: 800, fontSize: 18, flexShrink: 0 }}>{a.name.charAt(0)}</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <button className="lbtn" style={{ fontSize: 17 }} onClick={() => viewProfile(a.seekerId, "seeker")}>{a.name}</button>
                  <span className={`badge ${a.status === "accepted" ? "bok2" : a.status === "declined" ? "bbd" : "bgd"}`}>{a.status === "pending" ? "Pending" : a.status === "accepted" ? "✓ Accepted" : "✕ Declined"}</span>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap", fontSize: 13, color: T.inkM }}>
                  <span>📍 {a.location}</span><span><Stars v={a.rating} sz={12} /> {a.rating}</span><span>{a.done} jobs done</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>{a.skills.map(s => <span key={s} className="stag">{s}</span>)}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
                <button className="btn bg sm" onClick={() => openCall(a.name, a.phone)}>📞 Call</button>
                {a.status === "pending" && (<><button className="btn bok sm" onClick={() => updateApp(a.id, "accepted")}>✓ Accept</button><button className="btn bdn sm" onClick={() => updateApp(a.id, "declined")}>✕ Decline</button></>)}
                {a.status !== "pending" && <button className="btn bg sm" onClick={() => nav("review")}>⭐ Review</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;