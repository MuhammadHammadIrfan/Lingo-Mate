const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const chatRoutes = require('./routes/chat');
const speechRoutes = require('./routes/speech');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Support larger payloads for audio data

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/speech', speechRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// app.listen(5000, '0.0.0.0', () => {
//   console.log('Server is running on http://0.0.0.0:5000');
// });

