<template>
    <div class="container py-4">
        <!-- MAĞAZA BAŞLIĞI -->
        <div class="text-center mt-4 mb-5">
            <h1 class="fw-bold" style="color: #C71585;">Gökçe Hilal Akademi Mağazası</h1>
            <p class="text-muted">Ruhsal Şifa İlmi çalışmalarıma, özel içeriklerime, aromaterapi karışımlarıma ve telkin
                müziklerime buradan ulaşabilirsiniz.</p>
        </div>

        <!-- 🚀 HOCANIN İSTEDİĞİ CANLI ÜRÜN FİLTRELEME VE SIRALAMA PANELİ -->
        <div class="row g-3 mb-4 mt-1 bg-white rounded-3  align-items-center mx-1">
            <!-- İsim ile Canlı Arama Kutusu -->
            <div class="col-12 col-md-6">
                <div class="input-group input-group-sm">
                    <span class="input-group-text bg-white text-muted border-end-0"><i class="bi bi-search"></i></span>
                    <input type="text" v-model="filterSearch" class="form-control border-start-0 shadow-none ps-1"
                        placeholder="Eğitim veya program adı arayın..." style="height: 38px; font-size: 13px;" />
                </div>
            </div>
            <!-- Fiyat ve Alfabetik Sıralama Dropdown Menüsü -->
            <div class="col-12 col-md-6">
                <select v-model="filterSort" class="form-select form-select-sm shadow-none text-secondary"
                    style="height: 38px; font-size: 13px;">
                    <option value="">Varsayılan Sıralama</option>
                    <option value="price-asc">Fiyat: Ucuzdan Pahalıya</option>
                    <option value="price-desc">Fiyat: Pahalıdan Ucuza</option>
                    <option value="name-asc">İsim: A'dan Z'ye</option>
                </select>
            </div>
        </div>

        <!-- ÜRÜN KARTLARI LİSTESİ (1 SATIRA 5 ADET DİKEY KART) -->
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
            <div class="col" v-for="(product, index) in filteredProducts" :key="product.p_id">
                <div
                    class="card h-100 shadow-sm border border-light-subtle rounded-3 overflow-hidden custom-product-card d-flex flex-column">

                    <!-- 1080x1350 ÖZEL DİKEY RESİM ALANI -->
                    <div class="product-img-wrapper bg-white d-flex align-items-center justify-content-center p-2 position-relative"
                        style="aspect-ratio: 1080 / 1350; overflow: hidden;">

                        <!-- Veritabanındaki p_img1 doluysa resmi KIRPMADAN basar -->
                        <img v-if="product.p_img1" :src="`http://localhost:3001${product.p_img1}`"
                            class="dikey-format-img animate-img" :alt="product.p_name">

                        <div v-else class="text-center py-5 text-muted opacity-25">
                            <i class="bi bi-image fs-4"></i>
                        </div>
                    </div>

                    <!-- Kart Gövdesi -->
                    <div class="card-body d-flex flex-column justify-content-between p-2_5" style="font-size: 13px;">
                        <div>
                            <span class="text-secondary opacity-75 d-block mb-1" style="font-size: 11px;">Dijital
                                Program</span>
                            <!-- Yazıların taşmasını önlemek için 2 satır sınırı -->
                            <h6 class="card-title fw-bold text-dark mb-2 text-uppercase product-title-two-lines">
                                {{ product.p_name }}
                            </h6>
                        </div>

                        <!-- Fiyat ve Sepet Alanı -->
                        <div class="mt-auto">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="fw-bold text-success fs-6 m-0">
                                    {{ product.p_price }}₺
                                </span>
                                <span class="text-muted" style="font-size: 11px;">Stok: <b>{{ product.p_stock
                                        }}</b></span>
                            </div>

                            <!-- Yuvarlatılmış Köşeli Sepet Butonu (Radius: 5px) -->
                            <!-- Stok 0 olduğunda buton otomatik kilitlenir -->
                            <button @click="addCart(product.p_id)" :disabled="product.p_stock === 0"
                                class="btn btn-kibar-yesil w-100 py-1_5 fw-semibold sepet-buton">
                                <i class="bi"
                                    :class="product.p_stock === 0 ? 'bi-x-circle me-1' : 'bi-cart-plus me-1'"></i>
                                {{ product.p_stock === 0 ? 'Tükendi' : 'Sepete Ekle' }}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Arama Kriterine Uygun Ürün Kalmazsa Gösterilecek Zarif Mesaj -->
        <div v-if="filteredProducts.length === 0" class="text-center text-muted py-5 w-100">
            <i class="bi bi-search fs-2 d-block mb-2 text-secondary opacity-50"></i>
            Aradığınız kriterlere uygun akademi ürünü veya program bulunamadı.
        </div>
    </div>
