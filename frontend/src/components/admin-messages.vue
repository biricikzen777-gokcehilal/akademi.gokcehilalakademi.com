<template>
    <div class="messages container-fluid p-0 m-0" style="font-family: sans-serif; position: relative;">
        <!-- ÜST BAŞLIK -->
        <div class="d-flex justify-content-between align-items-center mb-4 pt-3 px-3">
            <h4 class="fw-semibold text-dark m-0" style="font-size: 20px;">Gelen Mesajlar</h4>
        </div>

        <!-- MESAJ LİSTELEME TABLOSU -->
        <div class="card border border-light-subtle shadow-sm rounded-2 overflow-hidden mx-3 mb-3">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0" style="font-size: 13px; table-layout: fixed; width: 100%;">
                    <thead class="table-light text-muted fw-normal">
                        <tr>
                            <th scope="col" class="fw-normal text-center py-2" style="width: 50px;">ID</th>
                            <th scope="col" class="fw-normal py-2" style="width: 120px;">Adı Soyadı</th>
                            <th scope="col" class="fw-normal py-2" style="width: 140px;">E-posta</th>
                            <th scope="col" class="fw-normal py-2" style="width: 120px;">Telefon</th>
                            <th scope="col" class="fw-normal py-2" style="width: 100px;">Konu</th>
                            <!-- Mesaj sütunu genişletildi -->
                            <th scope="col" class="fw-normal py-2">Mesaj</th>
                            <th scope="col" class="fw-normal py-2" style="width: 90px;">Tarih</th>
                            <!-- Durum sütunu 5px genişletildi -->
                            <th scope="col" class="fw-normal py-2" style="width: 135px;">Durum</th>
                            <!-- İşlemler alanı sağa kaydırıldı -->
                            <th scope="col" class="text-end fw-normal py-2 pe-3" style="width: 210px;">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(message, index) in messages" :key="message.m_id">
                            <th scope="row" class="text-secondary fw-normal text-center">#{{ index + 1 }}</th>
                            <td class="text-dark fw-medium text-truncate">{{ message.m_firstName }} {{ message.m_lastName }}</td>
                            <td class="text-secondary text-truncate">{{ message.m_email }}</td>
                            
                            <!-- DÜZELTME: Telefonun önündeki boş parantezler tamamen temizlendi -->
                            <td class="text-secondary text-nowrap">
                                <span v-if="message.m_code" class="text-muted" style="font-size: 11px;">({{ message.m_code }}) </span>{{ message.m_tel }}
                            </td>
                            
                            <td class="text-dark fw-medium text-truncate">{{ message.m_subject }}</td>
                            
                            <!-- Mesaj Alanı -->
                            <td class="text-secondary">
                                <div class="mesaj-hucre-siniri">
                                    {{ message.m_message }}
                                </div>
                            </td>
                            
                            <td class="text-muted text-nowrap">{{ message.m_created_at ? message.m_created_at.split("T")[0] : '-' }}</td>
                            <td>
                                <!-- DÜZELTME: Genişletilmiş ve ok işareti rahatlatılmış Durum alanı -->
                                <select 
                                    class="form-select form-select-sm border-light-subtle rounded-1 shadow-none py-1 pe-4 ps-2 m-0 fw-medium" 
                                    style="font-size: 13px; height: 32px; width: 100%;" 
                                    :class="message.m_status == 0 ? 'text-danger' : 'text-success'" 
                                    v-model="message.m_status">
                                    <option :value="0" class="text-danger fw-normal">Yanıtlanmadı</option>
                                    <option :value="1" class="text-success fw-normal">Yanıtlandı</option>
                                </select>
                            </td>
                            
                            <!-- DÜZELTME: Sağa yaslanan ve buton genişliği artırılmış işlemler alanı -->
                                                       <!-- GÜNCELLENMİŞ BUTON TASARIMLARI -->
                            <td class="text-end pe-3">
                                <div class="d-inline-flex gap-1.5 align-items-center">
                                    <!-- GÜNCELLE BUTONU (Satır Formatı) -->
                                    <button @click="updateMessage(message.m_id, message.m_status)"
                                        class="btn btn-sm btn-outline-primary py-1 px-2_5 rounded-1 fw-medium d-inline-flex align-items-center justify-content-center" 
                                        style="font-size: 12px; height: 28px; min-width: 85px;">
                                        <i class="bi bi-save me-1"></i>Güncelle
                                    </button>
                                    
                                    <!-- YANITLA BUTONU (Satır Formatı) -->
                                    <a :href="`mailto:${message.m_email}?subject=Re: ${message.m_subject}`" 
                                       class="btn btn-sm btn-outline-success d-inline-flex align-items-center justify-content-center py-1 px-2_5 rounded-1 fw-medium" 
                                       style="font-size: 12px; height: 28px; min-width: 75px; text-decoration: none;">
                                        <i class="bi bi-reply-fill me-1"></i>Yanıtla
                                    </a>
                                    
                                    <!-- SİL BUTONU (Gönderdiğiniz Görseldeki Kare Format) -->
                                    <button class="btn btn-sm btn-outline-danger d-inline-flex align-items-center justify-content-center rounded-1 sil-kare-btn" 
                                        style="height: 28px; width: 28px; padding: 0;" 
                                        @click="deleteMessage(message.m_id)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>

                        </tr>
                        <tr v-if="messages.length === 0">
                            <td colspan="9" class="text-center text-muted py-3">Henüz gelen bir mesaj bulunmuyor.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 1. GÜNCELLENDİ BİLDİRİMİ -->
        <Teleport to="body">
            <Transition name="toast-fade">
                <div v-if="showUpdateToast" class="custom-toast-overlay">
                    <div class="custom-toast-card border border-light-subtle rounded-4 shadow-lg">
                        <div class="toast-icon-wrapper bg-primary text-white rounded-circle">
                            <i class="bi bi-arrow-clockwise"></i>
                        </div>
                        <h6 class="toast-text">Durum Güncellendi</h6>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- 2. SİLİNDİ BİLDİRİMİ -->
        <Teleport to="body">
            <Transition name="toast-fade">
                <div v-if="showDeleteToast" class="custom-toast-overlay">
                    <div class="custom-toast-card border border-light-subtle rounded-4 shadow-lg">
                        <div class="toast-icon-wrapper bg-danger text-white rounded-circle">
                            <i class="bi bi-trash3"></i>
                        </div>
                        <h6 class="toast-text">Mesaj Silindi</h6>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- 3. SİLME ONAY MODALI -->
        <Teleport to="body">
            <Transition name="toast-fade">
                <div v-if="showConfirmModal" class="custom-toast-overlay-confirm">
                    <div class="custom-toast-backdrop-dark" @click="cancelDelete"></div>
                    <div class="custom-toast-card border border-light-subtle rounded-4 shadow-lg dynamic-confirm-box horizontal-wide-confirm">
                        <div class="toast-icon-wrapper bg-warning text-dark rounded-circle">
                            <i class="bi bi-exclamation-triangle"></i>
                        </div>
                        <h6 class="toast-text px-2">Bu mesajı silmek istediğinize emin misiniz?</h6>
                        <div class="d-flex gap-2 w-100 mt-2 px-3">
                            <button @click="cancelDelete" class="btn btn-sm btn-light border w-50 py-1_5 fw-semibold" style="font-size: 13px; border-radius: 5px;">Vazgeç</button>
                            <button @click="confirmDelete" class="btn btn-sm btn-danger w-50 py-1_5 fw-semibold" style="font-size: 13px; border-radius: 5px;">Sil</button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script>
