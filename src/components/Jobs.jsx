import { useState, useEffect, useMemo, useCallback } from "react";

import { T } from "../data/theme.js";

import { useApp } from "../context/AppContext.jsx";

import Stars from "./Stars.jsx";

const API_BASE = "http://localhost:8080";
const MONGO_ID_RE = /^[a-f\d]{24}$/i;

function formatSalaryRange(salary) {
  if (!salary || (salary.min == null && salary.max == null)) return "Compensation discussed on contact";
  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
  if (salary.min != null && salary.max != null) return `${fmt(salary.min)} – ${fmt(salary.max)}`;
  if (salary.min != null) return `From ${fmt(salary.min)}`;
  return `Up to ${fmt(salary.max)}`;
}

function formatPosted(createdAt) {
  if (!createdAt) return "";
  try {
    const d = new Date(createdAt);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

function mapApiJob(doc) {
  const id = doc?._id != null ? String(doc._id) : "";
  const appliedByIds = Array.isArray(doc.appliedBy) ? doc.appliedBy.map((x) => String(x)) : [];
  return {
    id,
    title: doc.title || "Untitled role",
    hirerId: doc.hirerId != null ? String(doc.hirerId) : "",
    hirer: "Employer",
    hirerRating: null,
    posted: formatPosted(doc.createdAt),
    location: "—",
    duration: doc.jobType || "—",
    pay: formatSalaryRange(doc.salary),
    skills: [doc.category, doc.jobType].filter(Boolean),
    applicants: appliedByIds.length,
    description: (doc.description || "").trim(),
    status: doc.status || "Open",
    urgentHiring: Boolean(doc.urgentHiring),
    experienceYears: doc.experienceYears,
    educationRequired: doc.educationRequired,
    openingsCount: doc.openingsCount,
    appliedByIds,
  };
}

const Jobs = () => {
  const { applyJob, applied, viewProfile, toast, user, seekerId, setSeekerId, role } = useApp();

  const [search, setSearch] = useState("");
  const [rawJobs, setRawJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyingId, setApplyingId] = useState(null);

  const fetchJobs = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/seeker/jobs`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.err || json?.message || "Could not load jobs");
      const list = Array.isArray(json?.data) ? json.data : [];
      setRawJobs(list);
    } catch (e) {
      if (e.name === "AbortError") return;
      setRawJobs([]);
      setError(e.message || "Could not load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetchJobs(ac.signal);
    return () => ac.abort();
  }, [fetchJobs]);

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

  const jobs = useMemo(() => rawJobs.map(mapApiJob), [rawJobs]);

  const q = search.trim().toLowerCase();
  const list = useMemo(() => {
    if (!q) return jobs;
    return jobs.filter((j) => {
      const hay = [j.title, j.description, j.duration, ...j.skills].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [jobs, q]);

  const handleApply = async (job) => {
    const sid = seekerId && MONGO_ID_RE.test(seekerId) ? seekerId : "";
    const already =
      applied.some((x) => String(x) === String(job.id)) ||
      (sid && job.appliedByIds.includes(sid));
    if (already || applyingId) return;
    if (!sid) {
      toast("Open Profile once or complete seeker signup so we can submit your application.", "danger");
      return;
    }
    try {
      setApplyingId(job.id);
      const res = await fetch(`${API_BASE}/seeker/apply-jobs/${encodeURIComponent(job.id)}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ seekerId: sid }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.err || "Could not apply");
      applyJob(job.id);
      setRawJobs((prev) =>
        prev.map((d) => {
          if (String(d._id) !== String(job.id)) return d;
          const cur = Array.isArray(d.appliedBy) ? d.appliedBy.map(String) : [];
          if (cur.includes(sid)) return d;
          return { ...d, appliedBy: [...d.appliedBy, sid] };
        })
      );
    } catch (e) {
      toast(e.message || "Could not apply", "danger");
    } finally {
      setApplyingId(null);
    }
  };

  const skeleton = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[1, 2, 3].map((k) => (
        <div
          key={k}
          className="card"
          style={{
            height: 148,
            background: `linear-gradient(90deg, ${T.saffronL} 25%, ${T.indigoL} 37%, ${T.saffronL} 63%)`,
            backgroundSize: "400% 100%",
            animation: "jobsShimmer 1.2s ease-in-out infinite",
            border: `1px solid ${T.border}`,
          }}
        />
      ))}
      <style>{`@keyframes jobsShimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }`}</style>
    </div>
  );

  return (
    <div className="pw fi">
      <h1 className="pt">Browse Jobs</h1>
      <p className="pst">Open roles from employers — filter by title, skills, or type</p>

      <div style={{ marginBottom: 20 }}>
        <div className="iw">
          <span className="ico">🔍</span>
          <input
            className="fi2"
            placeholder="Search by title, category, job type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading && !rawJobs.length}
          />
        </div>
      </div>

      {loading && !rawJobs.length ? (
        skeleton
      ) : error && !rawJobs.length ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "48px 24px",
            border: `1px solid ${T.border}`,
            background: `linear-gradient(180deg, ${T.badL}, ${T.white})`,
          }}
        >
          <div style={{ fontSize: 44, marginBottom: 12 }}>⚠️</div>
          <div className="df" style={{ fontWeight: 700, fontSize: 18, color: T.ink, marginBottom: 8 }}>
            {error}
          </div>
          <p style={{ fontSize: 14, color: T.inkM, marginBottom: 20 }}>Check that the backend is running on port 8080, then try again.</p>
          <button
            type="button"
            className="btn bp"
            onClick={() => {
              const ac = new AbortController();
              fetchJobs(ac.signal);
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {list.map((job) => {
            const sid = seekerId && MONGO_ID_RE.test(seekerId) ? seekerId : "";
            const ap =
              applied.some((x) => String(x) === String(job.id)) || (sid && job.appliedByIds.includes(sid));
            const closed = job.status && job.status !== "Open";

            return (
              <div
                key={job.id}
                className="card"
                style={{
                  cursor: "default",
                  borderLeft: job.urgentHiring ? `4px solid ${T.gold}` : undefined,
                  boxShadow: job.urgentHiring ? `0 8px 24px rgba(191, 138, 48, 0.12)` : undefined,
                }}
              >
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: T.saffronL,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    💼
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <div>
                        <div className="df" style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.25 }}>
                          {job.title}
                        </div>
                        <div style={{ fontSize: 14, color: T.inkM, marginTop: 4 }}>
                          by{" "}
                          <button type="button" className="lbtn" onClick={() => viewProfile(job.hirerId, "hirer")}>
                            {job.hirer}
                          </button>
                          {job.hirerRating != null ? (
                            <>
                              <span style={{ margin: "0 4px" }}>·</span>
                              <Stars v={job.hirerRating} sz={12} />
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-end" }}>
                        {job.urgentHiring ? (
                          <span className="badge" style={{ background: T.goldL, color: T.gold, fontWeight: 700 }}>
                            Urgent
                          </span>
                        ) : null}
                        <span
                          className="badge bin"
                          style={{
                            background: closed ? T.badL : T.okL,
                            color: closed ? T.bad : T.ok,
                          }}
                        >
                          {job.status}
                        </span>
                        {job.posted ? <span className="badge bin">{job.posted}</span> : null}
                      </div>
                    </div>

                    {job.description ? (
                      <p
                        style={{
                          margin: "10px 0 0",
                          fontSize: 14,
                          color: T.inkM,
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {job.description}
                      </p>
                    ) : null}

                    <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap", fontSize: 13, color: T.inkM }}>
                      <span>📍 {job.location}</span>
                      <span>🕐 {job.duration}</span>
                      {job.experienceYears ? <span>📊 Exp: {job.experienceYears}</span> : null}
                      {job.educationRequired ? <span>🎓 {job.educationRequired}</span> : null}
                      {job.openingsCount != null ? <span>👥 {job.openingsCount} opening(s)</span> : null}
                    </div>

                    <div style={{ fontWeight: 700, color: T.teal, fontSize: 15, marginTop: 8 }}>{job.pay}</div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                      {job.skills?.map((s) => (
                        <span key={s} className="stag">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                    <button
                      type="button"
                      className={`btn sm ${ap ? "bg" : "bp"}`}
                      onClick={() => !ap && !closed && handleApply(job)}
                      disabled={Boolean(ap || closed || applyingId === job.id)}
                      style={{ minWidth: 110, cursor: ap || closed ? "default" : "pointer", opacity: closed ? 0.65 : 1 }}
                    >
                      {applyingId === job.id ? "…" : ap ? "✓ Applied" : closed ? "Closed" : "Apply →"}
                    </button>
                    <span style={{ fontSize: 12, color: T.inkM }}>{job.applicants} applied</span>
                  </div>
                </div>
              </div>
            );
          })}

          {!loading && jobs.length === 0 && !error ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: T.inkM }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <div className="df" style={{ fontWeight: 700, fontSize: 18 }}>
                No openings yet
              </div>
              <p style={{ marginTop: 8, fontSize: 14 }}>Check back soon — new roles appear here when hirers post jobs.</p>
            </div>
          ) : null}

          {jobs.length > 0 && list.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: T.inkM }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
              <div className="df" style={{ fontWeight: 700, fontSize: 18 }}>
                No jobs match your search
              </div>
              <p style={{ marginTop: 8, fontSize: 14 }}>Try a shorter keyword or clear the search box.</p>
              <button type="button" className="btn bg sm" style={{ marginTop: 16 }} onClick={() => setSearch("")}>
                Clear search
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Jobs;
