<template>
    <div class="users container-fluid p-0 m-0" style="font-family: sans-serif;">
        <!-- ÜST BAŞLIK VE EKLEME BUTONU -->
        <div class="d-flex justify-content-between align-items-center mb-4 pt-3 px-3">
            <h4 class="fw-semibold text-dark m-0" style="font-size: 20px;">Kullanıcı Yönetimi</h4>
            <button type="button" style="background-color: #008000;" class="btn btn-success btn-sm shadow-sm d-flex align-items-center gap-2 py-2 px-3" @click="openModal">
                <i class="bi bi-person-plus" ></i> Yeni Kullanıcı Ekle
            </button>
        </div>

        <!-- KULLANICI LİSTELEME TABLOSU -->
        <div class="card border border-light-subtle shadow-sm rounded-2 overflow-hidden mx-3 mb-3">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0 p-0 m-0" style="font-size: 13px;">
                    <thead class="table-light text-muted fw-normal">
                        <tr>
                            <th scope="col" class="fw-normal p-0 m-0 text-center" style="width: 60px;">ID</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 150px;">Adı</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 150px;">Soyadı</th>
                            <th scope="col" class="fw-normal p-0 m-0">E-posta</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 140px;">Telefon</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 140px;">Parola</th>
                            <th scope="col" class="fw-normal p-0 m-0" style="width: 130px;">Rol</th>
                            <th scope="col" class="text-end fw-normal p-0 m-0" style="width: 160px;">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in users" :key="user.u_id" class="p-0 m-0">
                            <th scope="row" class="text-secondary fw-normal p-0 m-0 text-center">#{{ index + 1 }}</th>
                            <td class="p-0 m-0">
                                <input class="form-control form-control-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0" style="font-size: 13px; height: 32px;" type="text" v-model="user.u_firstName">
                            </td>
                            <td class="p-0 m-0">
                                <input class="form-control form-control-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0" style="font-size: 13px; height: 32px;" type="text" v-model="user.u_lastName">
                            </td>
                            <td class="p-0 m-0">
                                <input class="form-control form-control-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0" style="font-size: 13px; height: 32px;" type="email" v-model="user.u_email">
                            </td>
                            <td class="p-0 m-0">
                                <input class="form-control form-control-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0" style="font-size: 13px; height: 32px;" type="text" v-model="user.u_tel">
                            </td>
                            <td class="p-0 m-0">
                                <input class="form-control form-control-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0" style="font-size: 13px; height: 32px;" type="text" v-model="user.u_pass">
                            </td>
                            <td class="p-0 m-0">
                                <select class="form-select form-select-sm border-light-subtle rounded-0 shadow-none py-1 px-1 m-0" style="font-size: 13px; height: 32px;" v-model="user.u_role">
                                    <option :value="0">Kullanıcı</option>
                                    <option :value="1">Admin</option>
                                </select>
                            </td>
                            <td class="text-end p-0 m-0">
                                <div class="d-inline-flex gap-1 me-1">
                                    <button @click="updateUser(user.u_id, user.u_firstName, user.u_lastName, user.u_email, user.u_tel, user.u_pass, user.u_role)"
                                        class="btn btn-sm btn-outline-primary py-0_5 px-2 rounded-1" style="font-size: 12px; height: 26px; line-height: 1;">
                                        <i class="bi bi-save"></i> Güncelle
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger py-0_5 px-2 rounded-1" style="font-size: 12px; height: 26px; line-height: 1;" @click="deleteUser(user.u_id)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="users.length === 0">
                            <td colspan="8" class="text-center text-muted py-3">Henüz kayıtlı bir kullanıcı bulunmuyor.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- TELEPORTLU KULLANICI EKLEME MODALI -->
        <Teleport to="body">
            <div v-if="isModalOpen" class="custom-modal-backdrop" @click.self="closeModal">
                <div class="custom-modal-dialog">
                    <div class="custom-modal-content border border-light-subtle rounded-2 shadow-lg">
                        <div class="custom-modal-header border-bottom p-3 d-flex justify-content-between align-items-center bg-light rounded-top-2">
                            <h5 class="m-0 text-dark fw-semibold" style="font-size: 15px;">Yeni Kullanıcı Ekle</h5>
                        </div>
                        <form @submit.prevent="addUser">
                            <div class="p-3 bg-white" style="font-size: 13px;">
                                <div class="row g-3">
                                    <!-- [0] Dizi ifadeleri tamamen temizlendi, doğrudan nesneye bağlandı -->
                                    <div class="col-6">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Ad*</label>
                                        <input type="text" class="form-control form-control-sm border-light-subtle shadow-none" v-model="newUser.firstName" required placeholder="Örn: Ahmet">
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Soyad*</label>
                                        <input type="text" class="form-control form-control-sm border-light-subtle shadow-none" v-model="newUser.lastName" required placeholder="Örn: Yılmaz">
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Email*</label>
                                        <input type="email" class="form-control form-control-sm border-light-subtle shadow-none" v-model="newUser.email" required placeholder="example@hotmail.com">
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Telefon*</label>
                                        <input type="tel" class="form-control form-control-sm border-light-subtle shadow-none" v-model="newUser.tel" required placeholder="5xxxxxxxxx">
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Parola*</label>
                                        <input type="password" class="form-control form-control-sm border-light-subtle shadow-none" v-model="newUser.pass" required placeholder="••••••••">
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Rol*</label>
                                        <select class="form-select form-select-sm border-light-subtle shadow-none" v-model="newUser.role" required>
                                            <option :value="0">Kullanıcı</option>
                                            <option :value="1">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="border-top p-3 bg-light rounded-bottom-2 d-flex justify-content-end gap-2" style="font-size: 13px;">
                                <button type="button" class="btn btn-sm btn-light border border-light-subtle text-secondary py-1_5 px-3" @click="closeModal">Vazgeç</button>
                                <button type="submit" style="background-color: #008000; color: white;" class="btn btn-sm py-1_5 px-3">Kullanıcıyı Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Teleport>
                <!-- BAŞARILI TOAST BİLDİRİMİ -->
        <Teleport to="body">
            <Transition name="toast-fade">
                <div v-if="showSuccessToast" class="custom-toast-overlay">
                    <div class="custom-toast-card border border-light-subtle rounded-2 shadow-lg">
                        <div class="toast-icon-wrapper bg-success text-white rounded-circle">
                            <i class="bi bi-check-lg"></i>
                        </div>
                        <h6 class="m-0 text-dark" style="font-size: 14px; font-weight: 500;">Kullanıcı Başarıyla Eklendi</h6>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script>
