<template>
    <div class="user-products">
        <!-- ÜST BİLGİLENDİRME BANNERI -->
        <div class="d-flex flex-column mt-4  flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
                <h4 class="fw-bold text-dark m-0">Öğrencilerimize Özel Akademik Mağaza</h4>
                <p class="text-muted small m-0 mt-1">Aktif öğrencilerimiz için tüm eğitim ve materyallerde %5 indirim otomatik uygulanır.</p>
            </div>
            <span class="badge bg-danger fs-6 py-2 px-3 shadow-sm align-self-start align-self-md-center">%5 İndirim Kampanyası Aktif</span>
        </div>

        <!-- ÜRÜN KARTLARI GRUBU -->
        <div class="row g-4">
            <!-- 1. Bioenerji Eğitimi -->
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm border border-light-subtle rounded-3 overflow-hidden">
                    <div class="p-4 text-center bg-light border-bottom text-success">
                        <i class="bi bi-lightning-charge fs-1"></i>
                    </div>
                    <div class="card-body p-3 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold m-0 text-dark">Bioenerji Uzmanlık Eğitimi</h6>
                            <p class="text-muted small mt-1">Sertifikalı uzaktan eğitim programı, video kaynaklar ve dökümanlar.</p>
                        </div>
                        <div class="d-flex align-items-center justify-content-between mt-3">
                            <div class="d-flex flex-column">
                                <span class="text-muted text-decoration-line-through small">2,000₺</span>
                                <span class="fw-bold text-success fs-5">1,900₺</span>
                            </div>
                            <button @click="addToCart('Bioenerji Uzmanlık Eğitimi', 1900)" class="btn btn-sm btn-kibar-yesil rounded-pill px-3 py-1.5 fw-medium">
                                <i class="bi bi-cart-plus me-1"></i> Sepete Ekle
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2. Ruhsal Şifa Eğitimi -->
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm border border-light-subtle rounded-3 overflow-hidden">
                    <div class="p-4 text-center bg-light border-bottom text-pembe">
                        <i class="bi bi-heart-pulse fs-1"></i>
                    </div>
                    <div class="card-body p-3 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold m-0 text-dark">Ruhsal Şifa ve Arınma Eğitimi</h6>
                            <p class="text-muted small mt-1">İçsel blokajları kaldırma ve meditatif şifalandırma modülleri.</p>
                        </div>
                        <div class="d-flex align-items-center justify-content-between mt-3">
                            <div class="d-flex flex-column">
                                <span class="text-muted text-decoration-line-through small">2,500₺</span>
                                <span class="fw-bold text-pembe fs-5">2,375₺</span>
                            </div>
                            <button @click="addToCart('Ruhsal Şifa ve Arınma Eğitimi', 2375)" class="btn btn-sm btn-kibar-pembe rounded-pill px-3 py-1.5 fw-medium">
                                <i class="bi bi-cart-plus me-1"></i> Sepete Ekle
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. Ruhyıldızı Eğitimi -->
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm border border-light-subtle rounded-3 overflow-hidden">
                    <div class="p-4 text-center bg-light border-bottom text-dark">
                        <i class="bi bi-star-fill fs-1"></i>
                    </div>
                    <div class="card-body p-3 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold m-0 text-dark">Ruhyıldızı İleri Seviye Eğitimi</h6>
                            <p class="text-muted small mt-1">Kozmic enerji uyanışı ve yüksek benlik bağlantı pratikleri.</p>
                        </div>
                        <div class="d-flex align-items-center justify-content-between mt-3">
                            <div class="d-flex flex-column">
                                <span class="text-muted text-decoration-line-through small">3,000₺</span>
                                <span class="fw-bold text-success fs-5">2,850₺</span>
                            </div>
                            <button @click="addToCart('Ruhyıldızı İleri Seviye Eğitimi', 2850)" class="btn btn-sm btn-kibar-yesil rounded-pill px-3 py-1.5 fw-medium">
                                <i class="bi bi-cart-plus me-1"></i> Sepete Ekle
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 4. Özel Frekanslı Aromaterapi Kokusu -->
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm border border-light-subtle rounded-3 overflow-hidden">
                    <div class="p-4 text-center bg-light border-bottom text-pembe">
                        <i class="bi bi-flower1 fs-1"></i>
                    </div>
                    <div class="card-body p-3 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold m-0 text-dark">Aura Yükseltici Ruhsal Koku</h6>
                            <p class="text-muted small mt-1">Doğal esans yağları ile formüle edilmiş frekans dengeleyici koku.</p>
                        </div>
                        <div class="d-flex align-items-center justify-content-between mt-3">
                            <div class="d-flex flex-column">
                                <span class="text-muted text-decoration-line-through small">400₺</span>
                                <span class="fw-bold text-pembe fs-5">380₺</span>
                            </div>
                            <button @click="addToCart('Aura Yükseltici Ruhsal Koku', 380)" class="btn btn-sm btn-kibar-pembe rounded-pill px-3 py-1.5 fw-medium">
                                <i class="bi bi-cart-plus me-1"></i> Sepete Ekle
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 5. Adaçayı ve Doğal Tütsü Seti -->
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm border border-light-subtle rounded-3 overflow-hidden">
                    <div class="p-4 text-center bg-light border-bottom text-success">
                        <i class="bi bi-water fs-1"></i>
                    </div>
                    <div class="card-body p-3 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold m-0 text-dark">Mekansal Arınma Tütsü Seti</h6>
                            <p class="text-muted small mt-1">Negatif enerjileri uzaklaştırmak için birinci kalite kurutulmuş adaçayı seti.</p>
                        </div>
                        <div class="d-flex align-items-center justify-content-between mt-3">
                            <div class="d-flex flex-column">
                                <span class="text-muted text-decoration-line-through small">250₺</span>
                                <span class="fw-bold text-success fs-5">237.5₺</span>
                            </div>
                            <button @click="addToCart('Mekansal Arınma Tütsü Seti', 237.5)" class="btn btn-sm btn-kibar-yesil rounded-pill px-3 py-1.5 fw-medium">
                                <i class="bi bi-cart-plus me-1"></i> Sepete Ekle
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
    name: 'UserProducts',
    inject: ['sepet'], // App.vue'daki ortak sepet dizisini inject ediyoruz
    methods: {
        addToCart(name, price) {
            // Sepete %5 indirimli yeni ürünü ekleyen metot
            this.sepet.push({
                name: name,
                price: Number(price),
                stock: 99
            });
            alert(`${name} %5 indirimli fiyatıyla sepetinize eklendi!`);
        }
    }
}
</script>

<style scoped>
    /* 🎴 Kartların Hover ve Tasarım Geçişleri */
    .card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.06) !important;
    }

    /* 🖋️ Renk Tanımlamaları */
    .text-pembe {
        color: #C71585 !important;
    }

    /* 🟢 İnce Kibar Yeşil Buton */
    .btn-kibar-yesil {
        background-color: transparent;
        color: #198754;
        border: 1px solid #198754;
        transition: all 0.2s ease;
    }
    .btn-kibar-yesil:hover {
        background-color: #198754;
        color: #ffffff !important;
    }

    /* 🌸 İnce Kibar Pembe Buton */
    .btn-kibar-pembe {
        background-color: transparent;
        color: #C71585;
        border: 1px solid #C71585;
        transition: all 0.2s ease;
    }
    .btn-kibar-pembe:hover {
        background-color: #C71585;
        color: #ffffff !important;
    }
</style>
