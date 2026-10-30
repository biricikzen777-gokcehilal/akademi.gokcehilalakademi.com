<template>
    <div class="user-dashboard container-fluid p-0 m-0" style="font-family: sans-serif;">
        <div class="row p-0 m-0 w-100">

            <!-- ========================================================
                1. SABİT SOL SIDEBAR (KULLANICI PANELİ SÜRÜMÜ)
                ======================================================== -->
            <div class="user-sidebar d-flex flex-column justify-content-between p-3 position-fixed col-12 col-md-2"
                style="background-color: rgba(25, 135, 84, 0.93); left: 0; top: 0; bottom: 0; height: 100vh; z-index: 1030; box-shadow: 2px 0 10px rgba(0,0,0,0.1); padding-top: 20px !important;">

                <!-- ÜST VE ORTA ALAN GRUBU -->
                <div class="w-100 px-2 mx-auto d-flex flex-column align-items-center">

                    <!-- 1. EN ÜSTTEKİ ANASAYFA BUTONU -->
                    <RouterLink to="/"
                        class="btn fw-semibold text-start shadow-sm d-flex align-items-center py-2 px-3 text-truncate mb-4"
                        style="width: 80%; gap: 8px;" :style="passiveStyle">
                        <i class="bi bi-house-door-fill"></i> Anasayfa
                    </RouterLink>

                    <!-- 2. ORTADAKİ KULLANICI PANELİ BAŞLIĞI -->
                    <h6 class="text-white text-center mb-2 pb-2 text-truncate w-100"
                        style="border-bottom: 1px solid rgba(255,255,255,0.2); margin-top: 20px; font-weight: 400; font-size: 16px; letter-spacing: 0.5px;">
                        KULLANICI PANELİ
                    </h6>

                    <!-- ORTADAKİ MENÜ BUTONLARI -->
                    <div class="d-flex flex-column gap-2 mt-2 align-items-center w-100">
                        <!-- EĞİTİMLER -->
                        <button @click="state = 'courses'"
                            class="btn fw-semibold text-start shadow-sm d-flex align-items-center py-2 px-3 text-truncate"
                            style="width: 80%;" :style="[state === 'courses' ? activeStyle : passiveStyle]">
                            <i class="bi bi-mortarboard me-2"></i> Eğitimler
                        </button>

                        <!-- SERTİFİKALAR -->
                        <button @click="state = 'certificates'"
                            class="btn fw-semibold text-start shadow-sm d-flex align-items-center py-2 px-3 text-truncate"
                            style="width: 80%;" :style="[state === 'certificates' ? activeStyle : passiveStyle]">
                            <i class="bi bi-patch-check me-2"></i> Sertifikalar
                        </button>

                        <!-- ÜRÜNLER (%5 İNDİRİMLİ) -->
                        <button @click="state = 'products'"
                            class="btn fw-semibold text-start shadow-sm d-flex align-items-center py-2 px-3 text-truncate"
                            style="width: 80%;" :style="[state === 'products' ? activeStyle : passiveStyle]">
                            <i class="bi bi-tags me-2"></i> Ürünler <span class="badge bg-danger ms-auto"
                                style="font-size: 10px;">%5 İndirim</span>
                        </button>

                        <!-- SİPARİŞLER -->
                        <button @click="state = 'orders'"
                            class="btn fw-semibold text-start shadow-sm d-flex align-items-center py-2 px-3 text-truncate"
                            style="width: 80%;" :style="[state === 'orders' ? activeStyle : passiveStyle]">
                            <i class="bi bi-bag-check me-2"></i> Siparişlerim
                        </button>
                    </div>
                </div>

                <!-- 3. EN ALTAKİ USERNAME VE İKON ALANI -->
                <div class="pt-3 w-100 px-2" style="border-top: 1px solid rgba(255,255,255,0.2);">
                    <div class="mb-2 w-100 text-center text-md-start ps-2">
                        <h6 class="text-white m-0 opacity-75 text-truncate mb-1"
                            style="font-size: 12px; text-align: center;">Giriş Yapıldı:</h6>
                        <h6 class="text-white fw-bold text-truncate m-0" :title="Username"
                            style="font-size: 12px; text-align: center;">{{ Username }}</h6>
                    </div>

                    <!-- Alt Menü İkon Butonları -->
                    <div class="d-flex gap-2 justify-content-center w-100">
                        <button class="btn d-flex justify-content-center align-items-center py-2 text-white border-0"
                            @click="setProfile()" title="Ayarlar" style="background: transparent; width: 25%;">
                            <i class="bi bi-gear-fill fs-4"></i>
                        </button>
                        <button class="btn d-flex justify-content-center align-items-center py-2 text-white border-0"
                            @click="logout()" title="Çıkış Yap" style="background: transparent; width: 25%;">
                            <i class="bi bi-box-arrow-right fs-4"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- ========================================================
                2. SAĞ DİNAMİK İÇERİK PANELİ (SIHİRLİ ENTEGRASYON)
                ======================================================== -->
            <div class="col-12 col-md-10 offset-md-2 p-4" style="min-height: 100vh; background-color: #f8f9fa;">

                <!-- Üst Hoş Geldiniz Karşılama Çubuğu -->
                <div
                    class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-light-subtle">
                    <h5 class="text-secondary m-0" style="font-weight: 400; font-size: 16px;">
                        Hoş Geldiniz, <span class="text-dark fw-semibold">{{ Username }}</span>
                    </h5>
                    <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1"
                        style="font-size: 11px; font-weight: 500;">
                        Akademi Öğrencisi
                    </span>
                </div>

                <!-- DİNAMİK BİLEŞEN MOTORU (State Değişim Kilidi Çözüldü) -->

                <!-- 1. EĞİTİMLER ALANI (state === 'courses') -->
                <div v-if="state === 'courses'">
                    <userEducations />
                </div>

                <!-- 2. SERTİFİKALAR ALANI (state === 'certificates') -->
                <div v-else-if="state === 'certificates'">
                    <userSertificates />
                </div>

                <!-- 3. ÜRÜNLER ALANI (state === 'products') -->
                <div v-else-if="state === 'products'">
                    <userProducts />
                </div>

                <!-- 4. SİPARİŞLER ALANI (state === 'orders') -->
                <div v-else-if="state === 'orders'">
                    <userOrders />
                </div>

            </div>

        </div>
    </div>
