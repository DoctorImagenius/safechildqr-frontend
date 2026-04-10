import styles from "./LoadingSpinner.module.css";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className={styles.loadingContainer}>
      <img 
        src="/assets/web-app-manifest-512x512.png" 
        alt="Loading..." 
        className={styles.spinningLogo}
        loading="eager"
      />
      <p>{message}</p>
    </div>
  );
}