const express = require('express');
const supabase = require('../lib/supabase');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Helper: calculate prize pool from active subscribers
async function calculatePrizePool() {
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active');

  const monthlyRate = 999; // 9.99 GBP in pence
  const totalPool = (count || 0) * monthlyRate;
  return {
    total: totalPool,
    jackpot: Math.floor(totalPool * 0.40),
    four_match: Math.floor(totalPool * 0.35),
    three_match: Math.floor(totalPool * 0.25),
    active_subscribers: count || 0,
  };
}

// Helper: get all active user scores
async function getActiveUserScores() {
  const { data } = await supabase
    .from('scores')
    .select('user_id, score')
    .order('score_date', { ascending: false });

  // Group by user_id, keep last 5 per user
  const userScores = {};
  if (data) {
    for (const row of data) {
      if (!userScores[row.user_id]) userScores[row.user_id] = [];
      if (userScores[row.user_id].length < 5) userScores[row.user_id].push(row.score);
    }
  }
  return userScores;
}

// Helper: run draw logic
function runDrawLogic(method, allUserScores) {
  const allScores = Object.values(allUserScores).flat();
  let drawnNumbers = [];

  if (method === 'random') {
    const unique = new Set();
    while (unique.size < 5) unique.add(Math.floor(Math.random() * 45) + 1);
    drawnNumbers = [...unique].sort((a, b) => a - b);
  } else {
    // Algorithmic: weighted by frequency (least frequent = more likely, balances pool)
    const freq = {};
    for (let i = 1; i <= 45; i++) freq[i] = 0;
    allScores.forEach(s => { if (freq[s] !== undefined) freq[s]++; });
    // Weight inversely proportional to frequency
    const weights = Object.entries(freq).map(([num, count]) => ({
      num: parseInt(num),
      weight: 1 / (count + 1),
    }));
    const totalWeight = weights.reduce((s, w) => s + w.weight, 0);
    const unique = new Set();
    let attempts = 0;
    while (unique.size < 5 && attempts < 1000) {
      attempts++;
      let rand = Math.random() * totalWeight;
      for (const w of weights) {
        rand -= w.weight;
        if (rand <= 0) { unique.add(w.num); break; }
      }
    }
    drawnNumbers = [...unique].sort((a, b) => a - b);
  }
  return drawnNumbers;
}

// Helper: find winners
function findWinners(drawnNumbers, userScores) {
  const drawn = new Set(drawnNumbers);
  const results = { five_match: [], four_match: [], three_match: [] };

  for (const [userId, scores] of Object.entries(userScores)) {
    const userSet = new Set(scores);
    const matches = [...userSet].filter(s => drawn.has(s)).length;
    if (matches === 5) results.five_match.push(userId);
    else if (matches === 4) results.four_match.push(userId);
    else if (matches === 3) results.three_match.push(userId);
  }
  return results;
}

// GET /api/draws - list all draws
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('draws')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(12);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch draws' });
  }
});

// GET /api/draws/latest - latest published draw
router.get('/latest', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('draws')
      .select('*')
      .eq('status', 'published')
      .order('draw_date', { ascending: false })
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || null);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch latest draw' });
  }
});

// GET /api/draws/my-results - user's draw results
router.get('/my-results', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('draw_winners')
      .select('*, draws(draw_date, drawn_numbers, status)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// POST /api/draws/simulate (Admin)
router.post('/simulate', authenticate, requireAdmin, async (req, res) => {
  try {
    const { method = 'random' } = req.body;
    const userScores = await getActiveUserScores();
    const prizePool = await calculatePrizePool();
    const drawnNumbers = runDrawLogic(method, userScores);
    const winners = findWinners(drawnNumbers, userScores);

    res.json({
      drawn_numbers: drawnNumbers,
      prize_pool: prizePool,
      winner_counts: {
        five_match: winners.five_match.length,
        four_match: winners.four_match.length,
        three_match: winners.three_match.length,
      },
      simulation: true,
    });
  } catch (err) {
    console.error('Simulate error:', err);
    res.status(500).json({ error: 'Simulation failed' });
  }
});

// POST /api/draws/run (Admin) - run and save draw
router.post('/run', authenticate, requireAdmin, async (req, res) => {
  try {
    const { method = 'random', draw_date, jackpot_rollover = 0 } = req.body;

    const userScores = await getActiveUserScores();
    const prizePool = await calculatePrizePool();
    const drawnNumbers = runDrawLogic(method, userScores);
    const winners = findWinners(drawnNumbers, userScores);

    const jackpotTotal = prizePool.jackpot + parseInt(jackpot_rollover || 0);
    const jackpotWon = winners.five_match.length > 0;
    const jackpotPerWinner = jackpotWon && winners.five_match.length > 0
      ? Math.floor(jackpotTotal / winners.five_match.length) : 0;
    const fourMatchPerWinner = winners.four_match.length > 0
      ? Math.floor(prizePool.four_match / winners.four_match.length) : 0;
    const threeMatchPerWinner = winners.three_match.length > 0
      ? Math.floor(prizePool.three_match / winners.three_match.length) : 0;

    // Insert draw
    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .insert({
        draw_date: draw_date || new Date().toISOString(),
        drawn_numbers: drawnNumbers,
        method,
        status: 'draft',
        prize_pool_total: prizePool.total,
        jackpot_amount: jackpotTotal,
        four_match_amount: prizePool.four_match,
        three_match_amount: prizePool.three_match,
        jackpot_won: jackpotWon,
        jackpot_rollover: jackpotWon ? 0 : jackpotTotal,
        active_subscribers: prizePool.active_subscribers,
      })
      .select()
      .single();

    if (drawError) throw drawError;

    // Insert winners
    const winnerRows = [];
    for (const uid of winners.five_match) {
      winnerRows.push({ draw_id: draw.id, user_id: uid, match_type: 'five_match', prize_amount: jackpotPerWinner, status: 'pending' });
    }
    for (const uid of winners.four_match) {
      winnerRows.push({ draw_id: draw.id, user_id: uid, match_type: 'four_match', prize_amount: fourMatchPerWinner, status: 'pending' });
    }
    for (const uid of winners.three_match) {
      winnerRows.push({ draw_id: draw.id, user_id: uid, match_type: 'three_match', prize_amount: threeMatchPerWinner, status: 'pending' });
    }

    if (winnerRows.length > 0) {
      await supabase.from('draw_winners').insert(winnerRows);
    }

    res.status(201).json({ draw, winner_counts: {
      five_match: winners.five_match.length,
      four_match: winners.four_match.length,
      three_match: winners.three_match.length,
    }});
  } catch (err) {
    console.error('Draw run error:', err);
    res.status(500).json({ error: 'Draw failed' });
  }
});

// POST /api/draws/:id/publish (Admin)
router.post('/:id/publish', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('draws')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to publish draw' });
  }
});

// GET /api/draws/:id/winners (Admin)
router.get('/:id/winners', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('draw_winners')
      .select('*, users(id, name, email)')
      .eq('draw_id', req.params.id);
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch winners' });
  }
});

module.exports = router;
