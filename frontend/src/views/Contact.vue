<template>
    <div class="contact-container container" style="font-family: sans-serif;">
        <!-- Sayfa Başlığı (Minimalist) -->
        <div class="text-center contact-header">
            <h1 class="page-title">Bize Mesaj Gönderin!</h1>
            <div class="title-underline"></div>
        </div>

        <div class="row g-5 match-height">

             <!-- Sol Taraf: Google Map -->
            <div class="col-lg-6">
                <div class="map-wrapper">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49968.68504783755!2d28.098161706079576!3d38.48665397011258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b85a582c507119%3A0xe33e87bea754060b!2sSalihli%2C%20Manisa!5e0!3m2!1str!2str!4v1792655123109!5m2!1str!2str" width="600" height="650" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
                </div>
            </div>

            <!-- Sağ Taraf: İletişim Formu -->
            <div class="col-lg-6">
                <form class="row g-4" @submit.prevent="sendMessage()">
                    <div class="col-md-6">
                        <label class="form-label">Ad *</label>
                        <input v-model="newMessage.firstName" type="text" class="form-control custom-input" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Soyad *</label>
                        <input v-model="newMessage.lastName" type="text" class="form-control custom-input" required>
                    </div>

                    <div class="col-md-12">
                        <label class="form-label">Email *</label>
                        <input v-model="newMessage.email" type="email" class="form-control custom-input"
                            placeholder="example@hotmail.com" required>
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Ülke *</label>
                        <select v-model="newMessage.code" class="form-select custom-input" required>
                            <option value="+90">TR (+90)</option>
                            <option value="+971">BAE (+971)</option>
                            <option value="+34">ES (+34)</option>
                        </select>
                    </div>

                    <div class="col-md-8">
                        <label class="form-label">Telefon *</label>
                        <input v-model="newMessage.tel" type="tel" class="form-control custom-input" required>
                    </div>

                    <div class="col-md-12">
                        <label class="form-label">Konu *</label>
                        <select v-model="newMessage.subject" class="form-select custom-input" required>
                            <option value="Teşekkür">Teşekkür</option>
                            <option value="Şikayet">Şikayet</option>
                            <option value="Öneri">Öneri</option>
                        </select>
                    </div>

                    <div class="col-md-12">
                        <label class="form-label">Mesaj *</label>
                        <textarea v-model="newMessage.message" class="form-control custom-input" rows="4" required></textarea>
                    </div>

                    <div class="col-12">
                        <div class="form-check custom-checkbox">
                            <input v-model="newMessage.check" class="form-check-input" type="checkbox" id="confirmCheck" required>
                            <label class="form-check-label text-muted" for="confirmCheck">
                                Bilgilerimin doğruluğunu onaylıyorum.
                            </label>
                        </div>
                    </div>

                    <!-- Düz Yeşil Butonlar -->
                    <div class="col-12">
                        <button v-if="status !== 'isleniyor'" class="btn btn-flat-success w-100" type="submit">
                            Gönder
                        </button>
                        <button v-else class="btn btn-flat-success w-100" type="button" disabled>
                            Mesajınız İletiliyor...
                        </button>
                    </div>
                </form>

                <!-- Bildirim Mesajları -->
                <div class="row mt-4">
                    <div v-if="status === 'basarili'" class="alert alert-minimal alert-success alert-dismissible fade show w-100" role="alert">
                        <strong>Mesaj gönderildi!</strong> İletişim notunuz başarıyla ulaştırıldı.
                        <button type="button" class="btn-close" @click="status = ''" aria-label="Close"></button>
                    </div>

                    <div v-if="status === 'basarisiz'" class="alert alert-minimal alert-danger alert-dismissible fade show w-100" role="alert">
                        <strong>Hata oluştu!</strong> Lütfen tekrar deneyin.
                        <button type="button" class="btn-close" @click="status = ''" aria-label="Close"></button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'ContactComponent',
    inject: ['products', 'sepet'],
    data() {
        return {
            newMessage: {
                firstName: "",
                lastName: "",
                email: "",
                code: "+90",
                tel: "",
                subject: "Teşekkür",
                message: "",
                check: false
            },
            status: "",
            baseUrl: "http://localhost:3001"
        };
    },
    methods: {
        async sendMessage() {
            this.status = "isleniyor";
            try {
                const res = await fetch(`${this.baseUrl}/api/messages`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        firstName: this.newMessage.firstName,
                        lastName: this.newMessage.lastName,
                        email: this.newMessage.email,
                        code: this.newMessage.code,
                        tel: this.newMessage.tel,
                        subject: this.newMessage.subject,
                        message: this.newMessage.message
                    })
                });

                if (!res.ok) throw new Error("Contact endpoint hatası!");

                this.status = "basarili";

                this.newMessage = {
                    firstName: "",
                    lastName: "",
                    email: "",
                    code: "+90",
                    tel: "",
                    subject: "Teşekkür",
                    message: "",
                    check: false
                };
            }
            catch (e) {
                console.error("Mesaj Gönderim Hatası:", e.message);
                this.status = "basarisiz";
            }
        }
    }
};
</script>

<style scoped>
/* Sayfa Yapısı */
.contact-container {
    padding-top: 50px;
    padding-bottom: 100px;
}
.contact-header {
    margin-bottom: 40px;
}
.page-title {
    font-size: 2rem;
    font-weight: 500;
    color: #008000;
    letter-spacing: -0.5px;
}
.title-underline {
    width: 50px;
    height: 3px;
    background-color: #008000;
    margin: 12px auto 0 auto;
}

/* Form Elemanları */
.form-label {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #666;
    font-weight: 600;
    margin-bottom: 4px;
}
.custom-input {
    border-radius: 4px;
    border: 1px solid #ddd;
    padding: 10px 14px;
    font-size: 0.95rem;
    background-color: #fff;
    box-shadow: none;
    transition: border-color 0.2s ease;
}
.custom-input:focus {
    border-color: #198754;
    background-color: #fff;
    box-shadow: none;
    outline: none;
}

/* Checkbox */
.custom-checkbox .form-check-input {
    border-radius: 2px;
    border-color: #ccc;
}
.custom-checkbox .form-check-input:checked {
    background-color: #198754;
    border-color: #198754;
}

/* İstediğiniz Düz Yeşil Buton (Gradientsiz / Gölgesiz) */
.btn-flat-success {
    background-color: #017801  ;
    color: #fff;
    font-weight: 600;
    padding: 12px;
    border-radius: 4px;
    border: none;
    font-size: 1rem;
    transition: background-color 0.2s ease;
}
.btn-flat-success:hover {
    background-color: #017801 ;
    color: #fff;
}
.btn-flat-success:disabled {
    background-color: #a3cfbb;
    color: #fff;
}

/* Harita Çerçevesi */
.map-wrapper {
    height: 100%;
    border: 1px solid #eee;
    border-radius: 4px;
    overflow: hidden;
}

/* Minimal Uyarı Kutuları */
.alert-minimal {
    border-radius: 4px;
    font-size: 0.9rem;
    border: 1px solid transparent;
}
</style>


