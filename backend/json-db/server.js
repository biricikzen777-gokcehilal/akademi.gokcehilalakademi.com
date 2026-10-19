const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// Yüklenen klasör yapısının tarayıcıdan/frontendden okunabilmesi için dışarı açıyoruz
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================================
// 1. MYSQL VERİTABANI BAĞLANTI AYARLARI
// ==========================================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gokcehilalakademi"
});

db.connect((err) => {
    if (err) {
        console.error("Veritabanı bağlantı hatası:", err.message);
    } else {
        console.log("MySQL Veritabanına başarıyla bağlanıldı.");
    }
});

// ==========================================
// YARDIMCI FONKSİYON: Klasör Adı İçin Yazıyı Temizle
// ==========================================
function slugifyFolderName(text) {
    const maps = {
        'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'I': 'i', 'İ': 'i',
        'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u'
    };
    let slug = text.toString().toLowerCase();
    Object.keys(maps).forEach(key => {
        slug = slug.replaceAll(key, maps[key]);
    });
    // Boşlukları ve özel karakterleri tamamen temizleyip birleştirir
    return slug.replace(/[^a-z0-9]/g, ''); 
}

// ==========================================
// 2. DİNAMİK KLASÖR AÇAN VE İSİMLENDİREN MULTER MOTORU
// ==========================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Form verilerinden gelen ürün adını yakalıyoruz, gelmediyse varsayılan bir isim veriyoruz
        const productName = req.body.p_name || "adsiz-urun";
        const folderName = slugifyFolderName(productName);
        const targetPath = path.join(__dirname, "uploads", folderName);

        // İstediğiniz ürün isimli klasör yoksa anında otomatik olarak oluşturulur
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
        }
        cb(null, targetPath);
    },
    filename: (req, file, cb) => {
        // İstekte kaçıncı dosyanın işlendiğini bulup img1, img2, img3 olarak kilitliyoruz
        if (!req.fileIndexCounter) {
            req.fileIndexCounter = 1;
        } else {
            req.fileIndexCounter++;
        }
        
        const ext = path.extname(file.originalname); // .jpg, .png vb. uzantıyı korur
        const newFileName = `img${req.fileIndexCounter}${ext}`;
        cb(null, newFileName);
    }
});
const upload = multer({ storage: storage });

// ==========================================
// 3. ADMİN PANELİ GÜVENLİ ÜRÜN EKLEME ROTASI
// ==========================================

//? GET products - Ürünleri Listele
app.get("/api/products/:userId", (req, res) => {
    const query = "SELECT * FROM products ORDER BY p_id DESC";
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Ürünler çekilemedi.");
        }
        res.status(200).json(results);
    });
});

//? POST secure product - 3 Resimli Dinamik Ürün Klasörü Oluşturan Ana Sistem
app.post("/api/addProductSecure", upload.any(), (req, res) => {
    try {
        const { p_name, p_stock, p_price, p_desc, u_id } = req.body;

        if (!p_name || !p_stock || !p_price) {
            return res.status(400).json("Gerekli alanlar eksik geldi.");
        }

        const folderName = slugifyFolderName(p_name);
        
        // Yüklenen dosyaları virgülle birleştirip tam istediğiniz formatta hazırlıyoruz
        let p_img1 = "";
        if (req.files && req.files.length > 0) {
            const imgPaths = req.files.map(file => `/uploads/${folderName}/${file.filename}`);
            p_img1 = imgPaths.join(","); // Örn: /uploads/ruhsalsifaprogrami/img1.jpg,/uploads/ruhsalsifaprogrami/img2.png
        }

        const query = `
            INSERT INTO products 
            (u_id, p_img1, p_name, p_stock, p_price, p_price_disc, p_active, p_desc) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            Number(u_id || 1),
            p_img1, 
            p_name,
            Number(p_stock),
            Number(p_price),
            Number(p_price),
            1,
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
        if (err) return res.status(500).json("Güncelleme başarısız.");
        res.status(200).json({ message: "Ürün güncellendi." });
    });
});

//? DELETE - Ürün Sil
app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const query = "DELETE FROM products WHERE p_id = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json("Silme işlemi başarısız.");
        res.status(200).json({ message: "Ürün silindi." });
    });
});

// Sunucu Kilit Açma Satırı
const PORT = 3001;
app.listen(PORT, () => console.log(`Backend sistem aktif: http://localhost:${PORT}`));
