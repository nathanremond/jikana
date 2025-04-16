import { useState, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";

export default function Login() {
  const { login, token, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  //Redirige vers /profile si l'utilisateur est déjà connecté
  if (isLoading) return <p>Chargement...</p>;
  if (token) {
    router.push("/profile");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      login(data.token, data.id_user, data.email, data.id_role);
      router.push("/profile");
    }
  };

  return (
    <div className="container-form">
      <form onSubmit={handleLogin} className="form-login">
        <h1>Connexion</h1>
        <br />
        <br />
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
        <button type="submit">Se connecter</button>
      </form>
      <a href="/register">Créer un compte</a>
    </div>
  );
}
