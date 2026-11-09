<template>
    <div>
        <div class="sepet-icon" style="border-color: green;">
            <a data-bs-toggle="offcanvas" href="#sepetBar">
                <i class="bi bi-cart fs-2 sepet-ana-ikon"></i>
            </a>
        </div>

        <!-- !sepet side bar -->
        <div class="offcanvas offcanvas-end" style="padding: 20px;" tabindex="-1" id="sepetBar">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title fw-bold">Sepetim</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body d-flex flex-column justify-content-between">
                <div>
                    <div class="row mb-3 border-bottom pb-2">
                        <div class="col-8 text-muted small"><b>ÜRÜN ADI</b></div>
                        <div class="col-4 text-muted small text-end"><b>FİYAT</b></div>
                    </div>
                    <!-- Sepetteki Ürünlerin Listelendiği Satırlar -->
                    <div class="row mb-3 align-items-center sepet-urun-satir" v-for="(value, index) in sepet" :key="index">
                        <div class="col-8 urun-adi fw-medium text-dark">{{ value.name }}</div>
                        <div class="col-3 text-end fw-semibold text-secondary">{{ value.price }}₺</div>
                        <div class="col-1 text-end">
                            <i style="cursor: pointer;" @click="deleteItem(index)" class="bi bi-x sepet-sil-ikon"></i>
                        </div>
                    </div>
                    <!-- Eğer Sepet Boşsa Gösterilecek Alan -->
                    <div v-if="sepet.length === 0" class="text-center text-muted py-5 opacity-75">
                        <i class="bi bi-cart-x fs-1 d-block mb-2" style="color: #C71585;"></i>
                        Sepetiniz henüz boş.
                    </div>
                </div>

                <div>
                    <div class="row mb-3 align-items-center border-top pt-3">
                        <div class="col-7"><span class="text-muted fw-medium">Toplam Tutar:</span></div>
                        <div class="col-5 text-end"><h4 class="m-0 fw-bold" style="color: #C71585;">{{ toplamTutar }}₺</h4></div>
                    </div>
                    
                    <!-- Ödeme Sayfasına Git Butonu -->
                    <button 
                        @click="goCheckout" 
                        class="btn btn-kibar-yesil w-100 py-2 fw-semibold" 
                        data-bs-dismiss="offcanvas"
                        :disabled="sepet.length === 0"
                    >
                        <i class="bi bi-credit-card me-2"></i>Ödeme Sayfasına Git
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SepetComponent',
    // KESİN ÇÖZÜM: Tüm Vue enjeksiyon bağları iptal edildi, isim çakışması sıfırlandı!
    inject: [], 
    computed: {
        // Şablondaki 'v-for="... in sepet"' kodları kırılmasın diye sepeti computed olarak bağlıyoruz
        sepet() {
            // Tarayıcı belleğindeki mühürlü diziyi okur, eğer henüz yüklenmediyse App.vue boş dizi fırlatır
            return window.küreselSepetHafizasi || [];
        },
        toplamTutar() {
            if (!this.sepet || !Array.isArray(this.sepet)) return 0;
            const toplam = this.sepet.reduce((acc, urun) => acc + Number(urun.price), 0);
            return Math.round(toplam * 100) / 100;
        }
    },
    methods: {
        deleteItem(index) {
            this.sepet.splice(index, 1);
            localStorage.setItem("gokceSepet", JSON.stringify(this.sepet));
        },
        goCheckout() {
            this.$router.push('/checkout');
        }
    }
};
</script>


<style scoped>
    /* 🌸 Koyu Pembe İkon Tasarımları */
    .sepet-ana-ikon, .sepet-sil-ikon {
        color: #C71585 !important;
    }
    
    /* Silme ikonunu daha kibar bir "X" yaptık ve üzerine gelince hafifçe parlatıyoruz */
    .sepet-sil-ikon {
        font-size: 1.4rem;
        transition: opacity 0.2s;
    }
    .sepet-sil-ikon:hover {
        opacity: 0.7;
    }

    /* 🟢 İnce ve Kibar Yeşil Buton Tasarımı */
    .btn-kibar-yesil {
        background-color: #00800007;
        color: #008000;
        border: 1px solid #008000;
        border-radius: 5px; 
        padding: 10px 20px;
        font-size: 0.95rem;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    /* Butonun üzerine gelindiğinde zarif bir dolgu efekti */
    .btn-kibar-yesil:hover:not(:disabled) {
        background-color: #008000;
        color: #ffffff !important;
    }

    .btn-kibar-yesil:hover:not(:disabled) i {
        color: #ffffff !important;
    }

    /* Sepet boşken butonun pasif durma stili */
    .btn-kibar-yesil:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .urun-adi {
        font-size: 0.95rem;
    }
</style>
