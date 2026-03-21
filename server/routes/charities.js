const express = require('express');
const supabase = require('../lib/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/charities
router.get('/', async (req, res) => {
  try {
    const { search, featured } = req.query;
    let query = supabase.from('charities').select('*').eq('active', true);
    if (search) query = query.ilike('name', `%${search}%`);
    if (featured === 'true') query = query.eq('featured', true);
    query = query.order('name');
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch charities' });
  }
});

// GET /api/charities/:id
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Charity not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch charity' });
  }
});

// POST /api/charities (Admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, description, logo_url, website, featured, events } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const { data, error } = await supabase
      .from('charities')
      .insert({ name, description, logo_url, website, featured: !!featured, events: events || [], active: true })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create charity' });
  }
});

// PUT /api/charities/:id (Admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, description, logo_url, website, featured, events, active } = req.body;
    const { data, error } = await supabase
      .from('charities')
      .update({ name, description, logo_url, website, featured, events, active, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update charity' });
  }
});

// DELETE /api/charities/:id (Admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('charities').update({ active: false }).eq('id', req.params.id);
    res.json({ message: 'Charity deactivated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete charity' });
  }
});

module.exports = router;
