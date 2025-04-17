import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";

export default function Home() {
  const { id_role, isLoading } = useContext(AuthContext);
  const [movies, setMovies] = useState(null);
  const [keywords, setKeywords] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/movie`)
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Erreur :", err));
  }, []);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/category`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Erreur :", err));
  }, []);


  const searchMovies = async () => {
    try {
      const queryParams = new URLSearchParams();

      if (keywords) queryParams.append("keywords", keywords);
      if (selectedCategory) queryParams.append("category", selectedCategory);

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + `/movie?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des films");
      }

      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  const handleAddMovie = () => {
    router.push("/addMovie");
  }

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div className="accueil-container">
      {/* Barre de recherche */}
      <div className="search-container">
        <input
          type="text"
          id="search"
          placeholder="Rechercher un film, un acteur, etc..."
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />

        <div className="categories-dropdown">
          <select
            id="categories"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {!categories ? (
              <option disabled>Chargement...</option>
            ) : categories.length === 0 ? (
              <option disabled>Aucune catégorie.</option>
            ) : (
              categories.map((category) => (
                <option key={category.id_category} value={category.id_category}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>

        <button onClick={searchMovies}>Rechercher</button>
      </div>

      {!isLoading && id_role === 1 && (
        <div className="btn-admin-add-movie">
          <button onClick={handleAddMovie}>Ajouter un film</button>
        </div>
      )}

      <section>
        <h2>Les films</h2>
        <div className="accueil-film-list">
          {!movies ? (
            <p>Chargement...</p>
          ) : movies.length === 0 ? (
            <p>Aucun film.</p>
          ) : (
            movies.map((movie) => (
              <div className="accueil-movies-card" key={movie.id_movie}>
                <a href={`/movie/${movie.id_movie}`}>
                  <img src={`/picturesMovies/${movie.picture}`} alt={movie.name} />
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