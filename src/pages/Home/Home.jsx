import styles from "./Home.module.css";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>SafeChildQR</h1>
        <p>Protect and track your children with QR codes. Easy, fast, and safe.</p>
        <div className={styles.buttons}>
          <NavLink to="/signup" className={styles.cta}>Sign Up</NavLink>
          <NavLink to="/login" className={styles.ctaSecondary}>Login</NavLink>
          <NavLink to="/scanner" className={styles.cta}>Scan QR</NavLink>
        </div>
      </section>
    </div>
  );
};

export default Home;