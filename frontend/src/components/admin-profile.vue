<template>
    <div class="user-profile container-fluid p-0 m-0">
        <h4 class="fw-bold mb-4 mt-4 text-dark px-3">Profil ve Şifre Ayarları</h4>

        <!-- 1. KART: MEVCUT PROFİL BİLGİLERİ -->
        <div class="card border border-light-subtle shadow-sm rounded-3 mx-3 mb-4 p-4"
            style="max-width: 650px; background-color: #f8f9fa;">
            <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                <div class="d-flex align-items-center gap-3">
                    <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                        style="width: 48px; height: 48px; background-color: #008000; font-size: 18px;">
                        {{ (form.firstName ? form.firstName[0] : 'A').toUpperCase() }}
                    </div>
                    <div>
                        <h6 class="fw-bold text-dark m-0">
                            {{ form.firstName || 'Admin' }} {{ form.lastName || '' }}
                        </h6>
                        <span class="badge mt-1" style="background-color: #C71585; font-weight: 500;">Yönetici
                            Hesabı</span>
                    </div>
                </div>
            </div>

            <div class="row g-2 small">
                <div class="col-sm-6">
                    <span class="text-muted d-block">Kayıtlı E-posta Adresi:</span>
                    <span class="fw-semibold text-dark">{{ form.email || 'Yükleniyor...' }}</span>
                </div>
                <div class="col-sm-6">
                    <span class="text-muted d-block">Kayıtlı Telefon Numarası:</span>
                    <span class="fw-semibold text-dark">{{ form.tel || 'Belirtilmemiş' }}</span>
                </div>
            </div>
        </div>

        <!-- 2. KART: KİŞİSEL BİLGİLERİ GÜNCELLE -->
        <div class="card border border-light-subtle shadow-sm rounded-3 mx-3 mb-4 p-4" style="max-width: 650px;">
            <h6 class="fw-bold text-success mb-3 border-bottom pb-2">Kişisel Bilgileri Güncelle</h6>
            <form @submit.prevent="updateProfile">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label small text-muted">Ad*</label>
                        <input type="text" class="form-control form-control-sm" v-model="form.firstName" required />
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small text-muted">Soyad*</label>
                        <input type="text" class="form-control form-control-sm" v-model="form.lastName" required />
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small text-muted">E-posta*</label>
                        <input type="email" class="form-control form-control-sm" v-model="form.email" required />
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small text-muted">Telefon</label>
                        <input type="text" class="form-control form-control-sm" v-model="form.tel" />
                    </div>
                    <div class="col-12 text-end mt-3">
                        <button type="submit" class="btn btn-sm text-white px-4" style="background-color: #008000;">
                            Bilgileri Güncelle
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <!-- 3. KART: ŞİFRE DEĞİŞTİRME -->
        <div class="card border border-light-subtle shadow-sm rounded-3 mx-3 mb-4 p-4" style="max-width: 650px;">
            <h6 class="fw-bold mb-3 border-bottom pb-2" style="color: #C71585;">Şifre Değiştir</h6>
            <form @submit.prevent="updatePassword">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label small text-muted">Yeni Şifre*</label>
                        <input type="password" class="form-control form-control-sm" v-model="newPass" required />
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small text-muted">Yeni Şifre (Tekrar)*</label>
                        <input type="password" class="form-control form-control-sm" v-model="confirmPass" required />
                    </div>
                    <div class="col-12 text-end mt-3">
                        <button type="submit" class="btn btn-sm text-white px-4" style="background-color: #C71585;">
                            Şifreyi Güncelle
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- BİLGİ VE ŞİFRE GÜNCELLEME TOAST BİLDİRİMİ -->
    <Teleport to="body">
        <Transition name="toast-slide">
            <div v-if="toast.show" class="fixed-top-center-toast border rounded-3 shadow-lg"
                :style="{ borderBottom: '5px solid ' + toast.color + ' !important' }">
                <div class="toast-icon-wrapper mb-3">
                    <i :class="toast.icon" :style="{ fontSize: '60px', color: toast.color }"></i>
                </div>
                <h6 class="m-0 text-dark text-center fw-bold px-2" style="font-size: 16px; line-height: 1.4;">
                    {{ toast.message }}
                </h6>
            </div>
        </Transition>
    </Teleport>

</template>



