import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  return (
    <header>
      <div className="header-logo">
        {/* Logo */}
        <img
          src="imageJiKaNa.png"
          alt="Logo"
          onClick={() => router.push("/")}
        />
      </div>
      <div className="header-login">
        {/* Icône de connexion */}
        <a href="/login">
          <img src="icone_de_connexion.png" alt="Icône de connexion" />
        </a>
      </div>
    </header>
  );
}
