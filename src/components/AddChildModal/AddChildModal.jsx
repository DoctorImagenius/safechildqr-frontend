import { useState } from "react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "./AddChildModal.module.css";

export default function AddChildModal({ isOpen, onClose, onSuccess }) {
  const [gettingLocation, setGettingLocation] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    emergencyMessage: "",
    location: { lat: null, lon: null }
  });

  if (!isOpen) return null;

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          location: {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Name is required");
      return;
    }

    if (!formData.emergencyMessage) {
      toast.error("Emergency message is required");
      return;
    }

    try {
      const submitData = {
        name: formData.name,
        emergencyMessage: formData.emergencyMessage,
      };

      if (formData.age) submitData.age = parseInt(formData.age);
      if (formData.location.lat && formData.location.lon) {
        submitData.location = formData.location;
      }

      await onSuccess(submitData);
      
      setFormData({
        name: "",
        age: "",
        emergencyMessage: "",
        location: { lat: null, lon: null }
      });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Add New Child</h3>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Child Name <span>* Required</span></label>
            <input
              type="text"
              placeholder="Enter child's name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Age <span>(Optional)</span></label>
            <input
              type="number"
              placeholder="1-18"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              min="1"
              max="18"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Emergency Message <span>* Required</span></label>
            <textarea
              placeholder="Message shown when QR is scanned"
              value={formData.emergencyMessage}
              onChange={(e) => setFormData({ ...formData, emergencyMessage: e.target.value })}
              rows="3"
              maxLength="100"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label><FaLocationArrow /> Location <span>(Optional)</span></label>
            <div className={styles.locationWarning}>
              ⚠️ Location is sensitive information - share only if necessary
            </div>

            {formData.location?.lat ? (
              <div className={styles.locationPreview}>
                <p><strong>Latitude:</strong> {formData.location.lat}</p>
                <p><strong>Longitude:</strong> {formData.location.lon}</p>
                <a
                  href={`https://www.google.com/maps?q=${formData.location.lat},${formData.location.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapPreviewLink}
                >
                  View on Google Maps →
                </a>
                <button
                  type="button"
                  className={styles.clearLocationBtn}
                  onClick={() => setFormData({ ...formData, location: { lat: null, lon: null } })}
                >
                  <FaTimes /> Clear Location
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
              This will help finders locate your child's parents more easily
            </small>
          </div>

          <button type="submit" className={styles.submitBtn}>Add Child</button>
        </form>
      </div>
    </div>
  );
}