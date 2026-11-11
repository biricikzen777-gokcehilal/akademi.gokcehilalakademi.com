<template>
    <div class="user-profile container-fluid p-0 m-0">
        <h4 class="fw-bold mb-4 mt-4 text-dark px-3">Profil ve Şifre Ayarları</h4>
        <div class="card border border-light-subtle shadow-sm rounded-3 mx-3 mb-4 p-4" style="max-width: 650px;">
            <form @submit.prevent="updateProfile">
                <!-- Ad, Soyad, E-posta, Telefon, Yeni Şifre ve Güncelle Butonu içeren form alanları -->
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserProfile',
    data() {
        return {
            baseUrl: "http://localhost:3001",
            profileForm: { firstName: "", lastName: "", email: "", tel: "", newPass: "" }
        };
    },
    mounted() { this.fetchProfile(); },
    methods: {
        async fetchProfile() {
            // sessionStorage'dan token alıp /api/get-profile isteği atar ve form verilerini doldurur
        },
        async updateProfile() {
            // /api/update-profile endpoint'ine PUT isteği göndererek profil ve şifre günceller
        }
    }
};
</script>
