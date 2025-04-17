import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { formatDateTimeLocal } from "../../utils/functions";

export default function UpdateMovie() {
  const { token, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [schedule_hour, setScheduleHour] = useState("");
  const [language, setLanguage] = useState("");
  const [price, setPrice] = useState("");


  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [isLoading, token]);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/schedule/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setScheduleHour(data.schedule_hour);
          setLanguage(data.language);
          setPrice(data.price);
          setMovie(data.id_movie);
        })
        .catch((err) => console.error("Erreur chargement horaire :", err));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/schedule/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setScheduleHour(formatDateTimeLocal(data.schedule_hour));
          setLanguage(data.language);
          setPrice(data.price);
          setMovie(data.id_movie);
        })
        .catch((err) => console.error("Erreur chargement horaire :", err));
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedSchedule = {
      schedule_hour,
      language,
      price: parseInt(price),
      id_movie: parseInt(movie)
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/schedule/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedSchedule),
        }
      );

      if (response.ok) {
        router.push(`/movie/${movie}`);
      } else {
        const err = await response.json();
        console.error("Erreur lors de la mise à jour :", err);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  if (!movie) return <p>Chargement...</p>;

  return (
    <div className="container-update-schedule">
      <form onSubmit={handleUpdate}>
        <h1>Modifier l'horaire</h1>
        <br />
        <br />
        <label>Date et heure de la séance</label>
        <input
          type="datetime-local"
          value={schedule_hour}
          onChange={(e) => setScheduleHour(e.target.value)}
        />
        <input
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
}
