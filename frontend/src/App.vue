<script setup>
import router from './router';
import { RouterLink, RouterView } from 'vue-router' //vue-router kütüphanesinden RouterLink ve RouterView fonksiyonlarını import ettik.
import Sepet from '@/components/sepet.vue'
import { reactive } from 'vue';
import { Modal } from 'bootstrap/dist/js/bootstrap.min';
import { ref } from 'vue';


</script>

<template>

    <!-- ! NAVBAR -->
    <div class="w-100 shadow-sm" style="background-color: white;">

        <!-- 
      İçerik sınırlandırmalarını kaldırıp sağdan-soldan tam 40px boşluk bırakmak için 
      style="padding-left: 40px; padding-right: 40px;" eklendi.
    -->
        <div class="container-fluid" style="padding-left: 7%; padding-right: 7%; padding-top: 5px;padding-bottom: 5px;">
            <!--! Navbar -->
            <nav class="navbar navbar-expand-lg" style="background-color: white">
                <div class="container-fluid p-0">
                    <a class="navbar-brand" href="index.html">
                        <img width="160px" src="/src/assets/img/logo.jpg" alt="LOGO">
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0 shadow-none">
                            <li class="nav-item">
                                <RouterLink class="navlink" style="color: black; font-weight: 400; font-size: 18px;"
                                    to="/">
                                    Anasayfa</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="navlink" style="color: black; font-weight: 400; font-size: 18px;"
                                    to="/about">
                                    Hakkımda</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="navlink" style="color: black; font-weight: 400; font-size: 18px;"
                                    to="/faq">
                                    S.S.S.</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="navlink" style="color: black; font-weight: 400; font-size: 18px;"
                                    to="/product">
                                    Ürünler</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="navlink" style="color: black; font-weight: 400; font-size: 18px;"
                                    to="/contact">
                                    İletişim</RouterLink>
                            </li>

                            <li class="nav-item">
                                <a class="navlink" style="cursor: pointer;" @click="pageRouter()">
                                    <svg xmlns="http://w3.org" width="26" height="26" fill="black"
                                        class="bi bi-person-circle" viewBox="0 0 18 18">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                        <path fill-rule="evenodd"
                                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                    </svg>
                                </a>
                            </li>
                        </ul>

                        <!--! Arama Formu -->
                        <form class="d-flex" @submit.prevent="search">
                            <input @keyup.enter="search" v-model="nav_search"
                                class="form-control me-2 shadow-none search-input" type="search"
                                placeholder="Ürün adı, koku veya taş arayın..." aria-label="Search" />
                            <button @click="search" class="btn fw-semibold px-4 search-button"
                                style="color: green; border-color: green; background-color: transparent; transition: all 0.2s ease-in-out;"
                                type="button">
                                Ara
                            </button>
                        </form>

                    </div>
                </div>
            </nav>
        </div>
    </div>

    <!--! Login - Modal -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Giriş Yap</h1>
                    <button type="button" id="loginClose" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Giriş sırasında bir hata oluşursa formu üstünde kırmızı uyarı gösterir -->
                    <div v-if="errors.general" class="alert alert-danger" role="alert">
                        {{ errors.general }}
                    </div>

                    <!-- ÜSTTEKİ YANYANA İKİ EŞİT SEÇİM BUTONU -->
                    <div class="row g-2 mb-4 text-center">
                        <div class="col-6">
                            <button type="button" class="btn w-100 fw-semibold"
                                :class="selectedRole === 'admin' ? 'btn-success text-white' : 'btn-outline-success bg-white text-success'"
                                @click="selectedRole = 'admin'">
                                Admin Girişi
                            </button>
                        </div>
                        <div class="col-6">
                            <button type="button" class="btn w-100 fw-semibold"
                                :class="selectedRole === 'user' ? 'btn-success text-white' : 'btn-outline-success bg-white text-success'"
                                @click="selectedRole = 'user'">
                                Kullanıcı Girişi
                            </button>
                        </div>
                    </div>

                    <!--! login form  -->
                    <!-- Form başlangıcında @submit.prevent olduğundan emin olun -->
                    <form @submit.prevent="login">

                        <!-- EMAIL -->
                        <div class="mb-3">
                            <label class="form-label">Email*</label>
                            <input required type="email" class="form-control" v-model="loginUser.email">
                        </div>

                        <!-- PAROLA -->
                        <div class="mb-3">
                            <label class="form-label">Parola*</label>
                            <input required type="password" class="form-control" v-model="loginUser.pass">
                        </div>

                        <!-- ROBOT CHECKBOX -->
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="robotCheck" v-model="loginUser.check">
                            <label class="form-check-label" for="robotCheck">Gerçekten Robot Değilim!</label>
                        </div>

                        <!-- BUTONUN form etiketinin İÇİNDE ve type="submit" olduğundan emin olun -->
                        <button type="submit" class="btn w-100 btn-success fw-bold">Giriş Yap</button>
                    </form>


                    <br>
                    <a href="" data-bs-toggle="modal" data-bs-target="#register" data-bs-dismiss="modal"
                        style="color: green;">Hesabın yoksa kayıt olmak için tıkla</a>
                </div>

            </div>
        </div>
    </div>

    <!--! Register - Modal -->
    <div class="modal fade" id="register" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Kayıt Ol</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <!-- Eğer formda genel bir hata mesajı varsa en üstte gösterir -->
                    <div v-if="errors.general" class="alert alert-danger" role="alert">
                        {{ errors.general }}
                    </div>

                    <form class="row g-3" @submit.prevent="register">
                        <!-- AD -->
                        <div class="col-md-6">
                            <label class="form-label">Ad*</label>
                            <input type="text" class="form-control" :class="{ 'is-invalid': errors.firstName }"
                                v-model="user[0].firstName" required>
                            <div class="invalid-feedback">{{ errors.firstName }}</div>
                        </div>

                        <!-- SOYAD -->
                        <div class="col-md-6">
                            <label class="form-label">Soyad*</label>
                            <input type="text" class="form-control" :class="{ 'is-invalid': errors.lastName }"
                                v-model="user[0].lastName" required>
                            <div class="invalid-feedback">{{ errors.lastName }}</div>
                        </div>

                        <!-- EMAIL -->
                        <div class="col-md-6">
                            <label class="form-label">Email*</label>
                            <input type="email" class="form-control" :class="{ 'is-invalid': errors.email }"
                                v-model="user[0].email" placeholder="example@hotmail.com" required>
                            <div class="invalid-feedback">{{ errors.email }}</div>
                        </div>

                        <!-- TELEFON -->
                        <div class="col-md-6">
                            <label class="form-label">Telefon*</label>
                            <input type="tel" class="form-control" :class="{ 'is-invalid': errors.tel }"
                                v-model="user[0].tel" placeholder="5xxxxxxxxx" required>
                            <div class="invalid-feedback">{{ errors.tel }}</div>
                        </div>

                        <!-- PAROLA -->
                        <div class="col-md-6">
                            <label class="form-label">Parola*</label>
                            <!-- user.pass? kullanarak undefined olsa bile çökmesini engelliyoruz -->
                            <input type="password" class="form-control"
                                :class="{ 'is-invalid': errors.pass, 'is-valid': user.pass?.length >= 6 && !errors.pass }"
                                v-model="user.pass" @input="checkPasswordMatch" required>
                            <div class="invalid-feedback">{{ errors.pass }}</div>
                            <div class="valid-feedback">Şifre formatı uygun.</div>
                        </div>

                        <!-- PAROLA TEKRAR -->
                        <div class="col-md-6">
                            <label class="form-label">Parola Tekrar*</label>
                            <!-- user.repeatPass? uzunluk kontrolü güvenli hale getirildi -->
                            <input type="password" class="form-control"
                                :class="{ 'is-invalid': errors.repeatPass, 'is-valid': user.repeatPass?.length > 0 && user.pass === user.repeatPass }"
                                v-model="user.repeatPass" @input="checkPasswordMatch" required>
                            <div class="invalid-feedback">{{ errors.repeatPass }}</div>

                            <!-- v-if kısmındaki çökme ihtimali de engellendi -->
                            <div class="valid-feedback"
                                v-if="user.repeatPass?.length > 0 && user.pass === user.repeatPass">
                                Parolalar başarıyla eşleşti.
                            </div>
                        </div>

                        <!-- ONAY KUTUSU -->
                        <div class="col-12">
                            <div class="form-check">
                                <input class="form-check-input"
                                    :class="{ 'is-valid': user[0].check, 'is-invalid': errors.check }" type="checkbox"
                                    id="onayCheck" v-model="user[0].check" required>
                                <label class="form-check-label" for="onayCheck">
                                    Bilgilerimin doğruluğunu onaylıyorum.
                                </label>
                                <div class="invalid-feedback">{{ errors.check }}</div>
                            </div>
                        </div>

                        <!-- SUBMIT BUTONU -->
                        <div class="col-12">
                            <button class="btn w-100 btn-success" type="submit">Kayıt Ol</button>
                        </div>
                    </form>
                    <br>
                    <a href="" id="loginLink" class="navlink" data-bs-toggle="modal" data-bs-target="#loginModal"
                        style="color: green;">Hesabın varsa giriş yapmak için tıkla</a>
                </div>
            </div>
        </div>
    </div>

    <!-- TOAS Bildirim Kutusu --><!-- Başarılı Kayıt Bildirim Kutusu -->
    <transition name="fade-scale">
        <!-- v-if ile görünürlüğü kontrol ediyoruz -->
        <div v-if="showSuccessToast" class="success-toast-overlay">
            <div class="success-toast-card">
                <!-- Yeşil Tik İkonu (Bootstrap Icons) -->
                <div class="success-icon-circle">
                    <svg xmlns="http://w3.org" width="48" height="48" fill="currentColor"
                        class="bi bi-check-lg text-white" viewBox="0 0 16 16">
                        <path
                            d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                    </svg>
                </div>
                <!-- Başarı Mesajı -->
                <h5 class="mt-3 mb-0 fw-bold">Kaydınız Başarıyla Tamamlandı</h5>
            </div>
        </div>
    </transition>

    <!-- ! SEPET SİDEBAR -->
    <div class="container">
        <div class="sepetsidebar">
            <Sepet />
        </div>


        <RouterView />

    </div>

    <!-- ! FOOTER -->
    <footer class="container-fluid w-100 px-0 py-5 text-white border-top border-white border-opacity-10"
        style="background-color: green; margin-top: 100px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

        <!-- 10 Sütun Genişliğinde Ortalanmış Ana Sarmalayıcı -->
        <div class="col-12 col-xl-10 mx-auto px-0">

            <!-- Sağdan ve soldan tam 50px iç boşluklu ana satır -->
            <div class="row mx-0 g-4 justify-content-between" style="padding-left: 50px; padding-right: 50px;">

                <!-- 1. SÜTUN: HIZLI ERİŞİM -->
                <div class="col-12 col-sm-6 col-lg">
                    <h6 class="text-white fw-bold text-uppercase mb-3 pb-2 position-relative"
                        style="letter-spacing: 0.5px; font-size: 14px;">
                        Hızlı Erişim
                        <span class="position-absolute bottom-0 start-0 bg-white"
                            style="width: 35px; height: 2px;"></span>
                    </h6>
                    <ul class="list-unstyled lh-lg">
                        <li><a href="/" class="text-white text-decoration-none hover-white-link small">Anasayfa</a></li>
                        <li><a href="/about" class="text-white text-decoration-none hover-white-link small">Hakkımda</a>
                        </li>
                        <li><a href="/faq" class="text-white text-decoration-none hover-white-link small">S.S.S</a></li>
                        <li><a href="/product"
                                class="text-white text-decoration-none hover-white-link small">Ürünler</a></li>
                        <li><a href="/contact"
                                class="text-white text-decoration-none hover-white-link small">İletişim</a></li>
                    </ul>
                </div>

                <!-- 2. SÜTUN: HİZMETLER -->
                <div class="col-12 col-sm-6 col-lg">
                    <h6 class="text-white fw-bold text-uppercase mb-3 pb-2 position-relative"
                        style="letter-spacing: 0.5px; font-size: 14px;">
                        Hizmetlerimiz
                        <span class="position-absolute bottom-0 start-0 bg-white"
                            style="width: 35px; height: 2px;"></span>
                    </h6>
                    <ul class="list-unstyled lh-lg">
                        <li><a href="/" class="text-white text-decoration-none hover-white-link small" target="_blank"
                                rel="noopener">Ruhsal Şifa İlmi</a></li>
                        <li><a href="/" class="text-white text-decoration-none hover-white-link small" target="_blank"
                                rel="noopener">Özel İçerikler</a></li>
                        <li><a href="/" class="text-white text-decoration-none hover-white-link small" target="_blank"
                                rel="noopener">Telkin Müzikleri</a></li>
                        <li><a href="/" class="text-white text-decoration-none hover-white-link small" target="_blank"
                                rel="noopener">Aromaterapi</a></li>
                        <li><a href="/" class="text-white text-decoration-none hover-white-link small" target="_blank"
                                rel="noopener">Doğaltaş</a></li>
                    </ul>
                </div>

                <!-- 3. SÜTUN: SÖZLEŞMELER -->
                <div class="col-12 col-sm-6 col-lg">
                    <h6 class="text-white fw-bold text-uppercase mb-3 pb-2 position-relative"
                        style="letter-spacing: 0.5px; font-size: 14px;">
                        Yasal Bilgiler
                        <span class="position-absolute bottom-0 start-0 bg-white"
                            style="width: 35px; height: 2px;"></span>
                    </h6>
                    <ul class="list-unstyled lh-lg">
                        <li><a href="/" class="text-white text-decoration-none hover-white-link small">Gizlilik
                                Politikası</a></li>
                        <li><a href="/" class="text-white text-decoration-none hover-white-link small">KVKK Aydınlatma
                                Metni</a></li>
                        <li><a href="/" class="text-white text-decoration-none hover-white-link small">Danışmanlık
                                Sözleşmesi</a></li>
                        <li><a href="/" class="text-white text-decoration-none hover-white-link small">Mesafeli Satış
                                Sözleşmesi</a></li>
                    </ul>
                </div>

                <!-- 4. SÜTUN: SOSYAL MEDYA (İkonlar Hover Durumunda 33px Olur) -->
                <div class="col-12 col-sm-6 col-lg">
                    <h6 class="text-white fw-bold text-uppercase mb-3 pb-2 position-relative"
                        style="letter-spacing: 0.5px; font-size: 14px;">
                        Bizi Takip Edin
                        <span class="position-absolute bottom-0 start-0 bg-white"
                            style="width: 35px; height: 2px;"></span>
                    </h6>
                    <p class="text-white small mb-3">Güncel paylaşımlarımız için sosyal medya hesaplarımız:</p>

                    <!-- 
                    İkonların sarmalayıcı linklerine (<a>) eklenen hover özellikleri:
                    - 'transition: transform 0.2s ease-in-out' ile büyüme hareketi yumuşatıldı.
                    - 'transform' tanımları, farenin üzerine gelindiğinde tam 33px boyutuna büyümesini sağlar.
                    -->
                    <div class="d-flex flex-wrap gap-3 pt-1 admin-social-links">
                        <a href="https://instagram.com" target="_blank" rel="noopener" class="hover-icon d-inline-block"
                            style="transition: transform 0.2s ease-in-out;">
                            <img src="../src/assets/icons/instagram.svg" height="30" width="30" alt="Instagram"
                                style="filter: brightness(0) invert(1); transition: transform 0.2s ease-in-out;">
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener" class="hover-icon d-inline-block"
                            style="transition: transform 0.2s ease-in-out;">
                            <img src="../src/assets/icons/whatsapp.svg" height="30" width="30" alt="Whatsapp"
                                style="filter: brightness(0) invert(1); transition: transform 0.2s ease-in-out;">
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener" class="hover-icon d-inline-block"
                            style="transition: transform 0.2s ease-in-out;">
                            <img src="../src/assets/icons/telegram.svg" height="30" width="30" alt="Telegram"
                                style="filter: brightness(0) invert(1); transition: transform 0.2s ease-in-out;">
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener" class="hover-icon d-inline-block"
                            style="transition: transform 0.2s ease-in-out;">
                            <img src="../src/assets/icons/youtube.svg" height="30" width="30" alt="Youtube"
                                style="filter: brightness(0) invert(1); transition: transform 0.2s ease-in-out;">
                        </a>
                    </div>
                </div>


            </div>

        </div>

        <!-- ========================================================
                TAM İSTEDİĞİNİZ GİBİ DÜZENLENEN EN ALT SATIR
                ======================================================== -->
        <div class="container-fluid px-4 px-md-5 mt-5 pt-3 border-top border-white border-opacity-10">
            <div class="text-center small text-white mt-3">
                &copy; 2026 Gökçe Hilal Akademi | Designed by Gökçe Hilal | Tüm Hakları Saklıdır.
            </div>
        </div>
    </footer>

