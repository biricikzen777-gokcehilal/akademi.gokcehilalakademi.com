require("dotenv").config(); //env dosyamızı import ettik
const express = require("express");
const cors = require("cors");
const app = express();
const { error } = require("console");
app.use(cors());
const db = require("./db"); //db.js dosyamızı import ettik.
app.use(express.json({ limit: "10mb" }));
const multer = require("multer");
const path = require("path");
const mysql = require('mysql2');
const fs = require('fs');

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// 1. STATİK KLASÖR TANIMLAMA (Yüklenen resimlerin tarayıcıdan görünebilmesi için)
// Tarayıcıdan erişim linki örn: http://localhost:3001/uploads/resim_adi.jpg olur
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Eğer proje klasöründe 'uploads' adında bir klasör yoksa otomatik oluşturur
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// 2. MULTER DEPOLAMA (STORAGE) AYARLARI
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Dosyaların kaydedileceği klasör
    },
    filename: function (req, file, cb) {
        // Dosya isminin çakışmaması için benzersiz bir isim (timestamp + rastgele sayı) üretiyoruz
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Resim dosyası filtresi (Sadece görsel formatlarına izin verir)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Sadece görsel dosyaları yüklenebilir!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Maksimum 5MB dosya boyutu sınırı
});

// 3. 3 AYRI RESİM ALANINI KABUL EDEN MULTER YAPILANDIRMASI
// Frontend'deki append("p_img1", ...) isimleriyle birebir eşleşmektedir
const cpUpload = upload.fields([
    { name: 'p_img1', maxCount: 1 },
    { name: 'p_img2', maxCount: 1 },
    { name: 'p_img3', maxCount: 1 }
]);


