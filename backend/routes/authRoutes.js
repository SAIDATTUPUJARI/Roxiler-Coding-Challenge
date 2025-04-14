const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../authMiddleware');

const pool = require('../db');
require('dotenv').config();

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user exists
        const [existingUser] = await pool.query(
            'SELECT * FROM users WHERE username = ? OR email = ?', 
            [username, email]
        );
        
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        // Create user
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, passwordHash]
        );
        
        // Create token
        const payload = {
            user: {
                id: result.insertId,
                username
            }
        };
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if user exists
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ?', 
            [username]
        );
        
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Create token
        const payload = {
            user: {
                id: user.id,
                username: user.username
            }
        };
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update password
router.put('/update-password', async (req, res) => {
    try {
        const { username, currentPassword, newPassword } = req.body;
        
        // Check if user exists
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ?', 
            [username]
        );
        
        if (users.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }
        
        const user = users[0];
        
        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);
        
        // Update password
        await pool.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [newPasswordHash, user.id]
        );
        
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add this route to authRoutes.js
router.get('/user', authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
  
      const [result] = await pool.query(
        'SELECT id, username, email FROM users WHERE id = ?',
        [userId]
      );
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(result[0]);
    } catch (err) {
      console.error('Error fetching user:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;