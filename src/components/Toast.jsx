import { useApp } from "../context/AppContext";

export default function Toast() {
  const {notif} = useApp();
  if (!notif) return null;
  return <div className="toast">{notif.msg}</div>;
}