// 🚀 4. API ENDPOINT: GÜVENLİ ÜRÜN EKLEME (3 RESİMLİ)
app.post("/api/addProductSecure", cpUpload, async (req, res) => {
    try {
        const { p_name, p_stock, p_price, p_desc, u_id } = req.body;
        
        // Sunucu adresini dinamik veya sabit olarak alıyoruz
        const serverUrl = `${req.protocol}://${req.get('host')}`;

        // Eğer resim yüklendiyse tarayıcıdan erişilecek tam URL'sini oluştur, yüklenmediyse null bırak
        const p_img1 = req.files['p_img1'] ? `${serverUrl}/uploads/${req.files['p_img1'][0].filename}` : null;
        const p_img2 = req.files['p_img2'] ? `${serverUrl}/uploads/${req.files['p_img2'][0].filename}` : null;
        const p_img3 = req.files['p_img3'] ? `${serverUrl}/uploads/${req.files['p_img3'][0].filename}` : null;

        // SQL Sorgusu: Veritabanındaki tablonuzun kolon isimlerine göre yapılandırılmıştır
        const query = `
            INSERT INTO products (p_name, p_stock, p_price, p_desc, u_id, p_img1, p_img2, p_img3) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            p_name, 
            parseInt(p_stock) || 0, 
            parseFloat(p_price) || 0, 
            p_desc, 
            u_id, 
            p_img1, 
            p_img2, 
            p_img3
        ]);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: "Ürün başarıyla eklendi.", insertId: result.insertId });
        } else {
            res.status(400).json({ success: false, message: "Ürün veritabanına yazılamadı." });
        }
    } catch (err) {
        console.error("Ekleme Hatası:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});


// 🚀 5. API ENDPOINT: ÜRÜN GÜNCELLEME
app.put("/api/products/:p_id", async (req, res) => {
    const { p_id } = req.params;
    const { p_name, p_stock, p_price, p_desc } = req.body;

    try {
        const query = `
            UPDATE products 
            SET p_name = ?, p_stock = ?, p_price = ?, p_desc = ? 
            WHERE p_id = ?
        `;
        
        const [result] = await db.query(query, [p_name, p_stock, p_price, p_desc, p_id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: "Ürün güncellendi." });
        } else {
            res.status(404).json({ success: false, message: "Ürün bulunamadı veya değişiklik yapılmadı." });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


// 🚀 6. API ENDPOINT: ÜRÜN SİLME
app.delete("/api/products/:p_id", async (req, res) => {
    const { p_id } = req.params;

    try {
        const query = "DELETE FROM products WHERE p_id = ?";
        const [result] = await db.query(query, [p_id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: "Ürün silindi." });
        } else {
            res.status(404).json({ success: false, message: "Ürün bulunamadı." });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});



//? FOTOĞRAF EKLEME
// Ürün resimlerinin bulunduğu klasörü erişebilir yap (Mükerrer satır teke düşürüldü)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// EKSİK DÜZELTİLDİ: Multer ayarları tamamlandı
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Proje kök dizininde "uploads" klasörü olmalı
  },

  filename: (req, file, cb) => {
    // Resmi atmadan önce product.id adında bir klasör açsın. Bu ürünle ilgili resimleri bu klasörde tutsun. resimlerin adları 1jpeg, 2jpeg, 3jpeg şeklinde olsun.
    // Benzersiz dosya adı oluşturma (Örn: image1-1718293849.jpg)
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});


// Vue'dan gelecek dosya alan adlarını (image1, image2, image3) burada tanımlıyoruz
const upload = multer({ storage: storage }).fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },

]);

// API Uç Noktası (Route) Örneği:

app.post('/api/products', upload, (req, res) => {
  // formData.name, formData.stock, formData.price, formData.desc, formData.userId, formData.image1, formData.image2
  try {
    // 1. Vue'dan gelen ilk resmi (image1) p_photoway olarak ayarlıyoruz

    // 2. Vue'dan gelen FormData metin içeriklerini alıyoruz
    const { name, stock, price, desc, userId } = req.body;

    const img1_path = `/uploads/${userId}-${name}/1.jpg`;
    const img2_path = `/uploads/${userId}-${name}/2.jpg`;
    const allPath = img1_path + "," + img2_path;
    console.log(name, stock, price, desc, userId, allPath);


    // 3. TAMAMEN SİZİN TABLONUZA GÖRE DÜZENLENMİŞ SQL SORGUSU
    const sql = `INSERT INTO products 
            (u_id, p_photoway, p_name, p_stock, p_price, p_price_disc, p_active, p_desc) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;


    // Gönderilecek parametre dizisi (Sıralama yukarıdaki SQL parantezi ile birebir aynı)
    const values = [
      userId || null,     // u_id
      allPath,            // p_photoway (Yüklenen ilk fotoğrafın sunucudaki yolu)
      name,               // p_name
      stock || 0,         // p_stock
      price || 0,         // p_price
      0,                  // p_price_disc (İndirimli fiyat - Başlangıçta 0 verdik)
      1,                  // p_active (Ürün direkt aktif olsun diye 1 verdik)
      desc || ''          // p_desc
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("SQL Sorgu Hatası:", err);
        return res.status(500).json({ error: "Veritabanı hatası: " + err.message });
      }
      return res.status(200).json("Ürün ve fotoğraf başarıyla SQL'e kaydedildi!");
    });

  } catch (catchError) {
    console.error("Sunucu Genel Hatası:", catchError);
    return res.status(500).json({ error: catchError.message });
  }
});

// app.post('/api/products', upload, (req, res) => {
//     // Yüklenen dosyaların yolları
//     const img1_path = req.files['image1'] ? `/uploads/${req.files['image1'][0].filename}` : null;
//     const img2_path = req.files['image2'] ? `/uploads/${req.files['image2'][0].filename}` : null;

//     // Vue'dan gelen diğer metin verileri
//     const { name, model, type, category, stock, price, userId } = req.body;

//     // Burada SQL INSERT sorgunuzu çalıştırabilirsiniz:
//     const sql = "INSERT INTO urunler (ad, model, resim1, resim2...) VALUES (?, ?, ?, ?...)";
//     db.query(sql, [name, model, img1_path, img2_path, ...], ...)

//     res.status(200).json({ message: "Ürün ve fotoğraflar başarıyla kaydedildi!" });
// });



//? ADMİN KISMI


