import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";

export default function UpdateMovie() {
  const { token, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [duration, setDuration] = useState("");
  const [release_date, setReleaseDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [video, setVideo] = useState("");
  const [directors, setDirectors] = useState("");
  const [actors, setActors] = useState("");
  const [languages, setLanguages] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [isLoading, token]);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/movie/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setMovie(data);
          setName(data.name);
          setDescription(data.description);
          setPicture(data.picture);
          setDuration(data.duration);
          setReleaseDate(data.release_date);
          setEndDate(data.end_date);
          setVideo(data.video);
          setDirectors(data.directors.join(", "));
          setActors(data.actors.join(", "));
          setLanguages(data.languages.join(", "));
          setSelectedCategories(data.categories.map((cat) => cat.id_category));
        })
        .catch((err) => console.error("Erreur chargement film :", err));

      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`)
        .then((res) => res.json())
        .then((data) => setAvailableCategories(data))
        .catch((err) =>
          console.error("Erreur chargement des catégories :", err)
        );
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedMovie = {
      name,
      description,
      duration,
      picture,
      release_date,
      end_date,
      video,
      directors: directors.split(",").map((d) => d.trim()),
      actors: actors.split(",").map((a) => a.trim()),
      languages: languages.split(",").map((l) => l.trim()),
      categories: selectedCategories
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/movie/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedMovie),
      }
    );

    if (response.ok) {
      router.push(`/movie/${id}`);
    } else {
      const err = await response.json();
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  if (!movie) return <p>Chargement...</p>;

  return (
    <form onSubmit={handleUpdate} className="update-movie-form">
      <h1>Modifier le film</h1>
      <label>Titre</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>Durée</label>
      <input
        type="text"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <label>Image</label>
      <input
        type="text"
        value={picture}
        onChange={(e) => setPicture(e.target.value)}
      />
      <label>Date de sortie</label>
      <input
        type="date"
        value={release_date}
        onChange={(e) => setReleaseDate(e.target.value)}
      />
      <label>Date de fin de diffusion</label>
      <input
        type="date"
        value={end_date}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <label>Vidéo</label>
      <input
        type="text"
        value={video}
        onChange={(e) => setVideo(e.target.value)}
      />
      <label>Réalisateurs</label>
      <input
        type="text"
        value={directors}
        onChange={(e) => setDirectors(e.target.value)}
      />
      <label>Acteurs</label>
      <input
        type="text"
        value={actors}
        onChange={(e) => setActors(e.target.value)}
      />
      <label>Langues</label>
      <input
        type="text"
        value={languages}
        onChange={(e) => setLanguages(e.target.value)}
      />
      <label>Catégories</label>
      <div className="checkbox-categories-update">
        {availableCategories.map((category) => (
          <label key={category.id_category}>
            <input
              type="checkbox"
              value={category.id_category}
              checked={selectedCategories.includes(category.id_category)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setSelectedCategories((prev) =>
                  e.target.checked
                    ? [...prev, value]
                    : prev.filter((id) => id !== value)
                );
              }}
            />
            {category.name}
          </label>
        ))}
      </div>
      <button type="submit">Mettre à jour</button>
    </form>
  );
}
