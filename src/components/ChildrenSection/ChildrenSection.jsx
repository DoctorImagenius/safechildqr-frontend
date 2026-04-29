import { FaPlus, FaChild } from "react-icons/fa";
import ChildrenList from "../ChildrenList/ChildrenList";
import styles from "./ChildrenSection.module.css";

export default function ChildrenSection({ children, onAddChild }) {
  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeader}>
        <div className={styles.title}>
          <FaChild className={styles.childIcon} />
          <h3>My Children</h3>
          <span className={styles.badge}>{children.length}</span>
        </div>
        <button className={styles.addBtn} onClick={onAddChild}>
          <FaPlus /> Add Child
        </button>
      </div>
      <ChildrenList children={children} />
    </div>
  );
}