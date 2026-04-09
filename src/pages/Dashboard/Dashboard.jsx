import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { childAPI } from "../../services/api";
import { toast } from "react-toastify";
import { FaChild, FaPlus, FaArrowRight, FaPhone, FaLocationArrow, FaTimes } from "react-icons/fa";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    emergencyMessage: "",
    location: { lat: null, lon: null }
  });

  useEffect(() => {
    if (token) {
      fetchChildren();
    }
  }, [token]);

  const fetchChildren = async () => {
    try {
      const response = await childAPI.getAll();
      setChildren(response || []);
    } catch (error) {
      toast.error("Failed to load children");
    } finally {
      setLoading(false);
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

      await childAPI.add(submitData);
      toast.success("Child added successfully");
      fetchChildren();
      setShowModal(false);
      setFormData({
        name: "",
        age: "",
        emergencyMessage: "",
        location: { lat: null, lon: null }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        {/* Welcome Card */}
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeContent}>
            <div>
              <h2>Welcome back, {user?.email?.split('@')[0]}!</h2>
              <p>Manage your children's safety profiles</p>
            </div>
            <div className={styles.emergencyBadge}>
              <FaPhone />
              <span>{user?.emergencyNumber}</span>
            </div>
          </div>
        </div>

        {/* Children Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3>
              <FaChild className={styles.childIcon} /> My Children ({children.length})
            </h3>
            <button className={styles.addBtn} onClick={() => setShowModal(true)}>
              <FaPlus /> Add Child
            </button>
          </div>

          {children.length === 0 ? (
            <div className={styles.emptyState}>
              <FaChild className={styles.emptyIcon} />
              <p>No children added yet</p>
              <button onClick={() => setShowModal(true)}>Add Your First Child</button>
            </div>
          ) : (
            <>
              {/* Children Table for Desktop */}
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Emergency Message</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {children.map((child) => (
                      <tr key={child._id}>
                        <td>
                          <div className={styles.childCell}>
                            <FaChild className={styles.childBlackIcon} />
                            <span>{child.name}</span>
                          </div>
                        </td>
                        <td>{child.age || "—"}</td>
                        <td>
                          <div className={styles.messageCell}>
                            {child.emergencyMessage?.slice(0, 50)}...
                          </div>
                        </td>
                        <td>
                          <button
                            className={styles.viewBtn}
                            onClick={() => navigate(`/child/${child._id}`)}
                          >
                            View Details <FaArrowRight />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Children Cards for Mobile */}
              <div className={styles.childrenCards}>
                {children.map((child) => (
                  <div key={child._id} className={styles.childCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.childName}>
                        <FaChild />
                        <h4>{child.name}</h4>
                      </div>
                      {child.age && (
                        <div className={styles.childAge}>
                          {child.age} years
                        </div>
                      )}
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.messageSection}>
                        <span className={styles.messageLabel}>Emergency Message</span>
                        <p className={styles.messageText}>
                          {child.emergencyMessage?.slice(0, 80)}
                          {child.emergencyMessage?.length > 80 && "..."}
                        </p>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <button
                        className={styles.viewCardBtn}
                        onClick={() => navigate(`/child/${child._id}`)}
                      >
                        View Details <FaArrowRight />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Modal with Location */}
      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add New Child</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>&times;</button>
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
                  maxLength="100" // Limit to 100 characters
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
      )}
    </div>
  );
}