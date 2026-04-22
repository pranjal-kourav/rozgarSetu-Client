// context/AppContext.jsx
import { createContext, useContext, useState } from "react";
import { JOBS, GIGS_INIT, APPS_INIT } from "../data/data";

const Ctx = createContext();
export const useApp = () => useContext(Ctx);

export const AppProvider = ({ children }) => {
  const [page, setPage] = useState("landing");
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  const [jobs, setJobs] = useState(JOBS);
  const [gigs, setGigs] = useState(GIGS_INIT);
  const [applicants, setApplicants] = useState(APPS_INIT);
  
  const [authMode, setAuthMode] = useState("login");
  const [notif, setNotif] = useState(null);
  const [applied, setApplied] = useState([]);

  const nav = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const login = (u, r) => {
    setUser(u);
    setRole(r);
    nav(r === "hirer" ? "hirer-dash" : "seeker-dash");
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    nav("landing");
  };

  return (
    <Ctx.Provider
      value={{
        page, nav,
        role, setRole,
        user, setUser,
        login, logout,
        jobs, gigs, applicants,
        authMode, setAuthMode,
        notif
      }}>
      {children}
    </Ctx.Provider>
  );
  
};