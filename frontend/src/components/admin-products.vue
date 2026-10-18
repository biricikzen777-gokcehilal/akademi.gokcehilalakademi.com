<template>
    <div class="products">
        <!--! Ürünler -->
        <h3>Ürünler:</h3>
        <button style="float: right;" type="button" class="btn-sm btn btn-outline-success mb-4" data-bs-toggle="modal"
            data-bs-target="#addproduct">
            Ürün Ekle
        </button>

        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Ad</th>
                    <th scope="col">Stok</th>
                    <th scope="col">Fiyat</th>
                    <th scope="col">KDV'li Fiyat</th>
                    <th scope="col">Açıklama</th>
                    <th scope="col">İşlem</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product, index in products" :key="product.p_id">
                    <!-- <th>{{ index + 1 }}</th> -->
                    <th scope="row">{{ product.p_id }}</th>
                    <td><input class="form-control" type="text" v-model="product.p_name"> </td>
                    <td><input class="form-control" type="number" min="0" v-model="product.p_stock"> </td>
                    <td><input class="form-control" type="text" v-model="product.p_price"> </td>
                    <td>{{ product.p_price * 1.2 }} </td>
                    <td><textarea class="form-control" type="text" v-model="product.p_desc"></textarea></td>
                    <td>
                        <button
                            @click="updateProduct(product.p_id, product.p_name, product.p_stock, product.p_price, product.p_desc)"
                            class="btn-sm btn btn-outline-primary" type="submit">Güncelle</button>
                        <button style="margin-left: 10px;" class="btn-sm btn btn-outline-danger"
                            @click="deleteProduct(product.p_id)">Sil</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!--! Ürün Ekleme Modalı (Navbar Öncelikli Kesin Düzen) -->
     
        <div class="modal fade" id="addproduct" tabindex="-1" aria-hidden="true" style="z-index: 2050 !important;">
            <div class="modal-dialog modal-lg modal-dialog-centered" style="z-index: 2051 !important;">
                <div class="modal-content border-0 shadow-lg">

                    <div class="modal-header bg-success text-white py-3">
                        <h1 class="modal-title fs-5 fw-bold" id="exampleModalLabel">Yeni Ürün Ekle</h1>
                        <button type="button" id="closeAddProductModal" class="btn-close btn-close-white"
                            data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <!--! Ürün ekleme formu -->
                    <form @submit.prevent="addProduct()">
                        <div class="modal-body p-4 bg-white">
                            <div class="row g-3">

                                <!-- ÜRÜN ADI -->
                                <div class="col-12">
                                    <label class="form-label fw-semibold text-dark">Ürün Adı*</label>
                                    <input type="text" class="form-control py-2" v-model="newProduct.p_name" required
                                        placeholder="Örn: Ruhsal Şifa Programı">
                                </div>

                                <!-- STOK VE FİYAT (2 Eşit Sütun) -->
                                <div class="col-12 col-md-6">
                                    <label class="form-label fw-semibold text-dark">Stok Miktarı*</label>
                                    <input type="number" min="1" class="form-control py-2" v-model="newProduct.p_stock"
                                        required placeholder="Örn: 100">
                                </div>

                                <div class="col-12 col-md-6">
                                    <label class="form-label fw-semibold text-dark">Ürün Fiyatı (TL)*</label>
                                    <input type="text" class="form-control py-2" v-model.number="newProduct.p_price"
                                        pattern="[0-9]+([.][0-9]{1,2})?" required placeholder="Örn: 350.00">
                                </div>

                                <!-- AÇIKLAMA -->
                                <div class="col-12">
                                    <label class="form-label fw-semibold text-dark">Ürün Açıklaması*</label>
                                    <textarea class="form-control" rows="2" v-model="newProduct.p_desc" required
                                        placeholder="Ürünü anlatınız."></textarea>
                                </div>

                                <!-- FOTOĞRAFLAR VE ÖNİZLEME (2 Eşit Sütun) -->
                                <div class="col-12 border-top pt-3 mt-3">
                                    <label class="form-label fw-bold text-success mb-2" style="font-size: 15px;">Ürün
                                        Görseli</label>
                                    <div class="row align-items-center g-3">
                                        <div class="col-12 col-sm-6">
                                            <label class="form-label small text-secondary">Ana Fotoğraf
                                                (JPEG/PNG/WEBP):</label>
                                            <input ref="imageInput1" type="file" class="form-control py-1"
                                                accept="image/jpeg, image/png, image/webp"
                                                @change="handleImageChange($event, 1)" required />
                                        </div>
                                        <div
                                            class="col-12 col-sm-6 d-flex justify-content-center justify-content-sm-start">
                                            <div v-if="imagePreview1"
                                                class="image-preview-box p-1 border rounded bg-light shadow-sm">
                                                <img :src="imagePreview1"
                                                    style="width: 100px; height: 70px; object-fit: cover; display: block; border-radius: 4px;"
                                                    alt="Seçilen Ürün Fotoğrafı">
                                            </div>
                                            <div v-else
                                                class="text-muted small border border-dashed rounded text-center d-flex align-items-center justify-content-center"
                                                style="width: 100px; height: 70px; background-color: #fafafa; border-style: dashed !important;">
                                                <i class="bi bi-image fs-4 opacity-50"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="modal-footer bg-light p-3">
                            <!-- İstediğiniz gibi buton metni sadece Ürün Ekle olarak güncellendi -->
                            <button class="btn btn-success fw-bold py-2 shadow-sm" type="submit"
                                style="width: 100%; letter-spacing: 0.5px;">
                                Ürün Ekle
                            </button>
                            <label v-if="productMessage"
                                class="text-danger small mt-1 d-block w-100 text-center fw-medium">{{ productMessage
                                }}</label>
                        </div>
                    </form>

                </div>
            </div>
        </div>



        <!--! Başarılı Ürün Kaydı Toast Bildirimi -->
        <Teleport to="body">
            <transition name="fade-scale">
                <div v-if="showSuccessToast" class="admin-toast-overlay">
                    <div
                        class="admin-toast-card text-center d-flex flex-column align-items-center justify-content-center">
                        <!-- Yeşil Daire İçinde Beyaz Tik İkonu -->
                        <div class="toast-icon-circle mb-3">
                            <svg xmlns="http://w3.org" width="40" height="40" fill="currentColor"
                                class="bi bi-check-lg text-white" viewBox="0 0 16 16">
                                <path
                                    d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                            </svg>
                        </div>
                        <!-- Başarı Mesajı -->
                        <h5 class="fw-bold text-dark m-0" style="font-size: 15px;">Ürün Başarıyla Eklendi</h5>
                    </div>
                </div>
            </transition>
        </Teleport>


    </div>

