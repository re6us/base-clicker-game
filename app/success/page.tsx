"use client";
import styles from "./page.module.css";

export default function Success() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.successMessage}>
          <h1 className={styles.title}>Nice work!</h1>
          <p className={styles.subtitle}>Keep clicking.</p>
        </div>
      </div>
    </div>
  );
}
