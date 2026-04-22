import { useState } from "react";
import {T} from "../data/theme.js";
import { PAY_UNITS } from "../data/data.js";
import { useApp } from "../context/AppContext.jsx";

const SeekerGigs = () => {
  const { nav, toast, gigs, postGig, updateGig, deleteGig, user } = useApp();
  const [tab, setTab] = useState("post");
  const [f, setF] = useState({ title: "", skills: "", days: [], from: "", to: "", pay: "", payUnit: "day", loc: "", note: "" });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(null);
  const days7 = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const toggleDay = d => setF(p => ({ ...p, days: p.days.includes(d) ? p.days.filter(x => x !== d) : [...p.days, d] }));
  const myGigs = gigs.filter(g => g.seekerId === "me" || (user && g.seeker === user.name));

  const save = () => {
    if (!f.title.trim()) { toast("Please add a gig title", "danger"); return; }
    if (!f.skills.trim()) { toast("Please add at least one skill", "danger"); return; }
    if (!f.pay || isNaN(Number(f.pay))) { toast("Pay must be a valid number", "danger"); return; }
    postGig({ title: f.title, skills: f.skills.split(",").map(s => s.trim()).filter(Boolean), duration: f.days.length > 0 ? f.days.map(d => d.slice(0, 3)).join(", ") : "Flexible", pay: Number(f.pay), payUnit: f.payUnit, location: f.loc || "Location not specified" });
    setF({ title: "", skills: "", days: [], from: "", to: "", pay: "", payUnit: "day", loc: "", note: "" });
    setTab("mygigs");
  };

  const startEdit = (gig) => { setEditId(gig.id); setEditData({ title: gig.title, pay: String(gig.pay), payUnit: gig.payUnit, location: gig.location, skills: gig.skills.join(", ") }); };
  const saveEdit = () => {
    if (!editData.pay || isNaN(Number(editData.pay))) { toast("Pay must be a valid number", "danger"); return; }
    updateGig(editId, { ...editData, pay: Number(editData.pay), skills: editData.skills.split(",").map(s => s.trim()).filter(Boolean) });
    setEditId(null); setEditData(null);
  };

  return (
    <div className="pw fi">
      <button onClick={() => nav("seeker-dash")} style={{ background: "none", border: "none", color: T.inkM, cursor: "pointer", fontSize: 14, marginBottom: 16 }}>← Back to Dashboard</button>
      <h1 className="pt">My Gigs</h1>
      <p className="pst">Post your availability as a gig for hirers to find you</p>
      <div className="tb">
        <button className={`tbn ${tab === "post" ? "on" : ""}`} onClick={() => setTab("post")}>📝 Post New Gig</button>
        <button className={`tbn ${tab === "mygigs" ? "on" : ""}`} onClick={() => setTab("mygigs")}>⚡ My Posted Gigs {myGigs.length > 0 && `(${myGigs.length})`}</button>
      </div>

      {tab === "post" && (
        <div className="cf fi">
          <div className="fg"><label className="fl">Gig Title *</label><input className="fi2" placeholder="e.g. Plumber for 2 days" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} /></div>
          <div className="fg"><label className="fl">Your Skills *</label><input className="fi2" placeholder="e.g. Plumbing, Wiring, Painting (comma-separated)" value={f.skills} onChange={e => setF({ ...f, skills: e.target.value })} /></div>
          <div className="fg">
            <label className="fl">Available Days</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {days7.map(d => (
                <button key={d} onClick={() => toggleDay(d)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontFamily: "'Baloo 2',cursive", fontWeight: 700, cursor: "pointer", transition: "all .15s", border: `1.5px solid ${f.days.includes(d) ? T.saffron : T.border}`, background: f.days.includes(d) ? T.saffronL : "#fff", color: f.days.includes(d) ? T.saffron : T.inkM }}>
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
          <div className="g2" style={{ gap: 14 }}>
            <div className="fg"><label className="fl">From</label><input type="time" className="fi2" value={f.from} onChange={e => setF({ ...f, from: e.target.value })} /></div>
            <div className="fg"><label className="fl">Until</label><input type="time" className="fi2" value={f.to} onChange={e => setF({ ...f, to: e.target.value })} /></div>
          </div>
          <div className="fg">
            <label className="fl">Expected Pay *</label>
            <div className="pay-row">
              <input className="fi2" type="number" min="0" placeholder="e.g. 600" value={f.pay} onChange={e => setF({ ...f, pay: e.target.value.replace(/[^0-9]/g, "") })} />
              <select className="fi2" value={f.payUnit} onChange={e => setF({ ...f, payUnit: e.target.value })}>
                {PAY_UNITS.map(u => <option key={u} value={u}>/ {u}</option>)}
              </select>
            </div>
            {f.pay && <span style={{ fontSize: 12, color: T.inkM, marginTop: 4 }}>Preview: ₹{f.pay}/{f.payUnit}</span>}
          </div>
          <div className="fg"><label className="fl">Your Location</label><div className="iw"><span className="ico">📍</span><input className="fi2" placeholder="Area, City" value={f.loc} onChange={e => setF({ ...f, loc: e.target.value })} /></div></div>
          <div className="fg"><label className="fl">Additional Note</label><textarea className="fi2" placeholder="Any extra info about you or your work…" value={f.note} onChange={e => setF({ ...f, note: e.target.value })} /></div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn bp" style={{ flex: 1 }} onClick={save}>⚡ Post Gig</button>
            <button className="btn bg" onClick={() => nav("seeker-dash")}>Cancel</button>
          </div>
        </div>
      )}

      {tab === "mygigs" && (
        <div className="fi">
          {myGigs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: T.inkM }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>⚡</div>
              <div className="df" style={{ fontWeight: 700, fontSize: 18 }}>No gigs posted yet</div>
              <p style={{ marginTop: 6 }}>Click "Post New Gig" to get started</p>
              <button className="btn bp" style={{ marginTop: 20 }} onClick={() => setTab("post")}>Post Your First Gig</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {myGigs.map(gig => (
                <div key={gig.id} className="card" style={{ cursor: "default", borderLeft: `3px solid ${T.saffron}` }}>
                  {editId === gig.id ? (
                    <div>
                      <div className="df" style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: T.saffron }}>✏️ Edit Gig</div>
                      <div className="fg"><label className="fl">Title</label><input className="fi2" value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} /></div>
                      <div className="fg">
                        <label className="fl">Pay</label>
                        <div className="pay-row">
                          <input className="fi2" type="number" min="0" value={editData.pay} onChange={e => setEditData({ ...editData, pay: e.target.value.replace(/[^0-9]/g, "") })} />
                          <select className="fi2" value={editData.payUnit} onChange={e => setEditData({ ...editData, payUnit: e.target.value })}>
                            {PAY_UNITS.map(u => <option key={u} value={u}>/ {u}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="fg"><label className="fl">Location</label><input className="fi2" value={editData.location} onChange={e => setEditData({ ...editData, location: e.target.value })} /></div>
                      <div className="fg"><label className="fl">Skills</label><input className="fi2" placeholder="Comma-separated" value={editData.skills} onChange={e => setEditData({ ...editData, skills: e.target.value })} /></div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button className="btn bp sm" onClick={saveEdit}>Save Changes</button>
                        <button className="btn bg sm" onClick={() => { setEditId(null); setEditData(null); }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: T.saffronL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>⚡</div>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <div className="df" style={{ fontWeight: 700, fontSize: 16 }}>{gig.title}</div>
                        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 13, color: T.inkM, marginTop: 4 }}>
                          <span>📍 {gig.location}</span>
                          <span style={{ color: T.teal, fontWeight: 600 }}>₹{gig.pay}/{gig.payUnit}</span>
                          <span>🕐 {gig.duration}</span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                          {gig.skills.map(s => <span key={s} className="stag">{s}</span>)}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 12, color: T.inkL }}>Posted: {gig.posted}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                        <button className="btn bg sm" onClick={() => startEdit(gig)}>✏️ Edit</button>
                        <button className="btn bdn sm" onClick={() => deleteGig(gig.id)}>🗑️ Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SeekerGigs;