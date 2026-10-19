<template>
    <div class="products container-fluid p-0 m-0" style="font-family: sans-serif;">
        <!-- ÜST BAŞLIK VE EKLEME BUTONU -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-semibold text-dark m-0" style="font-size: 20px;">Ürün Yönetimi</h4>
            <button type="button" class="btn btn-success btn-sm shadow-sm d-flex align-items-center gap-2 py-2 px-3"
                @click="openModal">
                <i class="bi bi-plus-circle"></i> Yeni Ürün Ekle
            </button>
        </div>

        <!-- ÜRÜN LİSTELEME TABLOSU -->
        <div class="card border border-light-subtle shadow-sm rounded-2 overflow-hidden">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0" style="font-size: 13px;">
                    <thead class="table-light text-muted fw-normal">
                        <tr>
                            <th scope="col" class="ps-3 fw-normal" style="width: 80px;">ID</th>
                            <th scope="col" class="fw-normal">Ürün Adı</th>
                            <th scope="col" class="fw-normal" style="width: 110px;">Stok</th>
                            <th scope="col" class="fw-normal" style="width: 140px;">Fiyat (TL)</th>
                            <th scope="col" class="fw-normal" style="width: 140px;">KDV'li Fiyat</th>
                            <th scope="col" class="fw-normal">Açıklama</th>
                            <th scope="col" class="text-end pe-3 fw-normal" style="width: 180px;">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in products" :key="product.p_id">
                            <th scope="row" class="ps-3 text-secondary fw-normal">#{{ product.p_id }}</th>
                            <td>
                                <input class="form-control form-control-sm border-light-subtle" style="font-size: 13px;"
                                    type="text" v-model="product.p_name">
                            </td>
                            <td>
                                <input class="form-control form-control-sm border-light-subtle" style="font-size: 13px;"
                                    type="number" min="0" v-model.number="product.p_stock">
                            </td>
                            <td>
                                <input class="form-control form-control-sm border-light-subtle" style="font-size: 13px;"
                                    type="text" v-model="product.p_price">
                            </td>
                            <td>
                                <span class="text-success fw-medium">
                                    {{ (Number(product.p_price || 0) * 1.2).toFixed(2) }} TL
                                </span>
                            </td>
                            <td>
                                <textarea class="form-control form-control-sm border-light-subtle"
                                    style="font-size: 13px;" rows="1" v-model="product.p_desc"></textarea>
                            </td>
                            <td class="text-end pe-3">
                                <div class="d-inline-flex gap-2">
                                    <button
                                        @click="updateProduct(product.p_id, product.p_name, product.p_stock, product.p_price, product.p_desc)"
                                        class="btn btn-sm btn-outline-primary py-1 px-2" style="font-size: 12px;">
                                        <i class="bi bi-save"></i> Güncelle
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger py-1 px-2" style="font-size: 12px;"
                                        @click="deleteProduct(product.p_id)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="products.length === 0">
                            <td colspan="7" class="text-center text-muted py-4">Henüz eklenmiş bir ürün bulunmuyor.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- TELEPORTLU ÜRÜN EKLEME MODALI -->
        <Teleport to="body">
            <div v-if="isModalOpen" class="custom-modal-backdrop" @click.self="closeModal">
                <div class="custom-modal-dialog">
                    <div class="custom-modal-content border border-light-subtle rounded-2 shadow-lg">
                        <div
                            class="custom-modal-header border-bottom p-3 d-flex justify-content-between align-items-center bg-light rounded-top-2">
                            <h5 class="m-0 text-dark fw-semibold" style="font-size: 15px;">Yeni Ürün Ekle</h5>
                            <button type="button" @click="closeModal" class="btn-close" style="font-size: 12px;"
                                aria-label="Kapat"></button>
                        </div>
                        <form @submit.prevent="addProduct">
                            <div class="p-3 bg-white" style="font-size: 13px;">
                                <div class="row g-3">
                                    <div class="col-12">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Ürün
                                            Adı*</label>
                                        <input type="text"
                                            class="form-control form-control-sm border-light-subtle shadow-none"
                                            v-model="newProduct.p_name" required
                                            placeholder="Örn: Ruhsal Şifa Programı">
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Stok
                                            Miktarı*</label>
                                        <input type="number" min="0"
                                            class="form-control form-control-sm border-light-subtle shadow-none"
                                            v-model.number="newProduct.p_stock" required placeholder="Örn: 100">
                                    </div>
                                    <!-- ÜRÜN FİYATI (100 TL aralıklarla artış sağlandı) -->
                                    <div class="col-6">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Ürün Fiyatı
                                            (TL)*</label>
                                        <input type="number" step="100" min="0"
                                            class="form-control form-control-sm border-light-subtle shadow-none"
                                            v-model.number="newProduct.p_price" required placeholder="Örn: 350.00">
                                    </div>

                                    <div class="col-12">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Ürün
                                            Açıklaması*</label>
                                        <textarea class="form-control form-control-sm border-light-subtle shadow-none"
                                            rows="3" v-model="newProduct.p_desc" required
                                            placeholder="Ürün detaylarını giriniz..."></textarea>
                                    </div>
                                    <div class="col-12 border-top pt-2 mt-2">
                                        <label class="form-label text-success mb-1" style="font-weight: 500;">Ürün
                                            Görseli</label>
                                        <div class="d-flex align-items-center gap-3">
                                            <div class="flex-grow-1">
                                                <input type="file"
                                                    class="form-control form-control-sm border-light-subtle shadow-none"
                                                    accept="image/jpeg, image/png, image/webp"
                                                    @change="handleImageChange" required />
                                            </div>
                                            <div class="flex-shrink-0">
                                                <div v-if="imagePreview"
                                                    class="border border-light-subtle rounded p-1 bg-light position-relative">
                                                    <img :src="imagePreview" class="rounded object-fit-cover"
                                                        style="width: 60px; height: 45px; display: block;"
                                                        alt="Önizleme">
                                                    <button type="button" @click="removeImage"
                                                        class="btn btn-danger position-absolute p-0 d-flex align-items-center justify-content-center rounded-circle"
                                                        style="width: 16px; height: 16px; top: -5px; right: -5px; font-size: 9px;">
                                                        <i class="bi bi-x"></i>
                                                    </button>
                                                </div>
                                                <div v-else
                                                    class="text-muted border border-dashed border-light-subtle rounded text-center d-flex align-items-center justify-content-center bg-light"
                                                    style="width: 60px; height: 45px;">
                                                    <i class="bi bi-image opacity-50" style="font-size: 16px;"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="border-top p-3 bg-light rounded-bottom-2 d-flex justify-content-end gap-2"
                                style="font-size: 13px;">
                                <button type="button"
                                    class="btn btn-sm btn-light border border-light-subtle text-secondary py-1_5 px-3"
                                    @click="closeModal">Vazgeç</button>
                                <button type="submit" class="btn btn-sm btn-success py-1_5 px-3">Ürünü Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- TOAST BİLDİRİMİ -->
        <Teleport to="body">
            <Transition name="toast-fade">
                <div v-if="showSuccessToast" class="custom-toast-overlay">
                    <div class="custom-toast-card border border-light-subtle rounded-2 shadow-lg">
                        <div class="toast-icon-wrapper bg-success text-white rounded-circle">
                            <i class="bi bi-check-lg"></i>
                        </div>
                        <h6 class="m-0 text-dark" style="font-size: 14px; font-weight: 500;">Ürün Başarıyla Eklendi</h6>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script>
