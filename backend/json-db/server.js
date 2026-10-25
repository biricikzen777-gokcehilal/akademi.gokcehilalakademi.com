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
    return slug.replace(/[^a-z0-9]/g, ''); 
}

// ==========================================
// 2. 3 RESMİ AYRI AYRI YAKALAYAN VE KLASÖRLEYEN MULTER MOTORU
// ==========================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const productName = req.body.p_name || "adsiz-urun";
        const folderName = slugifyFolderName(productName);
        const targetPath = path.join(__dirname, "uploads", folderName);

        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
        }
        cb(null, targetPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        let fieldNumber = "1";
        if (file.fieldname === "p_img2") fieldNumber = "2";
        if (file.fieldname === "p_img3") fieldNumber = "3";
        
        cb(null, `img${fieldNumber}${ext}`);
    }
});
const upload = multer({ storage: storage });

// ==========================================
// 3. ÜRÜN YÖNETİMİ (PRODUCTS) API ROTACILARI
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

//? POST - 3 Resimli Ve 3 Sütunlu Güvenli Ürün Ekleme
app.post("/api/addProductSecure", upload.fields([
    { name: 'p_img1', maxCount: 1 },
    { name: 'p_img2', maxCount: 1 },
    { name: 'p_img3', maxCount: 1 }
]), (req, res) => {
    try {
        const { p_name, p_stock, p_price, p_desc, u_id } = req.body;

        if (!p_name || p_stock === undefined || !p_price) {
            return res.status(400).json("Gerekli alanlar eksik geldi.");
        }

        const folderName = slugifyFolderName(p_name);

        const img1_path = req.files && req.files['p_img1'] ? `/uploads/${folderName}/${req.files['p_img1'][0].filename}` : "";
        const img2_path = req.files && req.files['p_img2'] ? `/uploads/${folderName}/${req.files['p_img2'][0].filename}` : "";
        const img3_path = req.files && req.files['p_img3'] ? `/uploads/${folderName}/${req.files['p_img3'][0].filename}` : "";

        const query = `
            INSERT INTO products 
            (u_id, p_img1, p_img2, p_img3, p_name, p_stock, p_price, p_price_disc, p_active, p_desc) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const formattedPrice = parseFloat(p_price) || 0.00;
        const formattedStock = parseInt(p_stock) || 0;

        const values = [
            Number(u_id || 1),
            img1_path, 
            img2_path, 
            img3_path, 
            p_name,
            formattedStock,
            formattedPrice,
            formattedPrice, 
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
    try {
        const id = Number(req.params.id);
        const { p_name, p_stock, p_price, p_desc } = req.body;

        if (!p_name || p_stock === undefined || !p_price) {
            return res.status(400).json("Hatalı veri geldi veya zorunlu alanlar boş.");
        }

        const formattedPrice = parseFloat(p_price) || 0.00;
        const formattedStock = parseInt(p_stock) || 0;

        const query = `
            UPDATE products 
            SET p_name = ?, p_stock = ?, p_price = ?, p_price_disc = ?, p_desc = ? 
            WHERE p_id = ?
        `;

        const values = [
            p_name.trim(),
            formattedStock,
            formattedPrice,
            formattedPrice, 
            p_desc || "",
            id
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ MySQL UPDATE Hatası Detayı:", err.message);
                return res.status(500).json("Güncelleme başarısız.");
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Güncellenecek ürün bulunamadı." });
            }
            res.status(200).json({ message: "Ürün başarıyla güncellendi." });
        });
    } catch (e) {
        console.error("Sistemsel Güncelleme Hatası:", e.message);
        res.status(500).json("Sunucu Hatası");
    }
});

//? DELETE - Ürün Sil
app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const query = "DELETE FROM products WHERE p_id = ?";
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("❌ MySQL DELETE Hatası Detayı:", err.message);
            return res.status(500).json("Ürün silme işlemi başarısız.");
        }
        if (result.affectedRows === 0) {
            return res.status(404).json("Silinecek ürün bulunamadı.");
        }
        res.status(200).json("Ürün başarıyla silindi.");
    });
});

// ==========================================================================
// 4. KULLANICI YÖNETİMİ (ADMIN-USERS) API ROTACILARI
// ==========================================================================

//? GET - Tüm kullanıcıları listele
app.get("/api/users", (req, res) => {
    const query = "SELECT u_id, u_firstName, u_lastName, u_email, u_tel, u_pass, u_role FROM users ORDER BY u_id DESC";
    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ MySQL GET Users Hatası:", err.message);
            return res.status(500).json("Kullanıcı listesi çekilemedi.");
        }
        res.status(200).json(results);
    });
});

//? POST - Yeni kullanıcı ekle
app.post("/api/users", (req, res) => {
    try {
        const { firstName, lastName, email, tel, pass, role } = req.body;

        if (!firstName || !lastName || !email || !pass) {
            return res.status(400).json("Gerekli zorunlu alanlar eksik geldi.");
        }

        const query = "INSERT INTO users (u_firstName, u_lastName, u_email, u_tel, u_pass, u_role) VALUES (?, ?, ?, ?, ?, ?)";
        const values = [
            firstName.trim(), 
            lastName.trim(), 
            email.trim(), 
            tel ? tel.trim() : "", 
            pass, 
            parseInt(role) || 0
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ MySQL INSERT User Hatası:", err.message);
                return res.status(500).json("Kullanıcı veritabanına eklenemedi.");
            }
            res.status(201).json("Kullanıcı Başarıyla Eklendi.");
        });
    } catch (e) {
        console.error("Sistemsel Kullanıcı Ekleme Hatası:", e.message);
        res.status(500).json("Sunucu Hatası");
    }
});

//? PUT - Kullanıcı bilgilerini güncelle
app.put("/api/users/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const { firstName, lastName, email, tel, pass, role } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json("Hatalı veri geldi veya zorunlu alanlar boş.");
        }

        const query = "UPDATE users SET u_firstName = ?, u_lastName = ?, u_email = ?, u_tel = ?, u_pass = ?, u_role = ? WHERE u_id = ?";
        const values = [
            firstName.trim(),
            lastName.trim(),
            email.trim(),
            tel ? tel.trim() : "",
            pass,
            parseInt(role) || 0,
            id
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ MySQL UPDATE User Hatası:", err.message);
                return res.status(500).json("Kullanıcı güncelleme işlemi başarısız.");
            }
            if (result.affectedRows === 0) {
                return res.status(404).json("Güncellenecek kullanıcı bulunamadı.");
            }
            res.status(200).json("Kullanıcı başarıyla güncellendi.");
        });
    } catch (e) {
        console.error("Sistemsel Kullanıcı Güncelleme Hatası:", e.message);
        res.status(500).json("Sunucu Hatası");
    }
});

//? DELETE - Kullanıcı sil
app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const query = "DELETE FROM users WHERE u_id = ?";
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("❌ MySQL DELETE User Hatası:", err.message);
            return res.status(500).json("Kullanıcı silme işlemi başarısız.");
        }
        if (result.affectedRows === 0) {
            return res.status(404).json("Silinecek kullanıcı bulunamadı.");
        }
        res.status(200).json("Kullanıcı silindi.");
    });
});

// ==========================================================================
// 5. MESAJLAR YÖNETİMİ (ADMIN-MESSAGES) API ROTACILARI (%100 VERİTABANI UYUMLU)
// ==========================================================================

//? GET - Tüm iletişim mesajlarını listele
app.get("/api/messages", (req, res) => {
    const query = "SELECT m_id, m_firstName, m_lastName, m_email, m_phone, m_subject, m_message, m_created_at FROM messages ORDER BY m_id DESC";
    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ MySQL GET Messages Hatası:", err.message);
            return res.status(500).json("Mesaj listesi çekilemedi.");
        }
        res.status(200).json(results);
    });
});

//? POST - Yeni mesaj ekle (İletişim Formundan Gelen Veriyi Kaydeder)
app.post("/api/messages", (req, res) => {
    try {
        const { firstName, lastName, email, code, tel, subject, message } = req.body;

        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json("Gerekli alanlar eksik geldi.");
        }

        const combinedPhone = code ? `${code} ${tel}` : tel;

        const query = `
            INSERT INTO messages 
            (m_firstName, m_lastName, m_email, m_phone, m_subject, m_message) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            firstName.trim(), 
            lastName.trim(), 
            email.trim(), 
            combinedPhone ? combinedPhone.trim() : "", 
            subject ? subject.trim() : "Teşekkür", 
            message.trim()
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ MySQL INSERT Message Hatası Detayı:", err.message);
                // Detaylı hatayı terminalde görebilmek için mutlaka buraya log ekledik
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json("Mesaj başarıyla iletildi.");
        });
    } catch (e) {
        console.error("Sistemsel Mesaj Kayıt Hatası:", e.message);
        res.status(500).json("Sunucu Hatası");
    }
});

