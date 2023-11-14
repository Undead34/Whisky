import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex w-full items-center justify-end bg-transparent min-h-[28px]">
      <div className="loat-right m-0">
        <Link
          className="mx-2 text-xs"
          target="_blank"
          href="https://www.microsoft.com/es-ES/servicesagreement/"
        >
          Términos de uso
        </Link>
        <Link
          className="mx-2 text-xs"
          target="_blank"
          href="https://privacy.microsoft.com/es-ES/privacystatement/"
        >
          Privacidad y cookies
        </Link>
        <Link
          style={{ letterSpacing: "3px", lineHeight: "24px" }}
          className={`mx-2 align-top no-underline`}
          href="/"
        >
          ...
        </Link>
      </div>
    </footer>
  );
}
