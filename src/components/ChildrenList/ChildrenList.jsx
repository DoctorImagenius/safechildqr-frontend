import { FaChild, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./ChildrenList.module.css";

export default function ChildrenList({ children }) {
  const navigate = useNavigate();

  if (children.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FaChild className={styles.emptyIcon} />
        <p>No children added yet</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
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

      {/* Mobile Cards View */}
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
  );
}