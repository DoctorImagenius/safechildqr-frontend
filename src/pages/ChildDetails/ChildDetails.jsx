import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { childAPI } from "../../services/api";
import { toast } from "react-toastify";
import {
  FaChild, FaEdit, FaTrash, FaArrowLeft, FaSave,
  FaTimes, FaMapMarkerAlt, FaLocationArrow, FaExternalLinkAlt,
  FaQrcode, FaDownload
} from "react-icons/fa";
import QRCode from "react-qrcode-logo";
import styles from "./ChildDetails.module.css";
import { AuthContext } from "../../context/AuthContext";


export default function ChildDetails() {

  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    emergencyMessage: "",
    location: { lat: null, lon: null }
  });

  useEffect(() => {
    fetchChild();
    // eslint-disable-next-line
  }, [id]);

  const fetchChild = async () => {
    try {
      const res = await childAPI.getOne(id);
      setChild(res.data);
      setFormData({
        name: res.data.name || "",
        age: res.data.age || "",
        emergencyMessage: res.data.emergencyMessage || "",
        location: res.data.location || { lat: null, lon: null }
      });
      const qrCodeValue = `${process.env.REACT_APP_WEB_URL}/scan/${res.data._id}+${user.emergencyNumber}`;
      setQrValue(qrCodeValue);
    } catch (error) {
      toast.error("Failed to load child");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };


  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-code-canvas");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${child?.name || "child"}_SafeChildQR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("QR Code downloaded successfully!");
    } else {
      toast.error("Failed to generate QR code");
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setFormData({
          ...formData,
          location: newLocation
        });
        toast.success("Location captured! You can now save it.");
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
      const updateData = {};
      if (formData.name) updateData.name = formData.name;
      if (formData.age) updateData.age = parseInt(formData.age);
      if (formData.emergencyMessage) updateData.emergencyMessage = formData.emergencyMessage;
      if (formData.location && formData.location.lat && formData.location.lon) {
        updateData.location = formData.location;
      } else {
        updateData.location = { lat: null, lon: null };
      }

      await childAPI.update(id, updateData);
      toast.success("Updated successfully");
      setIsEditing(false);
      fetchChild();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this child? This cannot be undone.")) {
      setLoading(true);
      try {
        await childAPI.delete(id);
        toast.success("Deleted successfully");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Delete failed");
      }
      finally {
        setLoading(false);
      }
    }
  };

  const openGoogleMaps = (lat, lon) => {
    window.open(`https://www.google.com/maps?q=${lat},${lon}`, "_blank");
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!child) return <div className={styles.loading}>Not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
            <FaArrowLeft /> Back
          </button>
          {!isEditing && (
            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit
              </button>
              <button className={styles.deleteBtn} onClick={handleDelete}>
                <FaTrash /> Delete
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          /* View Mode */
          <div className={styles.viewMode}>
            <div className={styles.profile}>
              <div className={styles.avatar}>
                <FaChild />
              </div>
              <div>
                <h1>{child.name}</h1>
                {child.age && <p>Age: {child.age} years</p>}
              </div>
            </div>

            <div className={styles.infoBox}>
              <h3>Emergency Message</h3>
              <p>{child.emergencyMessage}</p>
            </div>

            {child.location?.lat && child.location?.lon && (
              <div className={styles.infoBox}>
                <h3><FaMapMarkerAlt /> Location</h3>
                <div className={styles.locationDisplay}>
                  <p><strong>Latitude:</strong> {child.location.lat}</p>
                  <p><strong>Longitude:</strong> {child.location.lon}</p>
                  <button
                    className={styles.mapButton}
                    onClick={() => openGoogleMaps(child.location.lat, child.location.lon)}
                  >
                    <FaExternalLinkAlt /> Open in Google Maps
                  </button>
                </div>
              </div>
            )}

            <div className={styles.infoBox}>
              <h3><FaQrcode /> QR Code</h3>
              <div className={styles.qrContainer}>
                <div className={styles.qrCodeWrapper}>
                  <QRCode
                    id="qr-code-canvas"
                    value={qrValue}
                    size={180}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className={styles.qrInfo}>
                  <p className={styles.qrText}>
                    <strong>Scan Code:</strong> {qrValue}
                  </p>
                  <p className={styles.qrHint}>
                    This QR code contains: <strong>Child ID + Emergency Number</strong>
                  </p>

                  <button
                    className={styles.downloadQrBtn}
                    onClick={downloadQRCode}
                  >
                    <FaDownload /> Download QR Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className={styles.editMode}>
            <h2>Edit Child</h2>

            <div className={styles.field}>
              <label>Name <span>* Required</span></label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Child's name"
                required
              />
            </div>

            <div className={styles.field}>
              <label>Age <span>(Optional)</span></label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="1-18"
                min="1"
                max="18"
              />
            </div>

            <div className={styles.field}>
              <label>Emergency Message <span>* Required</span></label>
              <textarea
                value={formData.emergencyMessage}
                onChange={(e) => setFormData({ ...formData, emergencyMessage: e.target.value })}
                rows="3"
                required
              />
            </div>

            <div className={styles.field}>
              <label><FaMapMarkerAlt /> Location <span>(Optional)</span></label>
              <div className={styles.locationWarning}>
                ⚠️ Location is sensitive information - share only if necessary for child's safety
              </div>

              {formData.location?.lat && formData.location?.lon ? (
                <div className={styles.locationPreview}>
                  <p><strong>Latitude:</strong> {formData.location.lat}</p>
                  <p><strong>Longitude:</strong> {formData.location.lon}</p>
                  <button
                    type="button"
                    className={styles.testMapBtn}
                    onClick={() => openGoogleMaps(formData.location.lat, formData.location.lon)}
                  >
                    Test Location on Maps
                  </button>
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
                This will help finders locate your child's home more easily
              </small>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className={styles.saveBtn}>
                <FaSave /> Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}