const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");

// =====================================
//   IMAGE STORAGE CONFIGURATION
// =====================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpg|jpeg|png|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);

        if (ext && mime) cb(null, true);
        else cb(new Error("Only JPG, JPEG, PNG, WEBP allowed"));
    }
});

// =====================================
//       ADD PRODUCT (with image)
// =====================================
router.post("/add", upload.single("image"), (req, res) => {

    const { farmer_id, title, description, price, quantity } = req.body;

    if (!farmer_id || !title || !description || !price || !quantity) {
        return res.json({ success: false, error: "All fields are required!" });
    }

    if (!req.file) {
        return res.json({ success: false, error: "Product image required!" });
    }

    const image = req.file.filename;

    const sql = `
        INSERT INTO products (farmer_id, title, description, price, quantity, image)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [farmer_id, title, description, price, quantity, image], (err, result) => {
        if (err) {
            console.log("SQL ERROR:", err);
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
                image,
                image_url: `http://localhost:5000/uploads/${image}`
            }
        });
    });
});

// =====================================
//         GET ALL PRODUCTS
// =====================================
router.get("/", (req, res) => {
    const sql = "SELECT * FROM products ORDER BY id DESC";

    db.query(sql, (err, rows) => {
        if (err) {
            console.log("SQL ERROR:", err);
            return res.json({ success: false, error: err.sqlMessage });
        }

        const products = rows.map(p => ({
            ...p,
            image_url: `http://localhost:5000/uploads/${p.image}`
        }));

        res.json({ success: true, products });
    });
});

// ====================================================
//     GET PRODUCTS OF A SPECIFIC FARMER
// ====================================================
router.get("/farmer/:farmer_id", (req, res) => {
    const farmer_id = req.params.farmer_id;

    const sql = "SELECT * FROM products WHERE farmer_id = ? ORDER BY id DESC";

    db.query(sql, [farmer_id], (err, rows) => {
        if (err) {
            console.log("SQL ERROR:", err);
            return res.json({ success: false, error: err.sqlMessage });
        }

        const products = rows.map(p => ({
            ...p,
            image_url: `http://localhost:5000/uploads/${p.image}`
        }));

        res.json({ success: true, products });
    });
});

module.exports = router;
