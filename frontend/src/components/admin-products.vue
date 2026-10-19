<template>
    <div class="products container-fluid p-0 m-0" style="font-family: sans-serif;">
        <!-- ÜST BAŞLIK VE EKLEME BUTONU -->
        <div class="d-flex justify-content-between align-items-center mb-4 pt-3 px-3">
            <h4 class="fw-semibold text-dark m-0" style="font-size: 20px;">Ürün Yönetimi</h4>
            <button type="button" class="btn btn-success btn-sm shadow-sm d-flex align-items-center gap-2 py-2 px-3" @click="openModal">
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
                            <th scope="row" class="text-secondary fw-normal p-0 m-0 text-center">#{{ product.p_id }}</th>
                            <td class="p-0 m-0">
                                <input class="form-control form-control-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0" style="font-size: 13px; height: 32px;" type="text" v-model="product.p_name">
                            </td>
                            <td class="p-0 m-0">
                                <input class="form-control form-control-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0" style="font-size: 13px; height: 32px;" type="number" min="0" v-model.number="product.p_stock">
                            </td>
                            <td class="p-0 m-0">
                                <input class="form-control form-control-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0" style="font-size: 13px; height: 32px;" type="text" v-model="product.p_price">
                            </td>
                            <td class="p-0 m-0">
                                <span class="text-success fw-medium ps-1" style="font-size: 13px;">
                                    {{ (Number(product.p_price || 0) * 1.2).toFixed(2) }} TL
                                </span>
                            </td>
                            <td class="p-0 m-0">
                                <textarea class="form-control form-control-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0" style="font-size: 13px; height: 32px; resize: none;" rows="1" v-model="product.p_desc"></textarea>
                            </td>
                            <td class="text-end p-0 m-0">
                                <div class="d-inline-flex gap-1 me-1">
                                    <button @click="updateProduct(product.p_id, product.p_name, product.p_stock, product.p_price, product.p_desc)"
                                        class="btn btn-sm btn-outline-primary py-0_5 px-2 rounded-1" style="font-size: 12px; height: 26px; line-height: 1;">
                                        <i class="bi bi-save"></i> Güncelle
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger py-0_5 px-2 rounded-1" style="font-size: 12px; height: 26px; line-height: 1;" @click="deleteProduct(product.p_id)">
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
                        <div class="custom-modal-header border-bottom p-3 d-flex justify-content-between align-items-center bg-light rounded-top-2">
                            <h5 class="m-0 text-dark fw-semibold" style="font-size: 15px;">Yeni Ürün Ekle (3 Resimli)</h5>
                            <button type="button" @click="closeModal" class="btn-close" style="font-size: 12px;" aria-label="Kapat"></button>
                        </div>
                        <form @submit.prevent="addProduct">
                            <div class="p-3 bg-white" style="font-size: 13px;">
                                <div class="row g-3">
                                    <div class="col-12">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Ürün Adı*</label>
                                        <input type="text" class="form-control form-control-sm border-light-subtle shadow-none" v-model="newProduct.p_name" required placeholder="Örn: Ruhsal Şifa Programı">
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Stok Miktarı*</label>
                                        <input type="number" min="0" class="form-control form-control-sm border-light-subtle shadow-none" v-model.number="newProduct.p_stock" required placeholder="Örn: 100">
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Ürün Fiyatı (TL)*</label>
                                        <input type="number" step="100" min="0" class="form-control form-control-sm border-light-subtle shadow-none" v-model.number="newProduct.p_price" required placeholder="Örn: 350.00">
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Ürün Açıklaması*</label>
                                        <textarea class="form-control form-control-sm border-light-subtle shadow-none" rows="3" v-model="newProduct.p_desc" required placeholder="Ürün detaylarını giriniz..."></textarea>
                                    </div>

                                    <!-- 3 AYRI RESİM SEÇİCİ ALANI (İsimler SQL Sütunlarıyla Eşitlendi) -->
                                    <div class="col-12 border-top pt-2 mt-2">
                                        <label class="form-label text-success mb-2" style="font-weight: 500;">Ürün Görselleri (3 Resim Alanı)</label>
                                        
                                        <div class="mb-2 border border-light-subtle p-2 rounded bg-light-subtle">
                                            <label class="form-label text-muted small mb-1">Görsel 1 (Ana Resim)*</label>
                                            <input type="file" name="p_img1" class="form-control form-control-sm shadow-none" accept="image/*" @change="handleImageChange($event, 1)" required />
                                        </div>

                                        <div class="mb-2 border border-light-subtle p-2 rounded bg-light-subtle">
                                            <label class="form-label text-muted small mb-1">Görsel 2*</label>
                                            <input type="file" name="p_img2" class="form-control form-control-sm shadow-none" accept="image/*" @change="handleImageChange($event, 2)" required />
                                        </div>

                                        <div class="border border-light-subtle p-2 rounded bg-light-subtle">
                                            <label class="form-label text-muted small mb-1">Görsel 3*</label>
                                            <input type="file" name="p_img3" class="form-control form-control-sm shadow-none" accept="image/*" @change="handleImageChange($event, 3)" required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="border-top p-3 bg-light rounded-bottom-2 d-flex justify-content-end gap-2" style="font-size: 13px;">
                                <button type="button" class="btn btn-sm btn-light border border-light-subtle text-secondary py-1_5 px-3" @click="closeModal">Vazgeç</button>
                                <button type="submit" class="btn btn-sm btn-success py-1_5 px-3">Ürünü Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Teleport>


        <!-- BAŞARILI TOAST BİLDİRİMİ -->
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
            newProduct: {
                p_name: "",
                p_stock: 0,
                p_price: 0,
                p_desc: ""
            },
            products: [],
            baseUrl: "http://localhost:3001",
            p_images: {
                1: null,
                2: null,
                3: null
            }
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
            if (!files || files.length === 0) return;
            this.p_images[index] = files[0]; 
        },
        async getProducts() {
            try {
                const id = sessionStorage.getItem("userId") || "1";
                const res = await fetch(`${this.baseUrl}/api/products/${id}`);
                if (!res.ok) throw new Error("Ürünler listesi çekilemedi.");
                this.products = await res.json();
            } catch (e) {
                console.error("GET Hatası:", e.message);
            }
        },
        async addProduct() {
            try {
                const formData = new FormData();
                formData.append("p_name", this.newProduct.p_name);
                formData.append("p_stock", this.newProduct.p_stock);
                formData.append("p_price", this.newProduct.p_price);
                formData.append("p_desc", this.newProduct.p_desc);
                formData.append("u_id", sessionStorage.getItem("userId") || "1");

                if (this.p_images[1]) formData.append("p_img1", this.p_images[1]);
                if (this.p_images[2]) formData.append("p_img2", this.p_images[2]);
                if (this.p_images[3]) formData.append("p_img3", this.p_images[3]);

                const res = await fetch(`${this.baseUrl}/api/addProductSecure`, {
                    method: "POST",
                    body: formData
                });

                if (!res.ok) throw new Error("Sunucu ürünü veritabanına ekleyemedi.");

                this.isModalOpen = false;
                document.body.style.overflow = '';
                this.showSuccessToast = true;

                setTimeout(() => {
                    this.showSuccessToast = false;
                    this.resetForm();
                    this.getProducts();
                }, 3000);

            } catch (error) {
                alert("Ürün eklenirken bir hata oluştu: " + error.message);
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
                alert("Ürün başarıyla güncellendi.");
                this.getProducts();
            } catch (error) {
                alert("Hata: " + error.message);
            }
        },
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
                console.error(error);
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
.toast-fade-enter-active, .toast-fade-leave-active {
    transition: all 0.25s ease;
}
.toast-fade-enter-from, .toast-fade-leave-to {
    opacity: 0;
    transform: scale(0.92);
}
</style>
