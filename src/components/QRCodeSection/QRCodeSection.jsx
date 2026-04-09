import { useRef } from "react";
import { FaQrcode, FaDownload } from "react-icons/fa";
import QRCode from "react-qrcode-logo";
import { toast } from "react-toastify";
import styles from "./QRCodeSection.module.css";

export default function QRCodeSection({ qrValue, childName }) {
  const qrRef = useRef(null);

  const downloadQRCode = () => {
    const canvas = qrRef.current?.canvasRef?.current;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${childName || "child"}_SafeChildQR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("QR Code downloaded successfully!");
    } else {
      toast.error("Failed to generate QR code");
    }
  };

  return (
    <div className={styles.infoBox}>
      <h3><FaQrcode /> QR Code</h3>
      <div className={styles.qrContainer}>
        <div className={styles.qrCodeWrapper}>
          <QRCode
            ref={qrRef}
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
  );
}