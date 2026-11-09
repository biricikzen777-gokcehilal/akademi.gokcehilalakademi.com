<template>
    <div class="user-products">
        <!-- ÜST BİLGİLENDİRME BANNERI (Kurumsal %10 İndirim Ayarı Kilitlendi) -->
        <div class="d-flex flex-column mt-4 flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
                <h4 class="fw-bold text-dark m-0">Öğrencilerimize Özel Akademik Mağaza</h4>
                <p class="text-muted small m-0 mt-1">Aktif öğrencilerimiz için tüm eğitim ve materyallerde %10 indirim otomatik uygulanır.</p>
            </div>
            <span class="badge bg-danger fs-6 py-2 px-3 shadow-sm align-self-start align-self-md-center">%10 İndirim Kampanyası Aktif</span>
        </div>

        <!-- DİNAMİK ÜRÜN KARTLARI GRUBU (Her Satırda Tam 4 Kart Düzeni: col-lg-3) -->
        <div class="row g-3">
            <div v-for="(product, index) in products" :key="index" class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card h-100 shadow-none border border-light-subtle rounded-3 p-2_5 custom-product-card bg-white">
                    
                    <!-- DİKEY FOTOĞRAF ALANI (1080x1350 Kuralına Tam Uyumlu) -->
                    <div class="product-image-wrapper bg-light rounded-3 overflow-hidden mb-2" style="aspect-ratio: 1080/1350; width: 100%;">
                        <img :src="product.p_img1 ? `${baseUrl}${product.p_img1}` : '/src/assets/img/logo.jpg'" 
                             :alt="product.p_name || product.name" 
                             class="dikey-format-img" />
                    </div>

                    <!-- Kart Alt Detay Gövdesi -->
                    <div class="card-body p-0 d-flex flex-column justify-content-between">
                        <div>
                            <!-- Dijital Ürün Alt Başlığı -->
                            <small class="text-muted d-block mb-1">Dijital Ürün</small>
                            
                            <!-- 2 Satırda Otomatik Sabitlenen Başlık Motoru -->
                            <h6 class="fw-bold text-dark m-0 product-title-two-lines">
                                {{ product.p_name || product.name }}
                            </h6>
                        </div>

                        <!-- Fiyat ve Sepet Alanı (Yumuşak Çizgi ile Ayrıldı) -->
                        <div class="d-flex align-items-center justify-content-between mt-2 pt-2 border-top">
                            <div class="d-flex flex-column">
                                <!-- Üstü Çizili Orijinal Eski Fiyat -->
                                <span class="text-muted text-decoration-line-through original-price-text">
                                    {{ Number(product.p_price || product.price) }}.00₺
                                </span>
                                <!-- %10 İndirimli Canlı Yeni Fiyat -->
                                <span class="fw-bold discount-price-text">
                                    {{ calculateDiscount(product.p_price || product.price) }}₺
                                </span>
                            </div>
                            
                            <!-- Oval Kibar Sepet Butonu -->
                            <button @click="addCartWithDiscount(product)" 
                                    class="btn btn-sm btn-kibar-yesil sepet-buton py-1 fw-medium">
                                <i class="bi bi-cart-plus me-1"></i> Sepete Ekle
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Eğer Mağazada Ürün Yoksa Gösterilecek Boş Alan -->
            <div v-if="products.length === 0" class="text-center text-muted py-5 col-12">
                <i class="bi bi-basket fs-1 d-block mb-2 text-pembe"></i>
                Mağazada henüz aktif ürün listelenmedi.
            </div>
        </div>
    </div>
</template>



