
function calculateTeamScore(profiles) {
  const avgRating = profiles.reduce((s,p)=>s+p.rating,0)/profiles.length;
  const diversity = new Set(profiles.flatMap(p=>p.categories)).size * 10;
  return Math.min(100, Math.round(
    0.35*(avgRating*20) +
    0.25*(diversity) +
    0.20*80 +
    0.20*(profiles.length>=5?90:60)
  ));
}
module.exports = { calculateTeamScore };