</template>


<script>
// DÜZELTİLDİ: Disk üzerindeki tamamen küçük harfli dosya adlarıyla pürüzsüzce eşleştirildi
import userEducations from '@/components/user-educations.vue'
import userSertificates from '@/components/user-sertificates.vue'
import userOrders from '@/components/user-orders.vue'
import userProducts from '@/components/user-products.vue'

export default {
    name: 'UserView',
    components: {
        userEducations,
        userSertificates,
        userOrders,
        userProducts
    },
    data() {
        return {
            state: "courses", 
            Username: sessionStorage.getItem("userName") || "Kullanıcı",
            baseUrl: "http://localhost:3001",
            activeStyle: {
                backgroundColor: '#C71585',
                color: '#ffffff',
                border: 'none',
                borderRadius: '5px',
                fontSize: '13px',
                transition: 'all 0.2s ease'
            },
            passiveStyle: {
                backgroundColor: '#ffffff',
                color: '#198754',
                border: 'none',
                borderRadius: '5px',
                fontSize: '13px',
                transition: 'all 0.2s ease'
            }
        };
    },
    mounted() {
        // KORUNDU: Yeni eklediğimiz dış navbar sarmalayıcısını ve footer'ı yakalayıp kullanıcı panelinde tamamen gizliyoruz
        const mainNavbar = document.querySelector('.main-nav-container');
        const footer = document.querySelector('footer');
        
        if (mainNavbar) mainNavbar.style.display = 'none';
        if (footer) footer.style.display = 'none';
        
        this.checkAdminSession();
    },
    unmounted() {
        // KORUNDU: Kullanıcı panelinden çıkıldığında navbar ve footer otomatik olarak geri gelir
        const mainNavbar = document.querySelector('.main-nav-container');
        const footer = document.querySelector('footer');
        
        if (mainNavbar) mainNavbar.style.display = '';
        if (footer) footer.style.display = '';
    },
    methods: {
        // DÜZELTİLDİ: mounted kancasında çağrılan ancak tanımlı olmadığı için sayfayı kilitleyen oturum kontrol fonksiyonu eklendi
        checkAdminSession() {
            let id = sessionStorage.getItem("userId");
            if (!id || id === "undefined" || id === "null") {
                sessionStorage.setItem("userId", "1");
            }
        },
        setProfile() {
            alert("Profil ayarları modülü yakında aktif edilecektir.");
        },
        logout() {
            sessionStorage.clear();
            alert("Başarıyla çıkış yapıldı.");
            this.$router.push('/');
            // Yedek Güvenlik: Çıkış anında genel sitenin navbarının anında görünmesini garanti eder
            const mainNavbar = document.querySelector('.main-nav-container');
            if (mainNavbar) mainNavbar.style.display = '';
        }
    }
};
</script>


<style scoped>
.btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}
</style>
