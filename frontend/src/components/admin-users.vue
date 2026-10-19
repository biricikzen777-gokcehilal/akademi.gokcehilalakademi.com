<template>
    <div class="users container-fluid p-0 m-0" style="font-family: sans-serif;">
        <!-- ÜST BAŞLIK VE EKLEME BUTONU -->
        <div class="d-flex justify-content-between align-items-center mb-4 pt-3 px-3">
            <h4 class="fw-semibold text-dark m-0" style="font-size: 20px;">Kullanıcı Yönetimi</h4>
            <button type="button" class="btn btn-success btn-sm shadow-sm d-flex align-items-center gap-2 py-2 px-3" @click="openModal">
                <i class="bi bi-person-plus"></i> Yeni Kullanıcı Ekle
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
                            <button type="button" @click="closeModal" class="btn-close" style="font-size: 12px;" aria-label="Kapat"></button>
                        </div>
                        <form @submit.prevent="addUser">
                            <div class="p-3 bg-white" style="font-size: 13px;">
                                <div class="row g-3">
                                    <div class="col-6">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Ad*</label>
                                        <input type="text" class="form-control form-control-sm border-light-subtle shadow-none" v-model="newUser[0].firstName" required placeholder="Örn: Ahmet">
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Soyad*</label>
                                        <input type="text" class="form-control form-control-sm border-light-subtle shadow-none" v-model="newUser[0].lastName" required placeholder="Örn: Yılmaz">
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Email*</label>
                                        <input type="email" class="form-control form-control-sm border-light-subtle shadow-none" v-model="newUser[0].email" required placeholder="example@hotmail.com">
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Telefon*</label>
                                        <input type="tel" class="form-control form-control-sm border-light-subtle shadow-none" v-model="newUser[0].tel" required placeholder="5xxxxxxxxx">
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Parola*</label>
                                        <input type="password" class="form-control form-control-sm border-light-subtle shadow-none" v-model="newUser[0].pass" required placeholder="••••••••">
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label text-muted mb-1" style="font-weight: 400;">Rol*</label>
                                        <select class="form-select form-select-sm border-light-subtle shadow-none" v-model="newUser[0].role" required>
                                            <option :value="0">Kullanıcı</option>
                                            <option :value="1">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="border-top p-3 bg-light rounded-bottom-2 d-flex justify-content-end gap-2" style="font-size: 13px;">
                                <button type="button" class="btn btn-sm btn-light border border-light-subtle text-secondary py-1_5 px-3" @click="closeModal">Vazgeç</button>
                                <button type="submit" class="btn btn-sm btn-success py-1_5 px-3">Kullanıcıyı Kaydet</button>
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
        // GET - Kullanıcıları çek
        async getUsers() {
            try {
                const res = await fetch(`${this.baseUrl}/api/users`);
                if (!res.ok) throw new Error("Kullanıcı listesi çekilemedi.");
                this.users = await res.json();
            } catch (e) {
                console.error("GET Hatası:", e.message);
            }
        },
        // POST - Kullanıcı ekleme 
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
                
                if (!res.ok) throw new Error("Sunucu kullanıcıyı veritabanına ekleyemedi.");
                
                const data = await res.json();
                this.userMessage = data;

                this.isModalOpen = false;
                document.body.style.overflow = '';
                this.showSuccessToast = true;

                setTimeout(() => {
                    this.showSuccessToast = false;
                    this.resetForm();
                    this.getUsers();
                }, 3000);

            } catch (e) {
                alert("Kullanıcı eklenirken bir hata oluştu: " + e.message);
            }
        },
        // PUT - Kullanıcı güncelle 
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
                        role: Number(u_role),
                    })
                });

                if (!res.ok) {
                    if (res.status === 400) throw new Error("Hatalı veri girişi yapıldı.");
                    throw new Error("Güncelleme başarısız.");
                } 

                const data = await res.json();
                if (data) alert("Kullanıcı başarıyla güncellendi.");
                this.getUsers();
            } catch (error) {
                alert("Hata: " + error.message);
            }
        },
        // DELETE - Kullanıcı sil 
        async deleteUser(id) {
            if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
            try {
                const res = await fetch(`${this.baseUrl}/api/users/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (!res.ok) throw new Error("Silme işlemi başarısız.");
                
                const data = await res.json();
                if (data) alert("Kullanıcı silindi.");
                this.getUsers();
            } catch (error) {
                alert("Hata: " + error.message);
            }
        }
    }
};
</script>

<style scoped>
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
    z-index: 100000 !important;
}
.custom-modal-dialog {
    width: 100%;
    max-width: 500px;
    margin: 1.75rem;
}
.custom-modal-content {
    background: #ffffff;
    display: flex;
    flex-direction: column;
}
.form-control:focus, .form-select:focus {
    border-color: #198754 !important;
    box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.15) !important;
}
.custom-toast-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(1px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100100 !important;
}
.custom-toast-card {
    background: #ffffff;
    padding: 20px 35px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.toast-icon-wrapper {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
}
.toast-fade-enter-active, .toast-fade-leave-active {
    transition: all 0.25s ease;
}
.toast-fade-enter-from, .toast-fade-leave-to {
    opacity: 0;
    transform: scale(0.92);
}
</style>
