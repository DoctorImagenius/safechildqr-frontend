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
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [savedLocation, setSavedLocation] = useState(null);

  useEffect(() => {
    const checkPermission = async () => {
      if (!navigator.permissions) return;
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setHasLocationPermission(result.state === 'granted');

        result.addEventListener('change', () => {
          setHasLocationPermission(result.state === 'granted');
          if (result.state !== 'granted') setSavedLocation(null);
        });
      } catch (error) {
        console.warn("Error checking geolocation permission");
      }
    };
    checkPermission();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      if (!hasLocationPermission || savedLocation) return;

      setGettingLocation(true);
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000
          });
        });
        setSavedLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          mapsLink: `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`
        });
      } catch (error) {
        if (error.code === 1) setHasLocationPermission(false);
      } finally {
        setGettingLocation(false);
      }
    };
    getLocation();
  }, [hasLocationPermission, savedLocation]);

  useEffect(() => {
    setScanTime(new Date().toLocaleString());
    const handleOnline = () => {
      setIsOnline(true);
      fetchScanData();
    };
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

  const sendLocationToWhatsApp = (location) => {
    const phone = parentData.emergencyNumber.replace(/^0/, "92");
    const message = encodeURIComponent(
      `🚨 URGENT: Child Location Shared!\n\n` +
      `👶 Child: ${childData?.name || "Unknown"}\n` +
      `📍 Location: ${location.mapsLink}\n` +
      `⏰ Time: ${new Date().toLocaleString()}\n\n` +
      `⚠️ Please come immediately!`
    );
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    const newWindow = window.open(whatsappUrl, "_blank");

    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      toast.success("Permission granted, Now press location button");
    }
  };

  const handleShareLocation = async () => {
    if (!isOnline) {
      toast.warning("Internet connection required");
      return;
    }
    if (!parentData?.emergencyNumber) {
      toast.error("Emergency number not available");
      return;
    }
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }

    if (hasLocationPermission && savedLocation) {
      sendLocationToWhatsApp(savedLocation);
      return;
    }

    setGettingLocation(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000
        });
      });
      const locationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        mapsLink: `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`
      };
      setSavedLocation(locationData);
      setHasLocationPermission(true);
      sendLocationToWhatsApp(locationData);
    } catch (error) {
      if (error.code === 1) {
        toast.error("Location access denied. Please allow location and try again.");
        setHasLocationPermission(false);
      } else if (error.code === 2) {
        toast.error("Location unavailable. Please check your GPS");
      } else if (error.code === 3) {
        toast.error("Location request timed out. Please try again");
      } else {
        toast.error("Unable to get your location");
      }
    } finally {
      setGettingLocation(false);
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
    if (!parentData?.emergencyNumber) return;
    const phoneNumber = parentData.emergencyNumber;
    if (navigator.clipboard?.writeText) {
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

  const extractNumberFromCode = (qrCode) => {
    if (!qrCode) return null;
    try {
      return qrCode.split('+').pop();
    }
    catch (err) {
      return null;
    }
  };

  const fetchScanData = async () => {
    try {
      if (!navigator.onLine) {
        const extractedNumber = extractNumberFromCode(code);
        if (extractedNumber) {
          setParentData({ emergencyNumber: extractedNumber });
          setChildData({
            name: "Child Information Unavailable",
            age: "Unknown",
            emergencyMessage: "Please contact the parent immediately using the number above."
          });
          toast.warning("No internet connection. Showing offline data.");
        }
        setLoading(false);
        return;
      }
      const response = await scanAPI.scan(code);
      setChildData(response.data.child);
      setParentData(response.data.parent);
    } catch (error) {
      setChildData(null)
      setParentData(null)
      toast.warning("No Child Found. Please try again.");
    } finally {
      setLoading(false);
    }
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
        {!isOnline && (
          <div className={styles.offlineBanner}>
            <FaPlaneSlash className={styles.offlineIcon} />
            <div>
              <strong>Offline Mode</strong>
              <p>Showing cached information. Some features may be limited.</p>
            </div>
          </div>
        )}

        <div className={styles.header}>
          <div className={styles.badge}>
            <FaShieldAlt /> Verified Child Safety QR
          </div>
          <h1>Child Safety Profile</h1>
          <p>Scan verified - Please help reunite this child with their family</p>
        </div>

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

            <button className={styles.actionCard} onClick={handleWhatsApp} disabled={!isOnline}>
              <FaWhatsapp className={styles.actionIconWhatsapp} />
              <div>
                <h4>WhatsApp</h4>
                <p>{!isOnline ? "Requires internet" : "Send message"}</p>
              </div>
            </button>

            <button
              className={`${styles.actionCard} ${hasLocationPermission && savedLocation && !gettingLocation ? styles.locationReady : ''}`}
              onClick={handleShareLocation}
              disabled={gettingLocation || !isOnline}
            >
              <FaLocationArrow className={styles.actionIconLocation} />
              <div>
                <h4>
                  {gettingLocation
                    ? "Getting location..."
                    : hasLocationPermission && savedLocation
                      ? "Send Location Now"
                      : "Share Location"}
                </h4>
                <p>
                  {!isOnline
                    ? "Requires internet"
                    : hasLocationPermission && savedLocation
                      ? "⚡ Click to share on WhatsApp"
                      : "Allow location access"}
                </p>
              </div>
            </button>

          </div>

          {hasLocationPermission && savedLocation && (
            <div className={styles.onlineBanner}>
              <div>
                <strong>Permission Granted</strong>
                <p>You can now share your location</p>
              </div>
            </div>
          )}
        </div>

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
                <a href={`https://www.google.com/maps?q=${childData.location.lat},${childData.location.lon}`} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                  <FaGlobe /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        )}

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
                {!isOnline && <p className={styles.offlineNote}>⚠️ Offline Mode</p>}
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