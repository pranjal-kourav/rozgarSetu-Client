import {T} from "../data/theme.js";
import { MY_APPS } from "../data/data.js";
import { useApp } from "../context/AppContext.jsx";

const AppStatus = () => {
  const { viewProfile } = useApp();
  const sc = {
    applied: { l: "Applied", c: T.saffron, bg: T.saffronL, e: "📤" },
    approved: { l: "Approved ✓", c: T.ok, bg: T.okL, e: "✅" },
    rejected: { l: "Not Selected", c: T.bad, bg: T.badL, e: "❌" }
  };
  return (
    <div className="pw fi">
      <h1 className="pt">My Applications</h1><p className="pst">Track the status of all your applications</p>
      <div className="g3" style={{ marginBottom: 28 }}>
        {Object.entries(sc).map(([k, v]) => (
          <div key={k} style={{ background: v.bg, border: `1.5px solid ${v.c}22`, borderRadius: 14, padding: 18, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{v.e}</div>
            <div className="df" style={{ fontSize: 24, fontWeight: 800, color: v.c }}>{MY_APPS.filter(a => a.status === k).length}</div>
            <div style={{ fontSize: 13, color: T.inkM, fontWeight: 500 }}>{v.l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {MY_APPS.map(app => {
          const s = sc[app.status];
          return (
            <div key={app.id} className="card" style={{ cursor: "default" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.e}</div>
                  <div>
                    <div className="df" style={{ fontWeight: 700, fontSize: 16 }}>{app.job}</div>
                    <div style={{ fontSize: 13, color: T.inkM }}>by <button className="lbtn" style={{ fontSize: 13 }} onClick={() => viewProfile(app.hirerId, "hirer")}>{app.hirer}</button> · Applied {app.date}</div>
                    <div style={{ fontSize: 14, color: T.teal, fontWeight: 600, marginTop: 3 }}>{app.pay}</div>
                  </div>
                </div>
                <span className="badge" style={{ background: s.bg, color: s.c, fontSize: 13 }}>{s.l}</span>
              </div>
              {app.status === "approved" && <div style={{ marginTop: 12, padding: "10px 14px", background: T.okL, borderRadius: 10, fontSize: 13, color: T.ok }}>🎉 Congratulations! The hirer accepted your application. They'll contact you soon.</div>}
              {app.status === "rejected" && <div style={{ marginTop: 12, padding: "10px 14px", background: T.badL, borderRadius: 10, fontSize: 13, color: T.bad }}>Keep applying — more opportunities await you!</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppStatus;