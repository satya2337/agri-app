const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");

// =====================================
//   CLOUDINARY CONFIG
// =====================================
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,       // dertiy3zc
    api_key: process.env.CLOUD_KEY,           // 548398554486147
    api_secret: process.env.CLOUD_SECRET      // qA5mKooCXuKz7QyZX-VBb3np0UU
});

// =====================================
//   MULTER STORAGE (CLOUDINARY)
// =====================================
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "agri_app_products",
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }
});

const upload = multer({ storage });

// =====================================
//   ADD PRODUCT (UPLOAD TO CLOUDINARY)
// =====================================
router.post("/add", upload.single("image"), (req, res) => {
    const { farmer_id, title, description, price, quantity } = req.body;

    if (!req.file) {
        return res.json({ success: false, error: "Product image required!" });
    }

    const image_url = req.file.path;  // Cloudinary URL

    const sql = `
        INSERT INTO products (farmer_id, title, description, price, quantity, image)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [farmer_id, title, description, price, quantity, image_url],
        (err, result) => {
            if (err) {
                return res.json({ success: false, error: err.sqlMessage });
            }

            res.json({
                success: true,
                message: "Product added successfully!",
                product: {
                    id: result.insertId,
                    farmer_id,
                    title,
                    description,
                    price,
                    quantity,
                    image_url
                }
            });
        }
    );
});

// =====================================
//   GET ALL PRODUCTS
// =====================================
router.get("/", (req, res) => {
    const sql = "SELECT * FROM products ORDER BY id DESC";

    db.query(sql, (err, rows) => {
        if (err) {
            return res.json({ success: false, error: err.sqlMessage });
        }

        const products = rows.map(p => ({
            ...p,
            image_url: p.image  // Already cloudinary URL
        }));

        res.json({ success: true, products });
    });
});

// =====================================
//   GET PRODUCTS OF A FARMER
// =====================================
router.get("/farmer/:farmer_id", (req, res) => {
    const farmer_id = req.params.farmer_id;

    const sql = "SELECT * FROM products WHERE farmer_id = ? ORDER BY id DESC";

    db.query(sql, [farmer_id], (err, rows) => {
        if (err) {
            return res.json({ success: false, error: err.sqlMessage });
        }

        const products = rows.map(p => ({
            ...p,
            image_url: p.image  // cloudinary URL
        }));

        res.json({ success: true, products });
    });
});

module.exports = router;
