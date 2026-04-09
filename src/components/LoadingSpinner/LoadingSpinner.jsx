import styles from "./LoadingSpinner.module.css";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>{message}</p>
    </div>
  );
}