</template>

<script>
export default {
    data() {
        return {
            nav_search: "",

            showSuccessToast: false, // İlk başta gizli olacak

            sepet: reactive([
                { name: "aaaa", stock: 40, price: 100 },
                { name: "bbbb", stock: 40, price: 200 },
                { name: "ccc", stock: 40, price: 300 },
                { name: "ddd", stock: 40, price: 400 }
            ]),

            // Kayıt verileriniz (Dizi yapınız korunuyor)
            user: [
                { firstName: '', lastName: '', email: '', tel: '', pass: '', repeatPass: '', check: false }
            ],


            // GİRİŞ VERİLERİNİZ (Kutular tam olarak buraya yazacak)
            loginUser: {
                email: '',
                pass: '',
                check: false
            },

            errors: {
                firstName: '', lastName: '', email: '', tel: '', pass: '', repeatPass: '', check: '', general: ''
            },
            selectedRole: 'user',
            showLoginToast: false,
            loggedInUserName: '',

            baseUrl: 'http://localhost:5000', // Kendi API adresiniz

        }
    },

    mounted() {

    },

    provide() {
        return {
            sepet: this.sepet
        }
    },

    watch: {

    },

    computed: {

    },

    methods: {
        // 1. ŞİFRE EŞLEŞME KONTROLÜ (HTML'deki user.pass kök bağına göre eşitlendi)
        checkPasswordMatch() {
            // HTML'deki v-model doğrudan 'user.pass' ve 'user.repeatPass' olarak bağlı
            const password = this.user.pass || '';
            const repeatPassword = this.user.repeatPass || '';

            if (password.length < 6) {
                this.errors.pass = "Parolanız en az 6 karakterden oluşmalıdır.";
            } else {
                this.errors.pass = "";
            }

            if (repeatPassword.length > 0 && password !== repeatPassword) {
                this.errors.repeatPass = "Girdiğiniz parolalar birbiriyle eşleşmiyor.";
            } else {
                this.errors.repeatPass = "";
            }
        },

        // 2. FORM DOĞRULAMA MOTORU (Ad, soyad, email, tel, check için user[0] yapısı korunuyor)
        // 2. Birleştirilmiş ve Hatalardan Arındırılmış Form Doğrulama Motoru (Regex Düzeltildi)
        formValidation() {
            this.errors = { firstName: '', lastName: '', email: '', tel: '', pass: '', repeatPass: '', check: '', general: '' };
            let isValid = true;

            // Sizin orijinal yapınız olan dizi içi ilk nesneye kesin erişim [0]
            const userData = this.user[0];

            if (!userData) {
                this.errors.general = "Kullanıcı verisi yüklenemedi.";
                return false;
            }

            // İsim ve Soyisim Kontrolü
            if (!userData.firstName || userData.firstName.trim().length < 2) {
                this.errors.firstName = "Adınız en az 2 karakter olmalıdır.";
                isValid = false;
            }
            if (!userData.lastName || userData.lastName.trim().length < 2) {
                this.errors.lastName = "Soyadınız en az 2 karakter olmalıdır.";
                isValid = false;
            }

            // E-posta Kontrolü (Kaçış karakterlerinden arındırılmış kesin Regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!userData.email || !emailRegex.test(userData.email.trim())) {
                this.errors.email = "Lütfen geçerli bir e-posta adresi giriniz.";
                isValid = false;
            }

            // Telefon Numarası Kontrolü (Kaçış karakterlerinden arındırılmış kesin Regex)
            if (!userData.tel) {
                this.errors.tel = "Telefon numarası boş bırakılamaz.";
                isValid = false;
            } else {
                const telClean = userData.tel.toString().replace(/\s+/g, '');
                const telRegex = /^5[0-9]{9}$/;
                if (telClean.length !== 10 || !telRegex.test(telClean)) {
                    this.errors.tel = "Telefon numarası başında 0 olmadan 10 hane olmalıdır.";
                    isValid = false;
                }
            }

            // Şifre Durum Kontrolü
            this.checkPasswordMatch();
            if (this.errors.pass || this.errors.repeatPass) {
                isValid = false;
            }

            // Onay Kutusu Kontrolü
            if (!userData.check) {
                this.errors.check = "Lütfen şartları onaylayın.";
                isValid = false;
            }

            if (!isValid) {
                this.errors.general = "Lütfen formdaki hataları düzelterek tekrar deneyiniz.";
            }

            return isValid;
        },

        // 3. KAYIT FONKSİYONU (Dizi verileri ile bağımsız şifreyi birleştiren güvenli havuz)
        register() {
            console.log("Kayıt butonuna başarıyla basıldı!");

            if (this.formValidation()) {
                console.log("Form doğrulandı! Yerel hafızaya (LocalStorage) yazılıyor...");
                try {
                    const userData = this.user[0];
                    const userPassword = this.user.pass; // HTML'deki v-model bağından şifreyi yakalıyoruz

                    const currentUsers = JSON.parse(localStorage.getItem('registerStorage')) || [];

                    // Melez verileri yerel hafızaya güvenle birleştirip push ediyoruz
                    currentUsers.push({
                        firstName: userData.firstName.trim(),
                        lastName: userData.lastName.trim(),
                        email: userData.email.trim().toLowerCase(),
                        tel: userData.tel.trim(),
                        pass: userPassword // Şifre artık string olarak %100 doğru şekilde gidiyor!
                    });

                    localStorage.setItem('registerStorage', JSON.stringify(currentUsers));
                    console.log("Kullanıcı başarıyla kaydedildi! Hafızadaki toplam kişi sayısı:", currentUsers.length);

                    // Modal Kapatma ve Temizleme Adımları
                    document.querySelector('#register .btn-close')?.click();

                    // Tüm form alanlarını güvenli şekilde sıfırlıyoruz
                    this.user[0].firstName = "";
                    this.user[0].lastName = "";
                    this.user[0].email = "";
                    this.user[0].tel = "";
                    this.user[0].check = false;
                    this.user.pass = "";
                    this.user.repeatPass = "";

                    this.showSuccessToast = true;

                    setTimeout(() => {
                        this.showSuccessToast = false;
                        document.getElementById('loginLink')?.click();
                    }, 3000);

                } catch (e) {
                    console.error("Kayıt hatası:", e.message);
                    this.errors.general = "Sistemsel bir hata oluştu: " + e.message;
                }
            } else {
                console.warn("Form kurallara uymuyor. Hatalar:", this.errors);
            }
        },

        // 4. PROFIL IKONUNA BASILDIGINDA YÖNLENDİREN MOTOR
        pageRouter() {
            console.log("pageRouter fonksiyonu tetiklendi.");

            const isLoggedIn = sessionStorage.getItem("isLoggedIn");
            const role = sessionStorage.getItem("role");

            if (role === "0" && isLoggedIn === "1") {
                console.log("Kullanıcı paneline gidiliyor...");
                this.$router.push("/user").catch(() => { });
            }
            else if (role === "1" && isLoggedIn === "1") {
                console.log("Admin paneline gidiliyor...");
                this.$router.push("/admin").catch(() => { });
            }
            else {
                console.log("Aktif oturum yok. Login modalı tetikleniyor...");
                const modalTrigger = document.querySelector('[data-bs-target="#loginModal"]');
                if (modalTrigger) {
                    modalTrigger.click();
                } else {
                    document.getElementById('loginLink')?.click();
                }
            }
        },

        // 5. GİRİŞ FORMU DOĞRULAMA
        loginValidation() {
            this.errors = { email: '', pass: '', check: '', general: '' };
            let isValid = true;
            const loginData = this.loginUser;

            if (!loginData.email || !loginData.email.trim() || !loginData.email.includes('@')) {
                this.errors.email = "Lütfen geçerli bir e-posta adresi giriniz.";
                isValid = false;
            }

            if (!loginData.pass || loginData.pass.length < 6) {
                this.errors.pass = "Şifreniz en az 6 karakter olmalıdır.";
                isValid = false;
            }

            if (!loginData.check) {
                this.errors.check = "Lütfen robot olmadığınızı doğrulayın.";
                isValid = false;
            }

            return isValid;
        },

        // 6. ANA GİRİŞ FONKSİYONU
        login() {
            console.log("Giriş yap fonksiyonu tetiklendi. Seçili Rol:", this.selectedRole);

            if (this.loginValidation()) {
                try {
                    const loginData = this.loginUser;
                    const registeredUsers = JSON.parse(localStorage.getItem('registerStorage')) || [];

                    const inputEmail = loginData.email.trim().toLowerCase();
                    const inputPass = loginData.pass;

                    const foundUser = registeredUsers.find(u =>
                        u.email && u.email.toLowerCase() === inputEmail && u.pass === inputPass
                    );

                    const ADMIN_EMAIL = 'ruhsalsifa.akademi@gmail.com';

                    if (foundUser) {
                        if (this.selectedRole === 'admin' && foundUser.email !== ADMIN_EMAIL) {
                            this.errors.general = "Bu alandan sadece yetkili admin girişi yapılabilir!";
                            return;
                        }

                        if (this.selectedRole === 'user' && foundUser.email === ADMIN_EMAIL) {
                            this.errors.general = "Admin hesabı ile kullanıcı panelinden giriş yapılamaz. Lütfen Admin Girişi butonunu seçin.";
                            return;
                        }

                        this.loggedInUserName = `${foundUser.firstName} ${foundUser.lastName}`;
                        sessionStorage.setItem("isLoggedIn", "1");

                        const userRole = foundUser.email === ADMIN_EMAIL ? "1" : "0";
                        sessionStorage.setItem("role", userRole);
                        sessionStorage.setItem("userName", this.loggedInUserName);

                        document.getElementById('loginClose')?.click();
                        document.querySelector('#loginModal .btn-close')?.click();

                        this.loginUser = { email: "", pass: "", check: false };
                        this.showLoginToast = true;

                        setTimeout(() => {
                            this.showLoginToast = false;
                            if (userRole === "1") {
                                this.$router.push("/admin").catch(() => { });
                            } else {
                                this.$router.push("/user").catch(() => { });
                            }
                        }, 3000);

                    } else {
                        this.errors.general = "E-posta adresi veya şifre hatalı ya da böyle bir kullanıcı kayıtlı değil!";
                    }
                } catch (e) {
                    console.error("Giriş hatası:", e.message);
                    this.errors.general = "Sistemsel bir hata oluştu, lütfen tekrar deneyin.";
                }
            }
        },

        // Aktif Arama Fonksiyonu
        search() {
            // Kullanıcının yazdığı kelimeyi temizle ve küçük harfe çevir
            const query = this.nav_search ? this.nav_search.trim().toLowerCase() : "";

            if (!query) {
                console.warn("Arama terimi boş.");
                return;
            }

            console.log("Sitede aranan kelime:", query);

            // EĞER KULLANICI ADMİN VEYA BAŞKA BİR PANELDEYSE DOĞRUDAN ÜRÜNLER SAYFASINA FIRLATIR
            // Arama sonuçlarının listelenebilmesi için kullanıcının ürünler rotasında olması gerekir
            if (this.$route.path !== '/product') {
                this.$router.push({
                    path: '/product',
                    query: { q: query } // Aranan kelimeyi URL parametresi olarak (/product?q=kelime) taşır
                }).catch(() => { });
            } else {
                // Eğer kullanıcı zaten ürünler sayfasındaysa sayfayı değiştirmeden küresel event tetikler
                // veya sayfa içindeki filtreleme fonksiyonunu doğrudan çalıştırır
                window.dispatchEvent(new CustomEvent('global-search', { detail: query }));
            }

            // Arama yapıldıktan sonra input kutusunun içini temizlemek isterseniz bu satırı aktif bırakın:
            // this.nav_search = "";
        },


        logout() {
            sessionStorage.clear();
            this.$router.push("/");
            window.location.reload(); // Değişikliklerin arayüze anında yansıması için sayfayı yeniler
        },
    }
};

