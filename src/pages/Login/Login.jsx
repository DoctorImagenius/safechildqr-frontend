import { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import { toast } from "react-toastify";
import { 
  FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash,
  FaShieldAlt, FaChild, FaQrcode, FaHeartbeat, 
  FaStar, FaHandHoldingHeart, FaUserShield 
} from "react-icons/fa";
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      login(response.data.token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  // Floating icons array
  const floatingIcons = [
    FaShieldAlt, FaChild, FaQrcode, FaHeartbeat, 
    FaStar, FaHandHoldingHeart, FaUserShield, FaStar, 
    FaChild, FaQrcode, FaHeartbeat, FaShieldAlt, FaUserShield, FaHandHoldingHeart, FaStar
  ];

  return (
    <div className={styles.loginContainer}>
      {/* Floating animated elements */}
      <div className={styles.floatingElements}>
        {floatingIcons.map((Icon, index) => (
          <div key={index} className={styles.floatingIcon}>
            <Icon />
          </div>
        ))}
      </div>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logo}>SafeChild<span className={styles.qr}>QR</span></div>
          <h2>Welcome Back</h2>
          <p>Login to manage your children's safety</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.inputIcon} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.inputIcon} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            <FaSignInAlt /> {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>Don't have an account? <NavLink to="/signup">Sign Up</NavLink></p>
        </div>
      </div>
    </div>
  );
}