<template>
    <div class="container py-5">
        <main>
            <div class="text-center mb-5">
                <h1 class="h2 fw-bold mb-3" style="color: #008000;">Ödeme Sayfası</h1>
                <p class="lead text-muted">Lütfen fatura bilgilerinizi ve ödeme yönteminizi eksiksiz doldurunuz.</p>
            </div>

            <div class="row g-5">
                <!--! Sepet Kısmı -->
                <div class="col-md-5 col-lg-4 order-md-last">
                    <h4 class="d-flex justify-content-between align-items-center mb-3">
                        <span class="sepet-baslik-pembe">Sepetiniz</span>
                        <span class="badge rounded-pill sepet-badge-yesil">{{ sepet ? sepet.length : 0 }} Ürün</span>
                    </h4>
                    <ul class="list-group mb-3 custom-card">
                        <!-- Ürün Listeleme -->
                        <li v-for="(value, index) in sepet" :key="index" class="list-group-item d-flex justify-content-between lh-sm align-items-center py-3">
                            <div>
                                <h6 class="my-0 fw-semibold">{{ value.name }}</h6>
                                <small class="text-muted">Ürün eklendi!</small>
                            </div>
                            <div class="d-flex align-items-center gap-3">
                                <span class="text-dark fw-medium">{{ value.price }}₺</span>
                                <i style="cursor: pointer;" @click="deleteItem(index)" class="bi bi-trash3 sepet-sil-ikon"></i>
                            </div>
                        </li>

                        <!-- Hesaplamalar -->
                        <li class="list-group-item d-flex justify-content-between bg-light text-muted small">
                            <span>Ara Toplam:</span>
                            <span>{{ araTutar }}₺</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between bg-light text-muted small">
                            <span>KDV Tutarı (%20):</span>
                            <span>{{ kdvTutari }}₺</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between border-top-0 pt-3">
                            <span class="fw-bold">KDV dahil Toplam:</span>
                            <strong class="fs-5" style="color: #C71585 ;">{{ kdvliToplamTutar }}₺</strong>
                        </li>
                    </ul>
                </div>

                <!--! Adres ve Kart Bilgileri Kısmı -->
                <div class="col-md-7 col-lg-8">
                    <h4 class="mb-3 fw-bold">Fatura Adresi</h4>
                    <form class="needs-validation" @submit.prevent="checkOut">
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label">TC Kimlik No:</label>
                                <input type="text" class="form-control" placeholder="Fatura için zorunludur." v-model="order[0].TC" required />
                            </div>

                            <div class="col-sm-6">
                                <label class="form-label">Ad:</label>
                                <input type="text" class="form-control" v-model="order[0].firstName" required />
                            </div>

                            <div class="col-sm-6">
                                <label class="form-label">Soyad:</label>
                                <input type="text" class="form-control" v-model="order[0].lastName" required />
                            </div>
                        
                            <div class="col-6">
                                <label class="form-label">E-posta</label>
                                <input type="email" class="form-control" placeholder="ornek@example.com" v-model="order[0].email"/>
                            </div>

                            <div class="col-6">
                                <label class="form-label">Telefon:</label>
                                <input type="tel" class="form-control" placeholder="+90(555)555 55 55" v-model="order[0].phone"/>
                            </div>

                            <div class="col-12">
                                <label class="form-label">Adres:</label>
                                <textarea class="form-control" rows="3" placeholder="Adresinizi ayrıntılı giriniz..." v-model="order[0].address" required></textarea>
                            </div>
                         
                            <div class="col-md-5">
                                <label class="form-label">Ülke:</label>
                                <select class="form-select" v-model="order[0].country" required>
                                    <option value="Türkiye">Türkiye</option>
                                </select>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Şehir:</label>
                                <select class="form-select" v-model="order[0].state" required>
                                    <option value="" disabled selected>Şehir Seçiniz</option>
                                    <option value="Adana">Adana</option>
                                    <option value="Ankara">Ankara</option>
                                    <option value="İstanbul">İstanbul</option>
                                    <option value="İzmir">İzmir</option>
                                </select>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Posta Kodu:</label>
                                <input type="text" class="form-control" v-model="order[0].zip" required />
                            </div>
                        </div>

                        <hr class="my-4" />

                        <!-- ! Kart Bilgileri -->
                        <h4 class="mb-3 fw-bold">Ödeme Yöntemi</h4>
                        <div class="my-3">
                            <div class="form-check form-check-inline">
                                <input id="credit" name="paymentMethod" type="radio" class="form-check-input" checked required />
                                <label class="form-check-label" for="credit">Kredi Kartı</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input id="debit" name="paymentMethod" type="radio" class="form-check-input" required />
                                <label class="form-check-label" for="debit">Debit Kart</label>
                            </div>
                        </div>

                        <!-- Sizin orijinal v-model="payment[0].xxx" yapınıza sadık kalındı -->
                        <div class="row gy-3 custom-card p-3 bg-light rounded border">
                            <div class="col-md-6">
                                <label class="form-label">Kart Sahibi:</label>
                                <input v-model="payment[0].name" type="text" class="form-control" placeholder="Kart üzerindeki isim" required />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Kart Numarası:</label>
                                <input v-model="payment[0].number" type="text" class="form-control" placeholder="0000 0000 0000 0000" required />
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">SKT:</label>
                                <input v-model="payment[0].exp" type="text" class="form-control" placeholder="AA/YY" required />
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">CVV:</label>
                                <input v-model="payment[0].cvv" type="text" class="form-control" placeholder="123" required />
                            </div>
                        </div>

                        <hr class="my-4" />
                        <!-- İnce kibar buton yapısı -->
                        <button class="btn btn-kibar-buyuk-yesil w-100" type="submit">
                            <i class="bi bi-shield-check me-2"></i> Siparişi Güvenle Tamamla
                        </button>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    inject: ['sepet'],
    data() {
        return {
            // Sizin orijinal dizi yapınız [ ] aynen korundu, hata çözüldü
            order: [
                { TC: "", firstName: "", lastName: "", email: "", phone: "", address: "", country: "Türkiye", state: "", zip: "" }
            ],
            payment: [
                { name: "", number: "", exp: "", cvv: "" }
            ],
            baseUrl: "http://localhost:3001" 
        };
    },
    computed: {
        araTutar() {
            if (!this.sepet) return 0;
            const toplam = this.sepet.reduce((acc, urun) => acc + Number(urun.price), 0);
            return Math.round(toplam * 100) / 100;
        },
        kdvTutari() {
            return Math.round((this.araTutar * 0.2) * 100) / 100;
        },
        kdvliToplamTutar() {
            return Math.round((this.araTutar * 1.2) * 100) / 100;
        }
    },
       methods: {
        // API'ye sipariş verilerini gönderen fonksiyon
        async checkOut() {
            try {
                // Ters tırnak (backtick) kullanımı sağlandı
                const res = await fetch(`${this.baseUrl}/api/orders`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        sepet: this.sepet,
                        order: this.order,
                        amount: this.kdvliToplamTutar
                    })
                });
                
                if (!res.ok) throw new Error("Endpoint hatası oluştu!");
                const data = await res.json();

                if (data) {
                    alert("Sipariş başarıyla alındı!");
                    // Sipariş onaylandıktan sonra sepet dizisini sıfırlıyoruz
                    this.sepet.length = 0; 
                    // Kullanıcıyı ana sayfaya yönlendiriyoruz
                    this.$router.push('/');
                }
            } catch (e) {
                console.error("Ödeme hatası:", e.message);
                alert("Ödeme sırasında bir hata oluştu.");
            }
        },
        // Ödeme sayfasındaki sepet listesinden ürün silme fonksiyonu
        deleteItem(index) {
            this.sepet.splice(index, 1);
        }
    }
};
</script>

