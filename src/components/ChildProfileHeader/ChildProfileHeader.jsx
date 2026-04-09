import { FaChild } from "react-icons/fa";
import styles from "./ChildProfileHeader.module.css";

export default function ChildProfileHeader({ child }) {
  return (
    <div className={styles.profile}>
      <div className={styles.avatar}>
        <FaChild />
      </div>
      <div>
        <h1>{child.name}</h1>
        {child.age && <p>Age: {child.age} years</p>}
      </div>
    </div>
  );
}