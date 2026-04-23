import { useEffect, useMemo, useState } from "react";
import {T} from "../data/theme.js";
import { SEEKERS } from "../data/data.js";
import { useApp } from "../context/AppContext.jsx";
import Stars from "./Stars.jsx";

const API_BASE = "http://localhost:8080";

const HirerGigs = () => {
  const { nav, openCall, viewProfile, contacted, setContacted, toast } = useApp();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [apiGigs, setApiGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openingGigId, setOpeningGigId] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/hirer/gigs`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
          signal: ac.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.err || data?.message || "Could not load gigs");
        setApiGigs(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        if (e.name === "AbortError") return;
        setApiGigs([]);
        setError(e.message || "Could not load gigs");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const mappedGigs = useMemo(() => {
    return apiGigs.map((g) => {
      const fallbackSeeker = SEEKERS.find((s) => String(s.id) === String(g.seekerId));
      const title = g?.title ? String(g.title) : "Untitled Gig";
      const category = g?.category ? String(g.category) : "General";
      const location = g?.location ? String(g.location) : "Not specified";
      const seekerName = fallbackSeeker?.name || "Seeker";
      const seekerRating = Number(g?.avgRating ?? fallbackSeeker?.rating ?? 0);
      return {
        id: g?._id != null ? String(g._id) : String(Math.random()),
        seekerId: g?.seekerId != null ? String(g.seekerId) : "",
        title,
        seeker: seekerName,
        seekerRating,
        posted: g?.status ? String(g.status) : "Active",
        location,
        duration: g?.startingFrom ? `From ${g.startingFrom}` : "Flexible",
        pay: g?.hourlyRate != null ? Number(g.hourlyRate) : 0,
        payUnit: "hour",
        skills: [category],
        available: g?.status !== "Paused",
        phone: fallbackSeeker?.phone || "",
      };
    });
  }, [apiGigs]);

  const list = mappedGigs
    .filter(g => g.available && (!search || g.title.toLowerCase().includes(search.toLowerCase()) || g.seeker.toLowerCase().includes(search.toLowerCase()) || g.location.toLowerCase().includes(search.toLowerCase()) || g.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))))
    .sort((a, b) => sort === "rating" ? b.seekerRating - a.seekerRating : 0);

  const contact = (id) => {
    if (!contacted.includes(id)) { setContacted(p => [...p, id]); toast("Seeker notified!", "success"); }
  };

  const openGigProfile = async (gig) => {
    const gigId = String(gig?.id || "");
    if (!gigId) {
      toast("Gig ID is missing", "danger");
      return;
    }
    try {
      setOpeningGigId(gigId);
      const res = await fetch(`${API_BASE}/hirer/gig/${encodeURIComponent(gigId)}`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.err || data?.message || "Could not load profile details");
      viewProfile(gig.seekerId, "seeker", {
        role: "seeker",
        user: data?.user || null,
        gig: {
          id: gig.id,
          title: gig.title,
          location: gig.location,
          duration: gig.duration,
          pay: gig.pay,
          payUnit: gig.payUnit,
          skills: gig.skills,
        },
      });
    } catch (e) {
      toast(e.message || "Could not load profile details", "danger");
    } finally {
      setOpeningGigId("");
    }
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
      {loading && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: T.inkM }}>
          <div className="df" style={{ fontWeight: 700, fontSize: 18 }}>Loading gigs...</div>
        </div>
      )}
      {!loading && error && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: T.bad }}>
          <div className="df" style={{ fontWeight: 700, fontSize: 18 }}>Could not load gigs</div>
          <p style={{ marginTop: 6, color: T.inkM }}>{error}</p>
        </div>
      )}
      {!loading && !error && list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: T.inkM }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>⚡</div>
          <div className="df" style={{ fontWeight: 700, fontSize: 20 }}>No gigs found</div>
          <p style={{ marginTop: 6 }}>Try adjusting your search</p>
        </div>
      ) : !loading && !error ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {list.map(gig => {
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
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 8, flexShrink: 0 }}>
                    <button className="btn bt sm" onClick={() => openGigProfile(gig)} disabled={openingGigId === gig.id}>
                      {openingGigId === gig.id ? "Loading..." : "📨 Contact"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default HirerGigs;