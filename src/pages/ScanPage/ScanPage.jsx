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
  FaWifi,
  FaPlaneSlash
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
  const [isOnline, setIsOnline] = useState(navigator.onLine);


  const [locationPermission, setLocationPermission] = useState(null);
  const [waitingForLocation, setWaitingForLocation] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (!navigator.permissions) return;

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setLocationPermission(result.state);

      result.addEventListener('change', () => {
        setLocationPermission(result.state);
      });
    } catch (error) {
      console.error("Permission check error:", error);
    }
  };

  const handleShareLocation = async () => {
    if (gettingLocation) return;

    if (!isOnline) {
      toast.warning("Location sharing requires internet connection");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation not supported on this device");
      return;
    }

    // If permission is already granted, proceed directly
    if (locationPermission === 'granted') {
      await getLocationAndShare();
      return;
    }

    // If permission not granted yet, request with user feedback
    setWaitingForLocation(true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          maximumAge: 0
        });
      });

      // Permission granted, now update status and proceed
      setLocationPermission('granted');
      await shareLocationWithPosition(position);

    } catch (error) {
      if (error.code === 1) {
        toast.error("Location permission denied. Please enable location access in your browser settings.");
        setLocationPermission('denied');
      } else {
        toast.error("Unable to get location");
      }
    } finally {
      setWaitingForLocation(false);
    }
  };

  const getLocationAndShare = async () => {
    setGettingLocation(true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          maximumAge: 0
        });
      });

      await shareLocationWithPosition(position);
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

  const shareLocationWithPosition = async (position) => {
    const { latitude, longitude } = position.coords;
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const phone = parentData.emergencyNumber.replace(/^0/, "92");

    const message = encodeURIComponent(
      `🚨 URGENT: Child Location Shared!\n\n` +
      `👶 Child: ${childData?.name || "Unknown"}\n` +
      `📍 Location: ${mapsLink}\n` +
      `⏰ Time: ${new Date().toLocaleString()}\n\n` +
      `⚠️ Please come immediately!`
    );

    // Small delay to ensure everything is ready
    setTimeout(() => {
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    }, 100);
  };



  useEffect(() => {
    setScanTime(new Date().toLocaleString());

    // Check if online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    fetchScanData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
    // eslint-disable-next-line
  }, [code]);

  const fetchScanData = async () => {
    // Check if online
    if (!navigator.onLine) {
      setLoading(false);
      // Try to extract number from QR code for offline mode
      const extractedNumber = extractNumberFromCode(code);
      if (extractedNumber) {
        setParentData({ emergencyNumber: extractedNumber });
        setChildData({
          name: "Child Information Unavailable",
          age: "Unknown",
          emergencyMessage: "Please contact the parent immediately using the number above."
        });
      }
      return;
    }

    try {
      const response = await scanAPI.scan(code);
      setChildData(response.data.child);
      setParentData(response.data.parent);
    } catch (error) {
      console.error("Scan error:", error);

      // Try offline fallback
      const extractedNumber = extractNumberFromCode(code);
      if (extractedNumber) {
        setParentData({ emergencyNumber: extractedNumber });
        setChildData({
          name: "Child Information Unavailable (Offline Mode)",
          age: "Unknown",
          emergencyMessage: "No internet connection. Please contact the parent/guardian using the number below."
        });
        toast.warning("No internet connection. Showing offline data.");
      } else {
        toast.error("Invalid QR code or no internet connection");
        setChildData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Extract phone number from QR code
  const extractNumberFromCode = (qrCode) => {
    if (!qrCode) return null;
    // Try to find a phone number pattern in the QR code
    const phonePattern = /(\+?92|0)?[0-9]{10,13}/g;
    const matches = qrCode.match(phonePattern);
    if (matches && matches.length > 0) {
      let number = matches[0];
      // Format number for Pakistan
      if (number.startsWith('0')) {
        number = '92' + number.substring(1);
      } else if (!number.startsWith('+')) {
        number = '+' + number;
      }
      return number;
    }
    return null;
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

    // Extra check for offline
    if (!isOnline) {
      toast.warning("WhatsApp requires internet connection. Please call the parent directly.");
      return;
    }

    const phone = parentData.emergencyNumber.replace(/^0/, "92").replace(/^\+/, "");

    const message = encodeURIComponent(
      `🚨 EMERGENCY ALERT: Lost Child Found!\n\n` +
      `👶 Child Name: ${childData?.name || "Unknown"}\n` +
      `📅 Age: ${childData?.age || "Not specified"}\n` +
      `⏰ Time: ${new Date().toLocaleString()}\n\n` +
      `⚠️ Please respond immediately!`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
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

  if (!childData && !parentData) {
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
        {/* Offline Banner */}
        {!isOnline && (
          <div className={styles.offlineBanner}>
            <FaPlaneSlash className={styles.offlineIcon} />
            <div>
              <strong>Offline Mode</strong>
              <p>Showing cached information. Some features may be limited.</p>
            </div>
          </div>
        )}

        {isOnline && (
          <div className={styles.onlineBanner}>
            <FaWifi className={styles.onlineIcon} />
            <div>
              <strong>Online Mode</strong>
              <p>Full features available</p>
            </div>
          </div>
        )}

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
            {/* Call Button - ALWAYS enabled */}
            <button className={styles.actionCard} onClick={handleCall}>
              <FaPhoneAlt className={styles.actionIconCall} />
              <div>
                <h4>Call Parent</h4>
                <p>Direct emergency call</p>
              </div>
            </button>

            {/* WhatsApp Button - Disabled in offline mode */}
            <button
              className={styles.actionCard}
              onClick={handleWhatsApp}
              disabled={!isOnline}
            >
              <FaWhatsapp className={styles.actionIconWhatsapp} />
              <div>
                <h4>WhatsApp</h4>
                <p>{!isOnline ? "Requires internet" : "Send message"}</p>
              </div>
            </button>

            {/* Location Button with dynamic text */}
            <button
              className={styles.actionCard}
              onClick={handleShareLocation}
              disabled={gettingLocation || waitingForLocation || !isOnline}
            >
              <FaLocationArrow className={styles.actionIconLocation} />
              <div>
                <h4>
                  {gettingLocation
                    ? "Getting location..."
                    : waitingForLocation
                      ? "Allow location access..."
                      : "Share Location"}
                </h4>
                <p>
                  {!isOnline
                    ? "Requires internet"
                    : locationPermission === 'granted'
                      ? "Send current location"
                      : locationPermission === 'denied'
                        ? "Location access blocked"
                        : "Allow location to share"}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Home Location Section - Only show if online and has location */}
        {isOnline && childData?.location?.lat && childData?.location?.lon && (
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
                <h2>{childData?.name || "Information Unavailable"}</h2>
                {!isOnline && (
                  <p className={styles.offlineNote}>⚠️ Offline Mode</p>
                )}
                {childData?.name && !childData?.name.includes("Unavailable") && (
                  <p>Child ID: ...{code?.split("+")[0]?.slice(-6) || "N/A"}</p>
                )}
              </div>
            </div>
            <div className={styles.profileDetails}>
              <div className={styles.detailRow}>
                <span>Age:</span>
                <strong>{childData?.age ? `${childData.age} years` : "Not specified"}</strong>
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
                <FaInfoCircle />
                {isOnline
                  ? "Parent will receive email alert with your approximate location and device info"
                  : "Please contact the number above immediately. This is an emergency situation."}
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Message Section */}
        {childData?.emergencyMessage && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <FaInfoCircle /> Emergency Message
            </div>
            <div className={styles.messageCard}>
              <p>{childData.emergencyMessage}</p>
            </div>
          </div>
        )}

        {/* Offline Emergency Instructions */}
        {!isOnline && !childData?.emergencyMessage && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <FaInfoCircle /> Emergency Instructions
            </div>
            <div className={styles.messageCard}>
              <p>
                ⚠️ You are currently offline. Please call the parent/guardian
                immediately using the number above. If the call doesn't connect,
                please take the child to the nearest police station or safe location.
              </p>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className={styles.footerNote}>
          <FaShieldAlt />
          <p>
            {isOnline
              ? "This is a verified SafeChildQR profile. All information is secure and shared only for child safety purposes."
              : "You're viewing offline data. Please ensure you contact the parent/guardian as soon as possible."}
          </p>
        </div>
      </div>
    </div>
  );
}