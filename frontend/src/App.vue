<script setup>
import router from './router';
import { RouterLink, RouterView } from 'vue-router' //vue-router kütüphanesinden RouterLink ve RouterView fonksiyonlarını import ettik.
import Sepet from '@/components/sepet.vue'
import { reactive } from 'vue';
import { Modal } from 'bootstrap/dist/js/bootstrap.min';
import { ref } from 'vue';
import axios from 'axios';
import { validateForm } from '@/validation.js';


</script>

<template>

    <!-- ANA NAVBAR SARMALAYICISI (Alttan ve üstten tam 13px boşluk kilitlendi) -->
    <div class="w-100 main-nav-container shadow-sm" style="padding-top: 13px; padding-bottom: 13px;">
        <div class="container-fluid px-custom">
            <nav class="navbar navbar-expand-lg bg-white p-0">
                <div class="container-fluid p-0">


                    <!-- LOGO ALANI -->
                    <RouterLink class="navbar-brand py-0" to="/">
                        <img width="145px" src="/src/assets/img/logo.jpg" alt="Gökçe Hilal Akademi LOGO"
                            class="nav-logo">
                    </RouterLink>

                    <!-- MOBIL MENÜ BUTONU -->
                    <button class="navbar-toggler border-0 shadow-none p-1" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Menüyü Aç/Kapat">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <!-- MENÜ VE ARAMA ALANI -->
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <!-- Menü Bağlantı Linkleri -->
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0 align-items-center custom-nav-links">
                            <li class="nav-item">
                                <RouterLink class="nav-link-item" to="/">Anasayfa</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link-item" to="/about">Hakkımda</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link-item" to="/faq">S.S.S.</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link-item" to="/product">Ürünler</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link-item" to="/contact">İletişim</RouterLink>
                            </li>

                            <!-- Profil / Giriş İkonu -->
                            <li class="nav-item ms-lg-2">
                                <a class="nav-profile-icon" @click="pageRouter()" role="button" title="Profilim">
                                    <svg xmlns="http://w3.org" width="22" height="22" fill="currentColor"
                                        class="bi bi-person-circle" viewBox="0 0 16 16">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                        <path fill-rule="evenodd"
                                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                    </svg>
                                </a>
                            </li>
                        </ul>

                        <!-- Minimalist Arama Formu -->
                        <form class="d-flex align-items-center search-form-wrapper" @submit.prevent="search">
                            <input @keyup.enter="search" v-model="nav_search"
                                class="form-control shadow-none custom-search-input" type="search"
                                placeholder="Ürün adı, koku veya taş arayın..." aria-label="Arama Terimi" />
                            <button @click="search" class="btn custom-search-button ms-2" type="button">
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
                            <!-- input içine border-success ve checked durumunda arka plan için w3-schools / bootstrap uyumlu özel yapı eklendi -->
                            <input type="checkbox"
                                class="form-check-input border-success shadow-none bg-success-checked" id="robotCheck"
                                v-model="loginUser.check">
                            <label class="form-check-label fw-medium" for="robotCheck">Gerçekten Robot Değilim!</label>
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
        <!-- v-if ile sepetin görünürlüğünü bağladık -->
        <div v-if="isSepetOpen" class="sepetsidebar">
            <!-- Eğer sepet içinden de kapatma tetiklenecekse event dinleyebilirsin -->
            <Sepet @close-sepet="isSepetOpen = false" />
        </div>

        <!-- Sitenizin tüm alt sayfalarını (Mağaza, Hakkımda, İletişim vb.) ekrana basar -->
        <RouterView />
    </div>

    <!-- LÜKS KOYU PEMBE KARE SEPETE EKLENDİ TOAST BİLDİRİM KATMANI -->
    <Teleport to="body">
        <Transition name="toast-fade">
            <div v-if="showCartToast" class="custom-cart-toast-overlay">
                <!-- 200x200 Kare Format, İkon Üstte, Yazı Altta Düzen -->
                <div
                    class="custom-cart-toast-card border border-light-subtle rounded-4 shadow-lg d-flex flex-column align-items-center justify-content-center gap-3 bg-white p-3">

                    <!-- Üstteki Büyük Onay İkon Çemberi (Sitenizin Koyu Pembe Lotus Tonu #C71585) -->
                    <div class="cart-toast-icon-wrapper rounded-circle d-flex align-items-center justify-content-center bg-transparent"
                        style="width: 60px; height: 60px; background-color: #C71585 !important; box-shadow: 0 8px 20px rgba(199, 21, 133, 0.3);">
                        <!-- Büyütülmüş Çanta İkonu -->
                        <i class="bi bi-bag-check-fill text-white" style="font-size: 1.8rem; line-height: 1;"></i>
                    </div>

                    <!-- Alttaki Net İki Satırlı Kurumsal Yazı -->
                    <h6 class="cart-toast-text m-0 text-dark fw-semibold text-center"
                        style="font-size: 14px; line-height: 1.4; letter-spacing: -0.2px;">
                        Ürün Sepetinize<br>Başarıyla Eklendi
                    </h6>

                </div>
            </div>
        </Transition>
    </Teleport>

    <!-- ! FOOTER -->
    <footer class="container-fluid w-100 px-0 py-5 text-white border-top border-white border-opacity-10"
        style="background-color: green; margin-top: 0px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

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
            name: 'App',
            // Sepetin açık/kapalı olma durumunu tutan değişken
            isSepetOpen: true,

            nav_search: "",
            showSuccessToast: false,

            // KESİN ÇÖZÜM: Referans kopmasını önlemek için sepeti nesne tabanlı listeye çevirdik
            // Temiz düz diziye geri döndük
            sepet: [],

            // KESİN DÜZELTME: Şablonunuzla tam uyumlu orijinal dizi yapısına geri döndük!
            user: [
                { firstName: '', lastName: '', email: '', tel: '', pass: '', repeatPass: '', check: false }
            ],

            loginUser: { email: '', pass: '', check: false },
            errors: { firstName: '', lastName: '', email: '', tel: '', pass: '', repeatPass: '', check: '', general: '' },
            selectedRole: 'user',
            showLoginToast: false,
            loggedInUserName: '',
            baseUrl: 'http://localhost:3001', // Backend portunuz olan 3001 ile eşitlendi

            showCartToast: false // Koyu pembe kurumsal sepet toast tetikleyicisi
        }
    },

    watch: {
        // Rota her değiştiğinde bu fonksiyon çalışır
        $route(to) {
            // Eğer kullanıcı checkout (ödeme) sayfasına gittiyse sepeti kapat
            if (to.path === '/checkout') {
                this.isSepetOpen = false;
            } else {
                // Diğer sayfalarda sepetin genel izlenebilirliğini korur
                this.isSepetOpen = true;
            }
        }
    },

    mounted() {
        // addCart fonksiyon kilidi aynen kalıyor
        window.küreselSepeteEkle = this.addCart.bind(this);

        // KESİN ÇÖZÜM: sepet dizisinin kendisini de tarayıcı ana hafızasına (window) mühürliyoruz!
        window.küreselSepetHafizasi = this.sepet;
        console.log("🚀 Küresel sepet dizisi tarayıcı hafızasına mühürlendi.");

        try {
            const kayitliSepet = localStorage.getItem("gokceSepet");
            if (kayitliSepet) {
                const hafizadakiUrunler = JSON.parse(kayitliSepet);
                if (Array.isArray(hafizadakiUrunler)) {
                    // Verileri temiz dizimize push ederek dolduruyoruz
                    this.sepet.length = 0;
                    this.sepet.push(...hafizadakiUrunler);
                    console.log("📦 Eski sepet verileri başarıyla geri yüklendi:", this.sepet);
                }
            }
        } catch (e) {
            console.error("Sepet hafızadan okunurken hata oluştu:", e.message);
            this.sepet.length = 0;
        }
    },

    provide() {
        return {
            // Sepet dizisini alt bileşenlere (Product.vue ve sepet.vue) reaktif olarak dağıtır
            sepet: this.sepet
        }
    },

    computed: {
        // Computed metotlar ihtiyaç halinde buraya tanımlanacaktır
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

        // 🚀 2. FORM DOĞRULAMA MOTORU (Hocanın İstediği Merkezi validation.js Bağlantılı Sürüm)
        formValidation() {
            // Her doğrulama başında hata mesajı havuzunu temizliyoruz
            this.errors = { firstName: '', lastName: '', email: '', tel: '', pass: '', repeatPass: '', check: '', general: '' };

            // Sizin orijinal yapınız olan dizi içi ilk nesneye kesin erişim [0]
            const userData = this.user[0];
            const userPassword = this.user.pass || '';
            const userRepeatPassword = this.user.repeatPass || '';

            if (!userData) {
                this.errors.general = "Kullanıcı verisi yüklenemedi.";
                return false;
            }

            // 🌸 MERKEZİ MOTOR MÜHÜRÜ: validation.js içerisindeki register süzgecine form verilerini paslıyoruz
            const result = validateForm.register(userData, userPassword, userRepeatPassword);

            // Eğer dışarıdaki dosyada bir kural ihlali yakalandıysa, mesajları doğrudan senin local errors nesnene doldurur
            if (!result.isValid) {
                this.errors.firstName = result.errors.firstName;
                this.errors.lastName = result.errors.lastName;
                this.errors.email = result.errors.email;
                this.errors.tel = result.errors.tel;
                this.errors.pass = result.errors.pass;
                this.errors.repeatPass = result.errors.repeatPass;
                this.errors.check = result.errors.check;

                this.errors.general = "Lütfen formdaki hataları düzelterek tekrar deneyiniz.";
            }

            // Sayfanın kayıt işlemine devam edip etmeyeceğini (true/false) geriye fırlatır
            return result.isValid;
        },

        // 🚀 KAYIT OLMA FONKSİYONU - POST (Kesin Dizi ve Şifre Korumalı Sürüm)
        async register() {
            console.log("Kayıt ol fonksiyonu tetiklendi...");

            if (!this.formValidation()) {
                console.warn("⚠️ Kayıt formu validasyon engeline takıldı.");
                return;
            }

            try {
                // Dizi içindeki ilk nesneye [0] indeksiyle doğrudan erişiyoruz
                const userData = Array.isArray(this.user) ? this.user[0] : this.user;

                const inputEmail = String(userData.email || "").trim().toLowerCase();
                const cleanTel = String(userData.tel || "").replace(/\s+/g, '');

                // Önce Vue değişkenlerine, boşsa aktif Kayıt Ol modalının içindeki şifre kutusuna bakar
                let cleanPass = String(userData.pass || userData.u_pass || userData.password || this.pass || "").trim();

                if (!cleanPass) {
                    const pwdInputs = document.querySelectorAll('input[type="password"]');
                    for (const inp of pwdInputs) {
                        if (inp.value && inp.value.trim() !== "") {
                            cleanPass = inp.value.trim();
                            break;
                        }
                    }
                }

                if (!cleanPass) {
                    alert("Kayıt Hatası: Şifre algılanamadı. Lütfen şifrenizi tekrar yazınız.");
                    return;
                }

                const sqlRegisterPayload = {
                    firstName: String(userData.firstName || "").trim(),
                    lastName: String(userData.lastName || "").trim(),
                    email: inputEmail,
                    tel: cleanTel,
                    pass: cleanPass,
                    u_firstName: String(userData.firstName || "").trim(),
                    u_lastName: String(userData.lastName || "").trim(),
                    u_email: inputEmail,
                    u_tel: cleanTel,
                    u_pass: cleanPass,
                    u_role: "0"
                };

                console.log("🚀 Sunucuya gönderilen tam dolu paket:", sqlRegisterPayload);

                const response = await fetch('http://localhost:3001/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sqlRegisterPayload)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || "Sunucu kayıt isteğini reddetti.");
                }

                const responseData = await response.json();
                console.log("✅ Kullanıcı veritabanına mühürlendi:", responseData);

                this.showRegisterToast = true;

                // Formu orijinal dizi yapısını bozmadan sıfırlıyoruz
                this.user = [{ firstName: "", lastName: "", email: "", tel: "", pass: "", u_pass: "", repeatPass: "", check: false }];

                document.getElementById('registerClose')?.click();

                setTimeout(() => {
                    this.showRegisterToast = false;
                    document.getElementById('loginModalButton')?.click();
                }, 2500);

            } catch (error) {
                console.error("❌ Kayıt Olma Hatası:", error);
                alert("Kayıt Hatası: " + error.message);
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

        // 🚀 5. GİRİŞ FORMU DOĞRULAMA (Hocanın İstediği Merkezi validation.js Bağlantılı Sürüm)
        loginValidation() {
            // Her doğrulama başında hata mesajı havuzunu temizliyoruz
            this.errors = { email: '', pass: '', check: '', general: '' };

            // 🌸 MERKEZİ MOTOR MÜHÜRÜ: validation.js içerisindeki login süzgecine form verilerini paslıyoruz
            const result = validateForm.login(
                this.loginUser.email,
                this.loginUser.pass,
                this.loginUser.check
            );

            // Eğer dışarıdaki dosyada bir hata yakalandıysa, mesajları doğrudan senin local errors nesnene doldurur
            if (!result.isValid) {
                this.errors.email = result.errors.email;
                this.errors.pass = result.errors.pass;
                this.errors.check = result.errors.check;
            }

            // Sayfanın giriş işlemine devam edip etmeyeceğini (true/false) geriye fırlatır
            return result.isValid;
        },

        // 6. ANA GİRİŞ FONKSİYONU (Hocanın İstediği JWT Token Sistemli - Sıfır Hatalı Sürüm)
        async login() {
            console.log("Giriş yap fonksiyonu tetiklendi. Seçili Rol:", this.selectedRole);

            // Form doğrulaması başarılıysa işlemlere başla
            if (!this.loginValidation()) return;

            try {
                const loginData = this.loginUser;
                const inputEmail = loginData.email.trim().toLowerCase();
                const inputPass = loginData.pass;

                // DOĞRU PORT: Sunucunuz 3001 portunda çalışıyor
                const response = await fetch('http://localhost:3001/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: inputEmail,
                        pass: inputPass
                    })
                });

                // Sunucu bağlantısı başarısızsa hata fırlat
                if (!response.ok) {
                    throw new Error("Sunucu hata kodu döndürdü.");
                }

                // Backend'den dönen JSON verisini alıyoruz
                const responseData = await response.json();

                // Backend'den başarılı sonuç döndüğünde kullanıcı verilerini alıyoruz
                if (responseData && responseData.success) {

                    // HOCANIN İSTEDİĞİ KRİTİK KURAL: SessionStorage'a şifreli JWT anahtarını kilitliyoruz
                    sessionStorage.setItem("token", responseData.token);
                    sessionStorage.setItem("userName", `${responseData.user.firstName} ${responseData.user.lastName}`);

                    // user-orders sayfasının süzme işlemi için gerekli e-postayı da yedekliyoruz
                    localStorage.setItem('userEmail', inputEmail);

                    // Formu sıfırla ve Toast mesajını göster
                    this.loginUser = { email: "", pass: "", check: false };
                    this.showLoginToast = true;

                    // Modalları kapatma işlemleri
                    document.getElementById('loginClose')?.click();

                    // Rota yönlendirmesi: Backend'den gelen role göre sayfaya uçuruyoruz
                    setTimeout(() => {
                        this.showLoginToast = false;
                        if (responseData.user.role === "1") {
                            this.$router.push("/admin").catch(() => { });
                        } else {
                            this.$router.push("/user").catch(() => { });
                        }
                    }, 2500);

                } else {
                    // Backend şifre yanlış veya kullanıcı yok dediyse
                    this.errors.general = responseData.message || "E-posta adresi veya şifre hatalı!";
                }

            } catch (error) {
                console.error("Giriş hatası:", error);
                this.errors.general = "Sistemsel bir hata oluştu veya sunucuya bağlanılamadı.";
            }
        },

        // Aktif Arama Fonksiyonu (App.vue)
        search() {
            const query = this.nav_search ? this.nav_search.trim().toLocaleLowerCase('tr-TR') : "";

            if (!query) {
                // Arama boşaltılırsa URL sorgusunu temizle ki tüm ürünler geri gelsin
                if (this.$route.path === '/product' && this.$route.query.q) {
                    this.$router.replace({ path: '/product', query: {} }).catch(() => { });
                }
                return;
            }

            console.log("Sitede aranan kelime:", query);

            // Hangi sayfada olursa olsun /product?q=kelime adresine yönlendirir/günceller
            this.$router.push({
                path: '/product',
                query: { q: query }
            }).catch(() => { });
        },

        logout() {
            sessionStorage.clear();
            this.$router.push("/");
            window.location.reload(); // Değişikliklerin arayüze anında yansıması için sayfayı yeniler
        },

        // 9. Ürünü sepete ekleyen ve lüks pembe toast bildirimini tetikleyen merkezi App.vue fonksiyonu
        addCart(product) {
            console.log("=== ASIL APP.VUE TETİKLENDİ ===", product);

            if (!product) {
                console.warn("Sepete eklenmek istenen ürün verisi boş geldi.");
                return;
            }

            // Gelen kargo paketindeki tüm olası fiyat ve isim parametrelerini (p_price, price, p_name, name) garantiye alıyoruz
            const urunAdi = String(product.p_name || product.name || "Bilinmeyen Ürün").trim();
            const urunFiyati = Number(product.p_price || product.price || 0);

            // Küresel reaktif sepet dizimize ekliyoruz
            this.sepet.push({
                name: urunAdi,
                price: urunFiyati
            });

            // KESİN DÜZELTME: Ürün eklenir eklenmez sepetin güncel halini tarayıcı hafızasına ve pencere belleğine mühürlüyoruz!
            localStorage.setItem("gokceSepet", JSON.stringify(this.sepet));
            window.küreselSepetHafizasi = this.sepet;

            console.log("✅ Ürün sepete ve hafızaya başarıyla mühürlendi:", this.sepet);

            // BİLDİRİMİ TETİKLE: Pembe başarı karesini anında true yaparak ekrana fırlatıyoruz!
            this.showCartToast = true;

            // Bildirimi 2.5 saniye sonra ekrandan zarifçe kaldırır
            setTimeout(() => {
                this.showCartToast = false;
            }, 2500);
        },

        provide() {
            return {
                // Nesneyi doğrudan paylaştığımız için alt bileşenler bağı asla kaybetmeyecek
                sepetObjesi: this.sepet,
                addCart: this.addCart.bind(this)
            }
        },
    }
};

