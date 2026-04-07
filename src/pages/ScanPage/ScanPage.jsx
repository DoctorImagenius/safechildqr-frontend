import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { scanAPI } from "../../services/api";
import { toast } from "react-toastify";
import {
  FaChild,
  FaPhoneAlt,
  FaWhatsapp,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaUserFriends,
  FaMobileAlt,
  FaCopy,
  FaCheck,
  FaShieldAlt,
  FaGlobe,
  FaInfoCircle,
} from "react-icons/fa";
import styles from "./ScanPage.module.css";

export default function ScanPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [childData, setChildData] = useState(null);
  const [parentData, setParentData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [scanTime, setScanTime] = useState(null);

  useEffect(() => {
    setScanTime(new Date().toLocaleString());
    fetchScanData();
    // eslint-disable-next-line
  }, [code]);

  const fetchScanData = async () => {
    try {
      const response = await scanAPI.scan(code);
      setChildData(response.data.child);
      setParentData(response.data.parent);
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Invalid QR code");
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (parentData?.emergencyNumber) {
      window.location.href = `tel:${parentData.emergencyNumber}`;
    } else {
      toast.error("Emergency number not available");
    }
  };

  const handleWhatsApp = () => {
    if (!parentData?.emergencyNumber) {
      toast.error("Emergency number not available");
      return;
    }

    const phone = parentData.emergencyNumber.replace(/^0/, "92");

    const message = encodeURIComponent(
      `🚨 EMERGENCY ALERT: Lost Child Found!\n\n` +
      `👶 Child Name: ${childData?.name || "Unknown"}\n` +
      `📅 Age: ${childData?.age || "Not specified"}\n` +
      `⏰ Time: ${new Date().toLocaleString()}\n\n` +
      `⚠️ Please respond immediately!`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

const handleShareLocation = async () => {
  if (gettingLocation) return;

  if (!navigator.geolocation) {
    toast.error("Geolocation not supported on this device");
    return;
  }
  
  const phone = parentData.emergencyNumber.replace(/^0/, "92");

  setGettingLocation(true);

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        maximumAge: 0
      });
    });

    const { latitude, longitude } = position.coords;
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const message = encodeURIComponent(
      `🚨 URGENT: Child Location Shared!\n\n` +
      `👶 Child: ${childData?.name || "Unknown"}\n` +
      `📍 Location: ${mapsLink}\n` +
      `⏰ Time: ${new Date().toLocaleString()}\n\n` +
      `⚠️ Please come immediately!`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  } catch (error) {
    if (error.code === 1) {
      toast.error("Location permission denied");
    } else {
      toast.error("Unable to get location");
    }
  } finally {
    setGettingLocation(false);
  }
};

  const handleCopyNumber = () => {
    if (parentData?.emergencyNumber) {
      const phoneNumber = parentData.emergencyNumber;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phoneNumber)
          .then(() => {
            setCopied(true);
            toast.success("Emergency number copied!");
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(() => fallbackCopy(phoneNumber));
      } else {
        fallbackCopy(phoneNumber);
      }
    }
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      toast.success("Number copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.info("Tap and hold the number to copy");
    }
    document.body.removeChild(textarea);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading child information...</p>
        <p className={styles.loadingSub}>Please wait while we fetch details</p>
      </div>
    );
  }

  if (!childData) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <h2>Invalid QR Code</h2>
        <p>This QR code is not recognized.</p>
        <button onClick={() => navigate("/")} className={styles.homeBtn}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className={styles.scanPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <FaShieldAlt /> Verified Child Safety QR
          </div>
          <h1>Child Safety Profile</h1>
          <p>Scan verified - Please help reunite this child with their family</p>
        </div>

        {/* Quick Actions */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <FaPhoneAlt /> Quick Actions
          </div>
          <div className={styles.actionGrid}>
            <button className={styles.actionCard} onClick={handleCall}>
              <FaPhoneAlt className={styles.actionIconCall} />
              <div>
                <h4>Call Parent</h4>
                <p>Direct emergency call</p>
              </div>
            </button>

            <button className={styles.actionCard} onClick={handleWhatsApp}>
              <FaWhatsapp className={styles.actionIconWhatsapp} />
              <div>
                <h4>WhatsApp</h4>
                <p>Send message</p>
              </div>
            </button>

            <button
              className={styles.actionCard}
              onClick={handleShareLocation}
              disabled={gettingLocation}
            >
              <FaLocationArrow className={styles.actionIconLocation} />
              <div>
                <h4>{gettingLocation ? "Waiting for permission..." : "Share Location"}</h4>
                <p>Send current location</p>
              </div>
            </button>
          </div>
        </div>

        {/* Home Location Section */}
        {childData.location?.lat && childData.location?.lon && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <FaMapMarkerAlt /> Home Location
            </div>
            <div className={styles.locationCard}>
              <div className={styles.locationInfo}>
                <div className={styles.coordinates}>
                  <span>Latitude: {childData.location.lat}</span>
                  <span>Longitude: {childData.location.lon}</span>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${childData.location.lat},${childData.location.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  <FaGlobe /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Child Profile Section */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <FaChild /> Child Information
          </div>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>
                <FaChild />
              </div>
              <div className={styles.profileName}>
                <h2>{childData.name}</h2>
                <p>Child ID: ...{code?.split("+")[0]?.slice(-6) || "N/A"}</p>
              </div>
            </div>
            <div className={styles.profileDetails}>
              <div className={styles.detailRow}>
                <span>Age:</span>
                <strong>{childData.age ? `${childData.age} years` : "Not specified"}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Scan Time:</span>
                <strong>{scanTime}</strong>
              </div>
              <div className={styles.detailRow}>
                <span>Status:</span>
                <strong className={styles.statusBadge}>Found - Awaiting Reunion</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Parent Contact Section */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <FaUserFriends /> Parent Contact
          </div>
          <div className={styles.contactCard}>
            <div className={styles.contactInfo}>
              <div className={styles.contactNumberWrapper}>
                <span className={styles.contactLabel}>Emergency Number</span>
                <div className={styles.contactNumber}>
                  <FaMobileAlt />
                  <span>{parentData?.emergencyNumber || "Not available"}</span>
                  {parentData?.emergencyNumber && (
                    <button onClick={handleCopyNumber} className={styles.copyBtn}>
                      {copied ? <FaCheck /> : <FaCopy />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  )}
                </div>
              </div>
              <p className={styles.contactNote}>
                <FaInfoCircle /> Parent will receive email alert with your approximate location and device info
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Message Section */}
        {childData.emergencyMessage && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <FaInfoCircle /> Emergency Message
            </div>
            <div className={styles.messageCard}>
              <div className={styles.messageIconWrapper}>
              </div>
              <p>{childData.emergencyMessage}</p>
            </div>
          </div>
        )}
        {/* Footer Note */}
        <div className={styles.footerNote}>
          <FaShieldAlt />
          <p>This is a verified SafeChildQR profile. All information is secure and shared only for child safety purposes.</p>
        </div>
      </div>
    </div>
  );
}