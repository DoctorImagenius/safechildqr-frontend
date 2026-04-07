import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaHome, FaUser, FaQrcode, FaTachometerAlt, FaCog, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import styles from "./Header.module.css";

const Header = () => {

  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true }); // Use replace to clear history
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => navigate("/")}>SafeChild<span className={styles.qr}>QR</span></div>
        <nav className={styles.nav}>
          {!token ? (
            <>
              <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ""}>
                <FaHome /> Home
              </NavLink>
              <NavLink to="/scanner" className={({ isActive }) => isActive ? styles.active : ""}>
                <FaQrcode /> Scan
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => isActive ? styles.active : ""}>
                <FaSignInAlt /> Login
              </NavLink>
              <NavLink to="/signup" className={({ isActive }) => isActive ? styles.active : ""}>
                <FaUser /> Signup
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : ""}>
                <FaTachometerAlt /> Dashboard
              </NavLink>
              <NavLink to="/scanner" className={({ isActive }) => isActive ? styles.active : ""}>
                <FaQrcode /> Scan
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => isActive ? styles.active : ""}>
                <FaCog /> Settings
              </NavLink>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                <FaSignOutAlt /> Logout
              </button>
            </>
          )}
        </nav>
      </header>

      <div className={styles.bottomNav}>
        {!token ? (
          <>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ""}>
              <FaHome />
              <span>Home</span>
            </NavLink>
            <NavLink to="/scanner" className={({ isActive }) => isActive ? styles.active : ""}>
              <FaQrcode />
              <span>Scan</span>
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? styles.active : ""}>
              <FaSignInAlt />
              <span>Login</span>
            </NavLink>
            <NavLink to="/signup" className={({ isActive }) => isActive ? styles.active : ""}>
              <FaUser />
              <span>Signup</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : ""}>
              <FaTachometerAlt />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/scanner" className={({ isActive }) => isActive ? styles.active : ""}>
              <FaQrcode />
              <span>Scan</span>
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? styles.active : ""}>
              <FaCog />
              <span>Settings</span>
            </NavLink>
            <button onClick={handleLogout} className={styles.logoutBottomBtn}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Header;