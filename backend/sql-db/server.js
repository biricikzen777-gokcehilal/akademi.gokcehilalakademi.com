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

        const img1_path =`/uploads/${userId}-${name}/1.jpg`;
        const img2_path =`/uploads/${userId}-${name}/2.jpg`;
        const allPath = img1_path + "," + img2_path;
        console.log(name,stock,price,desc,userId,allPath);


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
            return res.status(200).json("Ürün ve fotoğraf başarıyla SQL'e kaydedildi!" );
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
    const { firstName, lastName, email, tel, pass } = req.body;
    if (!firstName || !lastName || !active || !email || !tel || !pass) return res.status(400).json({ error: "hatalı veri geldi." });
    const [result] = await db.query(
      "INSERT INTO users (u_firstName, u_lastName, u_email, u_tel, p_pass) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName.trim(), lastName.trim(), email.trim(), tel, pass]
    );

    const [rows] = await db.query("SELECT * FROM users WHERE u_id=?", [result.p_id]);
    res.status(201).json(firstName + {} + lastName + " adlı kullanıcı eklendi.");
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//! USERS GÜNCELLE - PUT - SQL SORGUSU: UPDATE SET
app.put("/api/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, stock, price, desc, role } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });
    if (!name || !stock || !price || !desc) return res.status(400).json({ error: "Hatalı veri geldi." });

    const [result] = await db.query(
      "UPDATE users SET u_name=?, u_stock=?, u_price=?, u_desc=?, u_role=? WHERE u_id=?",
      [name.trim(), stock, price, desc, role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Güncellenecek kullanıcı bulunamadı." });
    }
    const [rows] = await db.query("SELECT * FROM users WHERE u_id=?", [id]);
    res.status(200).json(rows[0].u_name + " adlı ürün güncellendi.");
  }
  catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
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

//? LOGIN - POST - SQL SORGUSU: SELECT, WHERE= id
app.post("/api/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const [rows] = await db.query("SELECT u_id,u_role,u_firstName FROM users WHERE u_email=? AND u_pass=?", [email, pass]);
    console.log(rows);
    if (rows[0].u_id)
      res.status(200).json(rows);
    else
      res.status(404).json({ error: "Giriş başarısız." });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});



//------------------------------------------------------------------------------------------------------------



const port = process.env.PORT

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend: http://localhost:${PORT}`));