<script>
export default {
    name: 'UserProducts',
    data() {
        return {
            products: [], // Veritabanından çekilecek dinamik ürün listesi
            baseUrl: "http://localhost:3001" // Backend API sunucu adresiniz
        };
    },
    mounted() {
        // Sayfa yüklendiği an veritabanındaki güncel ürünleri çeker
        this.fetchPanelProducts();
    },
    methods: {
        // Vitrinle %100 aynı veritabanını okuyan asenkron API fonksiyonu
        // Vitrinle %100 aynı ve sadece aktif ürünleri çeken kurşun geçirmez API fonksiyonu
        async fetchPanelProducts() {
            try {
                // KESİN DÜZELTME: server.js içinde zaten tanımlı olan /api/productsPage rotasına bağlandık!
                const response = await fetch(`${this.baseUrl}/api/ordersPage` ? `${this.baseUrl}/api/productsPage` : `${this.baseUrl}/api/productsPage`);
                if (!response.ok) throw new Error("Ürün verileri sunucudan çekilemedi.");
                const data = await response.json();
                this.products = data;
                console.log("🚀 Öğrenci paneline dinamik aktif ürünler başarıyla yüklendi:", data);
            } catch (error) {
                console.error("Mağaza yükleme hatası:", error.message);
            }
        },

        // %10 İndirim Hesaplama Motoru (Kuruşları yuvarlar)
        calculateDiscount(price) {
            const rawPrice = Number(price || 0);
            const discounted = rawPrice * 0.90; // %10 İndirim düşülüyor
            return Math.round(discounted * 100) / 100;
        },

               // İndirimli Fiyatı Hesaplayıp Tarayıcı Hafızasındaki Metoda Gönderen Fonksiyon
        addCartWithDiscount(product) {
            if (!product) return;

            const indirimliFiyat = this.calculateDiscount(product.p_price || product.price);

            // KESİN DÜZELTME: App.vue'nun tam olarak aradığı 'name' ve 'price' standart alanlarını da pakete ekliyoruz!
            const indirimliUrunPaketi = {
                p_id: product.p_id || product.id,
                p_name: product.p_name || product.name,
                name: product.p_name || product.name,
                p_price: indirimliFiyat,
                price: indirimliFiyat // %10 İndirimli ham sayı değeri tam kilitlendi
            };

            console.log("🚀 Küresel hafızaya uçurulan indirimli kargo:", indirimliUrunPaketi);

            if (window.küreselSepeteEkle) {
                window.küreselSepeteEkle(indirimliUrunPaketi);
            } else {
                console.error("Küresel sepet fonksiyonu tarayıcı hafızasında bulunamadı!");
            }
        },


        // İsimlere göre otomatik Bootstrap İkon eşleştirme motoru
        getCardIcon(name) {
            const lowerName = String(name || "").toLowerCase();
            if (lowerName.includes("bioenerji")) return "bi bi-lightning-charge fs-1";
            if (lowerName.includes("şifa") || lowerName.includes("arınma")) return "bi bi-heart-pulse fs-1";
            if (lowerName.includes("yıldız") || lowerName.includes("ileri")) return "bi bi-star-fill fs-1";
            if (lowerName.includes("koku") || lowerName.includes("aura")) return "bi bi-flower1 fs-1";
            return "bi bi-box-seam fs-1"; // Varsayılan yedek ikon
        }
    }
};
</script>

<style scoped>
    /* Ürün Kartının Genel Köşeleri ve Yumuşak Etkileşimi */
    .custom-product-card {
        border-radius: 15px !important;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .custom-product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
    }

    /* Resmin Oranlarını Kesmeden Kutuya Sığdıran V3 Sınıfı */
    .dikey-format-img {
        width: 100%;
        height: 100%;
        object-fit: contain; 
        object-position: center;
        border-radius: 12px !important;
    }

    /* Yan Yana Duran Kartların Başlık Uzunlukları Değişse Bile Çizgiyi Sabitleyen Motor */
    .product-title-two-lines {
        display: -webkit-box !important;
        -webkit-box-orient: vertical !important;
        -webkit-line-clamp: 2 !important;
        line-clamp: 2;
        overflow: hidden !important;
        text-overflow: ellipsis;
        min-height: 38px;
        font-size: 13px;
        line-height: 1.4;
    }

    /* Üstü Çizili Orijinal Eski Fiyat Fontu */
    .original-price-text {
        font-size: 11px;
        color: #6c757d !important;
    }

    /* %10 İndirimli Başarı Yeşili Yeni Fiyat Fontu */
    .discount-price-text {
        font-size: 15px;
        color: #008000 !important;
    }

    /* 🟢 İnce ve Keskin Oval Yeşil Buton Tasarımı */
    .btn-kibar-yesil {
        background-color: #00800007;
        color: #008000;
        border: 1px solid #008000;
        border-radius: 5px !important; /* Oval yapıyı kırıp kibar 5px kilitledi */
        font-size: 12px;
        transition: all 0.2s ease;
    }
    .btn-kibar-yesil:hover {
        background-color: #008000;
        color: #ffffff !important;
    }
    .btn-kibar-yesil:active {
        transform: scale(0.97);
    }

    /* Kartların Zarif İç Boşluğu */
    .p-2_5 {
        padding: 0.75rem !important;
    }
    
    .text-pembe {
        color: #C71585 !important;
    }
</style>

