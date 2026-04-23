import {T} from "../data/theme.js";

import { JOBS } from "../data/data.js";

import { useApp } from "../context/AppContext.jsx";



const SeekerDash = () => {

    const { nav, user, applied = [] } = useApp();



  return (

    <div className="pw fi">

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>

        <div><h1 className="pt">Namaste, {user?.name?.split(" ")[0] || "Worker"}! 🙏</h1><p className="pst">Your job search dashboard</p></div>

        <button className="btn bp" onClick={() => nav("seeker-gigs")}>⚡ Post a Gig</button>

      </div>

      <div className="g4" style={{ marginBottom: 32, gap: 12 }}>
        {[
          { l: "Jobs Applied", v: (applied || []).length, c: T.saffron, em: "📨", sub: "Applications sent" },
          { l: "Approved", v: 1, c: T.teal, em: "✅", sub: "Selections received" },
          { l: "Profile Views", v: 18, c: T.cta, em: "👀", sub: "Employer visits" },
          { l: "Avg Rating", v: "4.7★", c: T.gold, em: "⭐", sub: "Overall feedback" },
        ].map((s) => (
          <div
            key={s.l}
            style={{
              background: "#fff",
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: "14px 16px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.c }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: T.inkM, fontWeight: 600 }}>{s.l}</div>
                <div className="df" style={{ marginTop: 6, fontSize: 26, lineHeight: 1, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 11, color: T.inkL, marginTop: 8 }}>{s.sub}</div>
              </div>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `${s.c}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                {s.em}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>

        <div className="sh">Nearby Jobs</div>

        <button className="btn bg sm" onClick={() => nav("jobs")}>Browse All →</button>

      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>

        {JOBS.slice(0, 4).map(job => (

          <div key={job.id} className="card" style={{ cursor: "default" }}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>

                <div style={{ width: 42, height: 42, borderRadius: 10, background: T.saffronL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💼</div>

                <div>

                  <div className="df" style={{ fontWeight: 700, fontSize: 15 }}>{job.title}</div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 13, color: T.inkM }}><span>📍 {job.location}</span><span style={{ color: T.teal, fontWeight: 600 }}>{job.pay}</span></div>

                </div>

              </div>

              <button className="btn bp sm" onClick={() => nav("jobs")}>Apply →</button>

            </div>

          </div>

        ))}

      </div>

      <div className="sh">Quick Actions</div>

      <div className="g3" style={{ gap: 12 }}>

        {[{ em: "🔍", l: "Browse Jobs", a: "jobs" }, { em: "📊", l: "My Applications", a: "app-status" }, { em: "👤", l: "My Profile", a: "profile" }].map(a => (

          <button key={a.l} onClick={() => nav(a.a)} style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, cursor: "pointer", textAlign: "center", transition: "all .2s", fontFamily: "'Hind',sans-serif" }}

            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px rgba(46,125,50,.12)`; e.currentTarget.style.transform = "translateY(-2px)"; }}

            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>

            <div style={{ fontSize: 28, marginBottom: 8 }}>{a.em}</div>

            <div className="df" style={{ fontWeight: 700, fontSize: 14 }}>{a.l}</div>

          </button>

        ))}

      </div>

    </div>

  );

};



export default SeekerDash;

