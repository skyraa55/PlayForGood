const express = require('express');
const supabase = require('../lib/supabase');
const { authenticate, requireSubscription } = require('../middleware/auth');

const router = express.Router();
router.get('/', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', req.user.id)
      .order('score_date', { ascending: false })
      .limit(5);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});
router.post('/', authenticate, requireSubscription, async (req, res) => {
  try {
    const { score, score_date } = req.body;

    if (!score || !score_date) return res.status(400).json({ error: 'Score and date required' });
    const s = parseInt(score);
    if (isNaN(s) || s < 1 || s > 45) return res.status(400).json({ error: 'Score must be 1–45 (Stableford)' });
    const { data: existing } = await supabase
      .from('scores')
      .select('id, score_date')
      .eq('user_id', req.user.id)
      .order('score_date', { ascending: true });
    if (existing && existing.length >= 5) {
      await supabase.from('scores').delete().eq('id', existing[0].id);
    }
    const { data, error } = await supabase
      .from('scores')
      .insert({ user_id: req.user.id, score: s, score_date })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Score add error:', err);
    res.status(500).json({ error: 'Failed to add score' });
  }
});
router.put('/:id', authenticate, requireSubscription, async (req, res) => {
  try {
    const { score, score_date } = req.body;
    const s = parseInt(score);
    if (isNaN(s) || s < 1 || s > 45) return res.status(400).json({ error: 'Score must be 1–45' });
    const { data, error } = await supabase
      .from('scores')
      .update({ score: s, score_date })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Score not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update score' });
  }
});
router.delete('/:id', authenticate, requireSubscription, async (req, res) => {
  try {
    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ message: 'Score deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete score' });
  }
});

module.exports = router;
