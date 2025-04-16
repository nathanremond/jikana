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

class OrderModel {
  static async getByUser(id_user) {
    const result = await pool.query("SELECT * FROM orders WHERE id_user = $1", [
      id_user,
    ]);
    return result.rows;
  }

  static async create({ total_amount, ordered_schedule, id_user }) {
    const client = await pool.connect();
    
    try {
      await client.query("BEGIN");
      const order_date = new Date().toISOString().split("T")[0];
      const result = await client.query(
        "INSERT INTO orders (order_date, total_amount, id_user) VALUES ($1, $2, $3) RETURNING *",
        [order_date, total_amount, id_user]
      );
      const order = result.rows[0];

      for (const schedule of ordered_schedule) {
        await client.query(
          "INSERT INTO order_schedule (id_order, id_schedule, quantity) VALUES ($1, $2, $3)",
          [order.id_order, schedule.id_schedule, schedule.quantity]
        );
      }
      await client.query("COMMIT");
      return order;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = OrderModel;
