// App.jsx
import { AppProvider } from "./context/AppContext";

import GlobalStyles from "./components/GlobalStyles";
import Navbar from "./components/Navbar";
import Router from "./components/Router";
import Toast from "./components/Toast";
import CallModal from "./components/CallModal";

export default function App() {
  return (
    <AppProvider>
      <GlobalStyles />
      <Toast />
      <CallModal />
      <Navbar />

      <main>
        <Router />
      </main>
    </AppProvider>
  );
}