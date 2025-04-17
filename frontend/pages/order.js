import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function MovieReservation() {
  const { id_user, isLoading, token } = useContext(AuthContext);
  const router = useRouter();
  const [book, setBook] = useState([]);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [isLoading, token]);

  useEffect(() => {
    const storedBook = JSON.parse(localStorage.getItem("book")) || [];
    setBook(storedBook);
  }, []);

  const updateQuantity = (index, delta) => {
    setBook((prevBook) => {
      const updated = [...prevBook];
      const newQuantity = updated[index].quantity + delta;
      if (newQuantity < 1) return prevBook;
      updated[index].quantity = newQuantity;
      localStorage.setItem("book", JSON.stringify(updated));
      return updated;
    });
  };

  const calculTotal = () => {
    const total = book.reduce(
      (sum, movie) => sum + Number(movie.price || 0) * movie.quantity,
      0
    );
    return Number(total).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const total_amount = calculTotal();
    const ordered_schedule = book.map((movie) => ({
      id_schedule: movie.id_movie,
      quantity: movie.quantity
    }));

    const data = {
      total_amount: total_amount,
      ordered_schedule: ordered_schedule,
      id_user: id_user
    };

    console.log("DATA ENVOYEE:", data);

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
        console.error("Erreur API:", errorData);
        alert(`Erreur : ${errorData.message || "Une erreur est survenue"}`);
        return;
      }

      localStorage.removeItem("book");
      await router.push("/profile");
    } catch (error) {
      alert("Une erreur est survenue lors de la commande.");
    }
  };

  return (
    <div className="container-order">
      <main>
        <h1>Votre Réservation</h1>
        {book.length > 0 ? (
          <div className="book-container">
            <ul>
              {book.map((movie, index) => (
                <li key={movie.id_movie}>
                  <h3>{movie.name}</h3>
                  <p>
                    Horaire :{" "}
                    {new Date(movie.schedule_hour).toLocaleString("fr-FR", {
                      weekday: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>Langue : {movie.language}</p>
                  <div className="quantity-section">
                    <p>Quantité :</p>
                    <button onClick={() => updateQuantity(index, -1)}>-</button>
                    <span>{movie.quantity}</span>
                    <button onClick={() => updateQuantity(index, 1)}>+</button>
                  </div>
                  <p>Prix unitaire : {Number(movie.price).toFixed(2)} €</p>
                  <p>
                    Sous-total :{" "}
                    {(Number(movie.price) * movie.quantity).toFixed(2)} €
                  </p>
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