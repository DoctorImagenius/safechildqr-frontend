import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <h1>SafeChildQR</h1>
      <p>Protect your child with QR-based safety system</p>

      <div className={styles.actions}>
        <Link to="/scanner" className="btn btn-primary">
          Scan QR
        </Link>

        <Link to="/signup" className="btn">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;