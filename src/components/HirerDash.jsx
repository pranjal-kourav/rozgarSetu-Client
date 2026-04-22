import {T} from "../data/theme.js";
import { JOBS } from "../data/data.js";
import { useApp } from "../context/AppContext.jsx";

const HirerDash = () => {
  const { nav, jobs, user, applicants } = useApp();
  const myJobs = jobs.filter(j => j.hirer === (user?.name || "You") || j.hirer === "You").slice(0, 4);

  return (
    <div className="pw fi">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
        <div><h1 className="pt">Welcome back, {user?.name?.split(" ")[0] || "Hirer"}! 👋</h1><p className="pst">Manage your job postings and applications</p></div>
        <button className="btn bt" onClick={() => nav("post-job")}>+ Post a Job</button>
      </div>
      <div className="g4" style={{ marginBottom: 32 }}>
        {[{ l: "Jobs Posted", v: myJobs.length || 3, c: T.saffron }, { l: "Applications", v: applicants.length, c: T.teal }, { l: "Active Hirings", v: 2, c: T.gold }, { l: "Reviews Given", v: 5, c: T.ctaD }].map(s => (
          <div key={s.l} className="stc" style={{ borderTop: `3px solid ${s.c}` }}><div className="stn" style={{ color: s.c }}>{s.v}</div><div className="stl">{s.l}</div></div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="sh">Your Recent Posts</div>
        <button className="btn bg sm" onClick={() => nav("applications")}>View All →</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(myJobs.length > 0 ? myJobs : JOBS.slice(0, 3)).map(job => (
          <div key={job.id} className="card" style={{ cursor: "default", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: T.saffronL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💼</div>
              <div>
                <div className="df" style={{ fontWeight: 700, fontSize: 15 }}>{job.title}</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4, fontSize: 13, color: T.inkM }}>
                  <span>📍 {job.location}</span><span style={{ color: T.teal, fontWeight: 600 }}>{job.pay}</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span className="badge bin">{job.applicants || 0} applicants</span>
              <button className="btn bg sm" onClick={() => nav("applications")}>View</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32 }}>
        <div className="sh">Quick Actions</div>
        <div className="g3" style={{ gap: 12 }}>
          {[{ em: "📋", l: "View Applications", a: "applications" }, { em: "⚡", l: "Browse Gigs", a: "hirer-gigs" }, { em: "⭐", l: "Leave a Review", a: "review" }].map(a => (
            <button key={a.l} onClick={() => nav(a.a)} style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, cursor: "pointer", textAlign: "center", transition: "all .2s", fontFamily: "'Hind',sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px rgba(46,125,50,.12)`; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{a.em}</div>
              <div className="df" style={{ fontWeight: 700, fontSize: 14 }}>{a.l}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HirerDash;