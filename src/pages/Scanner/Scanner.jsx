import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { FaQrcode, FaCamera } from "react-icons/fa";
import styles from "./Scanner.module.css";

export default function Scanner() {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const scanIntervalRef = useRef(null);

  const startScanner = async () => {
    setScanning(true);
    setError(null);
  };

  const stopScanner = () => {
    setScanning(false);
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
  };

  const captureAndScan = () => {
    if (!webcamRef.current || !scanning) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data) {
        // QR code detected!
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current);
        }
        processQRCode(code.data);
      }
    };
  };

  useEffect(() => {
    if (scanning && webcamRef.current) {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      scanIntervalRef.current = setInterval(() => {
        captureAndScan();
      }, 500);
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
    // eslint-disable-next-line
  }, [scanning]);

  const processQRCode = (decodedText) => {
    decodedText = decodedText.split("/scan/")[1];
    stopScanner();
    navigate(`/scan/${decodedText}`);
  };

  const videoConstraints = {
    facingMode: "environment"
  };

  return (
    <div className={styles.scannerPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>

          <div className={styles.title}>
            <FaQrcode className={styles.titleIcon} />
            <h1>Scan QR Code</h1>
          </div>
          <p>Position QR code in front of camera - auto detects!</p>
        </div>

        {/* Scanner Area */}
        <div className={styles.scannerWrapper}>
          {!scanning ? (
            <div className={styles.startContainer}>
              <FaCamera className={styles.cameraIcon} />
              <button onClick={startScanner} className={styles.startBtn}>
                Start Camera
              </button>
              {error && <div className={styles.error}>{error}</div>}
            </div>
          ) : (
            <>
              <div className={styles.videoContainer}>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className={styles.video}
                  mirrored={false}
                />
                <div className={styles.scanOverlay}>
                  <div className={styles.scanFrame}></div>
                  <div className={styles.scanLine}></div>
                </div>
              </div>
              <button onClick={stopScanner} className={styles.stopBtn}>
                Stop Camera
              </button>
              <div className={styles.autoScanText}>
                <FaQrcode /> Auto-scanning... Point camera at QR code
              </div>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className={styles.instructions}>
          <div className={styles.instruction}>
            <div className={styles.bullet}>1</div>
            <div>
              <h4>Click "Start Camera"</h4>
              <p>Allow camera access when prompted</p>
            </div>
          </div>
          <div className={styles.instruction}>
            <div className={styles.bullet}>2</div>
            <div>
              <h4>Point at QR Code</h4>
              <p>Hold the QR code steady in the frame</p>
            </div>
          </div>
          <div className={styles.instruction}>
            <div className={styles.bullet}>3</div>
            <div>
              <h4>Auto Redirect</h4>
              <p>Page will automatically redirect when QR is detected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}