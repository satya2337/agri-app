const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// SIGNUP API
router.post('/signup', async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [name, email, hashedPassword, phone, role], (err, result) => {
        if (err) {
            return res.json({ error: err });
        }

        res.json({ success: true, message: "Signup successful!" });
    });
});


// LOGIN API
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {
        if (err) return res.json({ error: err });

        if (results.length === 0) {
            return res.json({ error: "User not found!" });
        }

        const user = results[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ error: "Wrong password!" });
        }

        res.json({
            success: true,
            message: "Login successful!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
});

module.exports = router;
