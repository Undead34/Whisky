import Image from "next/image";
import styles from "./styles/Home.module.css";

// Images
import MicrosoftLogo from "./static/images/microsoft-logo.svg";
import NetReadyLogo from "./static/images/netready-logo.png";
import Key from "./static/images/key-icon.svg";
import LoginForm from "./login-form";

type TSearchParams = {
  searchParams?: {
    company?: string;
    view?: "email" | "password";
  };
};

export default async function Main({ searchParams }: TSearchParams) {
  const isCompany = searchParams?.company === "true" || false;
  const view = searchParams?.view || "email";

  return (
    <main className="flex flex-1 flex-col justify-center">
      <div className={styles["form-microsoft-container"]}>
        <div>
          <Image
            width={108}
            height={24}
            src={
              view === "email"
                ? MicrosoftLogo
                : isCompany
                ? NetReadyLogo
                : MicrosoftLogo
            }
            alt="Microsoft Logo"
          />
        </div>
        
        <LoginForm />
      </div>

      {view === "email" && (
        <div role="button" tabIndex={0} className={styles["options-container"]}>
          <div className={styles["options-text"]}>
            <Image width={32} height={32} src={Key} alt="Option Key" />
            <div className="pl-3 text-[15px]">Opciones de inicio de sesión</div>
          </div>
        </div>
      )}

      {isCompany && (
        <div
          role="button"
          tabIndex={0}
          className={styles["phishing-container"]}
        >
          <p>
            Evite ser victima de PHISHING. Verifica la fuente de información de
            tus correos entrantes. Introduce tus datos confidenciales únicamente
            en webs seguras. Ante la mínima duda se prudente y no te arriesgues.
            Infórmate periódicamente sobre la evolución del malware.
          </p>
        </div>
      )}

      {isCompany && <div className={styles.bg}></div>}
    </main>
  );
}
