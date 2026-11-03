require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db");
const multer = require("multer");
const path = require("path");

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Ürün resimlerinin bulunduğu klasörü dışarıya aç
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer Disk Depolama Ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// CRITICAL FIX: Vue dosya alan adları (p_img1, p_img2, p_img3) ile birebir eşitlendi!
const upload = multer({ storage: storage }).fields([
  { name: 'p_img1', maxCount: 1 },
  { name: 'p_img2', maxCount: 1 },
  { name: 'p_img3', maxCount: 1 }
]);


// ADMİN.VUE 

//! 1. PRODUCTS EKLE - POST
app.post('/api/products', upload, async (req, res) => {
  try {
    const { p_name, p_stock, p_price, p_desc, u_id } = req.body;

    // Resimlerin yollarını güvenli bir şekilde kontrol edip string oluşturuyoruz
    const img1 = req.files && req.files['p_img1'] ? `/uploads/${req.files['p_img1'][0].filename}` : '';
    const img2 = req.files && req.files['p_img2'] ? `/uploads/${req.files['p_img2'][0].filename}` : '';
    const img3 = req.files && req.files['p_img3'] ? `/uploads/${req.files['p_img3'][0].filename}` : '';

    // Veritabanındaki p_photoway alanına virgülle birleşik kaydediyoruz
    const allPath = [img1, img2, img3].filter(Boolean).join(",");

    const sql = `INSERT INTO products 
            (u_id, p_photoway, p_name, p_stock, p_price, p_price_disc, p_active, p_desc) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      u_id || null,
      allPath,
      p_name,
      p_stock || 0,
      p_price || 0,
      0,
      1,
      p_desc || ''
    ];

    // Callback veya Promise yapısına göre güvenli çalıştırma
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("SQL Sorgu Hatası:", err);
        return res.status(500).json({ error: "Veritabanı hatası: " + err.message });
      }
      return res.status(200).json("Ürün ve fotoğraflar başarıyla kaydedildi!");
    });

  } catch (catchError) {
    console.error("Sunucu Genel Hatası:", catchError);
    return res.status(500).json({ error: catchError.message });
  }
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

//? PRODUCTS SAYFASI - ALL PRODUCTS LİSTELE - GET - KULLANICI MAĞAZASI İÇİN
app.get("/api/productsPage", async (req, res) => {
  try {
    // Esas dizi destructuring yapısına geri dönüyoruz ([rows])
    const [rows] = await db.query("SELECT * FROM products WHERE p_active=1 ORDER BY p_id ASC");
    res.status(200).json(rows);
  }
  catch (err) {
    console.error("ProductsPage Hatası:", err.message);
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

// Sunucu ve Port Ayarı (En İdeal Yapı)
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend: http://localhost:${PORT}`);
});