<style scoped>
    /* 🌸 Sepet Başlık ve Badge Renkleri (Sepet.vue ile tam uyumlu) */
    .sepet-baslik-pembe {
        color: #C71585 !important;
        font-weight: bold;
    }
    .sepet-badge-yesil {
        background-color: #C71585  !important;
        border-radius: 10px !important;
    }
    .sepet-sil-ikon {
        color: #C71585 !important;
        font-size: 1.1rem;
        transition: transform 0.2s;
    }
    .sepet-sil-ikon:hover {
        transform: scale(1.15);
    }

    /* 🟢 Kibar Büyük Yeşil Tamamlama Butonu */
    .btn-kibar-buyuk-yesil {
        background-color: transparent;
        color: #008000;
        border: 2px solid #008000;
        border-radius: 10px; /* Oval ve kibar görünüm */
        padding: 12px 24px;
        font-size: 1.1rem;
        font-weight: 600;
        transition: all 0.3s ease;
        margin-bottom: 50px;
    }
    .btn-kibar-buyuk-yesil:hover {
        background-color: #008000;
        color: #ffffff !important;
    }

    /* Form ve Kart Dokunuşları */
    .custom-card {
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
    }
    
    /* Input odaklanma (focus) renkleri yeşile uyarlandı */
    .form-control:focus, .form-select:focus {
        border-color: #008000;
        box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.15);
    }
</style>
