<template>
    <h3>Mesajlar</h3>
    
    <table class="table table-striped mt-4">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Ad</th>
                <th scope="col">Soyad</th>
                <th scope="col">Email</th>
                <th scope="col">Ülke Kodu</th>
                <th scope="col">Telefon</th>
                <th scope="col">Konu</th>
                <th scope="col">Mesaj</th>
                <th scope="col">Tarih</th>
                <th scope="col">Durum</th>
                <th scope="col">İşlem</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="message, index in messages">
                <th><label {{index + 1}}></label></th>
                <td><label {{message.m_firstName}}{{message.m_lastName}}>></label></td>
                <td><label {{message.m_email}}></label></td>
                <td><label {{message.m_code}}{{message.m_tel}}></label></td>
                <td><label {{message.m_subject}}></label></td>
                <td><label {{message.m_message}}></label></td>
                <td><label {{message.m_created_at}}></label></td>   
                <!-- <td><label {{message.m_created_at.split("T")[0] }}></label></td>   //! Kontrol et -->
                <td>
                    <select :style="message.m_status == 0 ? 'color:red' : 'color:green' " class="form-selection" v-model="m_status" >
                        <option style="color:black" value="0">Yanıtlanmadı</option>
                        <option style="color:black" value="1">Yanıtlandı</option>
                    </select>
                </td>
                <td>
                    <button style="margin-left: 10px;" class="btn-sm btn btn-outline-primary" @click="updateMessageMessage(message.m_id,message.m_status)">Güncelle</button>
                    <button class="btn-sm btn btn-outline-primary" @click=""><a :href="`mailto:${message.m_email}`" style="margin-right: 10px;" class="btn-sm btn btn-outline-success">Yanıtla</a></button>
                    <button style="margin-left: 10px;" class="btn-sm btn btn-outline-danger" @click="deleteMessage(message.m_id)">Sil</button>
                </td>
            </tr>
        </tbody>
    </table>
    
</template>


<script>
export default {
    data() {
        return {
            detailId: 0,
            messages: [],
            baseUrl: "http://localhost:3001"
            // error: null
        };
    },

    mounted() {
        this.getMessages()
    },

    watch: {

    },

    computed: {

    },

    methods: {

        // GET - Mesaj listele
        async getMessages() {
            this.error = null;
            try {
                const res = await fetch(`${this.baseUrl}/api/messages`);
                if (!res.ok) throw new Error("Messages endpoint hatası");
                this.messages = await res.json();
            } catch (e) {
                this.error = e.message;
            }
        },

        // POST - Mesaj ekleme 
        async addMessage() {
            try {
                const res = await fetch(`${this.baseUrl}/api/messages`, { //istekte bulunduğumuz yer.
                    method: "POST", //POST isteğinde buluyoruz.
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ //istekle beraber neleri yolluyorsun?
                        firstName: this.newmessage[0].m_firstName,
                        lastName: this.newMessage[0].m_lastName,
                        subject: this.newMessage[0].m_subject,
                        message: this.newMessage[0].m_message,
                        created_at: this.newMessage[0].created_at,
                    })
                });
                if (!res.ok) throw new Error("addMessage endpoint hatası");
                const data = await res.json();
                this.messagesMessage = data;

                this.getUsers(); //Ekleme işleminden sonra tekrardan verileri çek.
                this.newUser[0].m_firstName = "";
                this.newUser[0].m_lastName = "";
                this.newUser[0].m_subject = "";
                this.newUser[0].m_message = "";
                this.newUser[0].m_created_at = "";
            }
            catch (e) {
                this.productMessage = e.message;
            }
        },

        // PUT - Mesaj güncelle 
        async updateMessage(m_id, m_status) {
            try {
                const res = await fetch(`${this.baseUrl}/api/messages/${m_id}`, { //istekte bulunduğumuz yer.
                    method: "PUT", //PUT isteğinde buluyoruz.
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ //istekle beraber neleri yolluyorsun?
                        status: m_status,
                    })
                });
                if (!res.ok){
                    if(res.status==400) throw new Error("updateMessage endpoint hatası.");
                } 

                const data = await res.json();
                if(data) alert("Mesaj güncellendi.")
                this.getMessages(); //Güncelle işleminden sonra tekrardan verileri çek.
            }
            catch (error) {
                console.log(error.message);
            }
        },

        // DELETE - Mesaj sil 
        async deleteMessage(m_id) {
            try {
                const res = await fetch(`${this.baseUrl}/api/messages/${m_id}`, { //istekte bulunduğumuz yer.
                    method: "DELETE", //PUT isteğinde buluyoruz.
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (!res.ok) throw new Error(res.error);
                
                const data = await res.json();
                if(data) alert(data)

                this.getMessages(); //Güncelle işleminden sonra tekrardan verileri çek.
            }
            catch (error) {
                console.log(error);
            }
        },
    }
};
</script>

<style scoped></style>