<template>
    <!-- ANA TASARIM SARMALAYICISI -->
    <div class="user-layout row g-0 m-0 p-0 text-dark"
        style="padding-top: 86px; min-height: calc(100vh - 86px); background-color: #ffffff; width: 100%; overflow-x: hidden;">

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
                        <i class="bi bi-tags me-2"></i> Ürünler <span class="badge bg-danger ms-auto" style="font-size: 10px;">%5 İndirim</span>
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
        2. SAĞ İÇERİK ALANI (KULLANICI PANELİ SÜRÜMÜ)
        ======================================================== -->
        <div class="user-main-container d-flex flex-column justify-content-between col-12 col-md-10 offset-md-2"
            style="min-height: calc(100vh - 86px); margin-top: 0px; background-color: #ffffff; position: relative; z-index: 1;">

            <!-- Üst Dinamik İçerik Alanı -->
            <div class="w-100 px-4" style="min-height: 75vh; padding-top: 20px;">
                
                <!-- 1. EĞİTİMLER SEKMESİ -->
                <div v-if="state === 'courses'">
                    <user-educations />
                </div>

                <!-- 2. SERTİFİKALAR SEKMESİ -->
                <div v-if="state === 'certificates'">
                    <user-sertificates />
                </div>

                <!-- 3. ÜRÜNLER SEKMESİ -->
                <div v-if="state === 'products'">
                    <user-products />
                </div>

                <!-- 4. SİPARİŞLER SEKMESİ -->
                <div v-if="state === 'orders'">
                    <user-orders />
                </div>
            </div>

            <!-- Alt Sabit Bilgi Çubuğu -->
            <div class="text-center py-3 text-muted small border-top"
                style="font-size: 12px; width: 100%; background-color: #ffffff;">
                &copy; 2026 Gökçe Hilal Akademi | Öğrenci ve Kullanıcı Paneli
            </div>
        </div>
    </div>
</template>

<script>
// Alt bileşenlerin (Subcomponents) içeri aktarılması
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
        // YENİLENDİ: Yeni eklediğimiz dış navbar sarmalayıcısını ve footer'ı yakalayıp kullanıcı panelinde tamamen gizliyoruz
        const mainNavbar = document.querySelector('.main-nav-container');
        const footer = document.querySelector('footer');
        
        if (mainNavbar) mainNavbar.style.display = 'none';
        if (footer) footer.style.display = 'none';
        
        this.checkAdminSession();
    },
    unmounted() {
        // YENİLENDİ: Kullanıcı panelinden çıkıldığında navbar ve footer otomatik olarak geri gelir
        const mainNavbar = document.querySelector('.main-nav-container');
        const footer = document.querySelector('footer');
        
        if (mainNavbar) mainNavbar.style.display = '';
        if (footer) footer.style.display = '';
    },
    methods: {
        setProfile() {
            alert("Profil ayarları modülü yakında aktif edilecektir.");
        },
        logout() {
            sessionStorage.clear();
            alert("Başarıyla çıkış yapıldı.");
            this.$router.push('/');
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
