import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";
import { FaHome, FaArrowLeft, FaQrcode, FaChild, FaShieldAlt } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Page Not Found | SafeChildQR";
  }, []);

  return (
    <div className={styles.notFound}>
      <div className={styles.container}>
        <div className={styles.bgElements}>
          <div className={styles.bgCircle1}></div>
          <div className={styles.bgCircle2}></div>
          <div className={styles.bgCircle3}></div>
        </div>

        <div className={styles.content}>
          <div className={styles.errorCode}>
            <span className={styles.code4}>4</span>
            <span className={styles.code0}>0</span>
            <span className={styles.code4last}>4</span>
          </div>
          
          <div className={styles.iconWrapper}>
            <FaChild className={styles.iconChild} />
            <FaQrcode className={styles.iconQr} />
            <FaShieldAlt className={styles.iconShield} />
          </div>

          <h1>Oops! Page Not Found</h1>
          <p>
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to safety.
          </p>

          <div className={styles.buttonGroup}>
            <button onClick={() => navigate(-1)} className={styles.btnSecondary}>
              <FaArrowLeft /> Go Back
            </button>
            <button onClick={() => navigate("/")} className={styles.btnPrimary}>
              <FaHome /> Back to Home
            </button>
          </div>

          <div className={styles.suggestionBox}>
            <h4>You might be looking for:</h4>
            <div className={styles.suggestionLinks}>
              <button onClick={() => navigate("/scanner")}>
                <FaQrcode /> QR Scanner
              </button>
              <button onClick={() => navigate("/login")}>
                Parent Login
              </button>
              <button onClick={() => navigate("/signup")}>
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;