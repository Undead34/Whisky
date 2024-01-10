import styles from "./ui/styles/Home.module.css";
import Footer from "./ui/footer";
import Main from "./ui/main";

type TSearchParams = {
  company?: string;
  view?: "email" | "password";
};

export default function Page({ searchParams }: { searchParams: TSearchParams }) {
  return (
    <div className="absolute w-screen h-screen">
      <div className={`${styles.container} ${searchParams?.company === "true" && styles["container-company"]}`}>
        <Main searchParams={searchParams} />
        {searchParams?.company !== "true" && <Footer />}
      </div>
    </div>
  )
}
