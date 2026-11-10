<template>
    <div class="user-orders container-fluid p-0 m-0" style="font-family: sans-serif;">
        <h4 class="fw-bold mb-4 mt-4 text-dark px-3" style="font-size: 20px;">Sipariş Geçmişim</h4>
        
        <!-- SİPARİŞ LİSTELEME TABLOSU (Kompakt ve İnce Padding Ayarlı) -->
        <div class="card border border-light-subtle shadow-sm rounded-2 overflow-hidden mx-3 mb-3">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0 p-0 m-0" style="font-size: 13px; padding: 20px;">
                    <thead class="table-light text-muted fw-normal">
                        <tr>
                            <th scope="col" class="fw-normal p-0 m-0 ps-3">Sipariş No</th>
                            <th scope="col" class="fw-normal p-0 m-0">Tarih</th>
                            <th scope="col" class="fw-normal p-0 m-0">Tutar</th>
                            <th scope="col" class="fw-normal p-0 m-0">Durum</th>
                            <th scope="col" class="text-end fw-normal p-0 m-0" style="width: 120px; padding-right: 15px !important;">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- DİNAMİK SATIRLAR -->
                        <tr v-for="(order, index) in userOrders" :key="order.o_id" class="p-0 m-0">
                            <td class="fw-semibold text-primary p-0 m-0 ps-3">#{{ order.o_no }}</td>
                            <td class="p-0 m-0 text-secondary">
                                {{ order.o_created_at ? new Date(order.o_created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' }}
                            </td>
                            <td class="fw-semibold text-success p-0 m-0">{{ Number(order.o_amount || 0).toFixed(2) }}₺</td>
                            <td class="p-0 m-0">
                                <span class="badge px-2 py-1" :class="{
                                    'bg-warning-subtle text-warning border border-warning-subtle': order.o_status === 'Hazırlanıyor' || order.o_status === 'Yeni Sipariş',
                                    'bg-info-subtle text-info border border-info-subtle': order.o_status === 'Kargoya Verildi',
                                    'bg-success-subtle text-success border border-success-subtle': order.o_status === 'Teslim Edildi',
                                    'bg-danger-subtle text-danger border border-danger-subtle': order.o_status === 'İptal Edildi'
                                }" style="font-size: 11px; font-weight: 500;">
                                    {{ order.o_status }}
                                </span>
                            </td>
                            <!-- DETAYLAR BUTONU -->
                            <td class="text-end p-0 m-0" style="padding-right: 15px !important;">
                                <button class="btn btn-sm btn-outline-secondary py-0_5 px-2 rounded-1"
                                    style="font-size: 12px; height: 26px; line-height: 1;"
                                    @click="openDetails(index)">
                                    Detaylar
                                </button>
                            </td>
                        </tr>
                        
                        <!-- Sipariş Boşsa Gösterilecek Alan -->
                        <tr v-if="userOrders.length === 0">
                            <td colspan="5" class="text-center text-muted py-4">Henüz verilmiş bir siparişiniz bulunmuyor.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- TELEPORT MÜHÜRÜ: Modalı DOM'un en dışına (body) fırlatarak arkada kalmasını engeller -->
        <Teleport to="body">
            <div v-if="isDetailsOpen" class="custom-modal-backdrop" @click.self="closeDetails">
                <div class="custom-modal-dialog">
                    <div class="custom-modal-content border border-light-subtle rounded-2 shadow-lg">
                        <div class="custom-modal-header border-bottom p-3 d-flex justify-content-between align-items-center bg-light rounded-top-2">
                            <h5 class="m-0 text-dark fw-semibold" style="font-size: 15px;">Sipariş Detayları</h5>
                            <button type="button" @click="closeDetails" class="btn-close" style="font-size: 12px;" aria-label="Kapat"></button>
                        </div>

                        <div v-if="userOrders.length > 0 && userOrders[detailID]" class="p-3 bg-white" style="font-size: 13px;">
                            <div class="row g-3">
                                <div class="col-4 text-muted">Sipariş No:</div>
                                <div class="col-8 text-dark fw-semibold">#{{ userOrders[detailID].o_no }}</div>

                                <div class="col-4 text-muted">Ürünler:</div>
                                <div class="col-8 text-dark fw-medium">{{ userOrders[detailID].o_products }}</div>

                                <div class="col-4 text-muted">Sipariş Veren:</div>
                                <div class="col-8 text-dark">{{ userOrders[detailID].o_person }}</div>

                                <div class="col-4 text-muted">Sipariş Adresi:</div>
                                <div class="col-8 text-secondary" style="line-height: 1.4;">{{ userOrders[detailID].o_adress || userOrders[detailID].o_address }}</div>

                                <div class="col-4 text-muted">Toplam Tutar:</div>
                                <div class="col-8 text-success fw-bold">{{ Number(userOrders[detailID].o_amount || 0).toFixed(2) }} ₺</div>

                                <div class="col-4 text-muted">Sipariş Tarihi:</div>
                                <div class="col-8 text-dark">
                                    {{ userOrders[detailID].o_created_at ? new Date(userOrders[detailID].o_created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-' }}
                                </div>

                                <div class="col-4 text-muted">Durumu:</div>
                                <div class="col-8">
                                    <span class="badge" :class="{
                                        'bg-warning-subtle text-warning border border-warning-subtle': userOrders[detailID].o_status === 'Hazırlanıyor' || userOrders[detailID].o_status === 'Yeni Sipariş',
                                        'bg-info-subtle text-info border border-info-subtle': userOrders[detailID].o_status === 'Kargoya Verildi',
                                        'bg-success-subtle text-success border border-success-subtle': userOrders[detailID].o_status === 'Teslim Edildi',
                                        'bg-danger-subtle text-danger border border-danger-subtle': userOrders[detailID].o_status === 'İptal Edildi'
                                    }" style="font-size: 11px; font-weight: 500; padding: 4px 8px;">
                                        {{ userOrders[detailID].o_status }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="border-top p-3 bg-light rounded-bottom-2 d-flex justify-content-end" style="font-size: 13px;">
                            <button type="button" class="btn btn-sm btn-light border border-light-subtle text-secondary py-1_5 px-3" @click="closeDetails">Kapat</button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'UserOrders',
    props: {
        user: {
            type: Object,
            default: null
        },
        email: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            userOrders: [],
            baseUrl: "http://localhost:3001",
            isDetailsOpen: false,
            detailID: 0
        }
    },
    watch: {
        user: {
            immediate: true,
            handler(newVal) {
                if (newVal) this.fetchUserOrders();
            }
        },
        email: {
            immediate: true,
            handler(newVal) {
                if (newVal) this.fetchUserOrders();
            }
        }
    },
    mounted() {
        this.fetchUserOrders();
    },
    methods: {
        async fetchUserOrders() {
            try {
                let rawData = this.email || (this.user ? (this.user.email || this.user.o_email || this.user.userEmail) : null);

                if (!rawData) {
                    const keysToTry = ['userEmail', 'email', 'user', 'activeUser'];
                    for (const key of keysToTry) {
                        const storedData = localStorage.getItem(key) || sessionStorage.getItem(key);
                        if (storedData) {
                            rawData = storedData;
                            break;
                        }
                    }
                }

                let finalEmail = null;
                if (rawData) {
                    if (typeof rawData === 'string' && rawData.trim().startsWith('{')) {
                        try {
                            const parsed = JSON.parse(rawData);
                            finalEmail = parsed.email || parsed.userEmail || parsed.o_email;
                        } catch (e) {
                            console.error("JSON parse hatası:", e);
                        }
                    } else if (typeof rawData === 'object') {
                        finalEmail = rawData.email || rawData.userEmail || rawData.o_email;
                    } else if (typeof rawData === 'string' && rawData.includes('@')) {
                        finalEmail = rawData;
                    }
                }

                console.log("🎯 Sorgulanan E-posta:", finalEmail);

                if (!finalEmail) {
                    this.userOrders = [];
                    return;
                }

                const targetUrl = `${this.baseUrl}/api/user-orders?email=${encodeURIComponent(finalEmail.trim())}`;
                const response = await axios.get(targetUrl);
                
                if (response.data && Array.isArray(response.data)) {
                    this.userOrders = response.data;
                }
                
            } catch (error) {
                console.error("❌ API bağlantı hatası:", error.message);
            }
        },
        openDetails(index) {
            this.detailID = index;
            this.isDetailsOpen = true;
        },
        closeDetails() {
            this.isDetailsOpen = false;
        }
    }
}
</script>

<style scoped>
/* GÜÇLÜ KATMAN: z-index değeri en üst sınıra çekilerek modalın en önde açılması sağlandı */
.custom-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999 !important; 
}

.custom-modal-dialog {
    width: 100%;
    max-width: 500px;
    margin: 1.75rem;
    z-index: 1000000 !important;
}

.custom-modal-content {
    background-color: #fff;
    background-clip: padding-box;
}
</style>
