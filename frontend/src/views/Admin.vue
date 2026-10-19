<template>
    <!-- ANA TASARIM SARMALAYICISI: -->
    <div class="admin-layout row g-0 m-0 p-0 text-dark"
        style="padding-top: 86px; min-height: calc(100vh - 86px); background-color: #ffffff; width: 100%; overflow-x: hidden;">

        <!-- ========================================================
        1. SABİT SOL SIDEBAR
        ======================================================== -->
        <div class="admin-sidebar d-flex flex-column justify-content-between p-3 position-fixed col-12 col-md-2"
            style="background-color: green; left: 0; top: 0; bottom: 0; height: 100vh; z-index: 1030; box-shadow: 2px 0 10px rgba(0,0,0,0.15); padding-top: 20px !important;">

            <!-- ÜST VE ORTA ALAN GRUBU -->
            <div class="w-100 px-2 mx-auto d-flex flex-column align-items-center">

                <!-- 1. EN ÜSTTEKİ ANASAYFA BUTONU -->
                <RouterLink to="/"
                    class="btn fw-semibold text-start shadow-sm d-flex align-items-center py-2 px-3 text-truncate mb-4"
                    style="width: 80%; gap: 8px;" :style="passiveStyle">
                    <i class="bi bi-house-door-fill"></i> Anasayfa
                </RouterLink>

                <!-- 2. ORTADAKİ ADMİN PANELİ BAŞLIĞI -->
                <h6 class="text-white text-center mb-2 pb-2 text-truncate w-100"
                    style="border-bottom: 1px solid rgba(255,255,255,0.2); margin-top: 90px; font-weight: 400; font-size: 20px; letter-spacing: 0.5px;">
                    ADMİN PANELİ
                </h6>

                <!-- ORTADAKİ MENÜ BUTONLARI -->
                <div class="d-flex flex-column gap-2 mt-2 align-items-center w-100">
                    <button @click="state = 'products'"
                        class="btn fw-semibold text-start shadow-sm d-flex align-items-center py-2 px-3 text-truncate"
                        style="width: 80%;" :style="[state === 'products' ? activeStyle : passiveStyle]">
                        <i class="bi bi-box-seam me-2"></i> Ürünler
                    </button>

                    <button @click="state = 'orders'"
                        class="btn fw-semibold text-start shadow-sm d-flex align-items-center py-2 px-3 text-truncate"
                        style="width: 80%;" :style="[state === 'orders' ? activeStyle : passiveStyle]">
                        <i class="bi bi-cart3 me-2"></i> Siparişler
                    </button>

                    <button @click="state = 'users'"
                        class="btn fw-semibold text-start shadow-sm d-flex align-items-center py-2 px-3 text-truncate"
                        style="width: 80%;" :style="[state === 'users' ? activeStyle : passiveStyle]">
                        <i class="bi bi-people me-2"></i> Kullanıcılar
                    </button>

                    <button @click="state = 'messages'"
                        class="btn fw-semibold text-start shadow-sm d-flex align-items-center py-2 px-3 text-truncate"
                        style="width: 80%;" :style="[state === 'messages' ? activeStyle : passiveStyle]">
                        <i class="bi bi-envelope me-2"></i> Mesajlar
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
        2. SAĞ İÇERİK ALANI
        ======================================================== -->
        <div class="admin-main-container d-flex flex-column justify-content-between col-12 col-md-10 offset-md-2"
            style="min-height: calc(100vh - 86px); margin-top: 80px; background-color: #ffffff; position: relative; z-index: 1;">

            <!-- Üst Dinamik İçerik Alanı -->
            <div class="w-100" style="min-height: 75vh; padding-top: 20px;">
                <div v-if="state === 'products'">
                    <adminProducts />
                </div>
                <div v-if="state === 'orders'">
                    <adminOrders />
                </div>
                <div v-if="state === 'users'">
                    <adminUsers />
                </div>
                <div v-if="state === 'messages'">
                    <adminMessages />
                </div>
            </div>

            <!-- Alt Sabit Bilgi Çubuğu -->
            <div class="text-center py-3 text-muted small border-top"
                style="font-size: 12px; width: 100%; background-color: #ffffff;">
                &copy; 2026 Gökçe Hilal Akademi | Admin Yönetim Paneli
            </div>

        </div>
    </div>
</template>

<script>
import adminProducts from '@/components/admin-products.vue'
import adminOrders from '@/components/admin-orders.vue'
import adminUsers from '@/components/admin-users.vue'
import adminMessages from '@/components/admin-messages.vue'

export default {
    name: 'AdminView',
    components: {
        adminProducts,
        adminOrders,
        adminUsers,
        adminMessages
    },
    data() {
        return {
            state: "products",
            Username: sessionStorage.getItem("userName") || "Admin",
            baseUrl: "http://localhost:3001",
            activeStyle: {
                backgroundColor: '#C71585',
                color: '#ffffff',
                border: 'none',
                borderRadius: '5px',
                fontSize: '12px',
                transition: 'all 0.2s ease'
            },
            passiveStyle: {
                backgroundColor: '#ffffff',
                color: 'green',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '5px',
                fontSize: '12px',
                transition: 'all 0.2s ease'
            }
        };
    },
    mounted() {
        const navbar = document.querySelector('nav');
        const footer = document.querySelector('footer');
        if (navbar) navbar.style.display = 'none';
        if (footer) footer.style.display = 'none';
        
        this.checkAdminSession();
    },
    unmounted() {
        const navbar = document.querySelector('nav');
        const footer = document.querySelector('footer');
        if (navbar) navbar.style.display = '';
        if (footer) footer.style.display = '';
    },
    methods: {
        checkAdminSession() {
            let id = sessionStorage.getItem("userId");
            if (!id || id === "undefined" || id === "null") {
                sessionStorage.setItem("userId", "1");
                id = "1";
            }
            this.getUsername(id);
        },
        async getUsername(verifiedId) {
            try {
                const res = await fetch(`${this.baseUrl}/api/getUsername/${verifiedId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: verifiedId })
                });
                if (!res.ok) throw new Error("Sunucu hatası.");
                const data = await res.json();
                if (data) {
                    this.Username = data.name || data;
                    sessionStorage.setItem("userName", this.Username);
                }
            } catch (error) {
                console.error("Kullanıcı adı çekilemedi:", error.message);
            }
        },
        setProfile() {
            alert("Profil ayarları modülü yakında aktif edilecek.");
        },
        logout() {
            sessionStorage.clear();
            this.$router.push("/");
        }
    }
};
</script>

<style scoped>
.btn {
    transition: all 0.2s ease-in-out;
}
.btn:hover {
    opacity: 0.95;
    transform: translateX(2px);
}
</style>
