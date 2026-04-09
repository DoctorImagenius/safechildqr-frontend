import { FaPhone } from "react-icons/fa";
import styles from "./WelcomeCard.module.css";

export default function WelcomeCard({ user }) {
  return (
    <div className={styles.welcomeCard}>
      <div className={styles.welcomeContent}>
        <div>
          <h2>Welcome back, <span className={styles.welcomeName}>{user?.email?.split('@')[0]}</span></h2>
          <p>Manage your children's safety profiles</p>
        </div>
        <div className={styles.emergencyBadge}>
          <FaPhone />
          <span>{user?.emergencyNumber}</span>
        </div>
      </div>
    </div>
  );
}