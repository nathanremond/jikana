import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";

export default function profile() {
  const { token, email, isLoading, logout } = useContext(AuthContext);
  const router = useRouter();

  //Redirige vers /login si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [isLoading, token]);

  //Fonction de déconnexion
  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
    router.push("/");
  };

  if (isLoading) return <p>Chargement...</p>;
  if (!token) return <p>Redirection en cours...</p>;

  return (
    <div className="container">
      <div className="profile-name">
        <h1>Bienvenue sur votre page de profil {email}</h1>
      </div>

      <div>
        <button onClick={handleLogout}>Se déconnecter</button>
      </div>
    </div>
  );
}