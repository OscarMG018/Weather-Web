const express = require('express');
const weatherRoutes = require('./routes/weather.js');
const locationsRoutes = require('./routes/locations.js');
const { notFoundHandler } = require('./middleware/errorHandler.js');
const cors = require('cors');
require('dotenv').config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 3000;

/* CORS LOCAL */
app.use(cors({
  origin: 'http://localhost:5173'
}));

/* CORS PROD 

app.use(cors({
  origin: 'https://frontend-domain-url'
}));

*/

// Logging middleware to track API calls
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${ip}`);
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