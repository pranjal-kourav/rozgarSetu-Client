import { useState, useEffect } from "react";
import {T} from "../data/theme.js";
import { useApp } from "../context/AppContext.jsx";
import Stars from "./Stars.jsx";

const API_BASE = "http://localhost:8080";

const emptyProfile = (user, role) => ({
  userId: "",
  seekerId: "",
  serverRole: "",
  name: user?.name || "",
  phone: user?.phone || "",
  email: user?.email || "",
  bio: "",
  skills: role === "seeker" ? [] : [],
  location: "",
  experience: role === "seeker" ? "—" : "N/A",
  businessName: "",
  industry: "",
  newSkill: "",
});

const mapApiUserToProfile = (data, role) => {
  const phone = data?.phoneNumber != null && data.phoneNumber !== "" ? String(data.phoneNumber) : "";
  const userId = data?._id != null ? String(data._id) : "";
  const serverRole = typeof data?.role === "string" ? data.role : "";
  return {
    userId,
    seekerId: "",
    serverRole,
    name: data?.fullName ?? "",
    phone,
    email: data?.emailId ?? "",
    bio: typeof data?.bio === "string" ? data.bio : "",
    skills: Array.isArray(data?.skills) ? data.skills : [],
    location: data?.district ?? "",
    experience: data?.experience != null && data.experience !== ""
      ? String(data.experience)
      : (role === "seeker" ? "—" : "N/A"),
    businessName: data?.businessName ?? "",
    industry: data?.industry ?? "",
    newSkill: "",
  };
};

const MONGO_ID_RE = /^[a-f\d]{24}$/i;

