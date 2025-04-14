const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticate = require('../authMiddleware');

// Get all stores with user's rating
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // First verify database connection
        const connection = await pool.getConnection();
        
        const [stores] = await connection.query(`
            SELECT s.*, r.rating as user_rating, 
                   (SELECT AVG(rating) FROM ratings WHERE store_id = s.id) as overall_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id AND r.user_id = ?
        `, [userId]);
        
        connection.release();
        
        if (!stores) {
            return res.status(404).json({ message: 'No stores found' });
        }
        
        res.json(stores);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ 
            message: 'Server error',
            error: err.message,
            sql: err.sql 
        });
    }
});

// Search stores by name or address
router.get('/search', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { query } = req.query;
        
        const [stores] = await pool.query(`
            SELECT s.*, r.rating as user_rating, 
                   (SELECT AVG(rating) FROM ratings WHERE store_id = s.id) as overall_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id AND r.user_id = ?
            WHERE s.name LIKE ? OR s.address LIKE ?
        `, [userId, `%${query}%`, `%${query}%`]);
        
        res.json(stores);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Submit or update rating
router.post('/:id/rate', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const storeId = req.params.id;
        const { rating } = req.body;
        
        // Check if store exists
        const [stores] = await pool.query('SELECT * FROM stores WHERE id = ?', [storeId]);
        if (stores.length === 0) {
            return res.status(404).json({ message: 'Store not found' });
        }
        
        // Check if rating exists
        const [existingRatings] = await pool.query(
            'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
            [userId, storeId]
        );
        
        if (existingRatings.length > 0) {
            // Update existing rating
            await pool.query(
                'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
                [rating, userId, storeId]
            );
            res.json({ message: 'Rating updated successfully' });
        } else {
            // Create new rating
            await pool.query(
                'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
                [userId, storeId, rating]
            );
            res.json({ message: 'Rating submitted successfully' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;