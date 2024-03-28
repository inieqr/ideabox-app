const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const cors = require('cors');

router.use(cors());

// Get all ideas
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM ideas');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// Get single idea
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM ideas WHERE id = $1', [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Idea not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// Add an idea
router.post('/', async (req, res) => {
  const { text, tag, username } = req.body;

  if (!text) {
    return res
      .status(400)
      .json({ success: false, error: 'Text field is required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO ideas (text, tag, username) VALUES ($1, $2, $3) RETURNING *',
      [text, tag, username]
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// Update idea
router.put('/:id', async (req, res) => {
  const { text, tag, username } = req.body;

  try {
    const { rowCount } = await pool.query(
      'UPDATE ideas SET text = $1, tag = $2 WHERE id = $3 AND username = $4',
      [text, tag, req.params.id, username]
    );
    if (rowCount === 0) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to update this resource',
      });
    }
    res.json({ success: true, message: 'Idea updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// Delete idea
router.delete('/:id', async (req, res) => {
  const { username } = req.body;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM ideas WHERE id = $1 AND username = $2',
      [req.params.id, username]
    );
    if (rowCount === 0) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to delete this resource',
      });
    }
    res.json({ success: true, message: 'Idea deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

module.exports = router;
