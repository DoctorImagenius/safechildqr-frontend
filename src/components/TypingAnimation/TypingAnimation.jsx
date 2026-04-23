import { useState, useEffect } from "react";
import styles from "./TypingAnimation.module.css";

const phrases = [
  "Scan to Rescue",
  "Alert Parents",
  "Share Location",
  "Bring Home Safe",
];

const TypingAnimation = () => {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (isWaiting) return;

    const currentPhrase = phrases[phraseIndex];
    
    if (!isDeleting && charIndex < currentPhrase.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + currentPhrase[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 60);
      return () => clearTimeout(timer);
    } 
    else if (!isDeleting && charIndex === currentPhrase.length) {
      setIsWaiting(true);
      setTimeout(() => {
        setIsDeleting(true);
        setIsWaiting(false);
      }, 2000);
    }
    else if (isDeleting && charIndex > 0) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      }, 40);
      return () => clearTimeout(timer);
    }
    else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex(prev => (prev + 1) % phrases.length);
    }
  }, [charIndex, isDeleting, isWaiting, phraseIndex]);

  return (
    <div className={styles.typingContainer}>
      <div className={styles.typingWrapper}>
        <div className={styles.heroPrefix}>
          <span className={styles.logoText}>SafeChild</span>
          <span className={styles.qrText}>QR</span>
        </div>
        <div className={styles.typingBox}>
          <span className={styles.typingLabel}>helps you</span>
          <span className={styles.typingText}>{displayText}</span>
          <span className={styles.cursor}>|</span>
        </div>
      </div>
    </div>
  );
};

export default TypingAnimation;