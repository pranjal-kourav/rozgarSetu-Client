import { useState } from "react";
import {T} from "../data/theme.js";
import { SEEKERS } from "../data/data.js";
import { useApp } from "../context/AppContext.jsx";

const HirerGigs = () => {
  const { nav, gigs, openCall, viewProfile, contacted, setContacted, toast } = useApp();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");

  const list = gigs
    .filter(g => g.available && (!search || g.title.toLowerCase().includes(search.toLowerCase()) || g.seeker.toLowerCase().includes(search.toLowerCase()) || g.location.toLowerCase().includes(search.toLowerCase()) || g.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))))
    .sort((a, b) => sort === "rating" ? b.seekerRating - a.seekerRating : 0);

  const contact = (id) => {
    if (!contacted.includes(id)) { setContacted(p => [...p, id]); toast("Seeker notified!", "success"); }
  };

  return (
    <div className="pw fi">
      <button onClick={() => nav("hirer-dash")} style={{ background: "none", border: "none", color: T.inkM, cursor: "pointer", fontSize: 14, marginBottom: 16 }}>← Back to Dashboard</button>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 6 }}>
        <div><h1 className="pt">Browse Gigs</h1><p className="pst">Explore gigs posted by seekers — hire directly</p></div>
        <div style={{ background: T.tealL, border: `1.5px solid ${T.teal}33`, borderRadius: 12, padding: "10px 18px", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <div><div className="df" style={{ fontSize: 22, fontWeight: 800, color: T.teal }}>{list.length}</div><div style={{ fontSize: 12, color: T.inkM }}>gigs available</div></div>
        </div>
      </div>
      <div className="cf" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="iw" style={{ flex: 1, minWidth: 200 }}>
            <span className="ico">🔍</span>
            <input className="fi2" placeholder="Search by title, skill, name or location…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, background: "#fff", cursor: "pointer", fontFamily: "'Hind',sans-serif" }}>
            <option value="recent">🕐 Most Recent</option>
            <option value="rating">⭐ Top Rated</option>
          </select>
        </div>
      </div>
      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: T.inkM }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>⚡</div>
          <div className="df" style={{ fontWeight: 700, fontSize: 20 }}>No gigs found</div>
          <p style={{ marginTop: 6 }}>Try adjusting your search</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {list.map(gig => {
            const seeker = SEEKERS.find(s => s.id === gig.seekerId);
            return (
              <div key={gig.id} className="card" style={{ cursor: "default" }}>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: T.saffronL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>⚡</div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <div>
                        <div className="df" style={{ fontWeight: 700, fontSize: 17 }}>{gig.title}</div>
                        <div style={{ fontSize: 14, color: T.inkM, marginTop: 2 }}>
                          by <button className="lbtn" onClick={() => viewProfile(gig.seekerId, "seeker")}>{gig.seeker}</button>
                          {gig.seekerRating > 0 && <><span style={{ margin: "0 4px" }}>·</span><Stars v={gig.seekerRating} sz={12} /></>}
                        </div>
                      </div>
                      <span className="badge bsa">{gig.posted}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", fontSize: 13, color: T.inkM }}>
                      <span>📍 {gig.location}</span><span>🕐 {gig.duration}</span>
                      <span style={{ fontWeight: 700, color: T.teal, fontSize: 14 }}>₹{gig.pay}/{gig.payUnit}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>{gig.skills.map(s => <span key={s} className="stag">{s}</span>)}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                    <button className="btn bg sm" onClick={() => seeker && openCall(gig.seeker, seeker.phone)}>📞 Call</button>
                    <button className={`btn sm ${contacted.includes(gig.id) ? "bg" : "bp"}`} onClick={() => contact(gig.id)} style={{ cursor: contacted.includes(gig.id) ? "default" : "pointer" }}>
                      {contacted.includes(gig.id) ? "✓ Sent" : "📨 Contact"}
                    </button>
                    <button className="btn bt sm" onClick={() => viewProfile(gig.seekerId, "seeker")}>View Profile →</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Stars is used inline here — import from Stars.jsx in actual implementation
import Stars from "./Stars.jsx";

export default HirerGigs;