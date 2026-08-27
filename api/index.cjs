require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const fs       = require('fs');
const path     = require('path');

const app    = express();
// Default secret for Vercel if not set in Vercel Environment Variables
const SECRET = process.env.JWT_SECRET || 'bluecross_vercel_secret_key';

// Use Vercel's /tmp in production, or local api/db.json in development
const DB_PATH = process.env.VERCEL ? '/tmp/db.json' : path.join(__dirname, 'db.json');

app.use(express.json());
// Allow frontend to communicate with API on Vercel
app.use(cors());

// ── JSON Database ─────────────────────────────────────────────────────────────
function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = { users: [], likes: {}, requests: [], aiMatch: {} };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ── Seed admin on first run ───────────────────────────────────────────────────
async function seedAdmin() {
  const db = readDB();
  const exists = db.users.find(u => u.username === 'bluecross');
  if (!exists) {
    const hash = await bcrypt.hash('bluecross123', 10);
    db.users.push({
      id:        'admin-001',
      fullName:  'Blue Cross Admin',
      username:  'bluecross',
      password:  hash,
      role:      'bluecross',
      createdAt: new Date().toISOString(),
    });
    writeDB(db);
    console.log('✅ Admin seeded on Vercel');
  }
}

// Seed on module load (Serverless cold start)
seedAdmin().catch(console.error);

// ── Auth middleware ───────────────────────────────────────────────────────────
function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token  = header.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: 'Not authenticated.' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Session expired. Please login again.' });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function normalizeUsername(u) { return u.trim().toLowerCase(); }

function makeToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, fullName: user.fullName },
    SECRET,
    { expiresIn: '7d' }
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROUTES
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/register', async (req, res) => {
  let { fullName, username, password, confirmPassword } = req.body;
  if (!fullName?.trim())          return res.status(400).json({ error: 'Full name is required.' });
  if (!username?.trim())          return res.status(400).json({ error: 'Username is required.' });
  if (username.trim().length < 3) return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  if (!password)                  return res.status(400).json({ error: 'Password is required.' });
  if (password.length < 6)       return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match.' });

  const norm = normalizeUsername(username);
  if (!/^[a-z0-9_]+$/.test(norm)) return res.status(400).json({ error: 'Username can only contain letters, numbers and underscores.' });

  const db = readDB();
  if (db.users.find(u => normalizeUsername(u.username) === norm)) return res.status(409).json({ error: 'Username is already taken.' });

  const hash = await bcrypt.hash(password, 10);
  const user = {
    id:        `user-${Date.now()}`,
    fullName:  fullName.trim(),
    username:  norm,
    password:  hash,
    role:      'user',
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDB(db);

  const token = makeToken(user);
  return res.status(201).json({ success: true, token, user: { id: user.id, fullName: user.fullName, username: user.username, role: user.role }});
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required.' });

  const norm = normalizeUsername(username);
  const db   = readDB();
  const user = db.users.find(u => normalizeUsername(u.username) === norm);
  if (!user) return res.status(401).json({ error: 'Incorrect username or password.' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Incorrect username or password.' });

  const token = makeToken(user);
  return res.json({ success: true, token, user: { id: user.id, fullName: user.fullName, username: user.username, role: user.role }});
});

app.get('/api/me', authRequired, (req, res) => {
  const db   = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  return res.json({ id: user.id, fullName: user.fullName, username: user.username, role: user.role });
});

app.put('/api/profile', authRequired, (req, res) => {
  const { fullName } = req.body;
  if (!fullName?.trim()) return res.status(400).json({ error: 'Full name is required.' });

  const db  = readDB();
  const idx = db.users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found.' });

  db.users[idx].fullName = fullName.trim();
  writeDB(db);
  const token = makeToken(db.users[idx]);
  return res.json({ success: true, token, fullName: fullName.trim() });
});

app.get('/api/likes', authRequired, (req, res) => {
  return res.json(readDB().likes[req.user.id] || []);
});

app.post('/api/likes/toggle', authRequired, (req, res) => {
  const { petId } = req.body;
  if (!petId) return res.status(400).json({ error: 'petId required.' });

  const db  = readDB();
  const uid = req.user.id;
  if (!db.likes[uid]) db.likes[uid] = [];

  const idx = db.likes[uid].indexOf(petId);
  if (idx === -1) db.likes[uid].push(petId);
  else            db.likes[uid].splice(idx, 1);

  writeDB(db);
  return res.json(db.likes[uid]);
});

app.get('/api/requests', authRequired, (req, res) => {
  const db = readDB();
  if (req.user.role === 'bluecross') return res.json(db.requests);
  return res.json(db.requests.filter(r => r.userId === req.user.id));
});

app.post('/api/requests', authRequired, (req, res) => {
  const { pet, type } = req.body;
  if (!pet || !type) return res.status(400).json({ error: 'pet and type required.' });

  const db = readDB();
  const request = {
    id:        `req-${Date.now()}`,
    userId:    req.user.id,
    user:      req.user.fullName,
    username:  req.user.username,
    phone:     req.body.phone || '',
    pet,
    type,
    status:    'Pending',
    createdAt: new Date().toISOString(),
  };
  db.requests.push(request);
  writeDB(db);
  return res.status(201).json(request);
});

app.put('/api/requests/:id', authRequired, (req, res) => {
  if (req.user.role !== 'bluecross') return res.status(403).json({ error: 'Admin only.' });
  const { status } = req.body;
  if (!['Approved', 'Rejected', 'Pending'].includes(status)) return res.status(400).json({ error: 'Invalid status.' });

  const db  = readDB();
  const idx = db.requests.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Request not found.' });
  db.requests[idx].status = status;
  writeDB(db);
  return res.json(db.requests[idx]);
});

app.get('/api/aimatch', authRequired, (req, res) => {
  return res.json(readDB().aiMatch[req.user.id] || null);
});

app.post('/api/aimatch', authRequired, (req, res) => {
  const { answers, matches } = req.body;
  const db = readDB();
  db.aiMatch[req.user.id] = { answers, matches, savedAt: new Date().toISOString() };
  writeDB(db);
  return res.json({ success: true });
});

app.get('/api/health', (_, res) => res.json({ status: 'vercel-ok' }));

// Export the Express app for Vercel Serverless
module.exports = app;

// If running locally via Node
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Blue Cross Auth Server running locally on http://localhost:${PORT}`);
  });
}