export default {
    name: 'AdminProducts',
    data() {
        return {
            isModalOpen: false,
            showSuccessToast: false,
            // Reaktif form nesnemiz arayüzdeki v-model alanlarıyla birebir eşleşir
            newProduct: {
                p_name: "",
                p_stock: 0,
                p_price: 0,
                p_desc: ""
            },
            products: [],
            productMessage: null,
            baseUrl: "http://localhost:3001",
            imagePreview: null,
            p_image: null
        };
    },
    mounted() {
        this.getProducts();
    },
    methods: {
        openModal() {
            this.isModalOpen = true;
            document.body.style.overflow = 'hidden';
        },
        closeModal() {
            this.isModalOpen = false;
            document.body.style.overflow = '';
            this.resetForm();
        },
        resetForm() {
            this.newProduct = { p_name: "", p_stock: 0, p_price: 0, p_desc: "" };
            this.removeImage();
            this.productMessage = null;
        },
        // DÜZELTİLDİ: Tekil dosya binary verisi güvenli şekilde hafızaya alınır
        handleImageChange(event) {
            const file = event.target.files[0]; // İlk elemanı alarak binary kilidini açıyoruz
            if (!file) return;

            this.p_image = file;
            this.imagePreview = URL.createObjectURL(file);
        },

        removeImage() {
            this.p_image = null;
            this.imagePreview = null;
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => input.value = '');
        },

        // API: Ürün Ekle (POST) - Sütun İsimleriyle Birebir Eşitlendi
        async addProduct() {
            try {
                const formData = new FormData();

                // phpMyAdmin şemanızdaki birebir sütun isimleri
                formData.append("p_name", this.newProduct.p_name);
                formData.append("p_stock", this.newProduct.p_stock);
                formData.append("p_price", this.newProduct.p_price);
                formData.append("p_desc", this.newProduct.p_desc);
                formData.append("u_id", sessionStorage.getItem("userId") || "1");

                // KRİTİK ALAN: Backend Multer'ın beklediği "p_img1" ile tam eşitlendi!
                if (this.p_image) {
                    formData.append("p_img1", this.p_image);
                }

                const res = await fetch(`${this.baseUrl}/api/products`, {
                    method: "POST",
                    body: formData // Content-Type belirtmiyoruz, tarayıcı boundary değerini otomatik atar
                });

                if (!res.ok) throw new Error("Sunucu ürünü veritabanına ekleyemedi.");

                // Başarılı Kapatma ve Toast Akışı
                this.isModalOpen = false;
                document.body.style.overflow = '';
                this.showSuccessToast = true;

                setTimeout(() => {
                    this.showSuccessToast = false;
                    this.resetForm();
                    this.getProducts(); // Tabloyu yeniler
                }, 3000);

            } catch (error) {
                console.error("Ekleme Hatası:", error.message);
                alert("Ürün eklenirken bir hata oluştu: " + error.message);
            }
        },

        // API: Ürünleri Listele (GET)
        async getProducts() {
            try {
                // Tablonuzdaki u_id ilişkisi için session hafızasındaki ID'yi okuyoruz
                const id = sessionStorage.getItem("userId") || "1";
                const res = await fetch(`${this.baseUrl}/api/products/${id}`);
                if (!res.ok) throw new Error("Ürünler listesi çekilemedi.");
                this.products = await res.json();
            } catch (e) {
                console.error("GET Hatası:", e.message);
            }
        },
        // API: Ürün Güncelle (PUT) - YENİ SQL ŞEMASINA GÖRE DÜZENLENDİ
        async updateProduct(p_id, p_name, p_stock, p_price, p_desc) {
            try {
                const res = await fetch(`${this.baseUrl}/api/products/${p_id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        p_name: p_name,
                        p_stock: Number(p_stock),
                        p_price: Number(p_price),
                        p_desc: p_desc
                    })
                });
                if (!res.ok) throw new Error("Güncelleme başarısız.");
                alert("Ürün başarıyla güncellendi.");
                this.getProducts();
            } catch (error) {
                console.error("Güncelleme Hatası:", error.message);
                alert("Hata: " + error.message);
            }
        },
        // API: Ürün Sil (DELETE)
        async deleteProduct(p_id) {
            if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
            try {
                const res = await fetch(`${this.baseUrl}/api/products/${p_id}`, {
                    method: "DELETE"
                });
                if (!res.ok) throw new Error("Silme işlemi başarısız.");
                alert("Ürün silindi.");
                this.getProducts();
            } catch (error) {
                console.error("Silme Hatası:", error.message);
            }
        }
    }
};
</script>


<style scoped>
.custom-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100000 !important;
}

.custom-modal-dialog {
    width: 100%;
    max-width: 500px;
    margin: 1.75rem;
}

.custom-modal-content {
    background: #ffffff;
    display: flex;
    flex-direction: column;
}

.form-control:focus {
    border-color: #198754 !important;
    box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.15) !important;
}

.custom-toast-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(1px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100100 !important;
}

.custom-toast-card {
    background: #ffffff;
    padding: 20px 35px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.toast-icon-wrapper {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: all 0.25s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
    opacity: 0;
    transform: scale(0.92);
}
</style>
