import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";

export default function MovieDetail() {
  const { id_role, isLoading, token } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const [movieByID, setMovieByID] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [nextSevenDates, setNextSevenDates] = useState([]);

  const generateNextSevenDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(nextDate.toISOString().split("T")[0]);
    }
    return dates;
  };

  useEffect(() => {
    if (id) {
      fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/movie/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setMovieByID(data);
          const nextDates = generateNextSevenDates();
          setNextSevenDates(nextDates);
          setSelectedDate(nextDates[0]);
        })
        .catch((err) => console.error("Erreur :", err));
    }
  }, [id]);

  const handleUpdateMovie = () => {
    router.push(`/updateMovie/${movieByID.id_movie}`);
  };

  const handleDeleteMovie = async () => {
    const confirmDelete = confirm("Es-tu sûr de vouloir supprimer ce film ?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/movie/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        router.push("/");
      } else {
        const error = await response.json();
        console.error("Erreur suppression :", error);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const handleOrderSchedule = (schedule) => {
    const booking = {
      id_movie: movieByID.id_movie,
      name: movieByID.name,
      schedule_hour: new Date(schedule.schedule_hour).toISOString(),
      language: schedule.language,
      price: schedule.price,
      quantity: 1,
    };

    localStorage.setItem("book", JSON.stringify([booking]));

    router.push("/order");
  };

  const handleAddSchedule = () => {
    router.push(`/addSchedule/${movieByID.id_movie}`);
  };

  const handleUpdateSchedule = () => {
    
    router.push(`/updateSchedule/${movieByID.id_movie}`);
  };

  if (!movieByID) return <p>Chargement...</p>;
  if (isLoading) return <p>Chargement...</p>;

  return (
    <div className="container">
      <div className="detail-video-film">
        <video
          src={`/videosMovies/${movieByID.video}`}
          controls
          autoPlay
          muted
        ></video>
      </div>
      {!isLoading && id_role === 1 && (
        <div className="btn-admin-update-movie">
          <button onClick={handleUpdateMovie}>Modifier</button>
        </div>
      )}
      {!isLoading && id_role === 1 && (
        <div className="btn-admin-delete-movie">
          <button onClick={handleDeleteMovie}>Supprimer</button>
        </div>
      )}
      <div className="detail-movie">
        <h2>{movieByID.name}</h2>
        <p>
          Catégories:&nbsp;
          {movieByID.categories &&
            movieByID.categories.map((cat, index) => (
              <span key={cat.id_category}>
                {cat.name}
                {index < movieByID.categories.length - 1 ? ", " : ""}
              </span>
            ))}
        </p>
        <p>Durée: {movieByID.duration} minutes</p>
        <p>Date de sortie: {movieByID.release_date}</p>
        <p>Langue: {movieByID.languages.join(", ")}</p>
        <p>Réalisateur: {movieByID.directors}</p>
        <p>Acteurs: {movieByID.actors.join(", ")}</p>
      </div>
      <div className="detail-movie-description">
        <h2>Description</h2>
        <p>{movieByID.description}</p>
      </div>

      <div className="detail-movie-schedule">
        {!isLoading && id_role === 1 && (
          <div className="btn-admin-delete-movie">
            <button onClick={handleAddSchedule}>Ajouter un horaire</button>
          </div>
        )}
        <h2>Horaires</h2>
        <div className="schedule-dates">
          {nextSevenDates.map((date, index) => (
            <button
              key={index}
              className={`date-button ${selectedDate === date ? "active" : ""}`}
              onClick={() => setSelectedDate(date)}
            >
              {new Date(date).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </button>
          ))}
        </div>
        <div className="schedule-times">
          {movieByID.schedules
            ?.filter((schedule) => {
              const scheduleDate = new Date(schedule.schedule_hour);
              const selected = new Date(selectedDate);
              return (
                scheduleDate.getFullYear() === selected.getFullYear() &&
                scheduleDate.getMonth() === selected.getMonth() &&
                scheduleDate.getDate() === selected.getDate()
              );
            })
            .map((schedule, index) => (
              <div key={index} className="time-slot">
                <p>
                  Heure :{" "}
                  {new Date(schedule.schedule_hour).toLocaleTimeString(
                    "fr-FR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                  | {schedule.language} | {schedule.price} €
                </p>
                {!isLoading && id_role === 1 && (
                  <div className="btn-admin-delete-movie">
                    <button onClick={handleUpdateSchedule}>
                      Modifier un horaire
                    </button>
                  </div>
                )}
                <button
                  className="reserve-button"
                  onClick={() => handleOrderSchedule(schedule)}
                >
                  Réserver
                </button>
              </div>
            ))}
          {movieByID.schedules &&
            movieByID.schedules.filter((schedule) => {
              const scheduleDate = new Date(schedule.schedule_hour);
              const selected = new Date(selectedDate);
              return (
                scheduleDate.getFullYear() === selected.getFullYear() &&
                scheduleDate.getMonth() === selected.getMonth() &&
                scheduleDate.getDate() === selected.getDate()
              );
            }).length === 0 && <p>Aucune séance prévue pour ce jour.</p>}
        </div>
      </div>
    </div>
  );
}