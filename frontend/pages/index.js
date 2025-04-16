import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [movie, setMovie] = useState(null);
  const [category, setCategory] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/movie`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error("Erreur :", err));
  }, []);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/category`)
      .then((res) => res.json())
      .then((data) => setCategory(data))
      .catch((err) => console.error("Erreur :", err));
  }, []);

  return (
    <div className="accueil-container">
      <div className="search-container">
        {/* Barre de recherche */}
        <input
          type="text"
          id="search"
          placeholder="Rechercher un film, un acteur, etc..."
        />

        <div className="categories-dropdown">
          <select id="categories">
            <option value="">Toutes les catégories</option>
            {!category ? (
              <option disabled>Chargement...</option>
            ) : category.length === 0 ? (
              <option disabled>Aucune catégorie.</option>
            ) : (
              category.map((category) => (
                <option key={category.id_category} value={category.id_category}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

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