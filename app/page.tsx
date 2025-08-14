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
      <div className={styles.sub}>Your career North Star.</div>
      {/* button to dashboard */}
      <div
        className={`button glass`}
        onClick={() => router.push("/intake-form")}
      >
        get started
      </div>
    </div>
  );
}
