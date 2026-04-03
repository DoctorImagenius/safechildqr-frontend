import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import Settings from "./pages/Settings/Settings";
import ScanPage from "./pages/ScanPage/ScanPage";
import Header from "./components/Header/Header";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {

  const { token } = useContext(AuthContext);

  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/scan/:code" element={<ScanPage />} />
        <Route path="/scanner" element={<ScanPage />} />
        <Route path="/dashboard" element={
          token ? <Dashboard /> : <Navigate to="/login" />
        } />
        <Route path="/settings" element={
          token ? <Settings /> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;