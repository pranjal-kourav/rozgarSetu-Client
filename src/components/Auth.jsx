import { useState } from "react";
import {T} from "../data/theme.js";
import { useApp } from "../context/AppContext.jsx";

const Auth = () => {
    const { nav, login, authMode, setAuthMode, toast } = useApp();
    const [role, setRole] = useState("seeker");
    const [step, setStep] = useState(1);
    const [f, setF] = useState({ name: "", phone: "", email: "", password: "", aadhar: "" });
    const isLogin = authMode === "login";

    const next = () => {
        if (step === 1) { setStep(2); return; }
        if (step === 2) {
            if (!f.name && !isLogin) { toast("Please enter your name", "danger"); return; }
            if (!f.phone) { toast("Please enter your phone", "danger"); return; }
            if (isLogin) { login({ name: f.name || "Rajesh Kumar", phone: f.phone }, role); return; }
            setStep(3); return;
        }
        if (step === 3) {
            if (f.aadhar.length < 12) { toast("Enter valid 12-digit Aadhar", "danger"); return; }
            login({ name: f.name, phone: f.phone, email: f.email }, role);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: T.sand, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
            <div style={{ width: "100%", maxWidth: 440 }}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div className="df" style={{ fontSize: 28, fontWeight: 800, color: T.ink }}>Rozgar<span style={{ color: T.saffron }}>setu</span></div>
                    <p style={{ color: T.inkM, fontSize: 14, marginTop: 4 }}>Kaam se jodein, zindagi badlein</p>
                </div>
                <div className="cf" style={{ padding: 28 }}>
                    <div className="tb" style={{ marginBottom: 24 }}>
                        <button className={`tbn ${!isLogin ? "on" : ""}`} onClick={() => { setAuthMode("signup"); setStep(1); }}>Sign Up</button>
                        <button className={`tbn ${isLogin ? "on" : ""}`} onClick={() => { setAuthMode("login"); setStep(2); }}>Login</button>
                    </div>
                    {!isLogin && (
                        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
                            {[1, 2, 3].map(s => <div key={s} style={{ width: s === step ? 28 : 8, height: 8, borderRadius: 4, background: s === step ? T.saffron : s < step ? T.teal : T.border, transition: "all .3s" }} />)}
                        </div>
                    )}
                    {(step === 1 || isLogin) && (
                        <div className="fi">
                            {!isLogin && <div className="df" style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>I want to…</div>}
                            <div className="g2" style={{ gap: 12, marginBottom: 20 }}>
                                {[{ id: "seeker", em: "🔧", t: "Find Work", s: "I'm a worker" }, { id: "hirer", em: "🏢", t: "Hire People", s: "I'm a hirer" }].map(r => (
                                    <div key={r.id} onClick={() => setRole(r.id)} style={{ border: `2px solid ${role === r.id ? T.saffron : T.border}`, borderRadius: 14, padding: 18, cursor: "pointer", background: role === r.id ? T.saffronL : "#fff", transition: "all .2s", textAlign: "center" }}>
                                        <div style={{ fontSize: 30, marginBottom: 8 }}>{r.em}</div>
                                        <div className="df" style={{ fontWeight: 700, fontSize: 15 }}>{r.t}</div>
                                        <div style={{ fontSize: 12, color: T.inkM, marginTop: 3 }}>{r.s}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {(step === 2 || isLogin) && (
                        <div className="fi">
                            {!isLogin && <div className="fg"><label className="fl">Full Name</label><input className="fi2" placeholder="e.g. Ramesh Kumar" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></div>}
                            <div className="fg"><label className="fl">Mobile Number</label><div className="iw"><span className="ico">📱</span><input className="fi2" placeholder="10-digit number" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} maxLength={10} /></div></div>
                            {!isLogin && <div className="fg"><label className="fl">Email (Optional)</label><input className="fi2" type="email" placeholder="you@email.com" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>}
                            <div className="fg"><label className="fl">Password</label><input className="fi2" type="password" placeholder="Create a password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></div>
                        </div>
                    )}
                    {step === 3 && !isLogin && (
                        <div className="fi">
                            <div style={{ background: T.goldL, border: `1px solid ${T.gold}44`, borderRadius: 12, padding: 14, marginBottom: 18, display: "flex", gap: 10 }}>
                                <span style={{ fontSize: 20 }}>🛡️</span>
                                <div><div className="df" style={{ fontWeight: 700, fontSize: 14 }}>Aadhar Verification</div><div style={{ fontSize: 13, color: T.inkM, marginTop: 3 }}>Used only for identity. Encrypted &amp; never shared.</div></div>
                            </div>
                            <div className="fg"><label className="fl">Aadhar Number</label><input className="fi2" placeholder="XXXX XXXX XXXX" value={f.aadhar} onChange={e => setF({ ...f, aadhar: e.target.value.replace(/\D/g, "").slice(0, 12) })} style={{ letterSpacing: 2 }} /></div>
                            <div className="fg"><label className="fl">OTP (Demo)</label><input className="fi2" placeholder="Any 6 digits" maxLength={6} /></div>
                        </div>
                    )}
                    <button className="btn bp" style={{ width: "100%", marginTop: 8 }} onClick={next}>
                        {isLogin ? "Login →" : step === 3 ? "Verify & Complete →" : "Continue →"}
                    </button>
                    <div style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: T.inkM }}>
                        {isLogin
                            ? <>Don't have an account? <button onClick={() => { setAuthMode("signup"); setStep(1); }} style={{ color: T.saffron, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Register</button></>
                            : <>Already registered? <button onClick={() => setAuthMode("login")} style={{ color: T.saffron, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Login</button></>}
                    </div>
                </div>
                <div style={{ textAlign: "center", marginTop: 16 }}><button onClick={() => nav("landing")} style={{ color: T.inkM, fontSize: 13, background: "none", border: "none", cursor: "pointer" }}>← Back to Home</button></div>
            </div>
        </div>
    );
};

export default Auth;