require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const updates = [
  { id: 'blg-01', num: '01', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop' },
  { id: 'blg-02', num: '02', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop' },
  { id: 'blg-03', num: '03', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop' },
  { id: 'blg-04', num: '04', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop' },
  { id: 'blg-agentic-ai', num: '05', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop' }
];

async function run() {
  try {
    await client.connect();
    for (const u of updates) {
      await client.query('UPDATE blogs SET image_url = $1, num = $2 WHERE id = $3', [u.image, u.num, u.id]);
    }
    const res = await client.query('SELECT id, num, title, category, image_url FROM blogs ORDER BY num ASC');
    console.log('Database blogs verified:');
    res.rows.forEach(r => console.log(`[${r.num}] ${r.title} (${r.category}) -> ${r.image_url ? 'Has Image' : 'No Image'}`));
    await client.end();
  } catch (e) {
    console.error('Update error:', e);
  }
}
run();
