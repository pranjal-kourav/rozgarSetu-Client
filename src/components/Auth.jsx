import { useState } from "react";
import {T} from "../data/theme.js";
import { useApp } from "../context/AppContext.jsx";

const Auth = () => {
    const { toast } = useApp();
    const { nav, login, authMode, setAuthMode } = useApp();
    const [role, setRole] = useState("seeker");
    const [step, setStep] = useState(1);
    const [f, setF] = useState({ name: "", email: "", password: "", aadhar: "", otp: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isLogin = authMode === "login";

    const next = async () => {
        if (isSubmitting) return;

        if (step === 1) { setStep(2); return; }
        if (step === 2) {
            if (!f.name && !isLogin) { toast("Please enter your name", "danger"); return; }
            if (!f.email.trim()) { toast("Please enter your email", "danger"); return; }
            if (!f.password.trim()) { toast("Please enter your password", "danger"); return; }

            if (isLogin) {
                try {
                    setIsSubmitting(true);
                    const res = await fetch("http://localhost:8080/user/login", {
                        method: "POST",
                        credentials:"include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            emailId: f.email.trim(),
                            password: f.password,
                        }),
                    });

                    const data = await res.json().catch(() => ({}));
                    if (!res.ok) throw new Error(data?.message || "Login failed");

                    toast("Login successful!", "success");
                    login(
                        { name: data?.fullName || data?.user?.fullName || f.email.trim(), email: f.email.trim() },
                        data?.role || data?.user?.role || role
                    );
                } catch (error) {
                    toast(error.message || "Could not login", "danger");
                } finally {
                    setIsSubmitting(false);
                }
                return;
            }

            setStep(3); return;
        }
        if (step === 3) {
            if (f.aadhar.length < 12) { toast("Enter valid 12-digit Aadhar", "danger"); return; }
            if (f.otp.trim().length < 4) { toast("Please enter valid OTP", "danger"); return; }

            try {
                setIsSubmitting(true);

                const signupRes = await fetch("http://localhost:8080/user/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fullName: f.name.trim(),
                        emailId: f.email.trim(),
                        password: f.password,
                        role,
                        status: "Active",
                        aadharNumber: Number(f.aadhar),
                        district: "Gwalior",
                    }),
                });
                const signupData = await signupRes.json().catch(() => ({}));
                if (!signupRes.ok) throw new Error(signupData?.message || "Signup failed");

                toast("Account created successfully!", "success");
                login({ name: f.name.trim(), email: f.email.trim() }, role);
            } catch (error) {
                toast(error.message || "Could not complete signup", "danger");
            } finally {
                setIsSubmitting(false);
            }
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
                            <div className="fg"><label className="fl">Email Id</label><input className="fi2" type="email" placeholder="you@email.com" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>
                            <div className="fg"><label className="fl">Password</label><input className="fi2" type="password" placeholder="Enter your password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></div>
                        </div>
                    )}
                    {step === 3 && !isLogin && (
                        <div className="fi">
                            <div style={{ background: T.goldL, border: `1px solid ${T.gold}44`, borderRadius: 12, padding: 14, marginBottom: 18, display: "flex", gap: 10 }}>
                                <span style={{ fontSize: 20 }}>🛡️</span>
                                <div><div className="df" style={{ fontWeight: 700, fontSize: 14 }}>Aadhar Verification</div><div style={{ fontSize: 13, color: T.inkM, marginTop: 3 }}>Used only for identity. Encrypted &amp; never shared.</div></div>
                            </div>
                            <div className="fg"><label className="fl">Aadhar Number</label><input className="fi2" placeholder="XXXX XXXX XXXX" value={f.aadhar} onChange={e => setF({ ...f, aadhar: e.target.value.replace(/\D/g, "").slice(0, 12) })} style={{ letterSpacing: 2 }} /></div>
                            <div className="fg"><label className="fl">OTP</label><input className="fi2" placeholder="Enter OTP" maxLength={6} value={f.otp} onChange={e => setF({ ...f, otp: e.target.value.replace(/\D/g, "") })} /></div>
                        </div>
                    )}
                    <button className="btn bp" style={{ width: "100%", marginTop: 8 }} onClick={next} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : isLogin ? "Login →" : step === 3 ? "Verify & Complete →" : "Continue →"}
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