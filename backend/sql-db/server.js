require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db");
const multer = require("multer");
const path = require("path");

const fs = require('fs'); // Klasör oluşturabilmek için en üste ekleyin (eğer yoksa)

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Ürün resimlerinin bulunduğu klasörü dışarıya aç
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Türkçe karakterleri temizleyip klasör dostu (slug) yapan fonksiyon
function convertToSlug(text) {
  if (!text) return 'urun';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Boşlukları - yap
    .replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ş/g, 's').replace(/ı/g, 'i')
    .replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\-]/g, '')  // Sadece harf, sayı ve - bırak
    .replace(/-+/g, '-');         // Yan yana tireleri teke indir
}


// DİNAMİK DİSK DEPOLAMA AYARLARI
// GÜVENLİ VE KİLİTLENMEYEN MULTER AYARLARI
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Kilitlenmeyi önlemek için öncelikle ana uploads klasörünün varlığını garanti ediyoruz
    const baseUploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(baseUploadDir)) {
      fs.mkdirSync(baseUploadDir, { recursive: true });
    }

    // req.body.p_name gelene kadar kilitlenmeyi önlemek adına geçici veya kalıcı adlandırma
    const productName = req.body.p_name || 'yeni-urun';
    const folderSlug = convertToSlug(productName);
    const uploadPath = path.join(baseUploadDir, folderSlug);

    // Klasörü asenkron veya güvenli senkron blokta oluşturuyoruz
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // p_img1 -> img1, p_img2 -> img2, p_img3 -> img3
    const cleanFieldName = file.fieldname.replace('p_', '');
    const ext = path.extname(file.originalname);

    // Aynı isimde dosya çakışmalarını engellemek için benzersiz bir timestamp ekliyoruz
    cb(null, `${cleanFieldName}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage: storage }).fields([
  { name: 'p_img1', maxCount: 1 },
  { name: 'p_img2', maxCount: 1 },
  { name: 'p_img3', maxCount: 1 }
]);


// ADMİN.VUE 


//! 1. PRODUCTS EKLE - POST (PROMISE YAPISI İLE TAM UYUMLU KESİN ÇÖZÜM)
app.post('/api/products', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer Yükleme Hatası:", err);
      return res.status(500).json({ error: "Resimler yüklenirken hata oluştu: " + err.message });
    }

    try {
      const { p_name, p_stock, p_price, p_desc, u_id } = req.body;
      
      const cleanName = p_name ? p_name.trim() : 'Yeni Urun';
      const folderSlug = convertToSlug(cleanName);

            // Her bir resmin gerçekten yüklenip yüklenmediğini ismini (filename) kontrol ederek alıyoruz
      const img1 = req.files && req.files['p_img1'] && req.files['p_img1'][0] ? `/uploads/${folderSlug}/${req.files['p_img1'][0].filename}` : null;
      const img2 = req.files && req.files['p_img2'] && req.files['p_img2'][0] ? `/uploads/${folderSlug}/${req.files['p_img2'][0].filename}` : null;
      const img3 = req.files && req.files['p_img3'] && req.files['p_img3'][0] ? `/uploads/${folderSlug}/${req.files['p_img3'][0].filename}` : null;

      const sql = `INSERT INTO products 
              (u_id, p_img1, p_img2, p_img3, p_name, p_stock, p_price, p_price_disc, p_active, p_desc) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const safeUserId = u_id && !isNaN(u_id) ? parseInt(u_id, 10) : null;
      const safeStock = p_stock && !isNaN(p_stock) ? parseInt(p_stock, 10) : 0;
      const safePrice = p_price && !isNaN(p_price) ? parseFloat(p_price) : 0;

      const values = [
        safeUserId,
        img1,
        img2,
        img3,
        cleanName,
        safeStock,
        safePrice,
        0,
        1,
        p_desc ? p_desc.trim() : ''
      ];

      console.log("SQL Sorgusu veritabanına gönderiliyor...");

      // CRITICAL FIX: Callback yerine projenizdeki gibi await kullanarak söz dizimini eşitliyoruz
      const [result] = await db.query(sql, values);
      
      console.log("✅ ÜRÜN VERİTABANINA BAŞARIYLA YAZILDI! Yeni ID:", result.insertId);
      return res.status(200).json({ message: "Ürün ve fotoğraflar başarıyla kaydedildi!", id: result.insertId });

    } catch (dbError) {
      console.error("🚨 SORGURDA YA DA VERİTABANINDA HATA OLUŞTU:", dbError.message);
      return res.status(500).json({ error: "Veritabanı kayıt hatası: " + dbError.message });
    }
  });
});



