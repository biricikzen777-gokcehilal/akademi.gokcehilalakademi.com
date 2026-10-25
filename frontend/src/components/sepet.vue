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
                <h5 class="offcanvas-title">Sepet</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body d-flex flex-column justify-content-between">
                <div>
                    <div class="row mb-3 border-bottom pb-2">
                        <div class="col-8 text-muted small"><b>ÜRÜN ADI</b></div>
                        <div class="col-4 text-muted small text-end"><b>FİYAT</b></div>
                    </div>
                    <div class="row mb-3 align-items-center sepet-urun-satir" v-for="(value, index) in sepet" :key="index">
                        <div class="col-8 urun-adi">{{ value.name }}</div>
                        <div class="col-3 text-end">{{ value.price }}₺</div>
                        <div class="col-1 text-end">
                            <i style="cursor: pointer;" @click="deleteItem(index)" class="bi bi-x sepet-sil-ikon"></i>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="row mb-3 align-items-center">
                        <div class="col-7"><span class="text-muted">Toplam Tutar:</span></div>
                        <div class="col-5 text-end"><h5 class="m-0 fw-bold">{{ toplamTutar }}₺</h5></div>
                    </div>
                    <!-- İnce, kibar hatlara sahip yeşil buton (btn-outline-success) -->
                   <!-- Eski <router-link> yerine bu kibar butonu ekleyin -->
                    <button 
                        @click="goCheckout" 
                        class="btn btn-kibar-yesil w-100" 
                        data-bs-dismiss="offcanvas"
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
    inject: ['sepet'],
    computed: {
        toplamTutar() {
            const toplam = this.sepet.reduce((acc, urun) => acc + Number(urun.price), 0);
            return Math.round(toplam * 100) / 100;
        }
    },
  
    methods: {
    deleteItem(index) {
        this.sepet.splice(index, 1);
    },
    goCheckout() {
        // JavaScript üzerinden yönlendirmeyi zorunlu kılıyoruz
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
        font-size: 1.3rem;
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
        border-radius: 5px; /* Köşeleri yumuşatarak kibarlaştırdık */
        padding: 10px 20px;
        font-size: 0.95rem;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    /* Butonun üzerine gelindiğinde zarif bir dolgu efekti */
    .btn-kibar-yesil:hover {
        background-color: #008000;
        color: #ffffff !important;
    }

    /* Butonun içindeki ikonun hover durumunda beyaz kalması için */
    .btn-kibar-yesil:hover i {
        color: #ffffff !important;
    }

    /* Genel font kibarlaştırmaları */
    .urun-adi {
        font-size: 0.95rem;
    }
</style>
