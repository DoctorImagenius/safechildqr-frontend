import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { parentAPI } from "../../services/api";
import { toast } from "react-toastify";
import { FaUser, FaPhone, FaLock, FaSave, FaTrash, FaSignOutAlt } from "react-icons/fa";
import styles from "./Settings.module.css";

export default function Settings() {
  const { user, setUser, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    emergencyNumber: user?.emergencyNumber || "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await parentAPI.deleteAccount();
      toast.success("Account deleted successfully");
      logout();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className={styles.settings}>
      <div className={styles.container}>
        <div className={styles.settingsHeader}>
          <h2>Settings</h2>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className={styles.settingsGrid}>
          {/* Profile Settings */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <FaUser className={styles.cardIcon} />
              <h3>Profile Information</h3>
            </div>
            <div className={styles.infoRow}>
              <span>Email:</span>
              <strong>{user?.email}</strong>
            </div>
            <p className={styles.infoNote}>Email cannot be changed</p>
          </div>

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
          <div className={`${styles.settingsCard} ${styles.dangerCard}`}>
            <div className={styles.cardHeader}>
              <FaTrash className={styles.cardIcon} />
              <h3>Danger Zone</h3>
            </div>
            <p className={styles.dangerText}>
              Once you delete your account, all your children's data will be permanently deleted.
              This action cannot be undone.
            </p>
            
            {!showDeleteConfirm ? (
              <button 
                className={styles.deleteAccountBtn}
                onClick={() => setShowDeleteConfirm(true)}
              >
                <FaTrash /> Delete Account
              </button>
            ) : (
              <div className={styles.confirmBox}>
                <p>Are you absolutely sure?</p>
                <div className={styles.confirmActions}>
                  <button 
                    className={styles.confirmDelete}
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    Yes, Delete My Account
                  </button>
                  <button 
                    className={styles.cancelDelete}
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

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