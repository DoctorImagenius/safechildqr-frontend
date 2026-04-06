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
    navigate("/");
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => navigate("/")}>SafeChild<spane className={styles.qr}>QR</spane></div>
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
              <NavLink
                onClick={() => {
                  handleLogout();
                }}
              >
                <FaSignOutAlt /> Logout
              </NavLink>
            </>
          )}
        </nav>
      </header>

      <div className={styles.bottomNav}>
        {!token ? (
          <>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ""}>
              <FaHome />
            </NavLink>
            <NavLink to="/scanner" className={({ isActive }) => isActive ? styles.active : ""}>
              <FaQrcode />
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? styles.active : ""}>
              <FaSignInAlt />
            </NavLink>
            <NavLink to="/signup" className={({ isActive }) => isActive ? styles.active : ""}>
              <FaUser />
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : ""}>
              <FaTachometerAlt />
            </NavLink>
            <NavLink to="/scanner" className={({ isActive }) => isActive ? styles.active : ""}>
              <FaQrcode />
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? styles.active : ""}>
              <FaCog />
            </NavLink>
            <NavLink
              onClick={() => {
                handleLogout();
              }}
            >
              <FaSignOutAlt />
            </NavLink>
          </>
        )}
      </div>
    </>
  );
};

export default Header;