//? DELETE - İletişim mesajını sil
app.delete("/api/messages/:id", (req, res) => {
    const id = Number(req.params.id);
    const query = "DELETE FROM messages WHERE m_id = ?";
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("❌ MySQL DELETE Message Hatası:", err.message);
            return res.status(500).json("Mesaj silme işlemi başarısız.");
        }
        if (result.affectedRows === 0) {
            return res.status(404).json("Silinecek mesaj bulunamadı.");
        }
        res.status(200).json("Mesaj silindi.");
    });
});


//? PUT - Mesaj yanıt durumunu güncelle
app.put("/api/messages/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (status === undefined || status === null) {
            return res.status(400).json("Durum bilgisi eksik geldi.");
        }

        const query = "UPDATE messages SET m_status = ? WHERE m_id = ?";
        db.query(query, [parseInt(status), id], (err, result) => {
            if (err) {
                console.error("❌ MySQL UPDATE Message Hatası:", err.message);
                return res.status(500).json("Mesaj durumu güncellenemedi.");
            }
            if (result.affectedRows === 0) {
                return res.status(404).json("Güncellenecek mesaj bulunamadı.");
            }
            res.status(200).json("Mesaj başarıyla güncellendi.");
        });
    } catch (e) {
        console.error("Sistemsel Mesaj Güncelleme Hatası:", e.message);
        res.status(500).json("Sunucu Hatası");
    }
});

// ==========================================
// 6. SERVER DİNLEME MOTORU
// ==========================================
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu aktif: http://localhost:${PORT}`);
});
