import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "../../context/AuthContext";

export default function Home() {
  const { token, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const [schedule_hour, setScheduleHour] = useState("");
  const [language, setlanguage] = useState("");
  const [price, setPrice] = useState("");


  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [isLoading, token]);

  const handleAddSchedule = async (e) => {
    e.preventDefault();

    const scheduleData = {
      schedule_hour,
      language,
      price: parseInt(price),
      id_movie: parseInt(id)
    };

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/schedule",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleData),
      }
    );

    if (response.ok) {
      router.push(`/movie/${id}`);
    } else {
      const err = await response.json();
      console.error("Erreur API :", response.status, err);
    }
  };

  
  if (!id) return <p>Chargement...</p>;

  return (
    <div className="container-add-schedule">
      <form onSubmit={handleAddSchedule}>
        <h1>Ajouter un horaire</h1>
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
          placeholder="langue"
          value={language}
          onChange={(e) => setlanguage(e.target.value)}
        />
        <input
          type="text"
          placeholder="prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit" onClick={handleAddSchedule}>Ajouter la séance</button>
      </form>
    </div>
  );
}
