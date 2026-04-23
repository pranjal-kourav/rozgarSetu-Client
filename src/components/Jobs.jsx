import { useState } from "react";
import { T } from "../data/theme.js";
import { HIRERS } from "../data/data.js";
import { useApp } from "../context/AppContext.jsx";
import Stars from "./Stars.jsx";

const Jobs = () => {
  const { jobs, applyJob, applied, openCall, viewProfile } = useApp();
  const [search, setSearch] = useState("");

  const q = search.trim().toLowerCase();
  const list = jobs.filter((j) => {
    if (!q) return true;
    return (
      (j.title && j.title.toLowerCase().includes(q)) ||
      (j.location && j.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="pw fi">
      <h1 className="pt">Browse Jobs</h1>
      <p className="pst">Find stable employment opportunities near you</p>
      <div style={{ marginBottom: 20 }}>
        <div className="iw">
          <span className="ico">🔍</span>
          <input className="fi2" placeholder="Search by title or location…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {list.map((job) => {
          const ap = applied.some((x) => String(x) === String(job.id));
          const hirer = HIRERS.find((h) => h.id === job.hirerId);
          return (
            <div key={job.id} className="card" style={{ cursor: "default" }}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: T.saffronL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>💼</div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div>
                      <div className="df" style={{ fontWeight: 700, fontSize: 17 }}>{job.title}</div>
                      <div style={{ fontSize: 14, color: T.inkM, marginTop: 2 }}>
                        by{" "}
                        <button type="button" className="lbtn" onClick={() => viewProfile(job.hirerId, "hirer")}>{job.hirer}</button>
                        <span style={{ margin: "0 4px" }}>·</span>
                        <Stars v={job.hirerRating} sz={12} />
                      </div>
                    </div>
                    <span className="badge bin">{job.posted}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", fontSize: 13, color: T.inkM }}>
                    <span>📍 {job.location}</span>
                    <span>🕐 {job.duration}</span>
                    <span style={{ fontWeight: 700, color: T.teal, fontSize: 14 }}>{job.pay}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                    {job.skills?.map((s) => <span key={s} className="stag">{s}</span>)}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                  <button type="button" className={`btn sm ${ap ? "bg" : "bp"}`} onClick={() => !ap && applyJob(job.id)} style={{ minWidth: 90, cursor: ap ? "default" : "pointer" }}>{ap ? "✓ Applied" : "Apply →"}</button>
                  {hirer ? <button type="button" className="btn bg sm" onClick={() => openCall(hirer.name, hirer.phone)}>📞 Call</button> : null}
                  <span style={{ fontSize: 12, color: T.inkM }}>{job.applicants} applied</span>
                </div>
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: T.inkM }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div className="df" style={{ fontWeight: 700, fontSize: 18 }}>No jobs found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
