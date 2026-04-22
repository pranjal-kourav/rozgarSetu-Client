import { useState } from "react";
import {T} from "../data/theme.js";
import { useApp } from "../context/AppContext.jsx";

const Review = () => {
  const { nav, toast } = useApp();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [fb, setFb] = useState("");
  const [done, setDone] = useState(false);

  const sub = () => {
    if (!rating) { toast("Please select a rating", "danger"); return; }
    setDone(true); toast("Review submitted!", "success");
    setTimeout(() => nav("applications"), 2000);
  };

  if (done) return (
    <div className="pw" style={{ textAlign: "center", paddingTop: 80 }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <div className="df" style={{ fontSize: 26, fontWeight: 800, color: T.teal }}>Review Submitted!</div>
    </div>
  );

  return (
    <div className="pw fi" style={{ maxWidth: 500 }}>
      <button onClick={() => nav("applications")} style={{ background: "none", border: "none", color: T.inkM, cursor: "pointer", fontSize: 14, marginBottom: 20 }}>← Back</button>
      <h1 className="pt">Leave a Review</h1><p className="pst">Your feedback helps workers grow</p>
      <div className="cf">
        <div style={{ display: "flex", gap: 14, alignItems: "center", padding: 16, background: T.sand, borderRadius: 12, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: T.saffronL, color: T.saffron, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Baloo 2',cursive", fontWeight: 800, fontSize: 18 }}>S</div>
          <div><div className="df" style={{ fontWeight: 700 }}>Suresh Yadav</div><div style={{ fontSize: 13, color: T.inkM }}>Electrician · Completed Apr 14</div></div>
        </div>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div className="df" style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>How was the work?</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 10 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}
                style={{ fontSize: 44, color: s <= (hover || rating) ? T.gold : T.border, background: "none", border: "none", cursor: "pointer", transition: "all .15s" }}>
                {s <= (hover || rating) ? "★" : "☆"}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 15, color: T.inkM, fontWeight: 500 }}>{["", "Poor", "Below Average", "Good", "Very Good", "Excellent! ⭐"][hover || rating] || "Select a rating"}</div>
        </div>
        <div className="fg"><label className="fl">Your Feedback</label><textarea className="fi2" rows={4} placeholder="Describe quality, punctuality, behaviour…" value={fb} onChange={e => setFb(e.target.value)} /></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn bp" style={{ flex: 1 }} onClick={sub}>Submit Review ★</button>
          <button className="btn bg" onClick={() => nav("applications")}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Review;