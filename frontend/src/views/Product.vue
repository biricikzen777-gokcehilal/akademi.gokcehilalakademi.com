<template>
    <div class="container py-4">
        <!-- MAĞAZA BAŞLIĞI -->
        <div class="text-center  mt-4  mb-5">
            <h1 class="fw-bold" style="color: #C71585;">Gökçe Hilal Akademi Mağazası</h1>
            <p class="text-muted">Shopier mağazamızdaki orijinal programlarımıza, ürünlerimize ve telkin müziklerimize buradan ulaşabilirsiniz.</p>
        </div>

        <!-- ÜRÜN KARTLARI LİSTESİ -->
        <div class="row g-4">
            <div class="col-12 col-md-6 col-lg-4" v-for="(product, index) in filteredProducts" :key="product.p_id">
                <div class="card h-100 shadow-sm border border-light-subtle rounded-3 overflow-hidden custom-product-card">
                    
                    <!-- Resim Alanı & İndirim Rozeti (p_price_disc varsa gösterilir) -->
                    <div class="product-img-wrapper bg-light d-flex align-items-center justify-content-center p-3 position-relative">
                        <span v-if="product.p_price_disc" class="badge bg-danger position-absolute top-0 start-0 m-3 px-2 py-1_5 rounded-2 shadow-sm" style="font-size: 11px;">
                            %10 İndirim
                        </span>
                        
                        <!-- Eğer veritabanında p_img1 doluysa resmi basar, yoksa şık bir ikon gösterir -->
                        <img v-if="product.p_img1" :src="product.p_img1" class="img-fluid rounded animate-img" :alt="product.p_name" style="max-height: 140px; object-fit: contain;">
                        <div v-else class="text-center py-4 text-muted opacity-25">
                            <i class="bi bi-image fs-1"></i>
                        </div>
                    </div>
                    
                    <!-- Kart Gövdesi -->
                    <div class="card-body d-flex flex-column justify-content-between p-3">
                        <div>
                            <span class="text-secondary small d-block mb-1">Dijital Ürün</span>
                            <h5 class="card-title fw-bold text-dark fs-5 mb-3 text-uppercase" style="letter-spacing: -0.3px; min-height: 48px;">
                                {{ product.p_name }}
                            </h5>
                        </div>
                        
                        <!-- Fiyat ve Sepete Ekleme Butonu -->
                        <div>
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="d-flex flex-column">
                                    <!-- Üstü çizili eski fiyat p_price_disc alanından okunuyor -->
                                    <span v-if="product.p_price_disc" class="text-muted text-decoration-line-through small mb-0">
                                        {{ product.p_price_disc }}₺
                                    </span>
                                    <span class="fw-bold fs-5 text-success m-0">
                                        {{ product.p_price }}₺
                                    </span>
                                </div>
                                <span class="text-muted small">Stok: <b>{{ product.p_stock }}</b></span>
                            </div>
                            
                            <button @click="addCart(product.p_id)" class="btn btn-kibar-yesil w-100 rounded-pill py-2 fw-semibold">
                                <i class="bi bi-cart-plus me-2"></i>Sepete Ekle
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Arama Sonucu Boş Kalırsa Gösterilecek Uyarı -->
            <div class="col-12 text-center py-5 text-muted" v-if="filteredProducts.length === 0">
                <i class="bi bi-search fs-2 mb-2 d-block text-muted"></i>
                Mağazamızda bu isimle eşleşen bir ürün bulunamadı.
            </div>
        </div>
    </div>
</template>

<script>
export default {
    inject: ['sepet'],
    data() {
        return {
            products: [], // Veritabanından gelen ham ürünler
            baseUrl: "http://localhost:3001"
        };
    },
    mounted() {
        this.getProducts(); // Sayfa açılır açılmaz verileri çeker
    },
    computed: {
        // Ürünlerin ekranda listelenmesini ve arama çubuğunu yöneten güvenli filtre motoru
        filteredProducts() {
            // Eğer veritabanından henüz veri gelmediyse veya boşsa boş dizi dön, çökmeyi önle
            if (!this.products || !Array.isArray(this.products)) {
                return [];
            }

            // URL'deki (?q=...) arama parametresini yakalar, yoksa boş metin kabul eder
            const searchQuery = (this.$route.query && this.$route.query.q) 
                ? String(this.$route.query.q).toLowerCase().trim() 
                : "";

            // Eğer arama çubuğu boşsa, veritabanından gelen tüm ürünleri doğrudan listele
            if (!searchQuery) {
                return this.products;
            }

            // Arama yapıldıysa, sadece harfleri eşleşen ürünleri süz
            return this.products.filter(product => {
                const productName = product && product.p_name ? String(product.p_name).toLowerCase() : "";
                return productName.includes(searchQuery);
            });
        }
    },
    methods: {
        async getProducts() {
            try {
                const res = await fetch(`${this.baseUrl}/api/productsPage`);
                if (!res.ok) throw new Error("Sunucu hata kodu döndürdü.");
                
                const data = await res.json();
                
                // Gelen verinin dizi formatında olduğundan emin oluyoruz
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
                this.sepet.push({
                    name: secilenUrun.p_name,
                    price: Number(secilenUrun.p_price),
                    stock: secilenUrun.p_stock
                });
                alert(`${secilenUrun.p_name} sepetinize başarıyla eklendi.`);
            }
        }
    }
};
</script>


<style scoped>
    .custom-product-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: 1px solid rgba(0,0,0,0.08) !important;
        background-color: #ffffff;
    }
    .custom-product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06) !important;
    }
    .product-img-wrapper {
        height: 160px;
        border-bottom: 1px solid rgba(0,0,0,0.04);
        position: relative;
    }
    .btn-kibar-yesil {
        background-color: transparent;
        color: #198754;
        border: 1px solid #198754;
        font-size: 0.95rem;
        transition: all 0.2s ease;
    }
    .btn-kibar-yesil:hover {
        background-color: #198754;
        color: #ffffff !important;
    }
      .card-title {
        display: -webkit-box;
        -webkit-line-clamp: 2; /* Safari ve Chrome uyumluluğu için */
        line-clamp: 2;         /* 🟢 Standart mülkiyet (Editörün istediği ekleme) */
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