</script>

<!--! BU SAYFAYA ÖZEL CSS UYGULAYACAKSAN scoped yazmamız gerekiyor -->
<!--! scoped yazmazsak buradaki cssler her sayfada geçerli olur -->

<style scoped>
/* ==========================================================================
   1. GENEL DÜZEN VE ÇEVRESEL BOŞLUKLAR (7% Esneklik Korundu)
   ========================================================================== */
.main-nav-container {
    background-color: #ffffff;
    position: relative;
    z-index: 1040;
}

.px-custom {
    padding-left: 7% !important;
    padding-right: 7% !important;
}

.nav-logo {
    transition: transform 0.2s ease;
}

.nav-logo:hover {
    transform: scale(1.02);
}

/* ==========================================================================
   2. YENİLENEN BÜYÜK MENÜ BAĞLANTILARI VE DİNAMİK KALINLAŞMA MOTORU
   ========================================================================== */
.custom-nav-links {
    gap: 18px;
    /* Linkler arası dengeli ve ferah boşluk */
    padding-left: 15px;
}

.nav-link-item {
    font-size: 16px !important;
    /* İstediğiniz gibi yazı boyutu büyütüldü */
    font-weight: 400 !important;
    color: #2b2b2b !important;
    text-decoration: none;
    letter-spacing: 0.3px;
    padding: 6px 6px;
    display: inline-block;
    transition: color 0.2s ease-in-out, font-weight 0.2s ease-in-out;
}

