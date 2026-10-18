const express = require("express");
const cors = require("cors");
const fs = require("fs");  //filesystem - dosyaları okumak için import ediyoruz.
const app = express();
            app.use(cors());
            app.use(express.json());
// import random;

//! get,post,put,delete
//! get hello endpointi

app.get("/api/hello", (req, res) => {
    res.status(200).json({
        message: "Merhaba! Backend çalışıyor.",
        time: new Date().toISOString()
    });
});

//! ADMİN PRODUCT KISMI
//? GET products endpointi - Ürün listele
app.get("/api/products", (req, res) => {
    const data = fs.readFileSync("products.json", "utf-8");  //! products.json dosyasını okuduk ve içindekileri data değişkenine attık
    res.status(200).json(JSON.parse(data)); //! data değişkenini json formatında response döndürdük. 
});
//? POST products endpointi - Ürün ekle
app.post("/api/products", (req, res) => {
    try {
        const { name, stock, price } = req.body;
        if (!name || !stock || !price) {
            return res.status(400).json("Hatalı veri geldi")
        }
        else {
            const data = JSON.parse(fs.readFileSync("products.json", "utf-8")); //jsondaki veriyi çek
            const newProduct = {
                id: data.length + 1,
                name: name,
                stock: stock,
                price: price
            }; // eklenecek eleman hazırlandı
            data.push(newProduct); //çektiğin diziye yeni elemanı ekle.
            fs.writeFileSync("products.json", JSON.stringify(data, null, 2)); // oluşan son diziyi tekrardan jsona yazar
            res.status(201).json("Ürün Başarıyla Eklendi.");
        }
    }
    catch (e) {
        res.status(500).json("Sunucu Hatası")
    }
});
//? PUT- Güncelle
app.put("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, stock, price } = req.body;
    if (!name || stock<0 || !price) { //değerler boş mu?
        return res.status(400).json("Hatalı veri geldi");
    }
    const products = JSON.parse(fs.readFileSync("products.json", "utf-8")); //jsondaki veriyi çek
    const product = products.find(p => p.id === id); // 404: ürün var mı?
    if (!product) {
        return res.status(404).json({
            error: "Güncellenecek ürün bulunamadı."
        });
    }
    //ürünün keylerindeki değeri istekle gelen değerlere ata.
    product.name = name.trim();
    product.stock = stock;
    product.price = price;
    //güncellenen products dizisini tekrardan dosyaya yaz.
    fs.writeFileSync("products.json", JSON.stringify(products, null, 2)); // oluşan son diziyi tekrardan jsona yazar
    // 200: başarılı
    res.status(200).json(product);
});
//? DELETE- SİL
app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const products = JSON.parse(fs.readFileSync("products.json", "utf-8")); //jsondaki veriyi çek
    const product = products.find(p => p.id === id); // 404: ürün var mı?
    if (!product) {
        return res.status(404).json({
            error: "Silinecek ürün bulunamadı."
        });
    }
    products.splice(products.indexOf(product), 1)
    //güncellenen products dizisini tekrardan dosyaya yaz.
    fs.writeFileSync("products.json", JSON.stringify(products, null, 2)); // oluşan son diziyi tekrardan jsona yazar
    // 200: başarılı
    res.status(200).json(product);
});


//! ADMİN USER KISMI
//? get users endpointi
app.get("/api/users", (req, res) => {
    const data = fs.readFileSync("users.json", "utf-8");
    res.status(200).json(JSON.parse(data));
});

//? POST users endpointi - Kullanıcı ekle
app.post("/api/users", (req, res) => {
    try {
        const { firstName, lastName, email, tel, pass } = req.body
        if (!firstName || !lastName || !email || !tel || !pass) {
            return res.status(400).json("Hatalı veri geldi.")
        }
        else {
            const data = JSON.parse(fs.readFileSync("users.json", "utf-8")); //jsondaki veriyi çek
            const newUser = {
                id: data.length + 1,
                firstName: firstName,
                lastName: lastName,
                email: email,
                tel: tel,
                pass: pass,
            }; // eklenecek eleman hazırlandı
            data.push(newUser); //çektiğin diziye yeni elemanı ekle.
            fs.writeFileSync("users.json", JSON.stringify(data, null, 2)); // oluşan son diziyi tekrardan jsona yazar
            res.status(201).json("Kullanıcı Başarıyla Eklendi.");
        }
    }
    catch (e) {
        res.status(500).json("Sunucuda hata oldu")
    }
});

