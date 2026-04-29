import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { childAPI, parentAPI } from "../../services/api";
import { toast } from "react-toastify";
import { FaChild, FaEye } from "react-icons/fa";
import WelcomeCard from "../../components/WelcomeCard/WelcomeCard";
import ChildrenSection from "../../components/ChildrenSection/ChildrenSection";
import AddChildModal from "../../components/AddChildModal/AddChildModal";
import ScanHistory from "../../components/ScanHistory/ScanHistory";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [children, setChildren] = useState([]);
  const [scans, setScans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("children");

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const fetchAllData = async () => {
    try {
      const [childrenRes, scansRes] = await Promise.all([
        childAPI.getAll(),
        parentAPI.getScanLogs()
      ]);

      setChildren(childrenRes || []);

      if (scansRes.data.success) {
        setScans(scansRes.data.data);
        setStats(scansRes.data.stats);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (childData) => {
    try {
      await childAPI.add(childData);
      toast.success("Child added successfully");
      fetchAllData();
    }
    catch (error) {
      toast.error("Failed to add child");
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <WelcomeCard user={user} />

        {/* Tab Buttons */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${activeTab === "children" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("children")}
          >
            <FaChild /> My Children
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "scans" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("scans")}
          >
            <FaEye /> Scan History
          </button>
        </div>

        {/* Children Tab */}
        {activeTab === "children" && (
          <ChildrenSection
            children={children}
            onAddChild={() => setShowModal(true)}
          />
        )}

        {/* Scan History Tab */}
        {activeTab === "scans" && (
          <ScanHistory scans={scans} stats={stats} />
        )}
      </div>

      <AddChildModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleAddChild}
      />
    </div>
  );
}