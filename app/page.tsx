"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <img src="/logo.png" alt="POLARIS" className={styles.logo}></img>
      <div className={styles.sub}>
        Take the guesswork out of your career decisions.
      </div>
      {/* button to dashboard */}
      <div
        className={`${styles.button} glass`}
        onClick={() => router.push("/dashboard")}
      >
        get started
      </div>
    </div>
  );
}
