import styles from "./LoadingSpinner.module.css";
import logoImg from "./logo.png";
export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className={styles.loadingContainer}>
      <img 
        src={logoImg}
        alt="Loading..." 
        className={styles.spinningLogo}
      />
      <p>{message}</p>
    </div>
  );
}