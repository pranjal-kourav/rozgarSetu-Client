import { useEffect, useState } from "react";
import {T} from "../data/theme.js";
import { useApp } from "../context/AppContext.jsx";
import Stars from "./Stars.jsx";

const Profile = () => {
    const { user, role, toast, viewProfileData } = useApp();
    const viewedRole = viewProfileData?.role || role;
    const [editing, setEditing] = useState(false);
    const [pd, setPd] = useState({
        name: user?.name || "Rajesh Kumar", phone: user?.phone || "9826XXXXXX", email: user?.email || "",
        bio: viewedRole === "hirer" ? "Local business owner hiring skilled workers for various roles." : "Experienced worker with 5+ years across Gwalior. Specialised in domestic wiring and AC repair.",
        skills: viewedRole === "seeker" ? ["Wiring", "AC Repair", "Electrical", "Fuse Box"] : [],
        location: "Morar, Gwalior", experience: viewedRole === "seeker" ? "5 years" : "N/A",
        businessName: viewedRole === "hirer" ? "My Business" : "", industry: viewedRole === "hirer" ? "General" : "", newSkill: "",
    });

    useEffect(() => {
        const apiUser = viewProfileData?.user;
        if (!apiUser) return;
        setPd((p) => ({
            ...p,
            name: apiUser?.fullName ?? p.name,
            phone: apiUser?.phoneNumber != null ? String(apiUser.phoneNumber) : p.phone,
            email: apiUser?.emailId ?? p.email,
            location: apiUser?.district ?? p.location,
            bio: viewProfileData?.gig?.title
                ? `Gig: ${viewProfileData.gig.title}${viewProfileData?.gig?.skills?.length ? ` (${viewProfileData.gig.skills.join(", ")})` : ""}`
                : (apiUser?.bio ?? p.bio),
            skills: Array.isArray(apiUser?.skills) && apiUser.skills.length ? apiUser.skills : p.skills,
            experience: apiUser?.experience != null ? String(apiUser.experience) : p.experience,
        }));
    }, [viewProfileData]);

    const addSkill = () => { if (!pd.newSkill.trim()) return; setPd(p => ({ ...p, skills: [...p.skills, p.newSkill.trim()], newSkill: "" })); };
    const rmSkill = s => setPd(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

    const reviews = [
        { n: "Ramesh Sharma", r: 5, t: "Excellent work! Very professional.", d: "Apr 10" },
        { n: "Priya Stores", r: 4, t: "Good worker, did the job well.", d: "Mar 22" },
        { n: "TechSeva Ltd", r: 5, t: "Highly recommended. Will hire again!", d: "Mar 5" },
    ];

    const seekerStats = [{ l: "Total Earnings", v: "₹45,200", c: T.teal }, { l: "Jobs Completed", v: "12", c: T.saffron }, { l: "Experience", v: pd.experience, c: T.cta }, { l: "Rating", v: "4.7 ★", c: T.gold }];
    const hirerStats = [{ l: "Jobs Posted", v: "5", c: T.saffron }, { l: "Active Hirings", v: "2", c: T.teal }, { l: "Reviews Given", v: "8", c: T.cta }, { l: "Avg Rating", v: "4.5 ★", c: T.gold }];
    const stats = viewedRole === "seeker" ? seekerStats : hirerStats;

    const personalFields = [
        ["👤", "Name", pd.name], ["📱", "Phone", pd.phone], ["📧", "Email", pd.email || "Not provided"], ["📍", "Location", pd.location],
        ...(viewedRole === "seeker" ? [["🏆", "Experience", pd.experience]] : []),
        ...(viewedRole === "hirer" ? [["🏢", "Business", pd.businessName || "Not set"], ["🏭", "Industry", pd.industry || "Not set"]] : []),
    ];

    return (
        <div className="pw fi">
            {/* Banner */}
            <div style={{ background: `linear-gradient(135deg,${T.saffron},${T.saffronD})`, borderRadius: 20, padding: "28px 24px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,.06)", pointerEvents: "none" }} />
                <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid #fff", background: T.saffronL, color: T.saffron, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Baloo 2',cursive", fontWeight: 800, fontSize: 28, flexShrink: 0 }}>
                        {pd.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="df" style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{pd.name}</div>
                        <div style={{ color: "rgba(255,255,255,.8)", fontSize: 14, marginTop: 3 }}>{pd.location}{viewedRole === "seeker" ? ` · ${pd.experience} exp.` : ""}</div>
                        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                            {[viewedRole === "hirer" ? "🏢 Hirer" : "🔧 Worker", "★ 4.7 · 12 reviews", "✓ Aadhar Verified"].map(t => (
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
                                <div className="fg"><label className="fl">Full Name</label><input className="fi2" value={pd.name} onChange={e => setPd(p => ({ ...p, name: e.target.value }))} /></div>
                                <div className="fg"><label className="fl">Phone Number</label><input className="fi2" value={pd.phone} onChange={e => setPd(p => ({ ...p, phone: e.target.value }))} /></div>
                                <div className="fg"><label className="fl">Email</label><input className="fi2" type="email" value={pd.email} placeholder="your@email.com" onChange={e => setPd(p => ({ ...p, email: e.target.value }))} /></div>
                                <div className="fg"><label className="fl">Location</label><input className="fi2" value={pd.location} onChange={e => setPd(p => ({ ...p, location: e.target.value }))} /></div>
                                {viewedRole === "seeker" && <div className="fg"><label className="fl">Experience</label><input className="fi2" value={pd.experience} placeholder="e.g. 5 years" onChange={e => setPd(p => ({ ...p, experience: e.target.value }))} /></div>}
                                {viewedRole === "hirer" && (
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
                        {editing ? <textarea className="fi2" value={pd.bio} onChange={e => setPd(p => ({ ...p, bio: e.target.value }))} rows={4} /> : <p style={{ fontSize: 14, color: T.inkM, lineHeight: 1.8 }}>{pd.bio}</p>}
                    </div>

                    {/* Skills (seekers only) */}
                    {viewedRole === "seeker" && (
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
                        <button className="btn bp" onClick={() => { setEditing(false); toast("Profile updated!", "success"); }}>💾 Save Profile</button>
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