// Import the PostgreSQL client library
const { Pool } = require('pg');

// Create a new instance of the PostgreSQL client
const pool = new Pool({
  connectionString: process.env.PG_URI,
});

class IdeasApi {
  constructor() {
    console.log(process.env.NODE_ENV);
  }

  async getIdeas() {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM ideas');
      client.release();
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createIdea(data) {
    try {
      const { text, tag, username } = data;
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO ideas (text, tag, username) VALUES ($1, $2, $3) RETURNING *',
        [text, tag, username]
      );
      client.release();
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateIdea(id, data) {
    try {
      const { text, tag } = data;
      const client = await pool.connect();
      const result = await client.query(
        'UPDATE ideas SET text = $1, tag = $2 WHERE id = $3 RETURNING *',
        [text, tag, id]
      );
      client.release();
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteIdea(id, username) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        'DELETE FROM ideas WHERE id = $1 AND username = $2',
        [id, username]
      );
      client.release();
      return result.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = IdeasApi;