export default {
    name: 'AdminMessages',
    data() {
        return {
            messages: [],
            baseUrl: "http://localhost:3001",
            showUpdateToast: false,
            showDeleteToast: false,
            showConfirmModal: false,
            pendingDeleteId: null
        };
    },
    mounted() {
        this.getMessages();
    },
    methods: {
        async getMessages() {
            try {
                const res = await fetch(`${this.baseUrl}/api/messages`);
                if (!res.ok) throw new Error("Mesaj listesi çekilemedi.");
                this.messages = await res.json();
            } catch (e) {
                console.error("GET Hatası:", e.message);
            }
        },
        async updateMessage(m_id, m_status) {
            try {
                const res = await fetch(`${this.baseUrl}/api/messages/${m_id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: Number(m_status) })
                });
                if (!res.ok) throw new Error("Güncelleme başarısız.");
                
                this.showUpdateToast = true;
                this.getMessages();
                setTimeout(() => { this.showUpdateToast = false; }, 2500);
            } catch (error) {
                console.error("Hata:", error.message);
            }
        },
        deleteMessage(m_id) {
            this.pendingDeleteId = m_id;
            this.showConfirmModal = true;
            document.body.style.overflow = 'hidden';
        },
        async confirmDelete() {
            if (!this.pendingDeleteId) return;
            try {
                const res = await fetch(`${this.baseUrl}/api/messages/${this.pendingDeleteId}`, {
                    method: "DELETE"
                });
                if (!res.ok) throw new Error("Silme işlemi başarısız.");
                
                this.showConfirmModal = false;
                document.body.style.overflow = '';
                this.showDeleteToast = true;
                this.getMessages();
                setTimeout(() => {
                    this.showDeleteToast = false;
                    this.pendingDeleteId = null;
                }, 2500);
            } catch (error) {
                console.error("Hata:", error.message);
                this.cancelDelete();
            }
        },
        cancelDelete() {
            this.showConfirmModal = false;
            this.pendingDeleteId = null;
            document.body.style.overflow = '';
        }
    }
};
</script>

<style scoped>
.form-select:focus {
    border-color: #198754 !important;
    box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.15) !important;
}

/* Buton genişliği için ekstra iç boşluk sınıfı */
.px-2_5 {
    padding-left: 0.65rem !important;
    padding-right: 0.65rem !important;
}

/* Mesaj alanının taşmasını önleyen kurallar */
.mesaj-hucre-siniri {
    max-height: 50px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word !important; 
    overflow-wrap: break-word !important;
    line-height: 1.4;
    padding: 2px 0;
}

/* Mesaj hücresindeki özel kaydırma çubuğu tasarımı */
.mesaj-hucre-siniri::-webkit-scrollbar {
    width: 4px;
}
.mesaj-hucre-siniri::-webkit-scrollbar-track {
    background: #f1f1f1;
}
.mesaj-hucre-siniri::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;
}

/* --- KARE FORMATLI TOAST VE MODAL CSS STİLLERİ --- */
.custom-toast-overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99999;
    pointer-events: none;
}

.custom-toast-overlay-confirm {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
}

.custom-toast-card {
    background-color: #ffffff;
    width: 200px;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    padding: 1.5rem;
    pointer-events: auto;
    box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.15) !important;
}

.horizontal-wide-confirm {
    width: 280px !important; 
    height: 230px !important; 
    padding: 1.25rem 0.5rem !important;
}

.dynamic-confirm-box {
    position: relative;
    z-index: 100000;
    gap: 0.8rem;
}

.toast-icon-wrapper {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50% !important;
}

.toast-icon-wrapper i {
    font-size: 2rem;
}

.toast-text {
    margin: 0;
    color: #212529;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    line-height: 1.5;
    letter-spacing: -0.2px;
}

.custom-toast-backdrop-dark {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 9999;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-fade-enter-from,
.toast-fade-leave-to {
    opacity: 0;
    transform: scale(0.8);
}
/* Güncelle ve Yanıtla butonlarının dolgun iç boşluğu */
.px-2_5 {
    padding-left: 0.65rem !important;
    padding-right: 0.65rem !important;
}

/* Gönderdiğiniz görselle birebir eşleşen kare silme butonu stili */
.sil-kare-btn {
    min-width: 28px !important;
    max-width: 28px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.sil-kare-btn i {
    font-size: 13px !important;
    line-height: 1 !important;
}

/* Butonlar arası ideal dikey-yatay hizalama dengesi */
.gap-1\.5 {
    gap: 0.35rem !important;
}

</style>