//? DELETE- SİL
app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const users = JSON.parse(fs.readFileSync("users.json", "utf-8")); //jsondaki veriyi çek
    const user = users.find(u => u.id === id); // 404: ürün var mı?
    if (!user) {
        return res.status(404).json({
            error: "Silinecek ürün bulunamadı."
        });
    }
    users.splice(users.indexOf(user), 1)
    //güncellenen products dizisini tekrardan dosyaya yaz.
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2)); // oluşan son diziyi tekrardan jsona yazar
    // 200: başarılı
    res.status(200).json(user);
});

//? PUT- Güncelle
app.put("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const { firstName, lastName, email, tel, pass } = req.body;
    if (!firstName || !lastName || !email || !tel || !pass) { //değerler boş mu?
        return res.status(400).json("Hatalı veri geldi");
    }
    const users = JSON.parse(fs.readFileSync("users.json", "utf-8")); //jsondaki veriyi çek
    const user = users.find(u => u.id === id); // 404: ürün var mı?
    if (!user) {
        return res.status(404).json({
            error: "Güncellenecek kullanıcı bulunamadı."
        });
    }
    //ürünün keylerindeki değeri istekle gelen değerlere ata.
    user.firstName = firstName.trim();
    user.lastName = lastName;
    user.email = email;
    user.tel = tel;
    user.pass = pass;
    //güncellenen products dizisini tekrardan dosyaya yaz.
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2)); // oluşan son diziyi tekrardan jsona yazar
    // 200: başarılı
    res.status(200).json("Kullanıcı güncellendi.");
});

//! ADMİN ORDERS KISMI

//? GET ORDER endpointi - admin sayfasına
app.get("/api/orders", (req, res) => {
    const data = fs.readFileSync("orders.json", "utf-8");
    res.status(200).json(JSON.parse(data));
});

//? PUT ORDER - Güncelle - admin sayfasına
app.put("/api/orders/:id", (req, res) => {
    const id = Number(req.params.id);
    const {o_no, o_amount, o_status } = req.body;
    if (!o_no || !o_amount || !o_status) { //değerler boş mu?
        return res.status(400).json("Hatalı veri geldi");
    }
    const orders = JSON.parse(fs.readFileSync("orders.json", "utf-8")); //jsondaki veriyi çek
    const order = orders.find(o => o.id === id); // 404: ürün var mı?
    if (!order) {
        return res.status(404).json({
            error: "Güncellenecek sipariş bulunamadı."
        });
    }
    //ürünün keylerindeki değeri istekle gelen değerlere ata.
    order.o_no = o_no;
    order.o_amount = o_amount;
    order.o_status = o_status;

    //güncellenen products dizisini tekrardan dosyaya yaz.
    fs.writeFileSync("orders.json", JSON.stringify(orders, null, 2)); // oluşan son diziyi tekrardan jsona yazar
    // 200: başarılı
    res.status(200).json("Sipariş güncellendi.");
});

//? POST ORDER endpointi - Sipariş ekle  - checkout sayfasına
app.post("/api/orders", (req, res) => {
    try {
        const { sepet, order, amount } = req.body
        console.log(sepet);
        console.log(order);
        console.log(amount);
        if(!sepet || !order || !amount)
        {
            return res.status(400).json ("Eksik veri geldi.");
        }
      
        else {
            const orders = JSON.parse(fs.readFileSync("orders.json", "utf-8")); //jsondaki veriyi çek
                let products=[], pids=[];
            for(let i=0; i < sepet.length; i++) {
                products.push(sepet[i].name);
                pids.push(sepet[i].id)
            }

            const newOrder = {
                id: Number(orders[orders.length-1]?.id || 0) + 1,
                o_no: "#" + order[0].firstName + order[0].lastName + (orders.length * 100 + 5),
                o_products: o_products,
                o_pids: o_pids,
                o_person: order[0].firstName + order[0].lastName ,
                o_address: order[0].address + order[0].state + "/" + order[0].country + order[0].zip,
                o_amount: amount,
                o_date: new Date().toLocaleDateString('tr-TR'),
                o_status: "Hazırlanıyor" ,
            }; // eklenecek eleman hazırlandı


            order.push(newUser); //çektiğin diziye yeni elemanı ekle.
            fs.writeFileSync("orders.json", JSON.stringify(orders, null, 2)); // oluşan son diziyi tekrardan jsona yazar
            

            // ! STOK DÜŞÜRME
            
            const allproducts = JSON.parse(fs.readFileSync("products.json", "utf-8")); //jsondaki veriyi çek

            // for ile pids içindeki id leri dön
            for(let i = 0; i < pids.length; i++) {
                 const product = allproducts.find(p => p.id === pids[i]); // 404: ürün var mı?
                 product.stock--;
                fs.writeFileSync("products.json", JSON.stringify(allproducts, null, 2)); // oluşan son diziyi tekrardan jsona yazar
            }
           
            res.status(201).json("Sipariş Başarıyla Eklendi.");
  
        }
    }
    catch (e) {
        res.status(500).json("Sunucuda hata oldu")
    }
});

