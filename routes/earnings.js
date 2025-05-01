const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { calculateTieredSplit, calculateAffiliateCommission } = require('../utils/tierCalculator');

router.post('/', async (req, res) => {
  try {
    const { model_id, week_start, total_revenue } = req.body;
    const { modelEarnings, agencyEarnings } = calculateTieredSplit(total_revenue);

    const model = await db.one('SELECT affiliate_id FROM models WHERE id = $1', [model_id]);
    const affiliateCommission = model.affiliate_id ? calculateAffiliateCommission(agencyEarnings) : 0;

    const result = await db.one(
      `INSERT INTO earnings (model_id, week_start, total_revenue, model_earnings, agency_earnings, affiliate_commission)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [model_id, week_start, total_revenue, modelEarnings, agencyEarnings, affiliateCommission]
    );

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save earnings' });
  }
});

router.get('/affiliate/:id', async (req, res) => {
  try {
    const affiliateId = req.params.id;
    const earnings = await db.any(
      `SELECT e.* FROM earnings e
       JOIN models m ON e.model_id = m.id
       WHERE m.affiliate_id = $1
       ORDER BY e.week_start DESC`,
      [affiliateId]
    );
    res.json(earnings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
});

module.exports = router;