/* Mouse ile üzerine gelindiğinde veya aktifken font-weight artar ve yeşil olur */
.nav-link-item:hover,
.router-link-active.nav-link-item {
    color: #008000 !important;
    font-weight: 500 !important;
    /* fw-semibold / bold seviyesine yumuşak geçiş */
}

/* Profil İkonu Tasarımı */
.nav-profile-icon {
    color: #2b2b2b;
    display: flex;
    align-items: center;
    padding: 6px;
    transition: color 0.2s ease, transform 0.2s ease;
}

.nav-profile-icon:hover {
    color: #008000;
    transform: scale(1.05);
}

/* Onay kutusunun dış çerçevesi ve tıklandığında içi tam yeşil olur */
.form-check-input:checked {
    background-color: #198754 !important;
    border-color: #198754 !important;
}

/* Seçilmediğinde bile dış çizgisi yeşil görünsün */
.form-check-input {
    border-color: #198754 !important;
}

/* Mavi renkli gölge efekti yerine hafif yeşil parlama verir */
.form-check-input:focus {
    box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25) !important;
}

/* ==========================================================================
   3. MİNİMALİST ARAMA KUTUSU VE BUTONU
   ========================================================================== */
.search-form-wrapper {
    max-width: 320px;
    width: 100%;
}

