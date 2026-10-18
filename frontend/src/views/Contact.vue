<template>

        <!--! Contact-İçerik -->
        <h1 style="text-align: center; margin-top: 50px;">Bize Mesaj Gönderin!</h1>
        <div class="row mt-5">
            <div class="col-md-6">
                <!--! Contact-Form  -->
                <form class="row g-3" @submit.prevent="sendMessage()">
                    <div class="col-md-6">
                        <label class="form-label">Ad*</label>
                        <input v-model="newMessage[0].firstName" type="text" class="form-control" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Soyad*</label>
                        <input v-model="newMessage[0].lastName" type="text" class="form-control" required>
                    </div>

                    <div class="col-md-5">
                        <label  class="form-label">Email*</label>
                        <input v-model="newMessage[0].email" type="email" class="form-control"
                            placeholder="example@hotmail.com" required>
                    </div>
                    
                    <div class="col-md-3">
                        <label class="form-label">Ülke*</label>
                        <select v-model="newMessage[0].code" class="form-select" required>
                            <option value="+90" selected>TR (+90)</option>
                            <option value="+971">BAE (+971)</option>
                            <option value="+34">ES (+34)</option>
                        </select>
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Telefon*</label>
                        <input v-model="newMessage[0].tel" type="tel" class="form-control" 
                            required>
                        <div id="contact_tel_sonuc">
                            
                        </div>
                    </div>

                    <div class="col-md-3">
                        <label class="form-label">Konu*</label>
                        <select v-model="newMessage[0].subject" class="form-select" required>
                            <option value="Teşekkür" selected>Teşekkür</option>
                            <option value="Şikayet">Şikayet</option>
                            <option value="Öneri">Öneri</option>
                        </select>
                    </div>

                    <div class="col-md-9">
                        <label class="form-label">Mesaj*</label>
                        <textarea v-model="newMessage[0].message" class="form-control" rows="3" required></textarea>
                       
                    </div>

                    <div class="col-12">
                        <div class="form-check">
                            <input v-model="newMessage[0].check" class="form-check-input " type="checkbox" required>
                            <label class="form-check-label">
                                Bilgilerimin doğruluğunu onaylıyorum.
                            </label>
                           
                        </div>
                    </div>
                    <div v-if="status!='isleniyor'" class="col-12">
                        <button class="btn w-100 btn-success" type="submit" >Gönder</button>
                    </div>
                </form>
            </div>

            

            <!-- ! Google Map -->
            <div class="col-md-6">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.747303461633!2d28.896969900000002!3d41.0089038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cabbbc0bff6f61%3A0xa7eb38abd6daa152!2sUNITYVERSE%20ACADEMY!5e0!3m2!1str!2str!4v1774789842170!5m2!1str!2str"
                    width="100%" height="400" style="border:0;" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>

            <!-- ! Mesaj Status -->
             <div class="row">

                <!--? Gönderildi -->
                <div v-if="status==basarili" class="alert col-6 alert-success alert-dismissible fade show" role="alert">
                     <strong>Mesaj gönderildi!</strong> You should check in on some of those fields below.
                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>

                <!--? Gönderilemedi -->
                <div v-if="status==basarisiz" class="alert col-6 alert-danger alert-dismissible fade show" role="alert">
                     <strong>Mesaj gönderildi!</strong> You should check in on some of those fields below.
                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
             </div>
            
        </div>

</template>

<script>
export default {
    inject: ['products','sepet'],
    data() {
        return {
            newMessage: [
                {firstName: "", lastName: "", email: "", code: "+90", tel: "", subject: "", message: "", check: false}
            ],

           status: "",
           baseUrl: "http://localhost:3001"
        };
    },

    mounted() {
        
    },

    watch: {

    },

    computed: {

    },

    methods: {

        //! POST - Mesaj Gönder
        async sendMessage() {
            try {
                const res = await fetch('${this.baseUrl}/api/contact', {
                   method: "POST", //POST isteğinde bulunuyoruz 
                   headers: {
                    "Content-Type": "application/json"
                   },
                   body: JSON.stringify({ // istekle beraber neleri yolluyoruz?
                        firstName: this.newMessage[0].firstName, 
                        lastName: this.newMessage[0].lastName, 
                        email: this.newMessage[0].email, 
                        code: this.newMessage[0].code, 
                        tel: this.newMessage[0].tel,
                        subject: this.newMessage[0].subject, 
                        message: this.newMessage[0].message, 
                   })
                });
                if (!res.ok) throw new Error("Contact endpoint hatası!")
                const data = await res.json();
                
                // if(data) this.status="basarili";
                // else this.status="basarisiz";

                this.status=data; // server.js ten gelen res değerini buraya ata. 
                // server.js ten basarili veya basarisiz değerlerini döndürüyoruz.
                this.newMessage[0].firstName=""; 
                this.newMessage[0].lastName="";
                this.newMessage[0].email="";
                this.newMessage[0].code="+90"; 
                this.newMessage[0].tel="";
                this.newMessage[0].subject="Teşekkür"; 
                this.newMessage[0].message="";
                this.newMessage[0].check="false";     
            }
            catch (e) {
                console.log(e.message);
            }
        },
    }
};

</script>

<style scoped>

/* Checkbox seçildiğinde arka planı Bootstrap yeşili yapar */
.form-check-input:checked {
    background-color: #198754; /* Bootstrap success (yeşil) rengi */
    border-color: #198754;
}

</style>