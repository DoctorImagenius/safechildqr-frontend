import { FaUser } from "react-icons/fa";
import styles from "./ProfileInfoCard.module.css";

export default function ProfileInfoCard({ user }) {
  return (
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
  );
}