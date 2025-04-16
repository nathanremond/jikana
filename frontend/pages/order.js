import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";

export default function MovieReservation() {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const handleRemoveFromCart = (movieId) => {
    const updatedCart = cart.filter((movie) => movie.id_movie !== movieId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculTotal = () => {
    const total = cart.reduce(
      (sum, movie) => sum + Number(movie.price || 0) * movie.quantity,
      0
    );
    return Number(total).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const total_amount = calculTotal();
    const ordered_movies = cart.map((movie) => ({
      id_movie: movie.id_movie,
      schedule_hour: movie.schedule_hour,
      quantity: movie.quantity,
    }));

    const data = {
      total_amount: total_amount,
      ordered_movies: ordered_movies,
    };

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Erreur : ${errorData.message || "Une erreur est survenue"}`);
        return;
      }

      alert("Votre commande a été passée avec succès !");
      await router.push("/profile");
    } catch (error) {
      alert("Une erreur est survenue lors de la commande.");
    }
  };

  return (
    <div className="container-order">
      <main>
        <h1>Votre Réservation</h1>
        {cart.length > 0 ? (
          <div className="cart-container">
            <ul>
              {cart.map((movie) => (
                <li key={movie.id_movie}>
                  <h3>{movie.name}</h3>
                  <p>Horaire : {new Date(movie.schedule_hour).toLocaleString("fr-FR", { weekday: "long", hour: "2-digit", minute: "2-digit" })}</p>
                  <p>Langue : {movie.language}</p>
                  <p>Quantité : {movie.quantity}</p>
                  <p>Prix : {(Number(movie.price) || 0).toFixed(2)} €</p>
                  <button onClick={() => handleRemoveFromCart(movie.id_movie)}>
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
            <h2>Total : {calculTotal()} €</h2>
            <button onClick={handleSubmit}>Payer</button>
          </div>
        ) : (
          <p>Pas de reservations.</p>
        )}
      </main>
    </div>
  );
}