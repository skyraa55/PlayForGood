require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('./lib/supabase');
async function seed() {
  console.log('Seeding admin and test users...');
  const adminHash = await bcrypt.hash('Admin123!', 12);
  const userHash = await bcrypt.hash('User123!', 12);
  const { error: e1 } = await supabase.from('users').upsert({
    name: 'Admin',
    email: 'admin@golfgives.com',
    password_hash: adminHash,
    role: 'admin',
    subscription_status: 'active',
  }, { onConflict: 'email' });
  if (e1) console.error('Admin seed error:', e1.message);
  else console.log('Admin user seeded: admin@golfgives.com / Admin123!');

  const { error: e2 } = await supabase.from('users').upsert({
    name: 'Test User',
    email: 'user@golfgives.com',
    password_hash: userHash,
    role: 'user',
    subscription_status: 'active',
    subscription_plan: 'monthly',
  }, { onConflict: 'email' });
  if (e2) console.error('User seed error:', e2.message);
  else console.log('Test user seeded: user@golfgives.com / User123!');
  const charities = [
    { name: 'Cancer Research UK', description: 'The largest independent cancer research organisation in the world, dedicated to saving more lives through research, diagnosis and treatment.', website: 'https://www.cancerresearchuk.org', featured: true, active: true },
    { name: 'British Heart Foundation', description: 'Fighting for every heartbeat — funding research into heart and circulatory diseases.', website: 'https://www.bhf.org.uk', featured: true, active: true },
    { name: 'Macmillan Cancer Support', description: 'Providing specialist health care, information and financial support to people affected by cancer.', website: 'https://www.macmillan.org.uk', featured: true, active: true },
    { name: 'Golf Foundation', description: 'Developing junior golfers and promoting golf in communities across the UK.', website: 'https://www.golf-foundation.org', featured: false, active: true },
    { name: 'Comic Relief', description: 'Using the power of entertainment to create positive change in the UK and around the world.', website: 'https://www.comicrelief.com', featured: false, active: true },
    { name: 'RNLI', description: 'Saving lives at sea around the coasts of the United Kingdom and Ireland.', website: 'https://www.rnli.org', featured: false, active: true },
  ];
  for (const c of charities) {
    const { error } = await supabase.from('charities').insert(c);
    if (error && !error.message.includes('duplicate')) console.error(`Charity error (${c.name}):`, error.message);
    else if (!error) console.log(`Charity: ${c.name}`);
  }
  const { data: testUser } = await supabase.from('users').select('id').eq('email', 'user@golfgives.com').single();
  if (testUser) {
    const testScores = [
      { user_id: testUser.id, score: 32, score_date: '2025-03-15' },
      { user_id: testUser.id, score: 28, score_date: '2025-03-08' },
      { user_id: testUser.id, score: 35, score_date: '2025-03-01' },
      { user_id: testUser.id, score: 24, score_date: '2025-02-22' },
      { user_id: testUser.id, score: 30, score_date: '2025-02-15' },
    ];
    for (const s of testScores) {
      await supabase.from('scores').insert(s);
    }
    console.log('Test scores added');
  }
  console.log('\n Seeding complete!');
  process.exit(0);
}
seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