export default {
    name: 'AdminUsers',
    data() {
        return {
            isModalOpen: false,
            showSuccessToast: false,
            users: [],
            // v-model çakışmasını çözen, temiz nesne yapısı
            newUser: { 
                firstName: "", 
                lastName: "", 
                email: "", 
                tel: "", 
                pass: "", 
                role: 0 
            },
            userMessage: null,
            baseUrl: "http://localhost:3001"
        };
    },
    mounted() {
        this.getUsers();
    },
    methods: {
        openModal() {
            this.isModalOpen = true;
            document.body.style.overflow = 'hidden';
        },
        closeModal() {
            this.isModalOpen = false;
            document.body.style.overflow = '';
            this.resetForm();
        },
        resetForm() {
            this.newUser = { 
                firstName: "", 
                lastName: "", 
                email: "", 
                tel: "", 
                pass: "", 
                role: 0 
            };
            this.userMessage = null;
        },
        // GET - Veritabanındaki tüm kullanıcıları listelemek için çeker
        async getUsers() {
            try {
                const res = await fetch(`${this.baseUrl}/api/users`);
                if (!res.ok) throw new Error("Kullanıcı listesi çekilemedi.");
                this.users = await res.json();
            } catch (e) {
                console.error("GET Hatası:", e.message);
            }
        },
        // POST - Modaldaki formu doldurup yeni kullanıcı ekler
        async addUser() {
            try {
                const res = await fetch(`${this.baseUrl}/api/users`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        firstName: this.newUser.firstName,
                        lastName: this.newUser.lastName,
                        email: this.newUser.email,
                        tel: this.newUser.tel,
                        pass: this.newUser.pass,
                        role: Number(this.newUser.role),
                    })
                });
                
                if (!res.ok) throw new Error("Sunucu kullanıcıyı ekleyemedi.");
                
                const data = await res.json();
                this.userMessage = data;

                this.isModalOpen = false;
                document.body.style.overflow = '';
                this.showSuccessToast = true;

                setTimeout(() => {
                    this.showSuccessToast = false;
                    this.resetForm();
                    this.getUsers(); // Eklenen yeni kullanıcıyı tabloda göstermek için listeyi yeniler
                }, 1500);

            } catch (e) {
                alert("Kullanıcı eklenirken bir hata oluştu: " + e.message);
            }
        },
        // PUT - Tablo üzerindeki satır içi değişiklikleri kaydeder
        async updateUser(u_id, u_firstName, u_lastName, u_email, u_tel, u_pass, u_role) {
            try {
                const res = await fetch(`${this.baseUrl}/api/users/${u_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        firstName: u_firstName,
                        lastName: u_lastName,
                        email: u_email,
                        tel: u_tel,
                        pass: u_pass,
                        role: Number(u_role)
                    })
                });

                if (!res.ok) throw new Error("Sunucu kullanıcıyı güncelleyemedi.");
                alert("Kullanıcı başarıyla güncellendi!");
                this.getUsers();
            } catch (e) {
                console.error("PUT Hatası:", e.message);
                alert("Güncelleme başarısız: " + e.message);
            }
        },
        // DELETE - Seçilen kullanıcıyı ID parametresiyle veritabanından siler
        async deleteUser(u_id) {
            if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
            try {
                const res = await fetch(`${this.baseUrl}/api/users/${u_id}`, {
                    method: "DELETE"
                });

                if (!res.ok) throw new Error("Sunucu silme işlemini gerçekleştiremedi.");
                alert("Kullanıcı başarıyla silindi.");
                this.getUsers();
            } catch (e) {
                console.error("DELETE Hatası:", e.message);
                alert("Silme işlemi başarısız: " + e.message);
            }
        }
    }
};
</script>

<style scoped>
/* Modal yapısının ekranda ortalanmasını sağlayan özel CSS */
.custom-modal-backdrop {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex; align-items: center; justify-content: center;
    z-index: 1050;
}
.custom-modal-dialog { width: 100%; max-width: 500px; padding: 20px; }
.custom-modal-content { background: white; display: flex; flex-direction: column; }

/* Sağ üstte çıkan şık yeşil Toast bildiriminin yerleşimi */
.custom-toast-overlay {
    position: fixed;
    top: 20px; right: 20px;
    z-index: 1100;
}
.custom-toast-card {
    background: white; padding: 12px 20px;
    display: flex; align-items: center; gap: 12px;
}
.toast-icon-wrapper {
    width: 24px; height: 24px;
    display: flex; align-items: center; justify-content: center;
}
.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>


