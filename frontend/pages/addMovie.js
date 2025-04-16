import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";

export default function Home() {
  const { token, isLoading } = useContext(AuthContext);
  const router = useRouter();
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

  const handleAddMovie = async (e) => {
    e.preventDefault();

    const formattedDirectors = directors
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const formattedActors = actors
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const formattedLanguages = languages
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const formattedCategories = selectedCategories.map((cat) =>
      parseInt(cat, 10)
    );

    const movieData = {
      name,
      description,
      picture,
      duration,
      release_date,
      end_date,
      video,
      directors: formattedDirectors,
      actors: formattedActors,
      languages: formattedLanguages,
      categories: formattedCategories,
    };

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/movie",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movieData)
      }
    );

    if (response.ok) {
      router.push("/");
    } else {
      const err = await response.json();
      console.error("Erreur API :", response.status, err);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/category`)
        .then((res) => res.json())
        .then((data) => setAvailableCategories(data))
        .catch((err) =>
          console.error("Erreur lors du chargement des catégories :", err)
        );
    }
  }, [isLoading]);

  return (
    <div className="container">
      <form onSubmit={handleAddMovie}>
        <h1>Ajouter un film</h1>
        <br />
        <br />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>Image du film</label>
        <input
          type="text"
          placeholder="Picture"
          value={picture}
          onChange={(e) => setPicture(e.target.value)}
        />
        <input
          type="text"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <input
          type="date"
          placeholder="Release_date"
          value={release_date}
          onChange={(e) => setReleaseDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="End_date"
          value={end_date}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <label>Bande-annonce</label>
        <input
          type="text"
          placeholder="video"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Réalisateurs (séparés par des virgules)"
          value={directors}
          onChange={(e) => setDirectors(e.target.value)}
        />
        <input
          type="text"
          placeholder="Acteurs (séparés par des virgules)"
          value={actors}
          onChange={(e) => setActors(e.target.value)}
        />
        <input
          type="text"
          placeholder="Langues (séparés par des virgules)"
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
        />
        <label>Catégories</label>
        <div className="checkbox-group">
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
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}
