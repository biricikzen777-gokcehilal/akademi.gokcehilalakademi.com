<template>

    <div>
        <h1>Ürün Sayfam</h1>
        <!-- ! Ürün Kartları  -->
        <div class="row">

            <div class="col-3 mt-3" v-for="(product, index) in products" :key="product.p_id">
                <div class="card h-100">
                    <!-- src niteliğini :src yaparak dinamik hale getirdik -->
                    <img :src="product.p_image || 'https://placeholder.com'" class="card-img-top" :alt="product.p_name">
                    <div class="card-body">
                        <h5 class="card-title">{{ product.p_name }}</h5>
                        <p class="card-text">Stok: {{ product.p_stock }} adet</p>
                        <p class="card-text">Fiyat: {{ product.p_price }}₺</p>
                        <button v-if="product.p_stock" @click="addCart(product.p_id)"
                            class="btn btn-success w-100">Sepete Ekle</button>
                        <button v-else class="btn btn-secondary w-100" disabled>Stok Yok</button>
                    </div>
                </div>
            </div>



        </div>


    </div>
</template>

<script>
export default {
    inject: ['sepet'],

    data() {
        return {
            products: [],
            baseUrl: "http://localhost:3001"
        };
    },

    mounted() {
        this.getProducts();
    },

    watch: {

    },

    // Ürünler sayfanızın (Product.vue) içerisine eklenecek filtreleme mantığı:
    computed: {
        // Ekrana v-for ile basacağınız ürün listesini bu computed fonksiyona bağlayın
        filteredProducts() {
            // URL'deki (?q=...) arama parametresini veya tetiklenen küresel arama terimini okur
            const searchQuery = (this.$route.query.q || "").toLowerCase().trim();

            if (!searchQuery) {
                return this.products; // Eğer arama yapılmadıysa tüm ürünleri ham listeler
            }

            // Ürün adı, açıklaması veya kategorisinde aranan kelime geçenleri süzer
            return this.products.filter(product => {
                return product.name.toLowerCase().includes(searchQuery) ||
                    (product.description && product.description.toLowerCase().includes(searchQuery));
            });
        }
    },


    methods: {
        async getProducts() {
            try {
                const res = await fetch(`${this.baseUrl}/api/productsPage`);
                if (!res.ok) throw new Error("Products endpoint hatası.");
                this.products = await res.json();
            }
            catch (e) {
                console.log(e.message);
            }
        },

        addCart(id) {

            //products'ın gelen id sini sepete pushla.
            this.sepet.push(this.products.find(product => product.p_id == id))
            alert("Sepete Eklendi")
        }
    }
};

</script>

<style scoped></style>