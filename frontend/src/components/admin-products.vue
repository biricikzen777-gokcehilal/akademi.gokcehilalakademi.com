<template>
    <div class="products container-fluid p-0 m-0" style="font-family: sans-serif;">
        <!-- ÜST BAŞLIK VE EKLEME BUTONU -->
        <div class="d-flex justify-content-between align-items-center mb-4 pt-3 px-3">
            <h4 class="fw-semibold text-dark m-0" style="font-size: 20px;">Ürün Yönetimi</h4>
            <button type="button" style="background-color: #008000;"
                class="btn btn-success btn-sm shadow-sm d-flex align-items-center gap-2 py-2 px-3" @click="openModal">
                <i class="bi bi-plus-circle"></i> Yeni Ürün Ekle
            </button>
        </div>

        <!-- ÜRÜN LİSTELEME TABLOSU -->
        <div class="card border border-light-subtle shadow-sm rounded-2 overflow-hidden mx-3 mb-3">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0 p-0 m-0" style="font-size: 13px;">
                    <thead class="table-light text-muted fw-normal">
                        <tr>
                            <th scope="col" class="fw-normal p-0 m-0 text-center" style="width: 60px;">ID</th>
                            <th scope="col" class="fw-normal p-0 m-0">Ürün Adı</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 100px;">Stok</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 130px;">Fiyat (TL)</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 130px;">KDV'li Fiyat</th>
                            <th scope="col" class="fw-normal p-0 m-0">Açıklama</th>
                            <th scope="col" class="text-end fw-normal p-0 m-0" style="width: 160px;">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in products" :key="product.p_id" class="p-0 m-0">
                            <th scope="row" class="text-secondary fw-normal p-0 m-0 text-center">#{{ product.p_id }}
                            </th>
                            <td class="p-0 m-0">
                                <input
                                    class="form-control form-control-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0"
                                    style="font-size: 13px; height: 32px;" type="text" v-model="product.p_name">
                            </td>
                            <td class="p-0 m-0">
                                <input
                                    class="form-control form-control-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0"
                                    style="font-size: 13px; height: 32px;" type="number" min="0"
                                    v-model.number="product.p_stock">
                            </td>
                            <td class="p-0 m-0">
                                <input
                                    class="form-control form-control-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0"
                                    style="font-size: 13px; height: 32px;" type="text" v-model="product.p_price">
                            </td>
                            <td class="p-0 m-0">
                                <span class="text-success fw-medium ps-1" style="font-size: 13px;">
                                    {{ (Number(product.p_price || 0) * 1.2).toFixed(2) }} TL
                                </span>
                            </td>
                            <td class="p-0 m-0">
                                <textarea
                                    class="form-control form-control-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0"
                                    style="font-size: 13px; height: 32px; resize: none;" rows="1"
                                    v-model="product.p_desc"></textarea>
                            </td>
                            <td class="text-end p-0 m-0">
                                <div class="d-inline-flex gap-1 me-1">
                                    <button
                                        @click="updateProduct(product.p_id, product.p_name, product.p_stock, product.p_price, product.p_desc)"
                                        class="btn btn-sm btn-outline-primary py-0_5 px-2 rounded-1"
                                        style="font-size: 12px; height: 26px; line-height: 1;">
                                        <i class="bi bi-save"></i> Güncelle
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger py-0_5 px-2 rounded-1"
                                        style="font-size: 12px; height: 26px; line-height: 1;"
                                        @click="deleteProduct(product.p_id)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="products.length === 0">
                            <td colspan="7" class="text-center text-muted py-3">Henüz eklenmiş bir ürün bulunmuyor.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- TELEPORTLU 3 RESİMLİ ÜRÜN EKLEME MODALI -->
        <Teleport to="body">
            <div v-if="isModalOpen" class="custom-modal-backdrop" @click.self="closeModal">
                <div class="custom-modal-dialog">
                    <div class="custom-modal-content border border-light-subtle rounded-2 shadow-lg">
                        <div
                            class="custom-modal-header border-bottom p-3 d-flex justify-content-between align-items-center bg-light rounded-top-2">
                            <h5 class="m-0 text-dark fw-semibold" style="font-size: 15px;">Yeni Ürün Ekle (3 Resimli)
                            </h5>
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

                                    <!-- 3 AYRI RESİM SEÇİCİ ALANI (Ref Yapısı ile Kilitlenme Önleyici Güncelleme) -->
                                    <div class="col-12 border-top pt-2 mt-2">
                                        <label class="form-label text-success mb-2" style="font-weight: 500;">Ürün
                                            Görselleri (3 Resim Alanı)</label>

                                        <div class="mb-2 border border-light-subtle p-2 rounded bg-light-subtle">
                                            <label class="form-label text-muted small mb-1">Görsel 1 (Ana
                                                Resim)*</label>
                                            <input type="file" name="p_img1" ref="fileInput1"
                                                class="form-control form-control-sm shadow-none" accept="image/*"
                                                required />
                                        </div>

                                        <div class="mb-2 border border-light-subtle p-2 rounded bg-light-subtle">
                                            <label class="form-label text-muted small mb-1">Görsel 2*</label>
                                            <input type="file" name="p_img2" ref="fileInput2"
                                                class="form-control form-control-sm shadow-none" accept="image/*"
                                                required />
                                        </div>

                                        <div class="border border-light-subtle p-2 rounded bg-light-subtle">
                                            <label class="form-label text-muted small mb-1">Görsel 3*</label>
                                            <input type="file" name="p_img3" ref="fileInput3"
                                                class="form-control form-control-sm shadow-none" accept="image/*"
                                                required />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="border-top p-3 bg-light rounded-bottom-2 d-flex justify-content-end gap-2"
                                style="font-size: 13px;">
                                <button type="button"
                                    class="btn btn-sm btn-light border border-light-subtle text-secondary py-1_5 px-3"
                                    @click="closeModal">Vazgeç</button>
                                <button type="submit" style="background-color: #008000;"
                                    class="btn btn-sm btn-success py-1_5 px-3">Ürünü Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- BAŞARILI TOAST BİLDİRİMİ (ZATEN VARDI) -->
        <Teleport to="body">
            <Transition name="toast-fade">
                <div v-if="showSuccessToast" class="custom-toast-overlay">
                    <div class="custom-toast-card border border-light-subtle rounded-4 shadow-lg">
                        <div class="toast-icon-wrapper bg-success text-white rounded-circle">
                            <i class="bi bi-check-lg"></i>
                        </div>
                        <h6 class="toast-text">Ürün Başarıyla Eklendi</h6>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- 1. ÜRÜN GÜNCELLENDİ TOAST BİLDİRİMİ -->
        <Teleport to="body">
            <Transition name="toast-fade">
                <div v-if="showUpdateToast" class="custom-toast-overlay">
                    <div class="custom-toast-card border border-light-subtle rounded-4 shadow-lg">
                        <div class="toast-icon-wrapper bg-primary text-white rounded-circle"
                            style="box-shadow: 0 8px 20px rgba(13, 110, 253, 0.3);">
                            <i class="bi bi-arrow-clockwise"></i>
                        </div>
                        <h6 class="toast-text">Ürün Başarıyla Güncellendi</h6>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- 2. ÜRÜN SİLİNDİ TOAST BİLDİRİMİ -->
        <Teleport to="body">
            <Transition name="toast-fade">
                <div v-if="showDeleteToast" class="custom-toast-overlay">
                    <div class="custom-toast-card border border-light-subtle rounded-4 shadow-lg">
                        <div class="toast-icon-wrapper bg-danger text-white rounded-circle"
                            style="box-shadow: 0 8px 20px rgba(220, 53, 69, 0.3);">
                            <i class="bi bi-trash3"></i>
                        </div>
                        <h6 class="toast-text">Ürün Başarıyla Silindi</h6>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- 3. SİLME ONAY MODALI (KARE UYUMLU CONFIRM PENCERESİ) -->
        <Teleport to="body">
            <Transition name="toast-fade">
                <div v-if="showConfirmModal" class="custom-toast-overlay" style="pointer-events: auto;">
                    <div class="custom-toast-backdrop-dark" @click="cancelDelete"></div>
                    <div class="custom-toast-card border border-light-subtle rounded-4 shadow-lg position-relative"
                        style="z-index: 10000; height: auto; min-height: 220px; gap: 0.8rem;">
                        <div class="toast-icon-wrapper bg-warning text-dark rounded-circle"
                            style="box-shadow: 0 8px 20px rgba(255, 193, 7, 0.3);">
                            <i class="bi bi-exclamation-triangle"></i>
                        </div>
                        <h6 class="toast-text">Bu ürünü silmek istediğinize emin misiniz?</h6>
                        <!-- Onay Butonları -->
                        <div class="d-flex gap-2 w-100 mt-2">
                            <button @click="cancelDelete" class="btn btn-sm btn-light border w-50 py-1_5 fw-semibold"
                                style="font-size: 13px;">Vazgeç</button>
                            <button @click="confirmDelete" class="btn btn-sm btn-danger w-50 py-1_5 fw-semibold"
                                style="font-size: 13px;">Sil</button>
                        </div>
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
            // Modal ve Listeleme Durumları
            isModalOpen: false,
            products: [],
            baseUrl: "http://localhost:3001",

            // Yeni Ürün Form Verileri
            newProduct: {
                p_name: "",
                p_stock: 0,
                p_price: 0,
                p_desc: ""
            },

            // Resim Referans Hafızası
            p_images: {
                1: null,
                2: null,
                3: null
            },

            // Kare Format Yeni Bildirim (Toast) ve Silme Durumları
            showSuccessToast: false,
            showUpdateToast: false,
            showDeleteToast: false,
            showConfirmModal: false,
            pendingDeleteId: null
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
            this.p_images = { 1: null, 2: null, 3: null };
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => input.value = '');
        },

        handleImageChange(event, index) {
            const files = event.target.files;
            if (!files || files.length === 0) {
                this.p_images[index] = null;
                return;
            }
            // CRITICAL FIX: files değil, dizinin İLK elemanı olan files[0] ham dosyasını alıyoruz!
            this.p_images[index] = files[0];
            console.log(`Görsel ${index} seçildi:`, files[0].name);
        },

        async getProducts() {
            try {
                // Yeni oluşturduğumuz filtrelemeyen doğrudan rotaya istek atıyoruz
                const res = await fetch(`${this.baseUrl}/api/allAdminProducts`);
                if (!res.ok) throw new Error("Ürünler listesi çekilemedi.");
                this.products = await res.json();
            } catch (e) {
                console.error("GET Hatası:", e.message);
                this.products = [];
            }
        },

        // BACKEND DEN HABER BEKLEYEN KODLAR
        // async addProduct() {
        //     console.log("Form tetiklendi, ürün ekleme başladı...", this.newProduct);
        //     try {
        //         const formData = new FormData();
        //         formData.append("p_name", this.newProduct.p_name);
        //         formData.append("p_stock", this.newProduct.p_stock);
        //         formData.append("p_price", this.newProduct.p_price);
        //         formData.append("p_desc", this.newProduct.p_desc);
        //         formData.append("u_id", sessionStorage.getItem("userId") || "1");

        //         // TAM GÜVENCE: Vue proxy nesnesini bypass edip direkt HTML input elementlerinden dosyaları çekiyoruz
        //         const fileInputs = document.querySelectorAll('input[type="file"]');

        //         fileInputs.forEach(input => {
        //             if (input.files && input.files[0]) {
        //                 // Input elementinin name özniteliğine göre (p_img1, p_img2, p_img3) eşleştirip ekliyoruz
        //                 formData.append(input.name, input.files[0]);
        //                 console.log(`${input.name} ham dosya olarak FormData'ya eklendi:`, input.files[0].name);
        //             }
        //         });

        //         console.log("Backend'e istek gönderiliyor...");
        //         const res = await fetch(`${this.baseUrl}/api/products`, {
        //             method: "POST",
        //             body: formData
        //         });

        //         console.log("Backend yanıt statüsü:", res.status);

        //         if (!res.ok) {
        //             const errorData = await res.json().catch(() => ({}));
        //             throw new Error(errorData.error || "Sunucu ürünü veritabanına ekleyemedi.");
        //         }

        //         const responseData = await res.json();
        //         console.log("Başarılı Sonuç:", responseData);

        //         // Modalı kapat ve başarı bildirimini göster
        //         this.isModalOpen = false;
        //         document.body.style.overflow = '';
        //         this.showSuccessToast = true;

        //         setTimeout(() => {
        //             this.showSuccessToast = false;
        //             this.resetForm();
        //             this.getProducts();
        //         }, 3000);

        //     } catch (error) {
        //         console.error("Yakaladığımız Hata:", error);
        //         alert("Ürün eklenirken bir hata oluştu: " + error.message);
        //     }
        // },

        // BACKEND DEN HABER BEKLEMEYEN KODLAR
        async addProduct() {
            console.log("Form tetiklendi, ürün ekleme başladı...", this.newProduct);
            try {
                // HIZLANDIRMA DOKUNUŞU: Kullanıcıyı bekletmeden kare başarı toastını ANINDA açıyoruz
                this.isModalOpen = false;
                document.body.style.overflow = '';
                this.showSuccessToast = true;

                const formData = new FormData();
                formData.append("p_name", this.newProduct.p_name);
                formData.append("p_stock", this.newProduct.p_stock);
                formData.append("p_price", this.newProduct.p_price);
                formData.append("p_desc", this.newProduct.p_desc);
                formData.append("u_id", sessionStorage.getItem("userId") || "1");

                // Ref Yapısı üzerinden dosyaları güvenli ekliyoruz
                if (this.$refs.fileInput1 && this.$refs.fileInput1.files) {
                    formData.append("p_img1", this.$refs.fileInput1.files);
                }
                if (this.$refs.fileInput2 && this.$refs.fileInput2.files) {
                    formData.append("p_img2", this.$refs.fileInput2.files);
                }
                if (this.$refs.fileInput3 && this.$refs.fileInput3.files) {
                    formData.append("p_img3", this.$refs.fileInput3.files);
                }

                // İstek arka planda sessizce ve güvenle akmaya devam ediyor
                console.log("Backend'e istek arka planda gönderiliyor...");
                const res = await fetch(`${this.baseUrl}/api/products`, {
                    method: "POST",
                    body: formData
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.error || "Sunucu ürünü veritabanına ekleyemedi.");
                }

                // Arka planda kayıt bittiğinde listeyi tazele ve formu sıfırla
                setTimeout(() => {
                    this.showSuccessToast = false;
                    this.resetForm();
                    this.getProducts();
                }, 2500);

            } catch (error) {
                // Eğer çok nadir de olsa arka planda bir hata oluşursa uyar ve toastı kapat
                this.showSuccessToast = false;
                console.error("Yakaladığımız Hata:", error);
                alert("Ürün arka planda kaydedilirken bir hata oluştu: " + error.message);
            }
        },

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

                // MAVİ KARE GÜNCELLENDİ TOASTI TETİKLENİYOR
                this.showUpdateToast = true;
                this.getProducts();

                setTimeout(() => {
                    this.showUpdateToast = false;
                }, 2500);

            } catch (error) {
                alert("Hata: " + error.message);
            }
        },

        // SİL BUTONUNA BASILDIĞINDA İLK BURASI ÇALIŞIR
        deleteProduct(p_id) {
            this.pendingDeleteId = p_id; // Silinecek ID'yi hafızaya al
            this.showConfirmModal = true; // Kare Onay penceresini aç
            document.body.style.overflow = 'hidden';
        },

        // KARE ONAY PENCERESİNDE "SİL" DENİRSE BURASI ÇALIŞIR
        async confirmDelete() {
            if (!this.pendingDeleteId) return;
            try {
                const res = await fetch(`${this.baseUrl}/api/products/${this.pendingDeleteId}`, {
                    method: "DELETE"
                });
                if (!res.ok) throw new Error("Silme işlemi başarısız.");

                this.showConfirmModal = false;
                document.body.style.overflow = '';

                // KIRMIZI KARE SİLİNDİ TOASTI TETİKLENİYOR
                this.showDeleteToast = true;
                this.getProducts();

                setTimeout(() => {
                    this.showDeleteToast = false;
                    this.pendingDeleteId = null;
                }, 2500);

            } catch (error) {
                alert("Hata: " + error.message);
                this.cancelDelete();
            }
        },

        // KARE ONAY PENCERESİNDE "VAZGEÇ" DENİRSE BURASI ÇALIŞIR
        cancelDelete() {
            this.showConfirmModal = false;
            this.pendingDeleteId = null;
            document.body.style.overflow = '';
        },

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
    padding: 30px 35px;
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
