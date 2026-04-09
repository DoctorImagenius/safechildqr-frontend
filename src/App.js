import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import Settings from "./pages/Settings/Settings";
import Scanner from "./pages/Scanner/Scanner";
import ScanPage from "./pages/ScanPage/ScanPage";
import ChildDetails from "./pages/ChildDetails/ChildDetails";
import Header from "./components/Header/Header";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

function App() {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <Router>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="/scan/:code" element={<ScanPage />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/child/:id" element={token ? <ChildDetails /> : <Navigate to="/login" />} />
        <Route path="/settings" element={token ? <Settings /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;