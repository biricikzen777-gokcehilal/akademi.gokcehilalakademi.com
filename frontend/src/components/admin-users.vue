<template>
    <h3>Kullanıcılar</h3>
    <button style="float: right;" type="button" class="btn-sm btn btn-outline-success" data-bs-toggle="modal"
        data-bs-target="#adduser">
        Kullanıcı Ekle
    </button>
    <table class="table table-striped">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Ad</th>
                <th scope="col">Soyad</th>
                <th scope="col">Email</th>
                <th scope="col">Telefon</th>
                <th scope="col">Parola</th>
                <th scope="col">İşlem</th>
                <th scope="col">Role</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user, index in users">
                <th scope="row">{{ index + 1 }}</th>
                <td><input class="form-control" type="text" v-model="user.u_firstName"> </td>
                <td><input class="form-control" type="text" v-model="user.u_lastName"> </td>
                <td><input class="form-control" type="text" v-model="user.u_email"> </td>
                <td><input class="form-control" type="text" v-model="user.u_tel"> </td>
                <td><input class="form-control" type="text" v-model="user.u_pass"> </td>
                <td>
                    <select class="form-select mb-4 mt-2" v-model="newUser[0].role" >
                        <option value=0>Kullanıcı</option>
                        <option value=1>Admin</option>
                    </select>
                </td>
                <td>
                    <button class="btn-sm btn btn-outline-primary" @click="updateUser(user.u_id, user.u_firstName, user.u_lastName, user.u_email, user.u_tel, user.u_pass)">Güncelle</button>
                    <button style="margin-left: 10px;" class="btn-sm btn btn-outline-danger"
                        @click="deleteUser(user.u_id)">Sil</button>
                </td>
            </tr>
        </tbody>
    </table>

    <!--! Kullanıcı ekle modal'ı -->
    <div class="modal fade" id="adduser" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Kullanıcı Ekle</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="addUser()">
                    <div class="modal-body row">
                        <div class="col-md-6 mb-2">
                            <label class="form-label mt-2">Ad*</label>
                            <input type="text" class="form-control" v-model="newUser[0].firstName" required>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label class="form-label">Soyad*</label>
                            <input type="text" class="form-control" v-model="newUser[0].lastName" required>
                        </div>

                        <div class="col-md-6 mb-2">
                            <label class="form-label mt-2">Email*</label>
                            <input type="email" class="form-control" v-model="newUser[0].email"
                                placeholder="example@hotmail.com" required>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label class="form-label mt-2">Telefon*</label>
                            <input type="tel" class="form-control" v-model="newUser[0].tel" placeholder="5xxxxxxxxx"
                                required>
                        </div>

                        <div class="col-md-12 mb-2">
                            <label class="form-label mt-2">Parola*</label>
                            <input type="password" class="form-control" v-model="newUser[0].pass" required>
                        </div>
                        <label>Role</label><br>
                        <select class="form-select mb-4 mt-2" v-model="newUser[0].role" >
                            <option value=0>Kullanıcı</option>
                            <option value=1>Admin</option>
                        </select>
                        <br>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success w-100" type="submit">Kullanıcı Ekle</button>
                        <span>{{ userMessage }}</span>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            users: [],
            newUser: [                    
                { firstName: "", lastName: "", email: "", tel: "", pass: "", repeatPass: "", check: true, role:0}
            ],
           
            userMessage: null,
            baseUrl: "http://localhost:3001"
        };
    },

    mounted() {
        this.getUsers()
    },

    watch: { },

    computed: { },

    methods: {

        // Userları çek
        async getUsers() {
            this.error = null;
            try {
                const res = await fetch(`${this.baseUrl}/api/users`);
                if (!res.ok) throw new Error("Users endpoint hatası");
                this.users = await res.json();
            } 
            catch (e) {
                this.error = e.message;
            }
        },

        //POST - Kullanıcı ekleme 
        async addUser() {
            try {
                const res = await fetch(`${this.baseUrl}/api/users`, { //istekte bulunduğumuz yer.
                    method: "POST", //POST isteğinde buluyoruz.
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({                      //istekle beraber neleri yolluyorsun?
                        firstName: this.newUser[0].firstName,
                        lastName: this.newUser[0].lastName,
                        email: this.newUser[0].email,
                        tel: this.newUser[0].tel,
                        pass: this.newUser[0].pass,
                        role: this.newUser[0].role,
                    })
                });
                if (!res.ok) throw new Error("addUser endpoint hatası");
                const data = await res.json();
                this.userMessage = data;

                this.getUsers(); //Ekleme işleminden sonra tekrardan verileri çek.
                this.newUser[0].firstName = "";
                this.newUser[0].lastName = "";
                this.newUser[0].email = "";
                this.newUser[0].tel = "";
                this.newUser[0].pass = "";
                this.newUser[0].role = "";
            }
            catch (e) {
                this.productMessage = e.message;
            }
        },

        //PUT - Kullanıcı güncelle 
        async updateUser(u_id, u_firstName, u_lastName, u_email, u_tel, u_pass, u_role) {
            try {
                const res = await fetch(`${this.baseUrl}/api/users/${u_id}`, { //istekte bulunduğumuz yer.
                    method: "PUT", //PUT isteğinde buluyoruz.
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ //istekle beraber neleri yolluyorsun?
                        firstName:u_firstName,
                        lastName:u_lastName,
                        email:u_email,
                        tel:u_tel,
                        pass:u_pass,
                        role:u_role,
                    })
                });
                if (!res.ok){
                    if(res.status==400) throw new Error("Hatalı veri");
                } 

                const data = await res.json();
                if(data) alert("Kullanıcı güncellendi.")
                this.getUsers(); //Güncelle işleminden sonra tekrardan verileri çek.
            }
            catch (error) {
                console.log(error.message);
            }
        },

        //DELETE - Kullanıcı sil 
        async deleteUser(id) {
            try {
                const res = await fetch(`${this.baseUrl}/api/users/${id}`, { //istekte bulunduğumuz yer.
                    method: "DELETE", //PUT isteğinde buluyoruz.
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (!res.ok) throw new Error(res.error);
                const data = await res.json();
                if(data) alert("Kullanıcı silindi.")
                this.getUsers(); //Güncelle işleminden sonra tekrardan verileri çek.
            }
            catch (error) {
                console.log(error);
            }
        },

     

    }
};
</script>

<style scoped></style>