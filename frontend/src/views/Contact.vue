<template>
    <div class="contact-container container mt-4" style="font-family: sans-serif;">
        <!--! Contact-İçerik -->
        <h1 style="text-align: center; margin-top: 50px;">Bize Mesaj Gönderin!</h1>

        <div class="row mt-5">
            <div class="col-md-6">
                <!--! Contact-Form  -->
                <form class="row g-3" @submit.prevent="sendMessage()">
                    <div class="col-md-6">
                        <label class="form-label">Ad*</label>
                        <input v-model="newMessage.firstName" type="text" class="form-control" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Soyad*</label>
                        <input v-model="newMessage.lastName" type="text" class="form-control" required>
                    </div>

                    <div class="col-md-5">
                        <label class="form-label">Email*</label>
                        <input v-model="newMessage.email" type="email" class="form-control"
                            placeholder="example@hotmail.com" required>
                    </div>

                    <div class="col-md-3">
                        <label class="form-label">Ülke*</label>
                        <select v-model="newMessage.code" class="form-select" required>
                            <option value="+90">TR (+90)</option>
                            <option value="+971">BAE (+971)</option>
                            <option value="+34">ES (+34)</option>
                        </select>
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Telefon*</label>
                        <input v-model="newMessage.tel" type="tel" class="form-control" required>
                    </div>

                    <div class="col-md-3">
                        <label class="form-label">Konu*</label>
                        <select v-model="newMessage.subject" class="form-select" required>
                            <option value="Teşekkür">Teşekkür</option>
                            <option value="Şikayet">Şikayet</option>
                            <option value="Öneri">Öneri</option>
                        </select>
                    </div>

                    <div class="col-md-9">
                        <label class="form-label">Mesaj*</label>
                        <textarea v-model="newMessage.message" class="form-control" rows="3" required></textarea>
                    </div>

                    <div class="col-12">
                        <div class="form-check">
                            <input v-model="newMessage.check" class="form-check-input" type="checkbox" required>
                            <label class="form-check-label">
                                Bilgilerimin doğruluğunu onaylıyorum.
                            </label>
                        </div>
                    </div>

                    <div v-if="status !== 'isleniyor'" class="col-12">
                        <button class="btn w-100 btn-success" type="submit">Gönder</button>
                    </div>
                    <div v-else class="col-12">
                        <button class="btn w-100 btn-success" type="button" disabled>Mesajınız İletiliyor...</button>
                    </div>
                </form>
            </div>

            <!-- ! Google Map -->
            <div class="col-md-6">
                <iframe src="https://google.com" width="100%" height="400" style="border:0;" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>

        </div>

        <!-- ! Mesaj Durum Bildirimleri -->
        <div class="row mt-3">
            <!--? Başarıyla Gönderildi -->
            <div v-if="status === 'basarili'" class="alert col-md-6 alert-success alert-dismissible fade show"
                role="alert">
                <strong>Mesaj gönderildi!</strong> İletişim notunuz başarıyla admin paneline ulaştırıldı.
                <button type="button" class="btn-close" @click="status = ''" aria-label="Close"></button>
            </div>

            <!--? Gönderilemedi / Hata Düştü -->
            <div v-if="status === 'basarisiz'" class="alert col-md-6 alert-danger alert-dismissible fade show"
                role="alert">
                <strong>Hata oluştu!</strong> Mesajınız sunucuya iletilemedi. Lütfen tekrar deneyin.
                <button type="button" class="btn-close" @click="status = ''" aria-label="Close"></button>
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
            // KRİTİK DÜZELTME: Gereksiz dizi parantezleri [] kaldırıldı, doğrudan sade nesne yapıldı.
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
        //! POST - Mesaj Gönder
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

                // Form Alanlarını Sıfırla
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
.form-check-input:checked {
    background-color: #198754;
    border-color: #198754;
}
</style>
