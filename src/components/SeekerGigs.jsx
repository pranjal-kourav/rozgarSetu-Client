import { useState, useEffect } from "react";
import { T } from "../data/theme.js";
import { PAY_UNITS } from "../data/data.js";
import { useApp } from "../context/AppContext.jsx";

const API_BASE = "http://localhost:8080";
const MONGO_ID_RE = /^[a-f\d]{24}$/i;

const SeekerGigs = () => {
    const { nav, toast, user, seekerId, setSeekerId, role } = useApp();
    const [tab, setTab] = useState("post");
    const [f, setF] = useState({ title: "", skills: "", days: [], from: "", to: "", pay: "", payUnit: "day", loc: "", note: "" });
    const [isPosting, setIsPosting] = useState(false);
    const [apiGigs, setApiGigs] = useState([]);
    const [gigsLoading, setGigsLoading] = useState(false);
    const [gigsError, setGigsError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const days7 = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const toggleDay = d => setF(p => ({ ...p, days: p.days.includes(d) ? p.days.filter(x => x !== d) : [...p.days, d] }));

    useEffect(() => {
        if (tab !== "mygigs") return;
        if (!seekerId || !MONGO_ID_RE.test(seekerId)) {
            setApiGigs([]);
            setGigsError("");
            setGigsLoading(false);
            return;
        }

        const ac = new AbortController();
        (async () => {
            setGigsLoading(true);
            setGigsError("");
            try {
                const res = await fetch(`${API_BASE}/seeker/get-gigs/${encodeURIComponent(seekerId)}`, {
                    method: "GET",
                    credentials: "include",
                    headers: { Accept: "application/json" },
                    signal: ac.signal,
                });
                const json = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(json?.err || json?.message || "Could not load gigs");
                }
                const list = Array.isArray(json?.data) ? json.data : [];
                setApiGigs(list);
            } catch (e) {
                if (e.name === "AbortError") return;
                setApiGigs([]);
                setGigsError(e.message || "Could not load gigs");
                toast(e.message || "Could not load gigs", "danger");
            } finally {
                setGigsLoading(false);
            }
        })();

        return () => ac.abort();
    }, [tab, seekerId]);

    useEffect(() => {
        if (seekerId || role !== "seeker") return;
        const emailId = user?.email?.trim();
        if (!emailId) return;

        const ac = new AbortController();
        (async () => {
            try {
                const ur = await fetch(`${API_BASE}/user`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ emailId }),
                    signal: ac.signal,
                });
                const uData = await ur.json().catch(() => ({}));
                if (!ur.ok) return;
                const uid = uData?._id != null ? String(uData._id) : "";
                if (!MONGO_ID_RE.test(uid)) return;
                const sr = await fetch(`${API_BASE}/seeker?userId=${encodeURIComponent(uid)}`, {
                    method: "GET",
                    credentials: "include",
                    headers: { Accept: "application/json" },
                    signal: ac.signal,
                });
                const sData = await sr.json().catch(() => ({}));
                if (sr.ok && sData?._id != null) setSeekerId(String(sData._id));
            } catch {
                /* ignore */
            }
        })();
        return () => ac.abort();
    }, [user?.email, role, seekerId, setSeekerId]);

    const save = async () => {
        if (isPosting) return;
        if (!f.title.trim()) { toast("Please add a gig title", "danger"); return; }
        if (!f.skills.trim()) { toast("Please add at least one skill", "danger"); return; }
        if (!f.from || !String(f.from).trim()) { toast("Please choose a start time (From)", "danger"); return; }
        if (!f.pay || isNaN(Number(f.pay))) { toast("Pay must be a valid number", "danger"); return; }
        const hourlyRate = Number(f.pay);
        if (hourlyRate < 10) { toast("Expected pay must be at least ₹10", "danger"); return; }
        if (!seekerId || !MONGO_ID_RE.test(seekerId)) {
            toast("Seeker ID not loaded. Open Profile once or complete seeker signup.", "danger");
            return;
        }

        const startingFrom = String(f.from);
        const payload = {
            seekerId,
            title: f.title.trim(),
            category: f.skills.trim(),
            startingFrom,
            hourlyRate,
            description: f.note.trim() || f.title.trim(),
            status: "Active",
        };

        try {
            setIsPosting(true);
            const res = await fetch(`${API_BASE}/seeker/create-gig`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data?.err || data?.message || "Could not post gig");
            }
            toast("Gig posted!", "success");
            setF({ title: "", skills: "", days: [], from: "", to: "", pay: "", payUnit: "day", loc: "", note: "" });
            setTab("mygigs");
        } catch (e) {
            toast(e.message || "Could not post gig", "danger");
        } finally {
            setIsPosting(false);
        }
    };

    const categoryTags = (cat) => {
        if (!cat || typeof cat !== "string") return [];
        return cat.split(",").map(s => s.trim()).filter(Boolean);
    };

    const deleteGig = async (gigId) => {
        const id = String(gigId);
        if (!MONGO_ID_RE.test(id)) {
            toast("Invalid gig id", "danger");
            return;
        }
        if (!window.confirm("Delete this gig? This cannot be undone.")) return;

        try {
            setDeletingId(id);
            const res = await fetch(`${API_BASE}/seeker/gig/${encodeURIComponent(id)}`, {
                method: "DELETE",
                credentials: "include",
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(json?.err || json?.message || "Could not delete gig");
            }
            setApiGigs(prev => prev.filter(g => String(g._id) !== id));
            toast("Gig deleted", "success");
        } catch (e) {
            toast(e.message || "Could not delete gig", "danger");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="pw fi">
            <button onClick={() => nav("seeker-dash")} style={{ background: "none", border: "none", color: T.inkM, cursor: "pointer", fontSize: 14, marginBottom: 16 }}>← Back to Dashboard</button>
            <h1 className="pt">My Gigs</h1>
            <p className="pst">Post your availability as a gig for hirers to find you</p>
            <div className="tb">
                <button className={`tbn ${tab === "post" ? "on" : ""}`} onClick={() => setTab("post")}>📝 Post New Gig</button>
                <button className={`tbn ${tab === "mygigs" ? "on" : ""}`} onClick={() => setTab("mygigs")}>⚡ My Posted Gigs {apiGigs.length > 0 && `(${apiGigs.length})`}</button>
            </div>

            {tab === "post" && (
                <div className="cf fi">
                    <div className="fg"><label className="fl">Gig Title *</label><input className="fi2" placeholder="e.g. Plumber for 2 days" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} /></div>
                    <div className="fg"><label className="fl">Your Skills *</label><input className="fi2" placeholder="e.g. Plumbing, Wiring, Painting (comma-separated)" value={f.skills} onChange={e => setF({ ...f, skills: e.target.value })} /></div>
                    <div className="fg">
                        <label className="fl">Available Days</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                            {days7.map(d => (
                                <button key={d} type="button" onClick={() => toggleDay(d)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontFamily: "'Baloo 2',cursive", fontWeight: 700, cursor: "pointer", transition: "all .15s", border: `1.5px solid ${f.days.includes(d) ? T.saffron : T.border}`, background: f.days.includes(d) ? T.saffronL : "#fff", color: f.days.includes(d) ? T.saffron : T.inkM }}>
                                    {d.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="g2" style={{ gap: 14 }}>
                        <div className="fg"><label className="fl">From *</label><input type="time" className="fi2" value={f.from} onChange={e => setF({ ...f, from: e.target.value })} /></div>
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
                        <button className="btn bp" style={{ flex: 1 }} onClick={save} disabled={isPosting}>{isPosting ? "Posting…" : "⚡ Post Gig"}</button>
                        <button className="btn bg" onClick={() => nav("seeker-dash")}>Cancel</button>
                    </div>
                </div>
            )}

            {tab === "mygigs" && (
                <div className="fi">
                    {(!seekerId || !MONGO_ID_RE.test(seekerId)) && (
                        <div style={{ padding: "16px 18px", background: T.goldL, borderRadius: 12, border: `1px solid ${T.gold}44`, color: T.inkM, fontSize: 14, marginBottom: 16 }}>
                            Seeker ID is not loaded yet. Open <strong>Profile</strong> once (or finish seeker signup) so gigs can load from the server.
                        </div>
                    )}
                    {gigsLoading && (
                        <div style={{ textAlign: "center", padding: "40px 20px", color: T.inkM }}>Loading your gigs…</div>
                    )}
                    {!gigsLoading && gigsError && (
                        <div style={{ padding: "14px 16px", background: T.badL, borderRadius: 12, border: `1px solid ${T.bad}44`, color: T.bad, fontSize: 14, marginBottom: 16 }}>{gigsError}</div>
                    )}
                    {!gigsLoading && seekerId && MONGO_ID_RE.test(seekerId) && apiGigs.length === 0 && !gigsError && (
                        <div style={{ textAlign: "center", padding: "60px 20px", color: T.inkM }}>
                            <div style={{ fontSize: 52, marginBottom: 12 }}>⚡</div>
                            <div className="df" style={{ fontWeight: 700, fontSize: 18 }}>No gigs on the server yet</div>
                            <p style={{ marginTop: 6 }}>Click &quot;Post New Gig&quot; to create one</p>
                            <button className="btn bp" style={{ marginTop: 20 }} onClick={() => setTab("post")}>Post a gig</button>
                        </div>
                    )}
                    {!gigsLoading && apiGigs.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {apiGigs.map(gig => (
                                <div key={String(gig._id)} className="card" style={{ cursor: "default", borderLeft: `3px solid ${T.saffron}` }}>
                                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 12, background: T.saffronL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>⚡</div>
                                        <div style={{ flex: 1, minWidth: 200 }}>
                                            <div className="df" style={{ fontWeight: 700, fontSize: 16 }}>{gig.title || "—"}</div>
                                            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 13, color: T.inkM, marginTop: 4 }}>
                                                <span style={{ color: T.teal, fontWeight: 600 }}>₹{gig.hourlyRate ?? "—"}/hr</span>
                                                <span>🕐 Starts from <strong>{gig.startingFrom != null ? String(gig.startingFrom) : "—"}</strong></span>
                                                <span className="stag" style={{ margin: 0 }}>{gig.status || "—"}</span>
                                            </div>
                                            {gig.description ? (
                                                <p style={{ fontSize: 13, color: T.inkM, lineHeight: 1.6, marginTop: 10 }}>{gig.description}</p>
                                            ) : null}
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                                                {categoryTags(gig.category).map(s => <span key={s} className="stag">{s}</span>)}
                                            </div>
                                            <div style={{ marginTop: 8, fontSize: 11, color: T.inkL, fontFamily: "ui-monospace, monospace" }}>Gig ID: {String(gig._id)}</div>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                                            <button
                                                type="button"
                                                className="btn bdn sm"
                                                disabled={deletingId === String(gig._id)}
                                                onClick={() => deleteGig(gig._id)}
                                            >
                                                {deletingId === String(gig._id) ? "Deleting…" : "🗑️ Delete"}
                                            </button>
                                        </div>
                                    </div>
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
