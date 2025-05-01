const tiers = [
  { min: 0, max: 1000, modelPct: 0.55, agencyPct: 0.45 },
  { min: 1000, max: 2000, modelPct: 0.60, agencyPct: 0.40 },
  { min: 2000, max: 3000, modelPct: 0.65, agencyPct: 0.35 },
  { min: 3000, max: 4000, modelPct: 0.70, agencyPct: 0.30 },
  { min: 4000, max: 5000, modelPct: 0.75, agencyPct: 0.25 },
  { min: 5000, max: 6000, modelPct: 0.80, agencyPct: 0.20 },
  { min: 6000, max: 7000, modelPct: 0.85, agencyPct: 0.15 },
  { min: 7000, max: Infinity, modelPct: 0.90, agencyPct: 0.10 },
];

function calculateTieredSplit(totalRevenue) {
  let modelEarnings = 0;
  let agencyEarnings = 0;
  for (const tier of tiers) {
    if (totalRevenue > tier.min) {
      const applicable = Math.min(totalRevenue, tier.max) - tier.min;
      modelEarnings += applicable * tier.modelPct;
      agencyEarnings += applicable * tier.agencyPct;
    }
  }
  return { modelEarnings, agencyEarnings };
}

function calculateAffiliateCommission(agencyEarnings) {
  return agencyEarnings * 0.05;
}

module.exports = { calculateTieredSplit, calculateAffiliateCommission };