</script>

<!--! BU SAYFAYA ÖZEL CSS UYGULAYACAKSAN scoped yazmamız gerekiyor -->
<!--! scoped yazmazsak buradaki cssler her sayfada geçerli olur -->

<style scoped>
.sepetsidebar {
    position: fixed;
    right: 20px;
    height: 100vh;
    /* Ekranın en yukarısından en aşağısına kadar kaplar */


    /* EN ÖNE GETİREN SİHİRLİ DOKUNUŞ */
    z-index: 9999 !important;
}

/* Ekranı Kaplayan Şeffaf Katman (Tıklamaları engellemek için) */
.success-toast-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    /* Arka planı hafif karartır */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    /* Her şeyin üstünde görünmesi için */
}

/* Ortadaki Kare Kart */
.success-toast-card {
    background-color: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    width: 280px;
    height: 220px;
    display: flex;
    flex-direction: column;
    /* Doğru hizalama komutu budur */
    justify-content: center;
    align-items: center;
    text-align: center;
}

/* Yeşil Yuvarlak İkon Alanı */
.success-icon-circle {
    width: 80px;
    height: 80px;
    background-color: #28a745;
    /* Bootstrap Success Yeşili */
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

/* Vue Yumuşak Geçiş (Animation) Efektleri */
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.hover-white-link:hover {
    color: #ffffff !important;
    text-decoration: underline !important;
    opacity: 0.85;
    /* Hafif bir etkileşim hissi verir */
}

/* İkonun üzerine gelindiğinde (hover) tam 33px boyutuna (1.1 katına) büyümesini sağlar */
.admin-social-links a:hover {
    transform: scale(1.2);
    opacity: 0.95;
}
</style>
