import { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaPhone, FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./Signup.module.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    emergencyNumber: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.emergencyNumber) {
      toast.error("Please fill in all fields");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    
    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(formData.emergencyNumber)) {
      toast.error("Emergency number must be a valid Pakistani number (03XXXXXXXXX)");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authAPI.signup({
        email: formData.email,
        password: formData.password,
        emergencyNumber: formData.emergencyNumber
      });
      login(response.data.token);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.details?.[0]?.msg || error.response?.data?.message || "Signup failed. Please try again.";
      console.log(error.response?.data?.message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.signupHeader}>
          <div className={styles.logo}>SafeChild<span className={styles.qr}>QR</span></div>
          <h2>Create Account</h2>
          <p>Join us to protect your children</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.inputIcon} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.inputIcon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (8+ chars, strong)"
              value={formData.password}
              onChange={handleChange}
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

          <div className={styles.inputGroup}>
            <FaLock className={styles.inputIcon} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className={styles.inputGroup}>
            <FaPhone className={styles.inputIcon} />
            <input
              type="tel"
              name="emergencyNumber"
              placeholder="Emergency Number (03XXXXXXXXX)"
              value={formData.emergencyNumber}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles.signupBtn} disabled={loading}>
            <FaUserPlus /> {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className={styles.signupFooter}>
          <p>Already have an account? <NavLink to="/login">Login</NavLink></p>
        </div>
      </div>
    </div>
  );
}