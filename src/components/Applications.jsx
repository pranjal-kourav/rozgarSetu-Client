import { useEffect, useMemo, useState } from "react";
import {T} from "../data/theme.js";
import { useApp } from "../context/AppContext.jsx";

const API_BASE = "http://localhost:8080";
const MONGO_ID_RE = /^[a-f\d]{24}$/i;

const prettySalary = (salary) => {
  if (salary == null) return "—";
  if (typeof salary === "number") return `₹${salary.toLocaleString("en-IN")}`;
  if (typeof salary === "object") {
    const min = salary?.min;
    const max = salary?.max;
    if (min != null && max != null) return `₹${Number(min).toLocaleString("en-IN")} - ₹${Number(max).toLocaleString("en-IN")}`;
    if (min != null) return `From ₹${Number(min).toLocaleString("en-IN")}`;
    if (max != null) return `Up to ₹${Number(max).toLocaleString("en-IN")}`;
  }
  return "—";
};

const Applications = () => {
  const { hirerId, toast, nav } = useApp();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!MONGO_ID_RE.test(String(hirerId || ""))) {
      setJobs([]);
      setLoading(false);
      setError("Hirer ID not found. Open Profile once to load your hirer account.");
      return;
    }

    const ac = new AbortController();
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/hirer/jobs?hirerId=${encodeURIComponent(hirerId)}`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
          signal: ac.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.err || data?.message || "Could not load listed jobs");
        setJobs(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        if (e.name === "AbortError") return;
        setJobs([]);
        setError(e.message || "Could not load listed jobs");
        toast(e.message || "Could not load listed jobs", "danger");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [hirerId, toast]);

  const stats = useMemo(() => {
    const total = jobs.length;
    const open = jobs.filter((j) => j?.status === "Open").length;
    const urgent = jobs.filter((j) => Boolean(j?.urgentHiring)).length;
    return { total, open, urgent };
  }, [jobs]);

  return (
    <div className="pw fi">
      <h1 className="pt">Listed Jobs</h1>
      <p className="pst">All jobs posted by your hirer account</p>

      <div className="g2" style={{ gap: 12, marginBottom: 18 }}>
        <div className="cf" style={{ background: T.saffronL }}>
          <div style={{ fontSize: 12, color: T.inkM }}>Total Jobs</div>
          <div className="df" style={{ fontSize: 22, color: T.saffron }}>{stats.total}</div>
        </div>
        <div className="cf" style={{ background: T.okL }}>
          <div style={{ fontSize: 12, color: T.inkM }}>Open</div>
          <div className="df" style={{ fontSize: 22, color: T.ok }}>{stats.open}</div>
        </div>
        <div className="cf" style={{ background: T.goldL }}>
          <div style={{ fontSize: 12, color: T.inkM }}>Urgent</div>
          <div className="df" style={{ fontSize: 22, color: T.gold }}>{stats.urgent}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "44px 20px", color: T.inkM }}>
          <div className="df" style={{ fontSize: 18 }}>Loading listed jobs...</div>
        </div>
      ) : error ? (
        <div className="card" style={{ textAlign: "center", padding: "40px 20px", border: `1px solid ${T.bad}44`, background: T.badL }}>
          <div className="df" style={{ color: T.bad, fontSize: 17, marginBottom: 8 }}>Could not load jobs</div>
          <p style={{ color: T.inkM, fontSize: 14, marginBottom: 16 }}>{error}</p>
          <button className="btn bg sm" onClick={() => nav("profile")}>Open Profile</button>
        </div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: T.inkM }}>
          <div style={{ fontSize: 46, marginBottom: 12 }}>📭</div>
          <div className="df" style={{ fontWeight: 700, fontSize: 20 }}>No listed jobs yet</div>
          <p style={{ marginTop: 6 }}>Post your first job to see it here.</p>
          <button className="btn bp sm" style={{ marginTop: 14 }} onClick={() => nav("post-job")}>Post Job</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {jobs.map((j) => (
            <div key={String(j._id)} className="card" style={{ cursor: "default" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: T.saffronL, color: T.saffron, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💼</div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div className="df" style={{ fontSize: 17 }}>{j.title || "Untitled Job"}</div>
                    <span className="badge bin">{j.status || "Open"}</span>
                    {j.urgentHiring ? <span className="badge" style={{ background: T.goldL, color: T.gold }}>Urgent</span> : null}
                  </div>
                  <p style={{ fontSize: 13, color: T.inkM, marginTop: 8, lineHeight: 1.6 }}>{j.description || "No description provided."}</p>
                  <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap", fontSize: 13, color: T.inkM }}>
                    <span>📂 {j.category || "—"}</span>
                    <span>🕐 {j.jobType || "—"}</span>
                    <span>💰 {prettySalary(j.salary)}</span>
                    <span>📈 Exp: {j.experienceYears || "—"}</span>
                    {j.openingsCount != null ? <span>👥 Openings: {j.openingsCount}</span> : null}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: T.inkM }}>Applicants: {Array.isArray(j.appliedBy) ? j.appliedBy.length : 0}</span>
                  <button className="btn bg sm" onClick={() => nav("applications")}>Manage</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;