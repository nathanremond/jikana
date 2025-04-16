import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import formatDate from "../utils/functions";

export default function profile() {
  const { token, id_user, email, isLoading, logout } = useContext(AuthContext);
  const [orderByUser, setOrderByUser] = useState(null);
  const router = useRouter();

  //Redirige vers /login si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [isLoading, token]);

  useEffect(() => {
    if (id_user) {
      fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/user/${id_user}/order`)
        .then((res) => res.json())
        .then((data) => setOrderByUser(data))
        .catch((err) => console.error("Erreur :", err));
    }
  }, [id_user]);

  //Fonction de déconnexion
  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
    router.push("/");
  };

  if (isLoading) return <p>Chargement...</p>;
  if (!token) return <p>Redirection en cours...</p>;

  return (
    <div className="profile-container">
      <div className="profile-name">
        <h1>Bienvenue sur votre page de profil {email}</h1>
      </div>
      <div className="profile-container-card">
        <h1>Mes reservations</h1>
        {orderByUser && orderByUser.length > 0 ? (
          orderByUser.map((orders) => (
            <div key={orders.id_order}>
              <p>{formatDate(orders.order_date)}</p>
              <p>{orders.total_amount} €</p>
            </div>
          ))
        ) : (
          <p>Aucune réservation trouvée.</p>
        )}
      </div>
      <div>
        <button onClick={handleLogout}>Se déconnecter</button>
      </div>
    </div>
  );
}