import React from "react";

import styles from "./template.module.css";
import Footer from "./components/Footer";
import Main from "./components/Main";

export default function Page() {
  return (
    <div className="absolute w-screen h-screen">
      <div className={styles.container}>
        <Main />
        <Footer />
      </div>
    </div>
  );
}
