require('dotenv').config();
const express        = require('express');
const helmet         = require('helmet');
const cors           = require('cors');
const morgan         = require('morgan');
const connectDB      = require('./config/db');
const errorHandler   = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const { checkAlerts } = require('./controllers/alertController');

// Routes
const medicineRoutes = require('./routes/medicineRoutes');
const aiRoutes       = require('./routes/aiRoutes');
const alertRoutes    = require('./routes/alertRoutes');
const historyRoutes  = require('./routes/historyRoutes');

const app = express();

// ── Database ──────────────────────────────────────────────────────────────────
connectDB();

// ── CORS (allow local dev + Vercel preview + custom domain) ──────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  // Add your Vercel frontend URLs:
  process.env.FRONTEND_URL,
  /\.vercel\.app$/,   // matches any *.vercel.app
].filter(Boolean);

app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    const allowed = ALLOWED_ORIGINS.some((o) =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    callback(allowed ? null : new Error('CORS: Origin not allowed'), allowed);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id'],
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/medicine', medicineRoutes);
app.use('/api/ai',       aiRoutes);
app.use('/api/alerts',   alertRoutes);
app.use('/api/history',  historyRoutes);

// Health check — used by Vercel and uptime monitors
app.get('/health', (req, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date().toISOString() })
);

// 404
app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

// Global error handler
app.use(errorHandler);

// ── Start server locally (NOT on Vercel — Vercel exports the app as a function) ──
const isVercel = !!process.env.VERCEL;
if (!isVercel) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 MedSave server  → http://localhost:${PORT}`);
    console.log(`📦 Environment     → ${process.env.NODE_ENV || 'development'}`);
    console.log(`🤖 Groq model      → llama-3.3-70b-versatile`);
  });

  // Background: check price alerts every 6 hours (only in long-running process)
  setInterval(checkAlerts, 6 * 60 * 60 * 1000);
}

// Export for Vercel serverless
module.exports = app;