.custom-search-input {
    font-size: 14px;
    height: 36px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    color: #2b2b2b;
    padding-left: 12px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.custom-search-input:focus {
    border-color: #008000 !important;
    box-shadow: 0 0 0 0.15rem rgba(0, 128, 0, 0.1) !important;
}

.custom-search-button {
    font-size: 14px;
    font-weight: 500;
    height: 36px;
    padding: 0 20px;
    color: #008000;
    border: 1px solid #008000;
    background-color: transparent;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;
}

.custom-search-button:hover {
    color: #ffffff;
    background-color: #008000;
    box-shadow: 0 4px 10px rgba(0, 128, 0, 0.15);
}

/* ==========================================================================
   4. SEPET SIDEBAR PANEL YERLEŞİMİ
   ========================================================================== */
.sepetsidebar {
    position: fixed;
    right: 20px;
    height: 100vh;
    z-index: 9999 !important;
    /* En öne getiren sihirli dokunuş */
}

/* ==========================================================================
   5. BAŞARILI KAYIT BİLDİRİM PENCERESİ
   ========================================================================== */
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
    z-index: 99999;
    /* Katman düzeyi artırıldı */
}

.success-toast-card {
    background-color: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    width: 280px;
    height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

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

/* Kayıt Bildirimi Animasyon Geçiş Efektleri */
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
}

