const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: true,
});

class MovieModel {
  static async getById(id) {
    const result = await pool.query(
      `SELECT m.id_movie, m.name, m.description, m.picture, m.duration, m.release_date, m.end_date, m.video, m.directors, m.actors, m.languages,
       json_agg(
		    DISTINCT jsonb_build_object(
		      'schedule_hour', s.schedule_hour,
		      'language', s.language,
		      'price', s.price
		    )
		  ) AS schedules,
	  json_agg(
		    DISTINCT jsonb_build_object(
		      'id_category', c.id_category,
		      'name', c.name
		    )
		  ) AS categories
       FROM movie m
       LEFT JOIN schedule s ON m.id_movie = s.id_movie
       LEFT JOIN movie_category mv ON m.id_movie = mv.id_movie
       LEFT JOIN category c ON mv.id_category = c.id_category
       WHERE m.id_movie = $1
       GROUP BY m.id_movie;`,
      [id]
    );
    return result.rows[0];
  }

  static async getByKeywordsAndCategory(keywords, id_category) {
    let baseQuery = `
        SELECT m.id_movie, m.name, m.description, m.picture, m.duration, m.release_date, m.end_date, m.video, m.directors, m.actors, m.languages,
        array_agg(mv.id_category) AS categories
        FROM movie m
        INNER JOIN movie_category mv ON m.id_movie = mv.id_movie
        WHERE 1=1
    `;
    const values = [];
    let index = 1;

    if (keywords) {
      baseQuery += ` AND (
      m.name ILIKE $${index++} OR
      m.description ILIKE $${index++} OR
      EXISTS (
        SELECT 1
        FROM unnest(m.actors) AS actor
        WHERE actor ILIKE $${index++}
      ) OR
      EXISTS (
        SELECT 1
        FROM unnest(m.directors) AS director
        WHERE director ILIKE $${index++}
      ) OR
      EXISTS (
        SELECT 1
        FROM unnest(m.languages) AS language
        WHERE language ILIKE $${index++}
      )
    )`;
      values.push(
        `%${keywords}%`,
        `%${keywords}%`,
        `%${keywords}%`,
        `%${keywords}%`,
        `%${keywords}%`
      );
    }

    if (id_category) {
      baseQuery += ` AND mv.id_category = $${index}`;
      values.push(id_category);
      index++;
    }

    baseQuery += ` GROUP BY m.id_movie
                   ORDER BY m.release_date DESC;`;

    const result = await pool.query(baseQuery, values);
    return result.rows;
  }

  static async create({
    name,
    description,
    picture,
    duration,
    release_date,
    end_date,
    video,
    directors,
    actors,
    languages,
    categories,
  }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const result = await client.query(
        "INSERT INTO movie (name, description, picture, duration, release_date, end_date, video, directors, actors, languages) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        [
          name,
          description,
          picture,
          duration,
          release_date,
          end_date,
          video,
          directors,
          actors,
          languages,
        ]
      );
      const movie = result.rows[0];

      const categoriesArray = [];

      for (const id_category of categories) {
        await client.query(
          "INSERT INTO movie_category (id_movie, id_category) VALUES ($1, $2)",
          [movie.id_movie, id_category]
        );
        categoriesArray.push(id_category);
      }

      await client.query("COMMIT");

      return {
        ...movie,
        categories: categoriesArray,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(
    id_movie,
    {
      name,
      description,
      picture,
      duration,
      release_date,
      end_date,
      video,
      directors,
      actors,
      languages,
      categories
    }
  ) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const result = await client.query(
        `UPDATE movie SET 
        name = $1,
        description = $2,
        picture = $3,
        duration = $4,
        release_date = $5,
        end_date = $6,
        video = $7,
        directors = $8,
        actors = $9,
        languages = $10
      WHERE id_movie = $11
      RETURNING *`,
        [
          name,
          description,
          picture,
          duration,
          release_date,
          end_date,
          video,
          directors,
          actors,
          languages,
          id_movie,
        ]
      );

      const movie = result.rows[0];

      await client.query("DELETE FROM movie_category WHERE id_movie = $1", [
        id_movie,
      ]);

      const categoriesArray = [];
      for (const id_category of categories) {
        await client.query(
          "INSERT INTO movie_category (id_movie, id_category) VALUES ($1, $2)",
          [id_movie, id_category]
        );
        categoriesArray.push(id_category);
      }

      await client.query("COMMIT");

      return {
        ...movie,
        categories: categoriesArray,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const client = await pool.connect();

    try{
        await client.query("BEGIN");

        await client.query("DELETE FROM movie_category WHERE id_movie = $1", [id]);

        await client.query("DELETE FROM movie WHERE id_movie = $1", [id]);

        await client.query("COMMIT");
    
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
module.exports = MovieModel;