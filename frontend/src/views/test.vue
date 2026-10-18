<template>
    <h1>Test 2 sayfamız</h1>
    <div style="font-family: Arial; padding: 20px;">

        <h2>Vue + Node.js Basit Örnek</h2>
        <!--! buttonlara tıklanınca methodlar çağırılıp istek atıyoruz.  -->
        <button @click="getHello()" style="margin-right: 10px;">Hello çağır</button>
        <button @click="getProducts()">Öğrencileri çek</button>

        <!--! eğer hello'da değer varsa(true döner) burası gözükür hale gelir.  -->
        <p v-if="hello" style="margin-top: 16px;">
            <b>Backend mesajı:</b> {{ hello.message }} <br />
            <b>Zaman:</b> {{ hello.time }}
        </p>


        <h3 style="margin-top: 24px;">Ürünler</h3>
        <!--! Öğrencileri listeliyoruz.  -->
        <ul>
            <li v-for="p in products" :key="p.id">
                {{ p.id }} - {{ p.name }} - {{  p.stock }} - {{ p.price }} - {{ p.price * 1.2 }}
            </li>
        </ul>
        <!--! eğer error değeri doluysa burası gözükür.  -->
        <p v-if="error" style="color: red;"><b>Hata:</b> {{ error }}</p>
    </div>

</template>


<script>
export default {
    data() {
        return {
            hello: null,
            products: [],
            error: null,
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

        //! async eklememizin nedeni içeride await kullandığımız için.  
        async getHello() {
            this.error = null;
            //! try içerisinde hata olursa catch kısmına atar. Bunu hata ayıklamada ve isteklerde hep kullanırız. 
            try {
                //! get isteğinde bulunduk. gelen cevabı(response) res değişkenine attık.
                const res = await fetch(`${this.baseUrl}/api/hello`);
                //! Eğer res değeri yoksa catch e fırlat. Hello endpoint hatası değeriyle. 
                if (!res.ok) throw new Error("Hello endpoint hatası");
                // gelen cevabı hello değişkenimize attık.
                this.hello = await res.json();
            } catch (e) {
                this.error = e.message;
            }
        },
        
        async getProducts() {
            this.error = null;
            try {
                const res = await fetch(`${this.baseUrl}/api/products`);
                if (!res.ok) throw new Error("Products endpoint hatası");
                this.products = await res.json();
            } catch (e) {
                this.error = e.message;
            }
        }
    }
};
</script>


<style scoped></style>