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

class ScheduleModel {
  static async create({ schedule_hour, language, price, id_movie }) {
    const result = await pool.query(
      "INSERT INTO schedule (schedule_hour, language, price, id_movie) VALUES ($1, $2, $3, $4) RETURNING *",
      [schedule_hour, language, price, id_movie]
    );
    return result.rows[0];
  }

  static async update(id, { schedule_hour, language, price, id_movie }) {
    const result = await pool.query(
      "UPDATE schedule SET schedule_hour = $1, language = $2, price = $3, id_movie = $4 WHERE id_schedule = $5 RETURNING * ",
      [schedule_hour, language, price, id_movie, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query("DELETE FROM schedule WHERE id_schedule = $1", [id]);
  }
}

module.exports = ScheduleModel;