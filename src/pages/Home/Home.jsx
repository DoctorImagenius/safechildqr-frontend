import styles from "./Home.module.css";
import { NavLink } from "react-router-dom";
import {
  FaShieldAlt,
  FaQrcode,
  FaUserPlus,
  FaChild,
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaGlobe,
  FaMobileAlt,
  FaArrowRight,
  FaCheckCircle,
  FaPhoneAlt
} from "react-icons/fa";

const Home = () => {
  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}></div>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>
              <FaShieldAlt /> Smart Child Safety System
            </span>
            <h1>
              Protect Your Child <br />
              with <span>Smart QR Technology</span>
            </h1>
            <p>
              SafeChildQR instantly connects lost children with their parents.
              One scan = immediate contact + location sharing + email alerts.
            </p>
            <div className={styles.heroButtons}>
              <NavLink to="/signup" className={styles.btnPrimary}>
                <FaUserPlus /> Get Started Free
              </NavLink>
              <NavLink to="/scanner" className={styles.btnSecondary}>
                <FaQrcode /> Try Scanner
              </NavLink>
            </div>
            <div className={styles.heroStats}>
              <div><span>5000+</span> Parents</div>
              <div><span>100%</span> Secure</div>
              <div><span>24/7</span> Protection</div>
            </div>
          </div>
          <div className={styles.heroPreview}>
            <img className={styles.heroImage} src="/assets/web-app-manifest-512x512.png" alt="SafeChildQR Logo"  loading="eager"/>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>How SafeChild<span className={styles.yellow}>QR</span> Works</h2>
            <p>Simple 3-step process to keep your child safe</p>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepIcon}>1</div>
              <FaUserPlus className={styles.stepIconMain} />
              <h3>Create Account</h3>
              <p>Sign up as a parent with your emergency contact number</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>2</div>
              <FaChild className={styles.stepIconMain} />
              <h3>Add Child Profile</h3>
              <p>Enter child's name, age, and emergency message</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>3</div>
              <FaQrcode className={styles.stepIconMain} />
              <h3>Generate & Print QR</h3>
              <p>Get unique QR code for your child's bracelet or bag</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Powerful Safety Features</h2>
            <p>Everything you need to protect your child</p>
          </div>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <FaGlobe />
              <h3>Online + Offline</h3>
              <p>Works with or without internet connection</p>
            </div>
            <div className={styles.feature}>
              <FaEnvelope />
              <h3>Instant Email Alerts</h3>
              <p>Get notified immediately when QR is scanned</p>
            </div>
            <div className={styles.feature}>
              <FaWhatsapp />
              <h3>Direct Contact</h3>
              <p>Call or WhatsApp parent with one tap</p>
            </div>
            <div className={styles.feature}>
              <FaMapMarkerAlt />
              <h3>Location Sharing</h3>
              <p>Finder can share real-time location</p>
            </div>
            <div className={styles.feature}>
              <FaShieldAlt />
              <h3>Privacy First</h3>
              <p>You control what information is shared</p>
            </div>
            <div className={styles.feature}>
              <FaMobileAlt />
              <h3>Mobile Ready</h3>
              <p>Works perfectly on all devices</p>
            </div>
          </div>
        </div>
      </section>

      {/* How Scan Works */}
      <section className={styles.scanFlow}>
        <div className={styles.container}>
          <div className={styles.scanContent}>
            <div className={styles.scanText}>
              <h2>What Happens When Someone Scans?</h2>
              <div className={styles.flowSteps}>
                <div><FaCheckCircle /> Finder scans QR code on child</div>
                <div><FaCheckCircle /> Child info & emergency number appear</div>
                <div><FaCheckCircle /> One tap to call or WhatsApp parent</div>
                <div><FaCheckCircle /> Parent receives instant email alert</div>
                <div><FaCheckCircle /> Location can be shared for quick reunion</div>
              </div>
              <NavLink to="/scanner" className={styles.btnOutline}>
                Test the Scanner <FaArrowRight />
              </NavLink>
            </div>
            <div className={styles.scanPreview}>
              <div className={styles.previewCard}>
                <div className={styles.previewHeader}>
                  <FaQrcode /> QR Code Scanned!
                </div>
                <div className={styles.previewBody}>
                  <p><strong>Child:</strong> Emma Johnson</p>
                  <p><strong>Age:</strong> 7 years</p>
                  <p><strong>Message:</strong> Please help me find my parents</p>
                  <div className={styles.previewActions}>
                    <button><FaPhoneAlt /> Call Parent</button>
                    <button><FaWhatsapp /> WhatsApp</button>
                    <button><FaMapMarkerAlt /> Send Location</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parent Dashboard Preview */}
      <section className={styles.dashboardPreview}>
        <div className={styles.container}>
          <div className={styles.dashboardContent}>
            <div className={styles.dashboardText}>
              <h2>Complete Parent Dashboard</h2>
              <p>Manage all your children from one place</p>
              <ul>
                <li><FaCheckCircle /> Add / edit / delete child profiles</li>
                <li><FaCheckCircle /> Generate & download QR codes</li>
                <li><FaCheckCircle /> View scan history & alerts</li>
                <li><FaCheckCircle /> Update emergency contact (QR auto-regenerates)</li>
                <li><FaCheckCircle /> Real-time location tracking (coming soon)</li>
              </ul>
              <NavLink to="/signup" className={styles.btnPrimary}>
                Create Parent Account
              </NavLink>
            </div>
            <div className={styles.dashboardMock}>
              <div className={styles.mockCard}>
                <div className={styles.mockHeader}>My Children</div>
                <div className={styles.mockChild}>
                  <FaChild /> Emma Johnson <span>View QR →</span>
                </div>
                <div className={styles.mockChild}>
                  <FaChild /> Liam Johnson <span>View QR →</span>
                </div>
                <button className={styles.mockBtn}>+ Add New Child</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Protect Your Child?</h2>
            <p>Join thousands of parents who trust SafeChildQR for their children's safety</p>
            <div className={styles.ctaButtons}>
              <NavLink to="/signup" className={styles.btnPrimary}>
                Sign Up Now <FaArrowRight />
              </NavLink>
              <NavLink to="/scanner" className={styles.btnSecondary}>
                Try Demo Scanner
              </NavLink>
            </div>
            <p className={styles.ctaNote}>✓ Free forever ✓ No credit card required ✓ Cancel anytime</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;