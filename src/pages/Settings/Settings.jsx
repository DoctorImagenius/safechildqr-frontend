import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { parentAPI } from "../../services/api";
import { toast } from "react-toastify";
import { FaPhone, FaLock, FaSave, FaSignOutAlt } from "react-icons/fa";
import ProfileInfoCard from "../../components/ProfileInfoCard/ProfileInfoCard";
import DangerZone from "../../components/DangerZone/DangerZone";
import styles from "./Settings.module.css";

export default function Settings() {
  const { user, setUser, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    emergencyNumber: user?.emergencyNumber || "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password && formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (formData.emergencyNumber) {
      const phoneRegex = /^03\d{9}$/;
      if (!phoneRegex.test(formData.emergencyNumber)) {
        toast.error("Emergency number must be a valid Pakistani number (03XXXXXXXXX)");
        return;
      }
    }

    setLoading(true);
    try {
      const updateData = {};
      if (formData.emergencyNumber !== user?.emergencyNumber) {
        updateData.emergencyNumber = formData.emergencyNumber;
      }
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      if (Object.keys(updateData).length > 0) {
        await parentAPI.updateProfile(updateData);
        setUser({ ...user, emergencyNumber: formData.emergencyNumber });
        toast.success("Profile updated successfully");
        if (formData.password) {
          toast.info("Please login again with your new password");
          setTimeout(() => logout(), 2000);
        }
      } else {
        toast.info("No changes to update");
      }
    } catch (error) {
      const message = error.response?.data?.details?.[0]?.msg || error.response?.data?.message || "Update failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuccess = () => {
    logout();
  };

  return (
    <div className={styles.settings}>
      <div className={styles.container}>
        <div className={styles.settingsHeader}>
          <h2>Settings</h2>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className={styles.settingsGrid}>
          {/* Profile Information Card */}
          <ProfileInfoCard user={user} />

          {/* Update Form */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <FaSave className={styles.cardIcon} />
              <h3>Update Information</h3>
            </div>
            <form onSubmit={handleUpdate} className={styles.updateForm}>
              <div className={styles.formGroup}>
                <div className={styles.locationWarning}>
                ⚠️ If you change your Number, every QR Code will be changed.
                </div>
                <label>
                  <FaPhone /> Emergency Number
                </label>
                <input
                  type="tel"
                  name="emergencyNumber"
                  placeholder="03XXXXXXXXX"
                  value={formData.emergencyNumber}
                  onChange={handleChange}
                />
                <small>Pakistani mobile number (03XXXXXXXXX)</small>
              </div>

              <div className={styles.formGroup}>
                <label>
                  <FaLock /> New Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Leave blank to keep current"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {formData.password && (
                <div className={styles.formGroup}>
                  <label>
                    <FaLock /> Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              )}

              <button type="submit" className={styles.updateBtn} disabled={loading}>
                <FaSave /> {loading ? "Updating..." : "Update Settings"}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <DangerZone onDeleteSuccess={handleDeleteSuccess} />

          {/* Logout */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <FaSignOutAlt className={styles.cardIcon} />
              <h3>Session</h3>
            </div>
            <button className={styles.logoutBtn} onClick={logout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}