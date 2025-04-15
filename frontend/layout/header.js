export default function Header() {

  return (
    <header>
      <div>
        {/* Logo */}
        <img
          src="imageJiKaNa.png"
          alt="Logo"
          onClick={() => router.push("/")}
        />
      </div>
      <div>
        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher..."
        />
      </div>
      <div>
        {/* Icône de connexion */}
        <a href="/login" >
          <img
            src="icone_de_connexion.png"
            alt="Icône de connexion"
          />
        </a>
      </div>
    </header>
  );
}
