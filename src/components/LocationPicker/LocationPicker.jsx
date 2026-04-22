import { useState } from "react";
import { FaLocationArrow, FaTimes, FaExternalLinkAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "./LocationPicker.module.css";

export default function LocationPicker({ location, onLocationChange, showWarning = true }) {
  const [gettingLocation, setGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        toast.success("Location captured!");
        setGettingLocation(false);
      },
      (error) => {
        let msg = "Failed to get location";
        if (error.code === 1) msg = "Please allow location access";
        if (error.code === 2) msg = "Location unavailable";
        if (error.code === 3) msg = "Location timeout";
        toast.error(msg);
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const openGoogleMaps = (lat, lon) => {
    window.open(`https://www.google.com/maps?q=${lat},${lon}`, "_blank");
  };

  const clearLocation = () => {
    onLocationChange({ lat: null, lon: null });
    toast.info("Location cleared");
  };

  return (
    <div className={styles.locationField}>
      {showWarning && (
        <div className={styles.locationWarning}>
          ⚠️ Location is sensitive information - share only if necessary
        </div>
      )}

      {location?.lat && location?.lon ? (
        <div className={styles.locationPreview}>
          <p><strong>Home Location Added</strong></p>
          <button
            type="button"
            className={styles.testMapBtn}
            onClick={() => openGoogleMaps(location.lat, location.lon)}
          >
            <FaExternalLinkAlt /> Test Location on Maps
          </button>
          <button
            type="button"
            className={styles.clearLocationBtn}
            onClick={clearLocation}
          >
            <FaTimes /> Remove Location
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={styles.locationBtn}
          onClick={getCurrentLocation}
          disabled={gettingLocation}
        >
          <FaLocationArrow /> {gettingLocation ? "Getting Location..." : "Get Current Location"}
        </button>
      )}
      <small className={styles.locationHint}>
        This will help finders locate your child's home more easily
      </small>
    </div>
  );
}