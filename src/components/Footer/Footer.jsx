import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";
import {
  FaHeart,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaQrcode,
  FaShieldAlt,
  FaChild,
  FaWhatsapp
} from "react-icons/fa";
import { toast } from "react-toastify";


const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toastAlert = (msg, type = "info") => {
    toast[type](msg);
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.footerContent}>
          
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logo}>
              <span>SafeChild<span className={styles.qr}>QR</span></span>
            </div>
            <p className={styles.tagline}>
              Protecting children through innovative QR technology. 
              Instantly connect lost children with their families.
            </p>
            <div className={styles.safetyBadge}>
              <FaShieldAlt />
              <span>Trusted Safety Platform</span>
            </div>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linksSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><button onClick={scrollToTop} className={styles.backToTop}>
                Home
              </button></li>
              <li><NavLink to="/scanner">QR Scanner</NavLink></li>
              <li><NavLink to="/login">Parent Login</NavLink></li>
              <li><NavLink to="/signup">Create Account</NavLink></li>
              
            </ul>
          </div>

          {/* Features */}
          <div className={styles.linksSection}>
            <h4>Features</h4>
            <ul>
              <li><FaQrcode /> QR Generation</li>
              <li><FaEnvelope /> Email Alerts</li>
              <li><FaWhatsapp /> WhatsApp Integration</li>
              <li><FaMapMarkerAlt /> Location Sharing</li>
              <li><FaChild /> Child Profiles</li>
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.linksSection}>
            <h4>Resources</h4>
            <ul>
              <li onClick={() => toastAlert("Blog section is coming soon. Stay tuned!")}>Blog</li>
              <li onClick={() => toastAlert("Help center is coming soon. Stay tuned!")}>Help Center</li>
              <li onClick={() => toastAlert("Contact support is coming soon. Stay tuned!")}>Contact Support</li>
              <li onClick={() => toastAlert("QR guide is coming soon. Stay tuned!")}>Download QR Guide</li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className={styles.contactSection}>
            <h4>Get in Touch</h4>
            <ul className={styles.contactList}>
              <li>
                <FaEnvelope />
                <a href="mailto:imagenius1001@gmail.com">support@safechildqr.com</a>
              </li>
              <li>
                <FaPhone />
                <a href="tel:+923096995350">+92 309 699 5350</a>
              </li>
              <li>
                <FaMapMarkerAlt />
                <span>Lahore, Pakistan</span>
              </li>
            </ul>
            
          </div>
        </div>

        {/* Newsletter Section */}
        <div className={styles.newsletter}>
          <div className={styles.newsletterContent}>
            <div className={styles.newsletterText}>
              <h4>Stay Updated</h4>
              <p>Get the latest safety tips and updates from SafeChildQR</p>
            </div>
            <form className={styles.newsletterForm} onSubmit={(e) => {
              e.preventDefault();
              toastAlert("Subscribed to newsletter!", "success");
            }}>
              <input type="email" placeholder="Your email address" required/>
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p>&copy; {currentYear} SafeChildQR. All rights reserved.</p>
          <p className={styles.madeWith}>
            Made with <FaHeart /> for child safety worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;