<script>
export default {
    name: 'AdminProfile',
    emits: ['profile-updated'],
    data() {
        return {
            baseUrl: 'http://localhost:3001',
            form: {
                firstName: '',
                lastName: '',
                email: '',
                tel: ''
            },
            newPass: '',
            confirmPass: '',
            toast: {
                show: false,
                message: '',
                icon: 'bi bi-check-circle-fill',
                color: '#008000'
            },

        };
    },
    mounted() {
        this.loadProfile();
    },

    methods: {
        async loadProfile() {
            const userToken = window.sessionStorage.getItem('token');
            if (!userToken) return;

            try {
                const response = await window.fetch(this.baseUrl + '/api/get-profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: userToken })
                });
                const data = await response.json();
                if (data) {
                    this.form.firstName = data.u_firstName || '';
                    this.form.lastName = data.u_lastName || '';
                    this.form.email = data.u_email || '';
                    this.form.tel = data.u_tel || '';
                }

            } catch (err) {
                console.error('Bilgiler alınamadı:', err);
            }
        },

        async updateProfile() {
            const t = window.sessionStorage.getItem('token');
            const payload = {
                token: t,
                firstName: this.form.firstName,
                lastName: this.form.lastName,
                email: this.form.email,
                tel: this.form.tel,
                newPass: ''
            };
            await this.sendUpdate(payload, 'Bilgiler güncellendi!');
        },

        async updatePassword() {
            if (this.newPass !== this.confirmPass) {
                this.triggerToast('Şifreler eşleşmiyor!', 'bi bi-exclamation-circle-fill', '#dc3545');
                return;
            }
            if (this.newPass.length < 6) {
                this.triggerToast('Şifre en az 6 karakter olmalı!', 'bi bi-exclamation-circle-fill', '#dc3545');
                return;
            }
            const t = window.sessionStorage.getItem('token');
            const payload = {
                token: t,
                firstName: this.form.firstName,
                lastName: this.form.lastName,
                email: this.form.email,
                tel: this.form.tel,
                newPass: this.newPass
            };
            await this.sendUpdate(payload, 'Şifre güncellendi!');
            this.newPass = '';
            this.confirmPass = '';
        },

        async sendUpdate(bodyData, successMsg) {
            const res = await window.fetch(this.baseUrl + '/api/update-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });
            const data = await res.json();
            if (data.success) {
                const isPass = successMsg.includes('Şifre');
                this.triggerToast(successMsg, isPass ? 'bi bi-shield-lock-fill' : 'bi bi-check-circle-fill', isPass ? '#C71585' : '#008000');

                const full = this.form.firstName + ' ' + this.form.lastName;
                window.sessionStorage.setItem('userName', full);
                this.$emit('profile-updated', full);
            } else {
                this.triggerToast(data.message || 'Hata oluştu!', 'bi bi-x-circle-fill', '#dc3545');
            }
        },
        triggerToast(msg, icon, color) {
            this.toast.message = msg;
            this.toast.icon = icon;
            this.toast.color = color;
            this.toast.show = true;
            setTimeout(() => {
                this.toast.show = false;
            }, 1500);
        },


    }
};


</script>

<style scoped>
/* Güncelleme Başarı Kartı İçin Alt Çizgi Rengini Mavi Yapan Ek Sınıf */
.fixed-top-center-toast.border-primary-subtle {
    border-bottom: 5px solid #007bff !important;
    /* r harfi f ile düzeltildi */
}

/* 1. Sayfanın orta-üst kısmına sabitlenmiş 250x250px net kare kartın temel yapısı */
.fixed-top-center-toast {
    position: fixed;
    top: 10%;
    /* Sayfanın en üstünden biraz aşağıda konumlanır */
    left: 50%;
    transform: translateX(-50%);
    /* Yatayda tam ortalama sağlar */
    width: 250px !important;
    height: 250px !important;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 25px;
    box-sizing: border-box;
    z-index: 9999;
    /* Diğer tüm modalların üstünde açılması için */
}

/* 2. Güncelleme Başarı Kartı İçin Alt Çizgi Rengini Mavi Yapan Ek Sınıf */
.fixed-top-center-toast.border-primary-subtle {
    border-bottom: 5px solid #007bff !important;
    /* Bootstrap Primary Mavisi */
}

/* 3. Toast'un yukarıdan aşağı pürüzsüzce süzülerek gelmesini sağlayan animasyon sınıfları */
.toast-slide-enter-active {
    transition: all 0.3s ease-out;
}

.toast-slide-leave-active {
    transition: all 0.25s ease-in;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
    transform: translate(-50%, -20px);
    /* Hafif yukarıdan başlar */
    opacity: 0;
}


/* Modal yapısının ekranda ortalanmasını sağlayan özel CSS */
.custom-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
}

.custom-modal-dialog {
    width: 100%;
    max-width: 500px;
    padding: 20px;
}

.custom-modal-content {
    background: white;
    display: flex;
    flex-direction: column;
}

/* Sağ üstte çıkan şık yeşil Toast bildiriminin yerleşimi */
.custom-toast-overlay {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1100;
}

.custom-toast-card {
    background: white;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.toast-icon-wrapper {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* KULLANICI BAŞARIYLA EKLENDİ TOASTI  */
/* Sayfanın orta-üst kısmına sabitlenmiş 250x250px net kare kart */
.fixed-top-center-toast {
    position: fixed;
    top: 15%;
    /* Sayfanın en üstünden biraz aşağıda (orta-üst) konumlanır */
    left: 50%;
    transform: translateX(-50%);
    /* Yatayda tam ortalama sağlar */
    width: 250px !important;
    height: 250px !important;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 25px;
    box-sizing: border-box;
    z-index: 9999;
    /* Alt kısımdaki estetik yeşil bar */
}

/* İkonun kendi iç büyüme efekti */
.toast-icon-wrapper i {
    display: inline-block;
    animation: popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes popIn {
    0% {
        transform: scale(0.4);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

/* Arkada hiçbir gölge karartma geçişi yaratmayan, sadece kartı yukarıdan aşağı kaydıran pürüzsüz geçiş animasyonu */
.toast-slide-enter-active {
    transition: all 0.3s ease-out;
}

.toast-slide-leave-active {
    transition: all 0.25s ease-in;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
    transform: translate(-50%, -20px);
    /* Hafif yukarıdan aşağı süzülerek gelir */
    opacity: 0;
}



/* SİLME TOASTLARI */
.fixed-top-center-toast.border-danger-subtle {
    border-bottom: 5px solid #dc3545 !important;
}

.custom-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    /* İçeriği dikeyde ve yatayda merkezler */
    z-index: 1050;
}
</style>
