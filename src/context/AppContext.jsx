// context/AppContext.jsx
import { createContext, useContext, useState } from "react";
import { JOBS, GIGS_INIT, APPS_INIT } from "../data/data";

const Ctx = createContext();
export const useApp = () => useContext(Ctx);

export const AppProvider = ({ children }) => {
  const [page, setPage] = useState("landing");
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [seekerId, setSeekerId] = useState(null);

  const [jobs, setJobs] = useState(JOBS);
  const [gigs, setGigs] = useState(GIGS_INIT);
  const [applied, setApplied] = useState([]);

  const [applicants, setApplicants] = useState(APPS_INIT);

  const [callModal, setCallModal] = useState(null);
  const [contacted, setContacted] = useState([]);
  
  const [authMode, setAuthMode] = useState("login");
  const [notif, setNotif] = useState(null);
  const toast = (msg, type = "info") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  };

  const nav = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const applyJob = (jobId) => {
    const sid = String(jobId);
    setApplied((p) => (p.some((x) => String(x) === sid) ? p : [...p, sid]));
    toast("Application submitted!", "success");
  };

  const openCall = (name, phone) => {
    setCallModal({ name, phone });
  };

  const closeCall = () => setCallModal(null);

  const viewProfile = () => {
    nav("view-profile");
  };

  const postJob = (data) => {
    setJobs((p) => [
      {
        id: Date.now(),
        title: data.title,
        hirer: user?.name || "You",
        hirerId: "me",
        hirerRating: 4.5,
        posted: "Just now",
        location: data.location,
        duration: data.duration || "—",
        pay: data.pay,
        skills: data.skills || [],
        applicants: 0,
      },
      ...p,
    ]);
    toast("Job posted!", "success");
    nav("hirer-dash");
  };

  const updateApp = (id, st) => {
    setApplicants((p) =>
      p.map((a) =>
        a.id === id
          ? { ...a, status: st === "accepted" ? "accepted" : "declined" }
          : a
      )
    );
    toast(st === "accepted" ? "Accepted!" : "Declined", st === "accepted" ? "success" : "info");
  };

  const login = (u, r) => {
    setUser(u);
    setRole(r);
    setSeekerId(null);
    nav(r === "hirer" ? "hirer-dash" : "seeker-dash");
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setSeekerId(null);
    nav("landing");
  };

  const postGig = (data) => {
    const { backendId, ...rest } = data;
    setGigs((p) => [
      {
        ...rest,
        id: backendId != null ? String(backendId) : String(Date.now()),
        posted: "Just now",
        seeker: user?.name || "You",
        seekerId: seekerId || "me",
      },
      ...p,
    ]);
  };

  const updateGig = (id, patch) => {
    setGigs((p) => p.map((g) => (String(g.id) === String(id) ? { ...g, ...patch } : g)));
  };

  const deleteGig = (id) => {
    setGigs((p) => p.filter((g) => String(g.id) !== String(id)));
  };

  return (
    <Ctx.Provider
      value={{
        page, nav,
        role, setRole,
        user, setUser,
        seekerId, setSeekerId,
        login, logout,
        jobs, setJobs,
        gigs, postGig, updateGig, deleteGig, applicants,
        authMode, setAuthMode,
        notif, toast,
        applied, setApplied,
        applyJob,
        postJob,
        updateApp,
        openCall, closeCall, callModal,
        viewProfile,
        contacted, setContacted,
      }}>
      {children}
    </Ctx.Provider>
  );
  
};
