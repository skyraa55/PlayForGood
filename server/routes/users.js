const express = require('express');
const bcrypt = require('bcryptjs');
const supabase = require('../lib/supabase');
const { authenticate } = require('../middleware/auth');
const router = express.Router();
router.get('/profile', authenticate, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*, charities(id, name, logo_url)')
      .eq('id', req.user.id)
      .single();
    if (error) throw error;
    const { password_hash, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, charity_id, charity_percentage } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (charity_id !== undefined) updates.charity_id = charity_id;
    if (charity_percentage !== undefined) {
      if (charity_percentage < 10 || charity_percentage > 100)
        return res.status(400).json({ error: 'Charity % must be 10–100' });
      updates.charity_percentage = charity_percentage;
    }
    updates.updated_at = new Date().toISOString();
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    const { password_hash, ...safeUser } = data;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});
router.put('/password', authenticate, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) return res.status(400).json({ error: 'Both passwords required' });
    if (new_password.length < 6) return res.status(400).json({ error: 'New password too short' });

    const { data: user } = await supabase.from('users').select('password_hash').eq('id', req.user.id).single();
    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Current password incorrect' });

    const hash = await bcrypt.hash(new_password, 12);
    await supabase.from('users').update({ password_hash: hash }).eq('id', req.user.id);
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

module.exports = router;
