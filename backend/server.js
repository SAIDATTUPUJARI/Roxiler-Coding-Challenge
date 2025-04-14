const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Store Ratings API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});