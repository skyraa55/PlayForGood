const express = require('express');
const bcrypt = require('bcryptjs');
const supabase = require('../lib/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, requireAdmin);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [usersRes, activeRes, drawsRes, winnersRes] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
      supabase.from('draws').select('*', { count: 'exact', head: true }),
      supabase.from('draw_winners').select('prize_amount').eq('status', 'pending'),
    ]);

    const totalSubscribers = activeRes.count || 0;
    const prizePool = totalSubscribers * 999;
    const charityTotal = Math.floor(prizePool * 0.1);

    const pendingPayout = winnersRes.data
      ? winnersRes.data.reduce((sum, w) => sum + (w.prize_amount || 0), 0)
      : 0;

    res.json({
      total_users: usersRes.count || 0,
      active_subscribers: totalSubscribers,
      total_draws: drawsRes.count || 0,
      prize_pool: prizePool,
      charity_total: charityTotal,
      pending_payout: pendingPayout,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let query = supabase.from('users').select('id, name, email, role, subscription_status, subscription_plan, charity_percentage, created_at, charities(name)', { count: 'exact' });
    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    if (status) query = query.eq('subscription_status', status);
    query = query.order('created_at', { ascending: false }).range(offset, offset + parseInt(limit) - 1);
    const { data, count, error } = await query;
    if (error) throw error;
    res.json({ users: data || [], total: count || 0, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, subscription_status, role, charity_id, charity_percentage } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email.toLowerCase();
    if (subscription_status) updates.subscription_status = subscription_status;
    if (role) updates.role = role;
    if (charity_id !== undefined) updates.charity_id = charity_id;
    if (charity_percentage !== undefined) updates.charity_percentage = charity_percentage;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from('users').update(updates).eq('id', req.params.id).select().single();
    if (error) throw error;
    const { password_hash, ...safeUser } = data;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// GET /api/admin/users/:id/scores
router.get('/users/:id/scores', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', req.params.id)
      .order('score_date', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

// PUT /api/admin/scores/:id
router.put('/scores/:id', async (req, res) => {
  try {
    const { score, score_date } = req.body;
    const s = parseInt(score);
    if (isNaN(s) || s < 1 || s > 45) return res.status(400).json({ error: 'Score must be 1–45' });
    const { data, error } = await supabase.from('scores').update({ score: s, score_date }).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update score' });
  }
});

// GET /api/admin/winners
router.get('/winners', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('draw_winners')
      .select('*, users(id, name, email), draws(draw_date, drawn_numbers)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch winners' });
  }
});

// PUT /api/admin/winners/:id/verify
router.put('/winners/:id/verify', async (req, res) => {
  try {
    const { status } = req.body; // approved or rejected
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const updates = { verification_status: status, updated_at: new Date().toISOString() };
    if (status === 'approved') updates.status = 'paid';
    const { data, error } = await supabase.from('draw_winners').update(updates).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify winner' });
  }
});

// PUT /api/admin/winners/:id/payout
router.put('/winners/:id/payout', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('draw_winners')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark payout' });
  }
});

module.exports = router;