// ! PRODUCTS LİSTELE - GET - ADMIN PANELİ İÇİN
app.get("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });

    // mysql2 kütüphanesinin promise yapısında veri her zaman ilk elemandan [rows] gelir
    const [users] = await db.query("SELECT u_role FROM users WHERE u_id=?", [id]);

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    let rows;
    // EĞER SADECE KENDİ ÜRÜNLERİNİ GÖRECEKSE (Görselde u_id'ler 0 olduğu için eşleşmeyi kontrol edin)
    if (users[0].u_role == 0) {
      const [result] = await db.query("SELECT * FROM products WHERE u_id=? ORDER BY p_id ASC", [id]);
      rows = result;
    } else {
      const [result] = await db.query("SELECT * FROM products ORDER BY p_id ASC");
      rows = result;
    }

    res.status(200).json(rows);
  }
  catch (err) {
    console.error("Listeleme Hatası:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ALTERNATİF DOĞRUDAN LİSTELEME ROTASI
app.get("/api/allAdminProducts", async (req, res) => {
  try {
    // Tüm ürünleri filtre olmadan doğrudan çeker
    const [rows] = await db.query("SELECT * FROM products ORDER BY p_id ASC");
    res.status(200).json(rows);
  }
  catch (err) {
    console.error("allAdminProducts Hatası:", err.message);
    res.status(500).json({ error: err.message });
  }
});


//! 3. PRODUCTS GÜNCELLE - PUT
app.put("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { p_name, p_stock, p_price, p_desc } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });

    const [result] = await db.query(
      "UPDATE products SET p_name=?, p_stock=?, p_price=?, p_desc=? WHERE p_id=?",
      [p_name, p_stock, p_price, p_desc, id]
    );

    res.status(200).json("Ürün başarıyla güncellendi.");
  }
  catch (err) {
    console.error("Güncelleme Hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

//! 4. PRODUCTS SİL - DELETE
app.delete("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.query("DELETE FROM products WHERE p_id=?", [id]);
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



//? PRODUCTS SAYFASI - ALL PRODUCTS LİSTELE - GET - KULLANICI MAĞAZASI İÇİN
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Resimlerin URL üzerinden açılabilmesi için bu satır sunucuda mutlaka olmalı

app.get("/api/productsPage", async (req, res) => {
  try {
    // Aktif olan tüm ürünleri p_img1, p_img2, p_img3 verileriyle birlikte doğrudan çeker
    const [rows] = await db.query("SELECT * FROM products WHERE p_active=1 ORDER BY p_id ASC");
    res.status(200).json(rows);
  }
  catch (err) {
    console.error("ProductsPage Hatası:", err.message);
    res.status(500).json({ error: err.message });
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

//? PRODUCTS SAYFASI - ALL PRODUCTS LİSTELE - GET - KULLANICI MAĞAZASI İÇİN
app.get("/api/productsPage", async (req, res) => {
  try {
    // Aktif olan tüm ürünleri 3 resmiyle birlikte çeker
    const [rows] = await db.query("SELECT * FROM products WHERE p_active=1 ORDER BY p_id ASC");

    /* 
      💡 ÖNEMLİ İPUCU: 
      Eğer sitenin ön yüzü (mağaza kısmı) tek bir "p_image" veya "p_photoway" alanı bekliyorsa, 
      aşağıdaki gibi döngüyle diziyi güncelleyerek frontend'i bozmadan uyumlu hale getirebilirsin:
    */
    const mappedRows = rows.map(product => ({
      ...product,
      // Eğer ön yüz "p_image" sütununu arıyorsa otomatik olarak p_img1'i (ana resmi) ona ata
      p_image: product.p_image || product.p_img1
    }));

    res.status(200).json(mappedRows);
  }
  catch (err) {
    console.error("ProductsPage Hatası:", err.message);
    res.status(500).json({ error: err.message });
  }
});


//? 5. KULLANICI ADI GETİR - POST (Admin Panelindeki Hatayı Çözer)
app.post('/api/getUsername', async (req, res) => {
  try {
    const { u_id } = req.body; // Veya frontend'den nasıl gönderiyorsanız
    if (!u_id) {
      return res.status(400).json({ error: "Kullanıcı ID gönderilmedi." });
    }

    // Veritabanından kullanıcının adını ve soyadını çekiyoruz
    const [rows] = await db.query("SELECT u_name, u_surname FROM users WHERE u_id = ?", [u_id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    // Frontend'in Admin.vue dosyasında beklediği şekilde veriyi dönüyoruz
    res.status(200).json({
      username: `${rows[0].u_name} ${rows[0].u_surname}`
    });
  } catch (err) {
    console.error("getUsername Hatası:", err.message);
    res.status(500).json({ error: "Sunucu hatası" });
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

// Sunucu ve Port Ayarı (En İdeal Yapı)
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend: http://localhost:${PORT}`);
});
