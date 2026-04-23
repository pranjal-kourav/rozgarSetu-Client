import { useState, useEffect } from "react";
import {T} from "../data/theme.js";
import { useApp } from "../context/AppContext.jsx";

const API_BASE = "http://localhost:8080";
const MONGO_ID_RE = /^[a-f\d]{24}$/i;
const CATEGORY_OPTIONS = ["Retail", "IT", "Consultancy", "Sales", "Delivery", "Others"];
const JOB_TYPE_OPTIONS = ["Full Time", "Part Time", "Internship", "Contract"];

const PostJob = () => {
  const { nav, toast, user } = useApp();
  const [f, setF] = useState({
    title: "",
    description: "",
    duration: "Full Time",
    pay: "",
    location: "",
    skills: "Others",
    experienceYears: "",
    urgentHiring: "false",
  });
  const [hirerId, setHirerId] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [loadingHirer, setLoadingHirer] = useState(false);

  useEffect(() => {
    const emailId = user?.email?.trim();
    if (!emailId) {
      setHirerId("");
      return;
    }

    const ac = new AbortController();
    (async () => {
      setLoadingHirer(true);
      try {
        const ur = await fetch(`${API_BASE}/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailId }),
          signal: ac.signal,
        });
        const uData = await ur.json().catch(() => ({}));
        if (!ur.ok) throw new Error(uData?.err || "Could not load user profile");
        const userId = uData?._id != null ? String(uData._id) : "";
        if (!MONGO_ID_RE.test(userId)) throw new Error("Invalid user id for this account");

        const hr = await fetch(`${API_BASE}/hirer/${encodeURIComponent(userId)}`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
          signal: ac.signal,
        });
        const hData = await hr.json().catch(() => ({}));
        if (!hr.ok) throw new Error(hData?.err || "Hirer profile not found. Save Profile once.");

        const id = hData?._id != null ? String(hData._id) : "";
        if (!MONGO_ID_RE.test(id)) throw new Error("Invalid hirer id from server");
        setHirerId(id);
      } catch (e) {
        if (e.name === "AbortError") return;
        setHirerId("");
        toast(e.message || "Could not load hirer profile", "danger");
      } finally {
        setLoadingHirer(false);
      }
    })();
    return () => ac.abort();
  }, [user?.email, toast]);

  const sub = async () => {
    if (isPosting) return;
    if (!f.title.trim() || !f.pay.trim() || !f.location.trim()) {
      toast("Please fill all required fields", "danger");
      return;
    }
    if (!f.description.trim()) {
      toast("Please add job description", "danger");
      return;
    }
    if (!f.experienceYears.trim()) {
      toast("Please add experience years", "danger");
      return;
    }
    if (!MONGO_ID_RE.test(hirerId)) {
      toast("Hirer ID not found. Open Profile and save it once.", "danger");
      return;
    }
    if (isNaN(Number(f.pay)) || !f.pay.trim()) {
      toast("Pay must be a number", "danger");
      return;
    }

    try {
      setIsPosting(true);
      const res = await fetch(`${API_BASE}/hirer/create-job`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          hirerId,
          title: f.title.trim(),
          description: f.description.trim(),
          category: f.skills,
          jobType: f.duration,
          salary: Number(f.pay),
          experienceYears: f.experienceYears.trim(),
          urgentHiring: f.urgentHiring === "true",
          status: "Open",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.err || data?.message || "Could not post job");
      toast("Job posted successfully!", "success");
      nav("hirer-dash");
    } catch (e) {
      toast(e.message || "Could not post job", "danger");
    } finally {
      setIsPosting(false);
    }
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
          <div className="fg">
            <label className="fl">Duration / Job Type</label>
            <select className="fi2" value={f.duration} onChange={e => setF({ ...f, duration: e.target.value })}>
              {JOB_TYPE_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
          <div className="fg">
            <label className="fl">Pay *</label>
            <input className="fi2" type="number" min="0" placeholder="e.g. 12000" value={f.pay} onChange={e => setF({ ...f, pay: e.target.value.replace(/[^0-9]/g, "") })} />
            <span style={{ fontSize: 12, color: T.inkM, marginTop: 4 }}>Preview: {f.pay ? `₹${f.pay}` : "—"}</span>
          </div>
        </div>
        <div className="fg"><label className="fl">Location *</label><div className="iw"><span className="ico">📍</span><input className="fi2" placeholder="Area, City" value={f.location} onChange={e => setF({ ...f, location: e.target.value })} /></div></div>
        <div className="fg">
          <label className="fl">Required Skills / Category</label>
          <select className="fi2" value={f.skills} onChange={e => setF({ ...f, skills: e.target.value })}>
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="g2" style={{ gap: 14 }}>
          <div className="fg">
            <label className="fl">Experience Years *</label>
            <input className="fi2" placeholder="e.g. 0-1, 2+ years" value={f.experienceYears} onChange={e => setF({ ...f, experienceYears: e.target.value })} />
          </div>
          <div className="fg">
            <label className="fl">Urgent Hiring</label>
            <select className="fi2" value={f.urgentHiring} onChange={e => setF({ ...f, urgentHiring: e.target.value })}>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </div>
        </div>
        <div style={{ fontSize: 12, color: T.inkM, marginTop: -4 }}>
          Hirer ID: <span style={{ fontFamily: "ui-monospace, monospace" }}>{hirerId || (loadingHirer ? "Loading..." : "Not loaded")}</span>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button className="btn bp" style={{ flex: 1 }} onClick={sub} disabled={isPosting || loadingHirer}>
            {isPosting ? "Posting..." : "📤 Post Job"}
          </button>
          <button className="btn bg" onClick={() => nav("hirer-dash")}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PostJob;