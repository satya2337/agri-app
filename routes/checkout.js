const express = require('express');
const router = express.Router();
const db = require('../db');

// GET CART ITEMS
router.get('/:buyer_id', (req, res) => {
    const buyer_id = req.params.buyer_id;

    const sql = `
        SELECT cart.id, products.title, products.price, products.image,
               cart.quantity,
               CONCAT('http://localhost:5000/uploads/', products.image) AS image_url
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.buyer_id = ?
    `;

    db.query(sql, [buyer_id], (err, result) => {
        if (err) return res.json({ success: false, error: err });

        res.json(result);
    });
});

// REMOVE ITEM FROM CART
router.delete('/remove/:id', (req, res) => {
    const cart_id = req.params.id;

    db.query("DELETE FROM cart WHERE id = ?", [cart_id], (err, result) => {
        if (err) return res.json({ success: false, error: err });

        res.json({ success: true, message: "Item removed from cart!" });
    });
});

module.exports = router;