</template>


<script>
export default {
    inject: ['sepet'],
    data() {
        return {
            products: [], // Veritabanından gelen ham ürünler
            baseUrl: "http://localhost:3001",
            // 🚀 HOCANIN İSTEDİĞİ CANLI PANEL BAĞLARI
            filterSearch: "",
            filterSort: ""
        };
    },
    mounted() {
        this.getProducts(); // Sayfa açılır açılmaz verileri çeker
    },
    computed: {
        // 🚀 Üst menü aramasını, panel içi aramayı ve fiyat/ad sıralamasını tek merkezden yöneten süzgeç motoru
        filteredProducts() {
            if (!this.products || !Array.isArray(this.products)) {
                return [];
            }

            let result = [...this.products];

            // ==========================================
            // SÜZGEÇ 1: ÜST MENÜDEN GELEN SORGULAR (?q=...)
            // ==========================================
            const urlQuery = (this.$route.query && this.$route.query.q)
                ? String(this.$route.query.q).toLocaleLowerCase('tr-TR').trim()
                : "";

            if (urlQuery) {
                result = result.filter(product => {
                    const productName = product && product.p_name
                        ? String(product.p_name).toLocaleLowerCase('tr-TR')
                        : "";
                    return productName.includes(urlQuery);
                });
            }

            // ==========================================
            // SÜZGEÇ 2: SAYFA İÇİNDEKİ ARAMA KUTUSU (filterSearch)
            // ==========================================
            if (this.filterSearch && this.filterSearch.trim() !== "") {
                const innerQuery = this.filterSearch.trim().toLocaleLowerCase('tr-TR');
                result = result.filter(product => {
                    const productName = product && product.p_name
                        ? String(product.p_name).toLocaleLowerCase('tr-TR')
                        : "";
                    return productName.includes(innerQuery);
                });
            }

            // ==========================================
            // SÜZGEÇ 3: FİYAT VE AD ALFABETİK SIRALAMA MOTORU
            // ==========================================
            if (this.filterSort === "price-asc") {
                result.sort((a, b) => Number(a.p_price || 0) - Number(b.p_price || 0));
            } else if (this.filterSort === "price-desc") {
                result.sort((a, b) => Number(b.p_price || 0) - Number(a.p_price || 0));
            } else if (this.filterSort === "name-asc") {
                result.sort((a, b) => {
                    const nameA = String(a.p_name || "");
                    const nameB = String(b.p_name || "");
                    return nameA.localeCompare(nameB, 'tr');
                });
            }

            return result;
        }

    },
    methods: {
        async getProducts() {
            try {
                const res = await fetch(`${this.baseUrl}/api/productsPage`);
                if (!res.ok) throw new Error("Sunucu hata kodu döndürdü.");

                const data = await res.json();

                if (Array.isArray(data)) {
                    this.products = data;
                } else {
                    console.error("Gelen veri dizi formatında değil:", data);
                }
            }
            catch (e) {
                console.error("Veri tabanından ürünler çekilemedi:", e.message);
            }
        },

        addCart(id) {
            if (!this.products) return;

            const secilenUrun = this.products.find(p => p.p_id == id);

            if (secilenUrun) {
                console.log("Ürün bulundu, tarayıcı ana hafızasındaki metoda uçuruluyor:", secilenUrun);

                if (window.küreselSepeteEkle) {
                    window.küreselSepeteEkle(secilenUrun);
                } else {
                    console.error("Küresel sepet fonksiyonu hafızada bulunamadı!");
                }
            }
        }
    }
};
</script>

<style scoped>
/* Resmin Oranlarını Asla Bozmayan ve Kırpmayan Özel Sınıf */
.dikey-format-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    border-radius: 12px !important;
}

/* Ürün Kartının Genel Ayarları */
.custom-product-card {
    border-radius: 12px !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Kartın üzerine gelince sadece tüm kart hafifçe yukarı kalkar, resim sabit kalır */
.custom-product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06) !important;
}

.btn-kibar-yesil {
    background-color: transparent;
    color: #008000;
    border: 1px solid #008000;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    border-radius: 5px;
}

.btn-kibar-yesil:hover:not([disabled]) {
    background-color: #008000;
    color: #ffffff !important;
}

/* 🚀 HOCANIN KURALI İÇİN TÜKENDİ BUTON STİLİ */
.btn-kibar-yesil:disabled {
    background-color: #f8f9fa !important;
    color: #6c757d !important;
    border: 1px solid #dee2e6 !important;
    cursor: not-allowed;
}

.card-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.animate-img {
    transition: transform 0.3s ease;
}

.custom-product-card:hover .animate-img {
    transform: scale(1.04);
}
</style>
