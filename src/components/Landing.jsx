import { T } from "../data/theme.js";
import { useApp } from "../context/AppContext.jsx";

const Landing = () => {
    const { nav, setAuthMode, user } = useApp();
    const go = () => { setAuthMode("signup"); nav("auth"); };

    return (
        <div>
            {/* HERO */}
            <section className="hero">
                <div style={{ maxWidth: 960, margin: "0 auto", width: "100%" }} className="fi">
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.saffronL, border: `1px solid ${T.saffron}44`, borderRadius: 50, padding: "5px 14px", marginBottom: 24 }}>
                        <span>🇮🇳</span>
                        <span className="df" style={{ fontWeight: 700, fontSize: 13, color: T.saffronD }}>Made for Bharat's Mid-Urban Workers</span>
                    </div>
                    <h1 className="htitle" style={{ marginBottom: 20 }}>
                        Kaam Chahiye?<br />
                        <span style={{ color: T.saffron }}>Rozgar</span><span style={{ color: T.cta }}>setu</span> Par<br />
                        Milega Zaroor.
                    </h1>
                    <p style={{ fontSize: 18, color: T.inkM, maxWidth: 520, lineHeight: 1.7, marginBottom: 36 }}>
                        India's fastest platform connecting <strong style={{ color: T.saffron }}>skilled workers</strong> and <strong style={{ color: T.ctaD }}>local hirers</strong> in Tier-2 &amp; Tier-3 cities.
                    </p>
                    {!user ? (
                        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                            <button className="btn bt lg" onClick={go}>Register as Hirer →</button>
                            <button className="btn bp lg" onClick={go}>Find Work Now →</button>
                        </div>
                    ) : (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: T.tealL, border: `1.5px solid ${T.teal}33`, borderRadius: 14, padding: "14px 22px" }}>
                            <span style={{ fontSize: 22 }}>👋</span>
                            <div>
                                <div className="df" style={{ fontWeight: 700, color: T.teal }}>You're logged in, {user.name?.split(" ")[0]}!</div>
                                <div style={{ fontSize: 13, color: T.inkM }}>Use the navbar to go to your dashboard.</div>
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ position: "absolute", top: -40, right: -60, width: 320, height: 320, borderRadius: "50%", background: `${T.saffron}0D`, pointerEvents: "none" }} />
            </section>

            {/* PROBLEM & SOLUTION */}
            <section style={{ background: "#fff", padding: "60px 20px" }}>
                <div style={{ maxWidth: 960, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 40 }}>
                        <div className="df" style={{ fontSize: 32, fontWeight: 800 }}>The Problem We Solve</div>
                        <p style={{ color: T.inkM, fontSize: 16, marginTop: 8 }}>Millions of workers and hirers struggle to find each other in mid-urban India</p>
                    </div>
                    <div className="g2" style={{ gap: 20 }}>
                        {[
                            { bg: T.badL, bc: `${T.bad}44`, em: "😓", title: "Before Rozgarsetu", tc: T.bad, items: ["Workers wander streets looking for daily work", "Hirers rely on word-of-mouth with no verification", "No transparency on pay — exploitation is common", "No digital record of work history or skills"], ic: T.bad, mk: "✕" },
                            { bg: T.tealL, bc: `${T.teal}44`, em: "✅", title: "With Rozgarsetu", tc: T.teal, items: ["Browse & apply to gigs/jobs from your phone", "Aadhar-verified profiles for trust & safety", "Clear pay rates posted upfront", "Build your work portfolio & get reviews"], ic: T.teal, mk: "✓" },
                        ].map((b, i) => (
                            <div key={i} style={{ background: b.bg, border: `1.5px solid ${b.bc}`, borderRadius: 16, padding: 24, display: "flex", gap: 14, alignItems: "flex-start" }}>
                                <span style={{ fontSize: 28, flexShrink: 0 }}>{b.em}</span>
                                <div>
                                    <div className="df" style={{ fontSize: 18, fontWeight: 700, color: b.tc, marginBottom: 6 }}>{b.title}</div>
                                    {b.items.map(p => (
                                        <div key={p} style={{ display: "flex", gap: 8, fontSize: 14, color: T.inkM, marginBottom: 6 }}>
                                            <span style={{ color: b.ic, flexShrink: 0 }}>{b.mk}</span>{p}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SERVICE CARDS */}
            <section style={{ background: T.sand, padding: "60px 20px" }}>
                <div style={{ maxWidth: 960, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 40 }}>
                        <div className="df" style={{ fontSize: 32, fontWeight: 800 }}>Our Two Services</div>
                        <p style={{ color: T.inkM, fontSize: 16, marginTop: 8 }}>Whether you need quick work today or a steady job — we've got both</p>
                    </div>
                    <div className="g2" style={{ gap: 24 }}>
                        {[
                            { cls: "svq", em: "⚡", badge: "bsa", bl: "GIGS", title: "Gig Work", desc: "Electricians, plumbers, cooks, delivery workers — get hired for a day or a week.", feats: ["Same-day hiring", "Daily/weekly pay", "Any skill accepted"], fc: T.saffron, btns: !user && [{ l: "Find Gigs", c: "bs" }] },
                            { cls: "svj", em: "💼", badge: "bgd", bl: "FULL-TIME JOBS", title: "Jobs", desc: "Data entry, sales, security, retail — find stable employment with local businesses.", feats: ["Monthly salary roles", "Verified employers", "Career growth path"], fc: T.ctaD, btns: !user && [{ l: "Post Job", c: "bt" }, { l: "Browse Jobs", c: "bg" }] },
                        ].map((s, i) => (
                            <div key={i} className={`svc ${s.cls}`}>
                                <div style={{ fontSize: 48, marginBottom: 14 }}>{s.em}</div>
                                <span className={`badge ${s.badge}`} style={{ marginBottom: 10 }}>{s.bl}</span>
                                <h3 className="df" style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>{s.title}</h3>
                                <p style={{ color: T.inkM, fontSize: 15, lineHeight: 1.7, marginBottom: 18 }}>{s.desc}</p>
                                {s.feats.map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 6 }}><span style={{ color: s.fc }}>●</span>{f}</div>)}
                                {s.btns && <div style={{ display: "flex", gap: 10, marginTop: 20 }}>{s.btns.map(b => <button key={b.l} className={`btn ${b.c} sm`} onClick={go}>{b.l}</button>)}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section style={{ background: "#fff", padding: "60px 20px" }}>
                <div style={{ maxWidth: 960, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 40 }}><div className="df" style={{ fontSize: 32, fontWeight: 800 }}>How It Works</div></div>
                    <div className="g2" style={{ gap: 48 }}>
                        {[
                            { color: T.saffron, bg: T.saffronL, icon: "🔧", label: "For Workers", steps: ["Register & verify with Aadhar", "Post your skills & availability", "Browse & apply to nearby jobs", "Get hired, work, get paid!"] },
                            { color: T.ctaD, bg: T.ctaL, icon: "🏢", label: "For Hirers", steps: ["Register & verify your business", "Post your job with details & pay", "Browse applicants & view profiles", "Hire, complete work, leave reviews"] },
                        ].map(col => (
                            <div key={col.label}>
                                <div className="df" style={{ fontSize: 18, fontWeight: 700, color: col.color, marginBottom: 20 }}>{col.icon} {col.label}</div>
                                {col.steps.map((s, i) => (
                                    <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
                                        <div style={{ width: 32, height: 32, borderRadius: 8, background: col.bg, color: col.color, fontFamily: "'Baloo 2',cursive", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                                        <p style={{ fontSize: 15, paddingTop: 6, color: T.ink }}>{s}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ background: T.ink, color: "#fff", padding: "56px 20px 0" }}>
                <div style={{ maxWidth: 960, margin: "0 auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40, paddingBottom: 48 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${T.saffron},${T.saffronD})`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 18 }}>🌱</span></div>
                                <span className="df" style={{ fontSize: 20, fontWeight: 800 }}>Rozgar<span style={{ color: T.gold }}>setu</span></span>
                            </div>
                            <p style={{ fontSize: 14, color: "rgba(255,255,255,.6)", lineHeight: 1.8, marginBottom: 16 }}>
                                Connecting skilled workers and local hirers across Tier-2 &amp; Tier-3 cities in Bharat. Kaam dhundho, zindagi badlo.
                            </p>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {["🇮🇳 Made in India", "✓ Aadhar Verified", "🔒 Secure Platform"].map(t => (
                                    <span key={t} style={{ fontSize: 12, background: "rgba(255,255,255,.08)", padding: "4px 10px", borderRadius: 20, color: "rgba(255,255,255,.7)" }}>{t}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="df" style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: T.gold }}>Our Services</div>
                            {[["⚡", "Gig Work"], ["💼", "Full-Time Jobs"], ["🔍", "Browse Seekers"], ["📋", "Post a Job"], ["⭐", "Reviews & Ratings"], ["🛡️", "Aadhar Verification"]].map(([ic, lb]) => (
                                <div key={lb} style={{ display: "flex", gap: 8, fontSize: 14, color: "rgba(255,255,255,.65)", marginBottom: 8 }}><span>{ic}</span>{lb}</div>
                            ))}
                        </div>
                        <div>
                            <div className="df" style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: T.gold }}>For Users</div>
                            {["Register as a Hirer", "Register as a Worker", "Browse Gig Listings", "Browse Job Listings", "Track Applications", "View & Edit Profile", "Aadhar-Based Verification"].map(item => (
                                <div key={item} style={{ fontSize: 14, color: "rgba(255,255,255,.65)", marginBottom: 8 }}>→ {item}</div>
                            ))}
                        </div>
                        <div>
                            <div className="df" style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: T.gold }}>Contact Us</div>
                            {[["📧", "pranjalkaurav23@gmail.com"], ["📱", "9165328550"], ["🏠", "Bhopal, Madhya Pradesh"], ["🕐", "Mon–Sat, 9 AM – 7 PM"]].map(([ic, txt]) => (
                                <div key={txt} style={{ display: "flex", gap: 8, fontSize: 14, color: "rgba(255,255,255,.65)", marginBottom: 10 }}><span>{ic}</span>{txt}</div>
                            ))}
                            <div className="df" style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.4)", marginTop: 16, marginBottom: 8 }}>ACTIVE CITIES</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {["Bhopal", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Ratlam", "Indore", "Satna"].map(c => (
                                    <span key={c} style={{ fontSize: 12, background: "rgba(255,255,255,.08)", padding: "3px 10px", borderRadius: 20, color: "rgba(255,255,255,.6)" }}>{c}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}>© 2025 Rozgarsetu Technologies Pvt. Ltd. · All rights reserved</div>
                        <div style={{ display: "flex", gap: 20 }}>
                            {["Privacy Policy", "Terms of Use", "Grievance Cell"].map(l => (
                                <span key={l} style={{ fontSize: 13, color: "rgba(255,255,255,.4)", cursor: "pointer" }}>{l}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;