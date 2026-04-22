import { useState } from "react";
import {T} from "../data/theme.js";
import { PAY_UNITS } from "../data/data.js";
import { useApp } from "../context/AppContext.jsx";

const PostJob = () => {
  const { nav, postJob, toast } = useApp();
  const [f, setF] = useState({ title: "", description: "", duration: "", pay: "", payUnit: "month", location: "", skills: "" });

  const sub = () => {
    if (!f.title || !f.pay || !f.location) { toast("Please fill all required fields", "danger"); return; }
    if (isNaN(Number(f.pay)) || !f.pay.trim()) { toast("Pay must be a number", "danger"); return; }
    postJob({ ...f, pay: `₹${f.pay}/${f.payUnit}`, skills: f.skills.split(",").map(s => s.trim()).filter(Boolean) });
  };

  return (
    <div className="pw fi" style={{ maxWidth: 640 }}>
      <button onClick={() => nav("hirer-dash")} style={{ background: "none", border: "none", color: T.inkM, cursor: "pointer", fontSize: 14, marginBottom: 16 }}>← Back to Dashboard</button>
      <h1 className="pt">Post a Job</h1>
      <p className="pst">Fill in the details to find the right employee</p>
      <div style={{ background: T.saffronL, border: `1.5px solid ${T.saffron}22`, borderRadius: 12, padding: "12px 18px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 20 }}>💼</span>
        <span style={{ fontSize: 14, color: T.inkM }}>Jobs are full-time or long-term roles posted by hirers. Workers can browse and apply.</span>
      </div>
      <div className="cf">
        <div className="fg"><label className="fl">Job Title *</label><input className="fi2" placeholder="e.g. Data Entry Operator, Sales Executive" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} /></div>
        <div className="fg"><label className="fl">Description</label><textarea className="fi2" placeholder="Describe the work and requirements…" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} /></div>
        <div className="g2" style={{ gap: 14 }}>
          <div className="fg"><label className="fl">Duration</label><input className="fi2" placeholder="e.g. Full-time, 6 months" value={f.duration} onChange={e => setF({ ...f, duration: e.target.value })} /></div>
          <div className="fg">
            <label className="fl">Pay *</label>
            <div className="pay-row">
              <input className="fi2" type="number" min="0" placeholder="e.g. 12000" value={f.pay} onChange={e => setF({ ...f, pay: e.target.value.replace(/[^0-9]/g, "") })} />
              <select className="fi2" value={f.payUnit} onChange={e => setF({ ...f, payUnit: e.target.value })}>
                {PAY_UNITS.map(u => <option key={u} value={u}>/ {u}</option>)}
              </select>
            </div>
            <span style={{ fontSize: 12, color: T.inkM, marginTop: 4 }}>Preview: {f.pay ? `₹${f.pay}/${f.payUnit}` : "—"}</span>
          </div>
        </div>
        <div className="fg"><label className="fl">Location *</label><div className="iw"><span className="ico">📍</span><input className="fi2" placeholder="Area, City" value={f.location} onChange={e => setF({ ...f, location: e.target.value })} /></div></div>
        <div className="fg"><label className="fl">Required Skills</label><input className="fi2" placeholder="Comma-separated: Typing, MS Office" value={f.skills} onChange={e => setF({ ...f, skills: e.target.value })} /></div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button className="btn bp" style={{ flex: 1 }} onClick={sub}>📤 Post Job</button>
          <button className="btn bg" onClick={() => nav("hirer-dash")}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PostJob;