import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [movie, setMovie] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/movie`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error("Erreur :", err));
  }, []);

  return (
    <div className="accueil_container">
      <section>
        <h2>Les film</h2>
        <div className="accueil-film-list">
          {!movie ? (
            <p>Chargement...</p>
          ) : movie.length === 0 ? (
            <p>Aucun film.</p>
          ) : (
            movie.map((movie) => (
              <div className="accueil-movies-card" key={movie.id_movie}>
                <a href={`/movie/${movie.id_movie}`}>
                  <img src={`/movies/${movie.name}.png`} alt={movie.name} />
                  <h3>{movie.name}</h3>
                </a>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}