// ! PRODUCTS LİSTELE - GET - SQL SORGUSU: SELECT
app.get("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [control] = await db.query("SELECT u_role FROM users WHERE u_id=?", [id]); // gelenin rolüne bak: admin, user
    if (control[0].u_role == 0) { // istekte bulunan adminse
      var [rows] = await db.query("SELECT * FROM products WHERE u_id=? ORDER BY p_id ASC", [id]); // tüm ürünleri yolla
    }
    else {
      var [rows] = await db.query("SELECT * FROM products ORDER BY p_id ASC"); // kendi eklediklerini yolla
    }

    res.status(200).json(rows);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//! PRODUCTS EKLE - POST - SQL SORGUSU: INSERT INTO

//! PRODUCTS GÜNCELLE - PUT - SQL SORGUSU: UPDATE SET
app.put("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, stock, price, desc } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });
    if (!name || !stock || !price || !desc) return res.status(400).json({ error: "Hatalı veri geldi." });

    const [result] = await db.query(
      "UPDATE products SET p_name=?, p_stock=?, p_price=?, p_desc=? WHERE p_id=?",
      [name.trim(), stock, price, desc, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Güncellenecek kullanıcı bulunamadı." });
    }
    const [rows] = await db.query("SELECT * FROM products WHERE p_id=?", [id]);
    res.status(200).json(rows[0].p_name + " adlı ürün güncellendi.");
  }
  catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

//! PRODUCTS SİL DELETE - SQL SORGUSU: DELETE
app.delete("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [result] = await db.query("DELETE FROM products WHERE p_id=?", [id]);
    res.status(200).json("Ürün silindi.");
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// post ekle.......................................................................
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
            (m_firstName, m_lastName, m_email, m_tel, m_subject, m_message) 
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
    res.status(201).json("Mesaj başarıyla iletildi.");

    // db.query(query, values, (err, result) => {
    //     if (err) {
    //         console.error("❌ MySQL INSERT Message Hatası Detayı:", err.message);
    //         // Detaylı hatayı terminalde görebilmek için mutlaka buraya log ekledik
    //         return res.status(500).json({ error: err.message });
    //     }
    //     res.status(201).json("Mesaj başarıyla iletildi.");
    // });
  } catch (e) {
    console.error("Sistemsel Mesaj Kayıt Hatası:", e.message);
    res.status(500).json("Sunucu Hatası");
  }
});

