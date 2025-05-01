const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/models', async (req, res) => {
  try {
    const models = await db.any(`
      SELECT m.id, m.name, u.email AS affiliate_email
      FROM models m
      LEFT JOIN users u ON m.affiliate_id = u.id
      ORDER BY m.id DESC
    `);
    res.json(models);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

router.post('/payouts', async (req, res) => {
  try {
    const { user_id, amount, status } = req.body;
    const result = await db.one(`
      INSERT INTO payouts (user_id, amount, status, paid_at)
      VALUES ($1, $2, $3, CASE WHEN $3 = 'paid' THEN NOW() ELSE NULL END)
      RETURNING *
    `, [user_id, amount, status]);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record payout' });
  }
});

router.get('/payouts/:user_id', async (req, res) => {
  try {
    const payouts = await db.any(
      'SELECT * FROM payouts WHERE user_id = $1 ORDER BY created_at DESC',
      [req.params.user_id]
    );
    res.json(payouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch payouts' });
  }
});

module.exports = router;
