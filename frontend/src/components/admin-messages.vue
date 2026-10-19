<template>
    <div class="messages container-fluid p-0 m-0" style="font-family: sans-serif;">
        <!-- ÜST BAŞLIK -->
        <div class="d-flex justify-content-between align-items-center mb-4 pt-3 px-3">
            <h4 class="fw-semibold text-dark m-0" style="font-size: 20px;">Gelen Mesajlar</h4>
        </div>

        <!-- MESAJ LİSTELEME TABLOSU -->
        <div class="card border border-light-subtle shadow-sm rounded-2 overflow-hidden mx-3 mb-3">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0 p-0 m-0" style="font-size: 13px;">
                    <thead class="table-light text-muted fw-normal">
                        <tr>
                            <th scope="col" class="fw-normal p-0 m-0 text-center" style="width: 60px;">ID</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 140px;">Adı Soyadı</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 160px;">E-posta</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 130px;">Telefon</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 130px;">Konu</th>
                            <th scope="col" class="fw-normal p-0 m-0">Mesaj</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 100px;">Tarih</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 140px;">Durum</th>
                            <th scope="col" class="text-end fw-normal p-0 m-0" style="width: 220px;">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(message, index) in messages" :key="message.m_id" class="p-0 m-0">
                            <th scope="row" class="text-secondary fw-normal p-0 m-0 text-center">#{{ index + 1 }}</th>
                            <td class="p-0 m-0 text-dark fw-medium ps-1">
                                {{ message.m_firstName }} {{ message.m_lastName }}
                            </td>
                            <td class="p-0 m-0 text-secondary ps-1">
                                {{ message.m_email }}
                            </td>
                            <td class="p-0 m-0 text-secondary ps-1">
                                <span class="text-muted" style="font-size: 11px;">({{ message.m_code }})</span> {{ message.m_tel }}
                            </td>
                            <td class="p-0 m-0 text-dark ps-1 fw-medium">
                                {{ message.m_subject }}
                            </td>
                            <td class="p-0 m-0 text-secondary ps-1">
                                <div style="max-height: 45px; overflow-y: auto; white-space: pre-wrap; line-height: 1.3; padding: 4px 0;">
                                    {{ message.m_message }}
                                </div>
                            </td>
                            <td class="p-0 m-0 text-muted ps-1">
                                {{ message.m_created_at ? message.m_created_at.split("T")[0] : '-' }}
                            </td>
                            <td class="p-0 m-0">
                                <select 
                                    class="form-select form-select-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0 fw-medium" 
                                    style="font-size: 13px; height: 32px;" 
                                    :class="message.m_status == 0 ? 'text-danger' : 'text-success'" 
                                    v-model="message.m_status">
                                    <option :value="0" class="text-danger fw-normal">Yanıtlanmadı</option>
                                    <option :value="1" class="text-success fw-normal">Yanıtlandı</option>
                                </select>
                            </td>
                            <td class="text-end p-0 m-0">
                                <div class="d-inline-flex gap-1 me-1">
                                    <!-- GÜNCELLE BUTONU -->
                                    <button @click="updateMessage(message.m_id, message.m_status)"
                                        class="btn btn-sm btn-outline-primary py-0_5 px-2 rounded-1" style="font-size: 12px; height: 26px; line-height: 1;">
                                        <i class="bi bi-save"></i> Güncelle
                                    </button>
                                    <!-- YANITLA MOUSE/MAILTO BUTONU -->
                                    <a :href="`mailto:${message.m_email}?subject=Re: ${message.m_subject}`" 
                                       class="btn btn-sm btn-outline-success d-inline-flex align-items-center justify-content-center py-0_5 px-2 rounded-1" 
                                       style="font-size: 12px; height: 26px; line-height: 1; text-decoration: none;">
                                        <i class="bi bi-reply-fill me-1"></i> Yanıtla
                                    </a>
                                    <!-- SİL BUTONU -->
                                    <button class="btn btn-sm btn-outline-danger py-0_5 px-2 rounded-1" style="font-size: 12px; height: 26px; line-height: 1;" @click="deleteMessage(message.m_id)">
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
    </div>
</template>

<script>
export default {
    name: 'AdminMessages',
    data() {
        return {
            detailId: 0,
            messages: [],
            baseUrl: "http://localhost:3001"
        };
    },
    mounted() {
        this.getMessages();
    },
    methods: {
        // GET - Mesaj listele
        async getMessages() {
            try {
                const res = await fetch(`${this.baseUrl}/api/messages`);
                if (!res.ok) throw new Error("Mesaj listesi çekilemedi.");
                this.messages = await res.json();
            } catch (e) {
                console.error("GET Hatası:", e.message);
            }
        },
        // POST - Mesaj ekleme (Gerekirse kullanılabilir)
        async addMessage() {
            try {
                const res = await fetch(`${this.baseUrl}/api/messages`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        firstName: this.newMessage[0].m_firstName,
                        lastName: this.newMessage[0].m_lastName,
                        subject: this.newMessage[0].m_subject,
                        message: this.newMessage[0].m_message,
                        created_at: this.newMessage[0].created_at,
                    })
                });
                if (!res.ok) throw new Error("Mesaj eklenirken bir hata oluştu.");
                this.getMessages();
            } catch (e) {
                console.error(e.message);
            }
        },
        // PUT - Mesaj güncelle 
        async updateMessage(m_id, m_status) {
            try {
                const res = await fetch(`${this.baseUrl}/api/messages/${m_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: Number(m_status)
                    })
                });

                if (!res.ok) {
                    if (res.status === 400) throw new Error("Hatalı veri girişi.");
                    throw new Error("Güncelleme işlemi başarısız.");
                }

                const data = await res.json();
                if (data) alert("Mesaj durumu başarıyla güncellendi.");
                this.getMessages();
            } catch (error) {
                alert("Hata: " + error.message);
            }
        },
        // DELETE - Mesaj sil 
        async deleteMessage(m_id) {
            if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
            try {
                const res = await fetch(`${this.baseUrl}/api/messages/${m_id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (!res.ok) throw new Error("Silme işlemi başarısız.");
                
                const data = await res.json();
                if (data) alert("Mesaj silindi.");
                this.getMessages();
            } catch (error) {
                alert("Hata: " + error.message);
            }
        }
    }
};
</script>

<style scoped>
.form-select:focus {
    border-color: #198754 !important;
    box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.15) !important;
}

/* Mesaj hücresindeki özel kaydırma çubuğu tasarımı */
div::-webkit-scrollbar {
    width: 4px;
}
div::-webkit-scrollbar-track {
    background: #f1f1f1;
}
div::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;
}
div::-webkit-scrollbar-thumb:hover {
    background: #aaa;
}
</style>