const Profile = () => {
  const { user, role, toast, setSeekerId } = useApp();
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadState, setLoadState] = useState({ status: "idle", message: "" });
  const [pd, setPd] = useState(() => emptyProfile(user, role));

  useEffect(() => {
    const emailId = user?.email?.trim();
    if (!emailId) {
      setPd(emptyProfile(user, role));
      setLoadState({ status: "error", message: "No email on account. Log in again." });
      return;
    }

    const ac = new AbortController();

    (async () => {
      setLoadState({ status: "loading", message: "" });
      try {
        const res = await fetch(`${API_BASE}/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailId }),
          signal: ac.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.err || data?.message || "Could not load profile");
        }

        let nextPd = mapApiUserToProfile(data, role);

        if (role === "seeker" && MONGO_ID_RE.test(nextPd.userId)) {
          try {
            const sRes = await fetch(`${API_BASE}/seeker?userId=${encodeURIComponent(nextPd.userId)}`, {
              method: "GET",
              credentials: "include",
              headers: { Accept: "application/json" },
              signal: ac.signal,
            });
            const sData = await sRes.json().catch(() => ({}));
            if (sRes.ok && sData?._id != null) {
              nextPd = {
                ...nextPd,
                seekerId: String(sData._id),
                bio: sData.description != null ? String(sData.description) : nextPd.bio,
              };
            }
          } catch {
            /* ignore seeker fetch errors (e.g. no seeker row yet) */
          }
        }

        setPd(nextPd);
        if (role === "seeker") setSeekerId(nextPd.seekerId || null);
        else setSeekerId(null);
        setLoadState({ status: "success", message: "" });
      } catch (e) {
        if (e.name === "AbortError") return;
        setLoadState({ status: "error", message: e.message || "Could not load profile" });
        setPd(emptyProfile(user, role));
        setSeekerId(null);
      }
    })();

    return () => ac.abort();
  }, [user?.email, role, setSeekerId]);

  const addSkill = () => { if (!pd.newSkill.trim()) return; setPd(p => ({ ...p, skills: [...p.skills, p.newSkill.trim()], newSkill: "" })); };
  const rmSkill = s => setPd(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

  const saveProfile = async () => {
    if (isSaving) return;

    if (role === "seeker") {
      const description = pd.bio.trim();
      if (!description) {
        toast("Add something in About before saving.", "danger");
        return;
      }
      if (!MONGO_ID_RE.test(pd.userId)) {
        toast("User ID is missing or invalid. Reload the page after logging in.", "danger");
        return;
      }

      try {
        setIsSaving(true);
        const res = await fetch(`${API_BASE}/seeker/create`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: pd.userId,
            description,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.err || data?.message || "Could not save profile");
        }
        if (data?.Id != null) {
          const sid = String(data.Id);
          setPd(p => ({ ...p, seekerId: sid }));
          setSeekerId(sid);
        }
        setEditing(false);
        toast("Profile saved!", "success");
      } catch (e) {
        toast(e.message || "Could not save profile", "danger");
      } finally {
        setIsSaving(false);
      }
      return;
    }

    setEditing(false);
    toast("Profile updated!", "success");
  };

  const reviews = [
    { n: "Ramesh Sharma", r: 5, t: "Excellent work! Very professional.", d: "Apr 10" },
    { n: "Priya Stores", r: 4, t: "Good worker, did the job well.", d: "Mar 22" },
    { n: "TechSeva Ltd", r: 5, t: "Highly recommended. Will hire again!", d: "Mar 5" },
  ];

  const seekerStats = [{ l: "Total Earnings", v: "₹45,200", c: T.teal }, { l: "Jobs Completed", v: "12", c: T.saffron }, { l: "Experience", v: pd.experience, c: T.cta }, { l: "Rating", v: "4.7 ★", c: T.gold }];
  const hirerStats = [{ l: "Jobs Posted", v: "5", c: T.saffron }, { l: "Active Hirings", v: "2", c: T.teal }, { l: "Reviews Given", v: "8", c: T.cta }, { l: "Avg Rating", v: "4.5 ★", c: T.gold }];
  const stats = role === "seeker" ? seekerStats : hirerStats;

  const roleLabel = pd.serverRole
    ? (pd.serverRole === "hirer" ? "Hirer" : pd.serverRole === "seeker" ? "Worker (Seeker)" : pd.serverRole)
    : "—";

  const personalFields = [
    ["🪪", "User ID", pd.userId || "—"],
    ...(role === "seeker" ? [["🆔", "Seeker ID", pd.seekerId || "—"]] : []),
    ["🎭", "Role", roleLabel],
    ["👤", "Name", pd.name || "—"], ["📱", "Phone", pd.phone || "—"], ["📧", "Email", pd.email || "Not provided"], ["📍", "Location", pd.location || "—"],
    ...(role === "seeker" ? [["🏆", "Experience", pd.experience]] : []),
    ...(role === "hirer" ? [["🏢", "Business", pd.businessName || "Not set"], ["🏭", "Industry", pd.industry || "Not set"]] : []),
  ];

  const bannerRoleChip = pd.serverRole === "hirer" ? "🏢 Hirer" : pd.serverRole === "seeker" ? "🔧 Worker" : (role === "hirer" ? "🏢 Hirer" : "🔧 Worker");

  const displayBio = pd.bio.trim() ? pd.bio : "No bio added yet.";
  const initialLetter = (pd.name || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="pw fi">
      {loadState.status === "loading" && (
        <div style={{ marginBottom: 16, padding: "12px 16px", background: T.saffronL, borderRadius: 12, border: `1px solid ${T.border}`, color: T.inkM, fontSize: 14 }}>
          Loading profile…
        </div>
      )}
      {loadState.status === "error" && loadState.message && (
        <div style={{ marginBottom: 16, padding: "12px 16px", background: T.badL, borderRadius: 12, border: `1px solid ${T.bad}44`, color: T.bad, fontSize: 14 }}>
          {loadState.message}
        </div>
      )}
      {/* Banner */}
      <div style={{ background: `linear-gradient(135deg,${T.saffron},${T.saffronD})`, borderRadius: 20, padding: "28px 24px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,.06)", pointerEvents: "none" }} />
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid #fff", background: T.saffronL, color: T.saffron, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Baloo 2',cursive", fontWeight: 800, fontSize: 28, flexShrink: 0 }}>
            {initialLetter}
          </div>
          <div style={{ flex: 1 }}>
            <div className="df" style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{pd.name || "—"}</div>
            <div style={{ color: "rgba(255,255,255,.8)", fontSize: 14, marginTop: 3 }}>{pd.location || "—"}{role === "seeker" ? ` · ${pd.experience} exp.` : ""}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
              {[bannerRoleChip, "★ 4.7 · 12 reviews", "✓ Aadhar Verified"].map(t => (
                <span key={t} style={{ background: "rgba(255,255,255,.2)", color: "#fff", padding: "3px 12px", borderRadius: 20, fontSize: 13 }}>{t}</span>
              ))}
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} style={{ background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.3)", color: "#fff", padding: "6px 14px", borderRadius: 8, fontFamily: "'Baloo 2',cursive", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            ✏️ {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="g2" style={{ gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Personal Details */}
          <div className="cf">
            <div className="df" style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Personal Details</div>
            {editing ? (
              <>
                <div className="fg"><label className="fl">User ID</label><input className="fi2" value={pd.userId} readOnly style={{ background: T.sand, color: T.inkM }} /></div>
                {role === "seeker" && <div className="fg"><label className="fl">Seeker ID</label><input className="fi2" value={pd.seekerId} readOnly placeholder="—" style={{ background: T.sand, color: T.inkM }} /></div>}
                <div className="fg"><label className="fl">Role</label><input className="fi2" value={roleLabel} readOnly style={{ background: T.sand, color: T.inkM }} /></div>
                <div className="fg"><label className="fl">Full Name</label><input className="fi2" value={pd.name} onChange={e => setPd(p => ({ ...p, name: e.target.value }))} /></div>
                <div className="fg"><label className="fl">Phone Number</label><input className="fi2" value={pd.phone} onChange={e => setPd(p => ({ ...p, phone: e.target.value }))} /></div>
                <div className="fg"><label className="fl">Email</label><input className="fi2" type="email" value={pd.email} placeholder="your@email.com" onChange={e => setPd(p => ({ ...p, email: e.target.value }))} /></div>
                <div className="fg"><label className="fl">Location</label><input className="fi2" value={pd.location} onChange={e => setPd(p => ({ ...p, location: e.target.value }))} /></div>
                {role === "seeker" && <div className="fg"><label className="fl">Experience</label><input className="fi2" value={pd.experience} placeholder="e.g. 5 years" onChange={e => setPd(p => ({ ...p, experience: e.target.value }))} /></div>}
                {role === "hirer" && (
                  <>
                    <div className="fg"><label className="fl">Business Name</label><input className="fi2" value={pd.businessName} placeholder="Your business name" onChange={e => setPd(p => ({ ...p, businessName: e.target.value }))} /></div>
                    <div className="fg"><label className="fl">Industry</label><input className="fi2" value={pd.industry} placeholder="e.g. IT, Trading, Security" onChange={e => setPd(p => ({ ...p, industry: e.target.value }))} /></div>
                  </>
                )}
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {personalFields.map(([ic, lbl, val]) => (
                  <div key={lbl} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 12px", background: T.sand, borderRadius: 10 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{ic}</span>
                    <div>
                      <div style={{ fontSize: 11, color: T.inkL, fontWeight: 700 }}>{lbl.toUpperCase()}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, marginTop: 1 }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="cf">
            <div className="df" style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>About</div>
            {editing ? <textarea className="fi2" value={pd.bio} onChange={e => setPd(p => ({ ...p, bio: e.target.value }))} rows={4} placeholder="Tell others about yourself…" /> : <p style={{ fontSize: 14, color: T.inkM, lineHeight: 1.8 }}>{displayBio}</p>}
            {role === "seeker" && (
              <div style={{ fontSize: 13, color: T.inkM, marginTop: 10, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 700, color: T.ink }}>Seeker ID:</span>{" "}
                <span style={{ fontFamily: "ui-monospace, monospace", wordBreak: "break-all" }}>{pd.seekerId || "—"}</span>
              </div>
            )}
          </div>

          {/* Skills (seekers only) */}
          {role === "seeker" && (
            <div className="cf">
              <div className="df" style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {pd.skills.map(s => (
                  <span key={s} className="stag" style={{ cursor: editing ? "pointer" : "default" }} onClick={() => editing && rmSkill(s)}>
                    {s}{editing && <span style={{ color: T.bad, marginLeft: 4 }}>×</span>}
                  </span>
                ))}
              </div>
              {editing && (
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <input className="fi2" placeholder="Add skill" value={pd.newSkill} onChange={e => setPd(p => ({ ...p, newSkill: e.target.value }))} onKeyDown={e => e.key === "Enter" && addSkill()} style={{ flex: 1 }} />
                  <button className="btn bp sm" onClick={addSkill}>Add</button>
                </div>
              )}
            </div>
          )}

          {editing && (
            <button className="btn bp" onClick={saveProfile} disabled={isSaving}>
              {isSaving ? "Saving…" : "💾 Save Profile"}
            </button>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Stats */}
          <div className="cf">
            <div className="df" style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Stats</div>
            <div className="g2" style={{ gap: 10 }}>
              {stats.map(s => (
                <div key={s.l} style={{ background: T.sand, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 12, color: T.inkM, marginBottom: 4 }}>{s.l}</div>
                  <div className="df" style={{ fontSize: 18, fontWeight: 700, color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="cf">
            <div className="df" style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Reviews &amp; Feedback</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {reviews.map((r, i) => (
                <div key={i} style={{ padding: "14px 16px", background: T.sand, borderRadius: 12, borderLeft: `3px solid ${T.gold}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div className="df" style={{ fontWeight: 700, fontSize: 14 }}>{r.n}</div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}><Stars v={r.r} sz={13} /><span style={{ fontSize: 12, color: T.inkM }}>{r.d}</span></div>
                  </div>
                  <p style={{ fontSize: 13, color: T.inkM, lineHeight: 1.6 }}>{r.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;