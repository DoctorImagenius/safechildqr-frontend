import { useState } from "react";
import { 
  FaEye, FaMobileAlt, FaCalendarAlt, 
  FaChartLine, FaGlobe, FaInfoCircle, FaChild,
  FaFilter
} from "react-icons/fa";
import styles from "./ScanHistory.module.css";

export default function ScanHistory({ scans: initialScans, stats: initialStats }) {
  const [scans] = useState(initialScans || []);
  const [stats] = useState(initialStats || null);
  const [selectedChild, setSelectedChild] = useState("all");

  const getUniqueChildren = () => {
    const childrenMap = new Map();
    scans.forEach(scan => {
      if (scan.child?._id && !childrenMap.has(scan.child._id)) {
        childrenMap.set(scan.child._id, {
          _id: scan.child._id,
          name: scan.child.name
        });
      }
    });
    return Array.from(childrenMap.values());
  };

  const filteredScans = selectedChild === "all" 
    ? scans 
    : scans.filter(scan => scan.child?._id === selectedChild);

  const formatDate = (date) => {
    const d = new Date(date);
    d.setHours(d.getHours() + 5);
    return d.toLocaleString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDeviceIcon = (device) => {
    if (!device) return "💻";
    const d = device.toLowerCase();
    if (d.includes('mobile') || d.includes('android') || d.includes('ios')) return "📱";
    return "💻";
  };

  if (!scans.length) {
    return (
      <div className={styles.empty}>
        <FaEye />
        <h4>No scans yet</h4>
        <p>When someone scans your child's QR code, you'll see it here.</p>
      </div>
    );
  }

  const children = getUniqueChildren();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2><FaEye /> Scan History</h2>
        <p>Track when your child's QR code is scanned</p>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <FaChartLine />
          <div>
            <strong>{stats?.total || 0}</strong>
            <span>Total Scans</span>
          </div>
        </div>
        <div className={styles.stat}>
          <FaCalendarAlt />
          <div>
            <strong>{stats?.last7Days || 0}</strong>
            <span>Last 7 Days</span>
          </div>
        </div>
        <div className={styles.stat}>
          <FaCalendarAlt />
          <div>
            <strong>{stats?.last30Days || 0}</strong>
            <span>Last 30 Days</span>
          </div>
        </div>
        <div className={styles.stat}>
          <FaMobileAlt />
          <div>
            <strong>{stats?.uniqueDevices || 0}</strong>
            <span>Unique Devices</span>
          </div>
        </div>
        <div className={styles.stat}>
          <FaGlobe />
          <div>
            <strong>{stats?.uniqueIPs || 0}</strong>
            <span>Unique Locations</span>
          </div>
        </div>
      </div>

      {/* Simple Filter */}
      <div className={styles.filterBar}>
        <div className={styles.filterLabel}>
          <FaFilter /> Filter by Child:
        </div>
        <select 
          value={selectedChild} 
          onChange={(e) => setSelectedChild(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Children ({scans.length})</option>
          {children.map(child => (
            <option key={child._id} value={child._id}>
              {child.name} ({scans.filter(s => s.child?._id === child._id).length})
            </option>
          ))}
        </select>
      </div>

      {/* Scan List */}
      <div className={styles.list}>
        {filteredScans.map((scan, index) => (
          <div key={scan._id} className={styles.item}>
            <div className={styles.number}>#{index + 1}</div>
            <div className={styles.info}>
              <div className={styles.row}>
                <span className={styles.child}>
                  <FaChild /> {scan.child?.name || "Unknown Child"}
                </span>
                <span className={styles.date}>{formatDate(scan.createdAt)}</span>
              </div>
              <div className={styles.meta}>
                <span>{getDeviceIcon(scan.deviceInfo)} {scan.deviceInfo || "Unknown Device"}</span>
                <span>📍 IP: {scan.ipAddress || "Unknown"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className={styles.note}>
        <FaInfoCircle />
        <small>Each scan sends an email alert. IP location is approximate.</small>
      </div>
    </div>
  );
}