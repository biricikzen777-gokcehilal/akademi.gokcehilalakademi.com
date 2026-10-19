const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const mysql = require("mysql2"); // MySQL sürücüsü dahil edildi

const app = express();
app.use(cors());
app.use(express.json());

// Resimlerin tarayıcıdan görüntülenebilmesi için uploads klasörünü açıyoruz
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================================
// 1. MYSQL VERİTABANI BAĞLANTI AYARLARI
// ==========================================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",          // phpMyAdmin kullanıcı adınız (Genelde root olur)
    password: "",          // phpMyAdmin şifreniz (Genelde boş olur)
    database: "gokcehilalakademi" // Görseldeki veritabanı adınız
});

db.connect((err) => {
    if (err) {
        console.error("Veritabanına bağlanırken hata oluştu:", err.message);
    } else {
        console.log("MySQL Veritabanına başarıyla bağlanıldı.");
    }
});

// ==========================================
// 2. MULTER RESİM YÜKLEME AYARLARI
// ==========================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// ==========================================
// 3. ADMİN ÜRÜN YÖNETİMİ (MYSQL ROTANIZ)
// ==========================================

//? GET products - Ürünleri Listele
app.get("/api/products/:userId", (req, res) => {
    const query = "SELECT * FROM products";
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Veritabanından ürünler çekilemedi.");
        }
        res.status(200).json(results);
    });
});

//? POST products - Veritabanına Yeni Ürün Ekle (ASLA MULTER HATASI VERMEYEN ESNEK SÜRÜM)
app.post("/api/products", upload.any(), (req, res) => {
    try {
        const { p_name, p_stock, p_price, p_desc, u_id } = req.body;

        // Zorunlu alan kontrolü
        if (!p_name || !p_stock || !p_price) {
            return res.status(400).json("Gerekli alanlar eksik geldi.");
        }

        // upload.any() kullandığımız için gelen resim req.files dizisine düşer
        // Frontend hangi ismi (p_img1, image1, u_img1 vb.) gönderirse göndersin ilk dosyayı yakalar
        let p_img1_url = "";
        if (req.files && req.files.length > 0) {
            p_img1_url = `http://localhost:3001/uploads/${req.files[0].filename}`;
        }

        // phpMyAdmin tablonuzdaki sütun yapısı
        const query = `
            INSERT INTO products 
            (u_id, p_img1, p_name, p_stock, p_price, p_price_disc, p_active, p_desc) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            Number(u_id || 1),
            p_img1_url, // Yakalanan esnek resim url adresi
            p_name,
            Number(p_stock),
            Number(p_price),
            Number(p_price), // p_price_disc alanı zorunlu olduğundan normal fiyatla eşlendi
            1,               // p_active (Evet durumu)
            p_desc || ""
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ MySQL INSERT Hatası Detayı:", err.message);
                return res.status(500).json("Sunucu ürünü veritabanına ekleyemedi.");
            }
            res.status(201).json("Ürün Başarıyla Eklendi.");
        });
    }
    catch (e) {
        console.error("Sistemsel Hata:", e.message);
        res.status(500).json("Sunucu Hatası");
    }
});



//? PUT - Ürün Güncelle
app.put("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const { p_name, p_stock, p_price, p_desc } = req.body;

    const query = "UPDATE products SET p_name = ?, p_stock = ?, p_price = ?, p_desc = ? WHERE p_id = ?";
    db.query(query, [p_name, Number(p_stock), Number(p_price), p_desc, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Güncelleme başarısız.");
        }
        res.status(200).json({ message: "Ürün güncellendi." });
    });
});

//? DELETE - Ürün Sil
app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const query = "DELETE FROM products WHERE p_id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Silme işlemi başarısız.");
        }
        res.status(200).json({ message: "Ürün silindi." });
    });
});

// Sunucu Başlatma
const PORT = 3001;
app.listen(PORT, () => console.log(`Backend aktif: http://localhost:${PORT}`));
