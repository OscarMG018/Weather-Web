const express = require('express');
const weatherRoutes = require('./routes/weather.js');
const locationsRoutes = require('./routes/locations.js');
const { notFoundHandler } = require('./middleware/errorHandler.js');
const cors = require('cors');
require('dotenv').config({ path: '.env' });

console.log(process.env.PORT);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['https://voluble-travesseiro-4a0275.netlify.app/', 'http://localhost:5173'],
  credentials: true,
}));

// Logging middleware to track API calls
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  //console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${ip}`);
  next();
});

app.use(express.json());

app.use('/api/weather', weatherRoutes);
app.use('/api/locations', locationsRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(notFoundHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;