.admin-social-links a:hover {
    transform: scale(1.2);
    opacity: 0.95;
}

/* ==========================================================================
   6. 🌸 LÜKS KOYU PEMBE SEPETE EKLENDİ TOAST BİLDİRİM STİLLERİ
/* ==========================================================================
   🌸 LÜKS KOYU PEMBE SEPETE EKLENDİ TOAST BİLDİRİM STİLLERİ
   ========================================================================== */
.custom-cart-toast-overlay {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    z-index: 999999 !important;
    /* Katman düzeyi en üst seviyeye kilitlendi */
    pointer-events: none;
}

/* 200x200 Tam Kare Kurumsal Başarı Kartı */
.custom-cart-toast-card {
    background-color: #ffffff !important;
    width: 200px !important;
    height: 200px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 1.25rem !important;
    padding: 1.5rem !important;
    pointer-events: auto;
    box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.15) !important;
}

/* İkon Çemberi - Sitenizin Kurumsal Koyu Pembe Tonu (#C71585) */
.cart-toast-icon-wrapper {
    width: 60px !important;
    height: 60px !important;
    background-color: #C71585 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: 0 8px 20px rgba(199, 21, 133, 0.3) !important;
}

.cart-toast-icon-wrapper i {
    font-size: 1.8rem !important;
    line-height: 1 !important;
}

.cart-toast-text {
    margin: 0 !important;
    color: #212529 !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    text-align: center !important;
    line-height: 1.4 !important;
    letter-spacing: -0.2px !important;
}

/* Pembe Sepet Toast Bildiriminin Merkezden Arkadan Öne Doğru Elastik Büyüme Animasyonu */
.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
    opacity: 0 !important;
    transform: translate(-50%, -50%) scale(0.8) !important;
}
</style>