</template>

<!--! Programlama ve fonksiyonların olduğu yer -->
<script>

export default {
    data() {
        return {
            newProduct: [
                { p_name: "", p_stock: 0, p_price: 0, p_desc: "" }

            ],
            products: [],
            productMessage: null,
            showSuccessToast: false, // İlk açılışta gizli durması için false kilitlendi
            baseUrl: "http://localhost:3001",

            // HATA BURADAYDI: Bu değişkenleri buraya eklemelisiniz
            imagePreview1: null,
            imagePreview2: null,

            // Resim dosyalarını tutacağınız değişkenler
            p_image1: null,
            p_image2: null,
            data() {
            },


        };

    },

    mounted() {
        this.getProducts()
    },

    unmounted() {

    },

    watch: {

    },

    computed: {

    },

    methods: {

        // Fotoğraf çekme
        handleImageChange(event, imageNumber) {
            const file = event.target.files[0];

            if (!file) {
                return;
            }

            if (imageNumber === 1) {
                this.p_image1 = file;
                this.imagePreview1 = URL.createObjectURL(file);
            }

            if (imageNumber === 2) {
                this.p_image2 = file;
                this.imagePreview2 = URL.createObjectURL(file);
            }

        },

        //GET- Ürünleri çektik
        async getProducts() {
            try {
                const id = sessionStorage.getItem("userId");
                const res = await fetch(`${this.baseUrl}/api/products/${id}`);
                if (!res.ok) throw new Error("Products endpoint hatası");
                this.products = await res.json();
            } catch (e) {
                console.log(e.message);
            }
        },

        // POST - Ürün ekleme (Bootstrap Kilitlerini Kaba Kuvvetle Kökten Çözen Metot)
        async addProduct() {
            try {
                const formData = new FormData();

                formData.append("name", this.newProduct.p_name || "");
                formData.append("stock", this.newProduct.p_stock || 0);
                formData.append("price", this.newProduct.p_price || 0);
                formData.append("desc", this.newProduct.p_desc || "");

                let userId = sessionStorage.getItem("userId");
                if (!userId || userId === "undefined" || userId === "null") {
                    userId = "1";
                }
                formData.append("userId", userId);

                if (this.p_image1) formData.append("image1", this.p_image1);
                if (this.p_image2) formData.append("image2", this.p_image2);

                const res = await fetch(`${this.baseUrl}/api/products`, {
                    method: "POST",
                    body: formData
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    const serverErrorMessage = errorData.error || "Bilinmeyen sunucu hatası";
                    throw new Error(`Sunucu Hatası: ${serverErrorMessage}`);
                }

                const data = await res.json();

                // ========================================================
                // KABA KUVVET (MANUEL) MODAL KAPATMA VE TOAST AKIŞI
                // ========================================================

                // 1. Modalı görünmez yapmak için Bootstrap'in 'show' sınıfını elinden alıyoruz
                const modalElement = document.getElementById('addproduct');
                if (modalElement) {
                    modalElement.classList.remove('show');
                    modalElement.style.display = 'none';
                    modalElement.setAttribute('aria-hidden', 'true');
                }

                // 2. Ekranın kilitli kalmasını engellemek için body etiketindeki Bootstrap kilitlerini siliyoruz
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';

                // 3. Arkadaki o yapışkan siyah perdeyi (gölgeliği) sayfadan tamamen söküp atıyoruz
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach(backdrop => backdrop.remove());

                // 4. Ekranın tam ortasındaki yeşil tikli kare kutuyu (Toast) açıyoruz
                this.showSuccessToast = true;

                // 5. Form alanlarını temizliyoruz ve ürün listesini anında yeniliyoruz
                this.getProducts();
                this.newProduct = [
                    { p_name: "", p_stock: 1, p_price: 0, p_desc: "" }
                ];
                this.imagePreview1 = null;
                this.imagePreview2 = null;
                this.p_image1 = null;
                this.p_image2 = null;

                // 6. Tam 3 saniye sonra yeşil kare kutuyu otomatik olarak kapatıyoruz
                setTimeout(() => {
                    this.showSuccessToast = false;
                }, 3000);

                // ========================================================

            }
            catch (error) {
                console.error("Ürün ekleme hatası:", error.message);
                alert("Hata: " + error.message);
            }
        },


        //PUT - Ürün güncelle 
        async updateProduct(p_id, p_name, p_stock, p_price, p_desc) {

            try {
                const res = await fetch(`${this.baseUrl}/api/products/${p_id}`, { //istekte bulunduğumuz yer.
                    method: "PUT", //PUT isteğinde buluyoruz.
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ //istekle beraber neleri yolluyorsun?
                        name: p_name,
                        stock: p_stock,
                        price: p_price,
                        desc: p_desc,
                    })
                });
                if (!res.ok) {
                    if (res.status == 400) throw new Error("Hatalı veri");
                }

                const data = await res.json();
                if (data) alert("Ürün güncellendi.")
                this.getProducts(); //Güncelle işleminden sonra tekrardan verileri çek.
            }
            catch (error) {
                console.log(error.message);
            }
        },

        //DELETE - Ürün sil 
        async deleteProduct(p_id) {
            try {
                const res = await fetch(`${this.baseUrl}/api/products/${p_id}`, { //istekte bulunduğumuz yer.
                    method: "DELETE", //PUT isteğinde buluyoruz.
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (!res.ok) throw new Error(res.error);
                const data = await res.json();
                if (data) alert("Ürün silindi.")
                this.getProducts(); //Güncelle işleminden sonra tekrardan verileri çek.
            }
            catch (error) {
                console.log(error);
            }
        }

    }
};

</script>

<style scoped>
/* Arka planı hafif buzlayan şeffaf perde katmanı */
.admin-toast-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999 !important;
    /* Modal ve navbar dahil her şeyin en üstüne çıkmasını sağlar */
}

/* İstediğiniz Tam Kare Başarı Bildirim Kartı */
.admin-toast-card {
    background-color: #ffffff;
    width: 220px;
    height: 220px;
    border-radius: 16px;
    /* Modern yumuşatılmış kare köşeler */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    padding: 20px;
}

/* Yeşil İkon Yuvarlağı */
.toast-icon-circle {
    width: 70px;
    height: 70px;
    background-color: #198754;
    /* Bootstrap Success Yeşili */
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 10px rgba(25, 135, 84, 0.25);
}

/* Vue Fade-Scale Geçiş Animasyonları */
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.85);
    /* Açılırken ve kapanırken büyüme/küçülme hissiyatı verir */
}
</style>