const express   = require("express");
const path      = require("path");
const fs        = require("fs");
const rateLimit = require("express-rate-limit");
const helmet    = require("helmet");
const cors      = require("cors");

const app         = express();
const PORT        = 3000;
const ADMIN_TOKEN = "shecan-admin-2025";
const DB_PATH     = path.join(__dirname, "database", "submissions.json");

// Create database folder if it doesn't exist
if (!fs.existsSync(path.join(__dirname, "database"))) {
  fs.mkdirSync(path.join(__dirname, "database"));
}

// Read and write JSON database
function readDB() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, "utf8")); }
  catch { return { submissions: [], nextId: 1 }; }
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Rate limiter
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: "Too many submissions. Try again later." }
});

// Helpers
function sanitize(str = "", max = 2000) {
  return String(str).trim().slice(0, max).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
}
function adminAuth(req, res, next) {
  const token = req.headers["x-admin-token"] || req.query.token;
  if (token !== ADMIN_TOKEN) return res.status(401).json({ success: false, error: "Unauthorized" });
  next();
}

// ── POST /api/contact ──────────────────────────
app.post("/api/contact", contactLimiter, (req, res) => {
  let { name, email, subject, message } = req.body;
  name    = sanitize(name, 100);
  email   = sanitize(email, 254);
  subject = sanitize(subject, 200);
  message = sanitize(message, 500);

  const errors = [];
  if (!name || name.length < 2)        errors.push("Name must be at least 2 characters.");
  if (!email || !isValidEmail(email))   errors.push("A valid email address is required.");
  if (!message || message.length < 10)  errors.push("Message must be at least 10 characters.");
  if (errors.length) return res.status(400).json({ success: false, errors });

  const db    = readDB();
  const entry = {
    id: db.nextId++,
    name, email,
    subject: subject || "",
    message,
    status: "new",
    created_at: new Date().toISOString()
  };
  db.submissions.push(entry);
  writeDB(db);

  console.log(`New submission #${entry.id} from ${email}`);
  return res.status(201).json({ success: true, id: entry.id, message: "Form Submitted Successfully" });
});

// ── GET /api/admin/submissions ─────────────────
app.get("/api/admin/submissions", adminAuth, (req, res) => {
  const db = readDB();
  res.json({ success: true, total: db.submissions.length, data: [...db.submissions].reverse() });
});

// ── PATCH /api/admin/submissions/:id ───────────
app.patch("/api/admin/submissions/:id", adminAuth, (req, res) => {
  const db      = readDB();
  const id      = parseInt(req.params.id);
  const entry   = db.submissions.find(s => s.id === id);
  const allowed = ["new", "read", "replied", "archived"];
  if (!entry) return res.status(404).json({ success: false });
  if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false });
  entry.status = req.body.status;
  writeDB(db);
  res.json({ success: true });
});

// ── DELETE /api/admin/submissions/:id ──────────
app.delete("/api/admin/submissions/:id", adminAuth, (req, res) => {
  const db = readDB();
  db.submissions = db.submissions.filter(s => s.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ success: true });
});

// ── GET /api/admin/stats ───────────────────────
app.get("/api/admin/stats", adminAuth, (req, res) => {
  const db    = readDB();
  const today = new Date().toISOString().slice(0, 10);
  res.json({
    success : true,
    total   : db.submissions.length,
    new     : db.submissions.filter(s => s.status === "new").length,
    today   : db.submissions.filter(s => s.created_at.startsWith(today)).length
  });
});

// Fallback — serve index.html for all other routes
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => {
  console.log(`\n✦ She Can Foundation running → http://localhost:${PORT}`);
  console.log(`  Admin panel              → http://localhost:${PORT}/admin.html\n`);
});