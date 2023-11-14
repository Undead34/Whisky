import styles from "./styles/template.module.css";
import Key from "./images/key.svg";
import Image from "next/image";

export default function Options() {
  return (
    <div role="button" tabIndex={0} className={styles["options-container"]}>
      <div className={styles["options-text"]}>
        <Image width={32} height={32} src={Key} alt="Option Key" />
        <div className="pl-3 text-[15px]">Opciones de inicio de sesión</div>
      </div>
    </div>
  );
}