//! MESAJ LİSTELE - GET - SQL SORGUSU: SELECT
app.get("/api/messages", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM messages ORDER BY m_id DESC");
    res.status(200).json(rows);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//! MESAJ GÜNCELLE - PUT - SQL SORGUSU: UPDATE SET
app.put("/api/messages/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });
    if (!status) json({ error: "Hatalı veri geldi." });

    const [result] = await db.query(
      "UPDATE messages SET m_status? WHERE m_id=?",
      [status, id]
    );

    res.status(200).json("Mesaj durumu güncellendi.");
  }
  catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

//! MESAJ SİL
app.delete("/api/messages/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [result] = await db.query("DELETE FROM messages WHERE m_id=?", [id]);
    res.status(200).json("Mesaj silindi.");
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ! ORDERS LİSTELE - GET - SQL SORGUSU: SELECT
app.get("/api/orders", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders ORDER BY o_id ASC");
    console.log(rows)
    res.status(200).json(rows);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//! ORDERS EKLE - POST - SQL SORGUSU: INSERT INTO
app.post("/api/orders", async (req, res) => {
  try {
    const { no, products, person, address, amount } = req.body;
    if (!no || !products || !person || !address || !amount) return res.status(400).json({ error: "Hatalı veri geldi." });
    const [result] = await db.query(
      "INSERT INTO orders (o_no, o_products, o_person, o_address, o_amount) VALUES (?, ?, ?, ?, ?)",
      [no, products, person, address, amount]
    );

    const [rows] = await db.query("SELECT * FROM orders WHERE p_id=?", [result.o_id]);
    res.status(201).json(" Sipariş eklendi.");
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//! ORDERS GÜNCELLE - PUT - SQL SORGUSU: UPDATE SET
app.put("/api/orders/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { no, products, person, address, amount } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });
    if (!no || !products || !person || !address || !amount)

      return res.status(400).json({ error: "Hatalı veri geldi." });

    const [result] = await db.query(
      "UPDATE orders SET o_no=?, o_products=?, o_person=?, o_address=? WHERE o_id=?",
      [no, products, person, address, amount]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Güncellenecek sipariş bulunamadı." });
    }
    const [rows] = await db.query("SELECT * FROM orders WHERE o_id=?", [id]);
    res.status(200).json(" Sipariş güncellendi.");
  }
  catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

//! ORDERS SİL DELETE - SQL SORGUSU: DELETE
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [result] = await db.query("DELETE FROM orders WHERE o_id=?", [id]);
    res.status(200).json("Sipariş silindi.");
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// ! USERS LİSTELE - GET - SQL SORGUSU: SELECT
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users ORDER BY u_id ASC");
    console.log(rows)
    res.status(200).json(rows);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//! USERS EKLE - POST - SQL SORGUSU: INSERT INTO
app.post("/api/users", async (req, res) => {
  try {
    // 1. req.body içinden role ve u_active durumunu da alıyoruz
    const { firstName, lastName, email, tel, pass, role } = req.body;

    // 2. Doğrulama kontrolünü düzeltiyoruz (active yerine role ekledik)
    if (!firstName || !lastName || !email || !tel || !pass || role === undefined) {
      return res.status(400).json({ error: "Hatalı veya eksik veri geldi." });
    }

    // 3. Sorgudaki soru işareti sayısını (6 adet) veri dizisi sayısıyla (6 adet) eşitledik
    // p_pass yerine tablonuzdaki u_pass kolonu yazıldı. u_role ve u_active eklendi.
    const [result] = await db.query(
      "INSERT INTO users (u_firstName, u_lastName, u_email, u_tel, u_pass, u_role, u_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [firstName.trim(), lastName.trim(), email.trim(), tel, pass, String(role), 1]
    );

    // 4. Yeni eklenen id değerini almak için insertId kullanılır (p_id hatalıydı)
    const [rows] = await db.query("SELECT * FROM users WHERE u_id=?", [result.insertId]);

    // 5. Yanıt mesajını string olarak düzelttik
    res.status(201).json(`${firstName} ${lastName} adlı kullanıcı başarıyla eklendi.`);
  }
  catch (err) {
    console.error("Kullanıcı ekleme hatası:", err.message);
    res.status(500).json({ error: err.message });
  }
});

//! USERS GÜNCELLE - PUT - SQL SORGUSU: UPDATE SET
app.put("/api/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { firstName, lastName, email, tel, role } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });

    if (!firstName || !lastName || !email || !tel || role === undefined) {
      return res.status(400).json({ error: "Hatalı veya eksik veri geldi." });
    }

    const [result] = await db.query(
      "UPDATE users SET u_firstName=?, u_lastName=?, u_email=?, u_tel=?, u_role=? WHERE u_id=?",
      [firstName.trim(), lastName.trim(), email.trim(), tel, String(role), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Güncellenecek kullanıcı bulunamadı." });
    }

    res.status(200).json(`${firstName} ${lastName} adlı kullanıcı başarıyla güncellendi.`);
  }
  catch (err) {
    console.error("Kullanıcı güncelleme hatası:", err.message);
    res.status(500).json({ error: err.message });
  }
});


app.put("/api/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    // 1. Ürün değişkenleri yerine kullanıcı değişkenlerini req.body'den alıyoruz
    const { firstName, lastName, email, tel, role } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });

    // 2. Doğrulama kontrolünü güncelliyoruz
    if (!firstName || !lastName || !email || !tel || role === undefined) {
      return res.status(400).json({ error: "Hatalı veya eksik veri geldi." });
    }

    // 3. Gerçek veritabanı sütun isimlerine göre SQL sorgusunu güncelliyoruz
    const [result] = await db.query(
      "UPDATE users SET u_firstName=?, u_lastName=?, u_email=?, u_tel=?, u_role=? WHERE u_id=?",
      [firstName.trim(), lastName.trim(), email.trim(), tel, String(role), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Güncellenecek kullanıcı bulunamadı." });
    }

    res.status(200).json(`${firstName} ${lastName} adlı kullanıcı başarıyla güncellendi.`);
  }
  catch (err) {
    console.error("Kullanıcı güncelleme hatası:", err.message);
    res.status(500).json({ error: err.message });
  }
});


//! USERS SİL DELETE - SQL SORGUSU: DELETE
app.delete("/api/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [result] = await db.query("DELETE FROM users WHERE u_id=?", [id]);
    res.status(200).json("Kullanıcı silindi.");
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});




//-------------------------------------------------------------------------------------------------------------



//? ADMİN PAGE - USERNAME
app.post("/api/getUsername", async (req, res) => {
  const { id } = req.body;
  try {
    const [rows] = await db.query("SELECT u_firstName FROM users WHERE u_id=?", [id]);

    if (rows)
      return res.status(200).json(rows[0].u_firstName);

    else
      res.status(404).json({ error: "Kullanıcı bulunamadı." });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
    alert("Giriş başarısız.")
  }
});


//? CONTACT MESSAGE - POST - SQL SORGUSU: INSERT INTO
app.post("/api/contact", async (req, res) => {
  try {
    const { name, stock, price, desc } = req.body;
    if (!name || !stock || !price || !desc) return res.status(400).json({ error: "hatalı veri geldi." });
    const [result] = await db.query(
      "INSERT INTO products (p_name, p_active, p_stock, p_price, p_price_disc, p_desc) VALUES (?, ?, ?, ?, ?, ?)",
      [name.trim(), 1, stock, price, price, desc.trim()]
    );

    const [rows] = await db.query("SELECT * FROM users WHERE p_id=?", [result.p_id]);
    res.status(201).json(name + " adlı ürün eklendi.");
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//------------------------------------------------------------------------------------------------------------

//? PRODUCTS SAYFASI - ALL PRODUCTS LİSTELE - GET - SQL SORGUSU: SELECT
app.get("/api/productsPage", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE p_active=1 ORDER BY p_id ASC");
    res.status(200).json(rows);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//? CHECKOUT - POST - SQL SORGUSU: INSERT INTO


//? REGISTER - POST - SQL SORGUSU: INSERT INTO
app.post("/api/register", async (req, res) => {
  try {
    const { firstName, lastName, email, tel, pass } = req.body;
    if (!firstName || !lastName || !email || !tel || !pass) return res.status(400).json({ error: "hatalı veri geldi." });

    const [result] = await db.query(
      "INSERT INTO users (u_firstName, u_lastName,u_active, u_email, u_tel, u_pass, u_role) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [firstName.trim(), lastName.trim(), 1, email.trim(), tel.trim(), pass, 0]
    );

    res.status(201).json("Kayıt başarılı");
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//? LOGIN - POST - SQL SORGUSU: SELECT, WHERE= id (Uyuşmazlıkları Çözülmüş Tam Uyumlu Hali)
app.post("/api/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    // u_active alanını da sorguya ekledik ve TRIM kullanarak boşluk riskini sıfırladık
    const [rows] = await db.query(
      "SELECT u_id, u_firstName, u_lastName, u_active, u_role, u_email FROM users WHERE TRIM(u_email) = ? AND u_pass = ?", 
      [email?.trim().toLowerCase(), pass]
    );

    console.log("Giriş denemesi sonuçları:", rows);

    // Kullanıcı bulundu mu kontrolü (Güvenli yöntem: rows.length > 0)
    if (rows && rows.length > 0) {
      const dbUser = rows[0];

      // Vue 3 arayüzünün (App.vue) tam olarak beklediği formatta cevap dönüyoruz
      res.status(200).json({
        success: true,
        user: {
          u_id: dbUser.u_id,
          u_firstName: dbUser.u_firstName,
          u_lastName: dbUser.u_lastName,
          u_email: dbUser.u_email,
          u_active: dbUser.u_active, // Arayüzün beklediği aktiflik durumu
          u_role: dbUser.u_role       // Rol bilgisi (0 veya 1)
        }
      });
    } else {
      // Kullanıcı bulunamadığında Vue kodunun okuyabilmesi için message alanı dönüyoruz
      res.status(200).json({ 
        success: false, 
        message: "E-posta adresi veya şifre hatalı!" 
      });
    }
  }
  catch (err) {
    console.error("Backend giriş hatası:", err);
    res.status(500).json({ success: false, message: "Sistemsel bir sunucu hatası oluştu.", error: err.message });
  }
});



//------------------------------------------------------------------------------------------------------------



const port = process.env.PORT

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend: http://localhost:${PORT}`));