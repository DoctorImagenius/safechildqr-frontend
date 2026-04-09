import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { parentAPI } from "../../services/api";
import styles from "./DangerZone.module.css";

export default function DangerZone({ onDeleteSuccess }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await parentAPI.deleteAccount();
      toast.success("Account deleted successfully");
      onDeleteSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
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
              {loading ? "Deleting..." : "Yes, Delete My Account"}
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
  );
}