//? DELETE- SİL
app.delete("/api/orders/:id", (req, res) => {
    const id = Number(req.params.id);
    const orders = JSON.parse(fs.readFileSync("orders.json", "utf-8")); //jsondaki veriyi çek
    const order = users.find(o => o.id === id); // 404: ürün var mı?
    if (!order) {
        return res.status(404).json({
            error: "Silinecek sipariş bulunamadı."
        });
    }
    orders.splice(orders.indexOf(order), 1)
    //güncellenen products dizisini tekrardan dosyaya yaz.
    fs.writeFileSync("orders.json", JSON.stringify(orders, null, 2)); // oluşan son diziyi tekrardan jsona yazar
    // 200: başarılı
    res.status(200).json(order);
});


//! ADMİN MESSAGES KISMI
//? get messages endpointi
app.get("/api/messages", (req, res) => {
    const data = fs.readFileSync("messages.json", "utf-8");
    res.status(200).json(JSON.parse(data));
});

//? PUT- Güncelle
// app.put("/api/messages/:id", (req, res) => {
//     const id = Number(req.params.id);
//     const { id, firstName, lastName, email, code, tel, subject, message} = req.body;
//     if ( !firstName || !lastName || !email || !code || !tel || !subject || !message ) { //değerler boş mu?
//         return res.status(400).json("Hatalı veri geldi");
//     }
//     const messages = JSON.parse(fs.readFileSync("messages.json", "utf-8")); //jsondaki veriyi çek
//     const messages = messages.find(o => o.id === id); // 404: ürün var mı?
//     if (!message) {
//         return res.status(404).json({
//             error: "Güncellenecek mesaj bulunamadı."
//         });
//     }
//     //ürünün keylerindeki değeri istekle gelen değerlere ata.
//     m.firstName=firstName,
//     m.lastName=lastName,
//     m.email=email,
//     m.code=code,
//     m.tel=tel,
//     m.subject=subject,
//     m.message=message,


//     //güncellenen products dizisini tekrardan dosyaya yaz.
//     fs.writeFileSync("messages.json", JSON.stringify(messages, null, 2)); // oluşan son diziyi tekrardan jsona yazar
//     // 200: başarılı
//     res.status(200).json("Mesaj güncellendi.");
// });

//? DELETE- SİL
app.delete("/api/messages/:id", (req, res) => {
    const id = Number(req.params.id);
    const messages = JSON.parse(fs.readFileSync("message.json", "utf-8")); //jsondaki veriyi çek
    const message = messages.find(m => m.id === id); // 404: ürün var mı?
    if (!message) {
        return res.status(404).json({
            error: "Silinecek mesaj bulunamadı."
        });
    }
    messages.splice(messages.indexOf(message), 1)
    //güncellenen products dizisini tekrardan dosyaya yaz.
    fs.writeFileSync("messages.json", JSON.stringify(messages, null, 2)); // oluşan son diziyi tekrardan jsona yazar
    // 200: başarılı
    res.status(200).json("Mesaj silindi.");
});

//! CONTACT send message kısmı
//? POST contact endpointi 
app.post("/api/contact", (req, res) => {
    try {
        const { firstName, lastName, email, code, tel, subject, message } = req.body
        if (!firstName || !lastName || !email || !code || !tel || !subject || !message) {
            return res.status(400).json("Başarısız!")
        }
        const messages = JSON.parse(fs.readFileSync("messages.json", "utf-8")); //jsondaki veriyi çek
        const newMessage = {
            id: data.length + 1,
            firstName: firstName,
            lastName: lastName,
            email: email,
            code: code,
            tel: tel,
            subject: subject,
            message: message,
        }; // eklenecek eleman hazırlandı
        messages.push(newMessage); //çektiğin diziye yeni elemanı ekle.
        fs.writeFileSync("messages.json", JSON.stringify(messages, null, 2)); // oluşan son diziyi tekrardan jsona yazar
        res.status(201).json("Başarılı!");

    }
    catch (e) {
        this.status="basarisiz";
        console.log(e.message);
    }
});



const PORT = 3001;
app.listen(PORT, () => console.log(`Backend: http://localhost:${PORT}`));