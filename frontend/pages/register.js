import { useState, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";

export default function Register() {
  const { token, isLoading } = useContext(AuthContext);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  //Redirige vers /profile si l'utilisateur est déjà connecté
  if (isLoading) return <p>Chargement...</p>;
  if (token) {
    router.push("/profile");
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, email, password, id_role: 2 }),
      }
    );

    if (response.ok) router.push("/login");
  };

  return (
    <div className="container">
      <form onSubmit={handleRegister}>
        <h1>Créer un compte</h1>
        <a href="/login">Se connecter à un compte</a>
        <input
          type="text"
          placeholder="Prénom"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nom"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}
