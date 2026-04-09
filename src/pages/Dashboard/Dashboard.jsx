import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { childAPI } from "../../services/api";
import { toast } from "react-toastify";
import { FaPlus, FaChild } from "react-icons/fa";
import WelcomeCard from "../../components/WelcomeCard/WelcomeCard";
import ChildrenList from "../../components/ChildrenList/ChildrenList";
import AddChildModal from "../../components/AddChildModal/AddChildModal";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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

  const handleAddChild = async (childData) => {
    await childAPI.add(childData);
    toast.success("Child added successfully");
    fetchChildren();
  };

    if (loading) {
      return <LoadingSpinner message="Loading your profile..." />;
    }

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <WelcomeCard user={user} />

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3>
              <FaChild className={styles.childIcon} /> My Children ({children.length})
            </h3>
            <button className={styles.addBtn} onClick={() => setShowModal(true)}>
              <FaPlus /> Add Child
            </button>
          </div>

          <ChildrenList children={children} />
        </div>
      </div>

      <AddChildModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleAddChild}
      />
    </div>
  );
}