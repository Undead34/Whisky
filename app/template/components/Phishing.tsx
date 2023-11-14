import styles from "./styles/template.module.css";

export default function Phishing() {
  return (
    <div role="button" tabIndex={0} className={styles["phishing-container"]}>
      <p>
        Evite ser victima de PHISHING. Verifica la fuente de información de tus
        correos entrantes. Introduce tus datos confidenciales únicamente en webs
        seguras. Ante la mínima duda se prudente y no te arriesgues. Infórmate
        periódicamente sobre la evolución del malware.
      </p>
    </div>
  );
}
