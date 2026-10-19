<template>
    <div class="orders container-fluid p-0 m-0" style="font-family: sans-serif;">
        <!-- ÜST BAŞLIK -->
        <div class="d-flex justify-content-between align-items-center mb-4 pt-3 px-3">
            <h4 class="fw-semibold text-dark m-0" style="font-size: 20px;">Sipariş Yönetimi</h4>
        </div>

        <!-- SİPARİŞ LİSTELEME TABLOSU (Kompakt ve İnce Padding Ayarlı) -->
        <div class="card border border-light-subtle shadow-sm rounded-2 overflow-hidden mx-3 mb-3">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0 p-0 m-0" style="font-size: 13px;">
                    <thead class="table-light text-muted fw-normal">
                        <tr>
                            <th scope="col" class="fw-normal p-0 m-0 text-center" style="width: 60px;">ID</th>
                            <th scope="col" class="fw-normal p-0 m-0">Sipariş No</th>
                            <th scope="col" class="fw-normal p-0 m-0">Toplam Tutar</th>
                            <th scope="col" class="fw-normal p-0 m-0">Verilen Tarih</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 160px;">Sipariş Durumu</th>
                            <th scope="col" class="text-end fw-normal p-0 m-0" style="width: 220px; padding-right: 10px !important;">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- DÜZELTİLDİ: Detay modalı indeksi için döngüye index eklendi -->
                        <tr v-for="(order, index) in orders" :key="order.id" class="p-0 m-0">
                            <th scope="row" class="text-secondary fw-normal p-0 m-0 text-center">#{{ order.id }}</th>
                            <td class="p-0 m-0 fw-medium text-primary ps-1">{{ order.o_no }}</td>
                            <td class="p-0 m-0 fw-semibold text-success">{{ Number(order.o_amount || 0).toFixed(2) }} ₺</td>
                            <td class="p-0 m-0 text-secondary">{{ order.o_date }}</td>
                            <td class="p-0 m-0">
                                <select class="form-select form-control-sm border-light-subtle rounded-1 py-0 px-1 shadow-none" 
                                    style="font-size: 12px; height: 28px; width: 140px;" v-model="order.o_status">
                                    <option value="Hazırlanıyor">Hazırlanıyor</option>
                                    <option value="Kargoya Verildi">Kargoya Verildi</option>
                                    <option value="Teslim Edildi">Teslim Edildi</option>
                                    <option value="İptal Edildi">İptal Edildi</option>
                                </select>
                            </td>
                            <td class="text-end p-0 m-0" style="padding-right: 10px !important;">
                                <div class="d-inline-flex gap-1">
                                    <!-- DÜZELTİLDİ: Tüm sipariş nesnesi parametre olarak gönderiliyor -->
                                    <button class="btn btn-sm btn-outline-primary py-0_5 px-2 rounded-1" style="font-size: 12px; height: 26px; line-height: 1;"
                                        @click="updateOrder(order)">Güncelle</button>

                                    <button class="btn btn-sm btn-outline-danger py-0_5 px-2 rounded-1" style="font-size: 12px; height: 26px; line-height: 1;"
                                        @click="deleteOrder(order.id)">Sil</button>

                                    <button class="btn btn-sm btn-outline-secondary py-0_5 px-2 rounded-1" style="font-size: 12px; height: 26px; line-height: 1;"
                                        @click="openDetails(index)" type="button" data-bs-toggle="modal" data-bs-target="#details">
                                        Detaylar
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="orders.length === 0">
                            <td colspan="6" class="text-center text-muted py-4">Henüz kayıtlı bir sipariş bulunmuyor.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ORDER DETAILS MODAL'I -->
        <div class="modal fade" id="details" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-2">
                    <div class="modal-header bg-light border-bottom p-3">
                        <h5 class="modal-title fw-semibold text-dark" style="font-size: 15px;">Sipariş Detayları</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <!-- DÜZELTİLDİ: orders[detailID] yapısının çökmemesi için v-if kontrolü eklendi -->
                    <div v-if="orders.length > 0 && orders[detailID]" class="modal-body p-4 bg-white" style="font-size: 13px;">
                        <div class="row g-2">
                            <div class="col-4 fw-medium text-secondary">Sipariş No:</div>
                            <div class="col-8 text-dark fw-semibold">{{ orders[detailID].o_no }}</div>

                            <div class="col-4 fw-medium text-secondary">Ürünler:</div>
                            <div class="col-8 text-dark">{{ formatProducts(orders[detailID].o_products) }}</div>

                            <div class="col-4 fw-medium text-secondary">Sipariş Veren:</div>
                            <div class="col-8 text-dark">{{ orders[detailID].o_person }}</div>

                            <div class="col-4 fw-medium text-secondary">Sipariş Adresi:</div>
                            <div class="col-8 text-muted" style="line-height: 1.4;">{{ orders[detailID].o_address }}</div>

                            <div class="col-4 fw-medium text-secondary">Toplam Tutar:</div>
                            <div class="col-8 text-success fw-bold">{{ Number(orders[detailID].o_amount || 0).toFixed(2) }} ₺</div>

                            <div class="col-4 fw-medium text-secondary">Sipariş Tarihi:</div>
                            <div class="col-8 text-dark">{{ orders[detailID].o_date }}</div>

                            <div class="col-4 fw-medium text-secondary">Durumu:</div>
                            <div class="col-8">
                                <span class="badge" :class="{
                                    'bg-warning-subtle text-warning border border-warning-subtle': orders[detailID].o_status === 'Hazırlanıyor',
                                    'bg-info-subtle text-info border border-info-subtle': orders[detailID].o_status === 'Kargoya Verildi',
                                    'bg-success-subtle text-success border border-success-subtle': orders[detailID].o_status === 'Teslim Edildi',
                                    'bg-danger-subtle text-danger border border-danger-subtle': orders[detailID].o_status === 'İptal Edildi'
                                }" style="font-size: 11px; font-weight: 500; padding: 4px 8px;">
                                    {{ orders[detailID].o_status }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AdminOrders',
    data() {
        return {
            orders: [],
            detailID: 0, // DÜZELTİLDİ: Tanımsız olan değişken buraya eklendi
            baseUrl: "http://localhost:3001"
        };
    },

    mounted() {
        this.getOrders();
    },

    methods: {
        // API: Tüm Siparişleri Çek (GET)
        async getOrders() {
            try {
                const res = await fetch(`${this.baseUrl}/api/orders`);
                if (!res.ok) throw new Error("Sipariş listesi çekilemedi.");
                this.orders = await res.json();
            } catch (e) {
                console.error("Sipariş çekme hatası:", e.message);
            }
        },

        // API: Sipariş Durumunu Güncelle (PUT) - Backend API şemasıyla tam senkronize
        async updateOrder(order) {
            try {
                const res = await fetch(`${this.baseUrl}/api/orders/${order.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        o_no: order.o_no,
                        o_amount: order.o_amount,
                        o_status: order.o_status // Backend'in beklediği parametreler gönderiliyor
                    })
                });

                if (!res.ok) throw new Error("Sipariş güncellenemedi.");
                
                alert("Sipariş başarıyla güncellendi.");
                this.getOrders(); // Güncel listeyi tekrar çek
            } catch (error) {
                console.error("Güncelleme Hatası:", error.message);
                alert("Hata: " + error.message);
            }
        },

        // API: Siparişi Sil (DELETE)
        async deleteOrder(id) {
            if (!confirm("Bu siparişi silmek istediğinize emin misiniz?")) return;
            try {
                const res = await fetch(`${this.baseUrl}/api/orders/${id}`, {
                    method: "DELETE"
                });
                if (!res.ok) throw new Error("Sipariş silinemedi.");
                
                alert("Sipariş silindi.");
                this.detailID = 0;
                this.getOrders();
            } catch (error) {
                console.error("Silme Hatası:", error.message);
            }
        },

        // Detay modal indeksini güncelleyen tetikleyici
        openDetails(index) {
            this.detailID = index;
        },

        // Yardımcı Fonksiyon: Çoklu ürün dizilerini temiz metne çevirir
        formatProducts(products) {
            if (!products) return "Ürün Bilgisi Yok";
            if (Array.isArray(products)) return products.join(", ");
            return products;
        }
    }
};
</script>

<style scoped>
/* Açılır kutuların Bootstrap odaklanma çizgisi */
.form-select:focus {
    border-color: #198754 !important;
    box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.15) !important;
}
</style>
