require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { initDatabase } = require('./models');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/BookmarkRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// 1. Security & Parsers
app.use(helmet());
app.use(express.json());

// 2. CORS Configuration (Only ONCE, using your env variable)
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true // Helpful for JWT auth
};
app.use(cors(corsOptions)); // <--- Only applied here!

// 3. Routes
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookRoutes);
app.use('/api/categories', categoryRoutes); 

// 4. Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

initDatabase().then(() => {
  app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
}).catch(err => {
  console.error('Failed to start database:', err);
});
