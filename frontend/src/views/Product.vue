<template>
    <div class="container py-4">
        <!-- MAĞAZA BAŞLIĞI -->
        <div class="text-center  mt-4  mb-5">
            <h1 class="fw-bold" style="color: #C71585;">Gökçe Hilal Akademi Mağazası</h1>
            <p class="text-muted">Shopier mağazamızdaki orijinal programlarımıza, ürünlerimize ve telkin müziklerimize
                buradan ulaşabilirsiniz.</p>
        </div>

        <!-- ÜRÜN KARTLARI LİSTESİ -->
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
                            <button @click="addCart(product.p_id)"
                                class="btn btn-kibar-yesil w-100 py-1_5 fw-semibold sepet-buton">
                                <i class="bi bi-cart-plus me-1"></i>Sepete Ekle
                            </button>

                        </div>
                    </div>
                </div>
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
                console.log("Ürün bulundu, tarayıcı ana hafızasındaki metoda uçuruluyor:", secilenUrun);

                // KESİN ÇÖZÜM: Tüm Vue bağları ve hataları bypass edildi, tarayıcı belleğindeki fonksiyon doğrudan tetiklendi!
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
    /* Fotoğraf köşeleri tam 15px yapıldı */
}

/* Ürün Kartının Genel Ayarları */
.custom-product-card {
    border-radius: 12px !important;
    /* Kartın dış köşeleri de 15px yapıldı */
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

.btn-kibar-yesil:hover {
    background-color: #008000;
    color: #ffffff !important;
}

.card-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* Safari ve Chrome uyumluluğu için */
    line-clamp: 2;
    /* 🟢 Standart mülkiyet (Editörün istediği ekleme) */
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
