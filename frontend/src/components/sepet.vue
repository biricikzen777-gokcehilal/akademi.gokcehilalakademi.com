<template>
    <div>

        <div class="sepet-icon" style="border-color: green;">
            <a data-bs-toggle="offcanvas" href="#sepetBar"><i style="color: gray;" class="bi bi-cart fs-2"></i></a>

        </div>

        <!-- !sepet side bar -->
        <div class="offcanvas offcanvas-end" tabindex="-1" id="sepetBar">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title">Sepet</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="row mb-3">
                    <div class="col-8"><b>ürün adı</b></div>
                    <div class="col-4"><b>Fiyat</b></div>
                </div>
                <div class="row" v-for="value, index in sepet">
                    <div class="col-8">{{ value.name }}</div>
                    <div class="col-3">{{ value.price }}₺</div>
                    <div class="col-1">
                        <i style="cursor: pointer;" @click.self="deleteItem(index)" class="bi bi-x-lg"></i>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-8"><b>Toplam Tutar:</b></div>
                    <!-- !burayı computed la hesapla -->
                    <div class="col-4"><b>{{ toplamTutar }}₺</b></div>
                </div>

                <div>
                    <button class="btn btn-success w-100 mt-5" @click="goCheckout()">Ödeme Sayfasına Git</button>
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
            toplam: 0
        };

    },

    mounted() {



    },
    computed: {
        // sepetteki tüm priceları topla
        // burayı sor çalışmıyor 
        toplamTutar() {
            // yöntem1
            this.toplam = this.sepet.reduce((toplam, urun) => toplam +Number(urun.price), 0)
            return Math.round(this.toplam * 100) / 100
            // yöntem2
            // for (let index = 0; index < this.sepet.length; index++) {
            //     this.toplam += this.sepet[index].price
            // }
            // return this.toplam
        }
    },

    methods: {
        goCheckout() {
            this.$router.push('/checkout')
        },
        deleteItem(index) {
         this.sepet.splice(index,1);
        }
    },

};

</script>

<style scoped>

    /* Sepet.vue dosyasının kendi içine yazılırsa asla ıskalamaz */
    svg, .bi, i, path {
        fill: #C71585 !important;
        color: #C71585 !important;
    }
</style>