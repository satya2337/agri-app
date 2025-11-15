const express = require('express');
const router = express.Router();
const db = require('../db');

// ADD OR UPDATE CART
router.post('/add', (req, res) => {
    const { buyer_id, product_id, quantity } = req.body;

    // Step 1: check if product already exists in cart
    const checkSql = "SELECT * FROM cart WHERE buyer_id = ? AND product_id = ?";

    db.query(checkSql, [buyer_id, product_id], (err, rows) => {
        if (err) return res.json({ success: false, error: err });

        // If product already exists → Update quantity
        if (rows.length > 0) {
            const newQty = rows[0].quantity + parseInt(quantity);

            const updateSql = "UPDATE cart SET quantity = ? WHERE buyer_id = ? AND product_id = ?";
            db.query(updateSql, [newQty, buyer_id, product_id], (err2) => {
                if (err2) return res.json({ success: false, error: err2 });

                return res.json({
                    success: true,
                    message: "Cart updated (quantity increased)!"
                });
            });
        }

        // Otherwise insert new item
        else {
            const insertSql = "INSERT INTO cart (buyer_id, product_id, quantity) VALUES (?, ?, ?)";
            db.query(insertSql, [buyer_id, product_id, quantity], (err3) => {
                if (err3) return res.json({ success: false, error: err3 });

                return res.json({
                    success: true,
                    message: "Added to cart!"
                });
            });
        }
    });
});

// GET CART ITEMS
router.get('/:buyer_id', (req, res) => {
    const buyer_id = req.params.buyer_id;

    const sql = `
        SELECT 
            cart.id, 
            products.title, 
            products.price, 
            products.image,
            cart.quantity 
        FROM cart 
        JOIN products ON cart.product_id = products.id 
        WHERE buyer_id = ?
    `;

    db.query(sql, [buyer_id], (err, result) => {
        if (err) return res.json({ success: false, error: err });

        result.forEach(item => {
            item.image_url = `http://localhost:5000/uploads/${item.image}`;
        });

        res.json(result);
    });
});

// REMOVE FROM CART
router.delete('/remove/:id', (req, res) => {
    const cart_id = req.params.id;

    db.query("DELETE FROM cart WHERE id = ?", [cart_id], (err, result) => {
        if (err) return res.json({ success: false, error: err });

        res.json({ success: true, message: "Item removed from cart!" });
    });
});

module.exports = router;
