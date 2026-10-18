<template>

    <h3>Siparişler</h3>

    <table class="table table-striped mt-4">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Sipariş No</th>
                <th scope="col">Toplam Tutar(₺)</th>
                <th scope="col">Verilen Tarihi</th>
                <th scope="col">Sipariş Durumu</th>
                <th scope="col">İşlem</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="order in orders">
                <td><label> {{ order.id }} </label></td>
                <td><label> {{ order.o_no }} </label></td>
                <td><label> {{ order.o_amount }} </label></td>
                <td><label>{{ order.o_date }}</label> </td>
                <td>
                    <select class="form-select" v-model="order.o_status">
                        <option value="Hazırlanıyor">Hazırlanıyor</option>
                        <option value="Kargoya Verildi">Kargoya Verildi</option>
                        <option value="Teslim Edildi">Teslim Edildi</option>
                        <option value="İptal Edildi">İptal Edildi</option>
                    </select>
                </td>
                <td>
                    <button class="btn-sm btn btn-outline-primary btn-sm m-1" 
                    @click="updateOrder(order.id, order.o_status)">Güncelle</button>

                    <button style="margin-left: 10px;" class="btn-sm btn btn-outline-danger"
                        @click="deleteOrder(order.id)">Sil</button>

                    <button style="margin-left: 10px;" @click="detailId = index" type="button"
                        class="btn-sm btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#details">
                        Detaylar
                    </button>
                </td>
            </tr>
        </tbody>
    </table>


    <!--! Order Details modal'ı -->
    <div v-if="orders.length > 0" class="modal fade" id="details" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Sipariş Detaylar</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body row">
                    <div class="col-md-4 mb-2">
                        <label class="form-label fw-bold">Sipariş No:</label>
                    </div>
                    <div class="col-md-8 mb-2">
                        <label class="form-label">{{ orders[detailID].o_no }}</label>
                    </div>

                    <div class="col-md-4 mb-2">
                        <label class="form-label fw-bold">Ürünler:</label>
                    </div>
                    <div class="col-md-8 mb-2">
                        <label class="form-label">{{ orders[detailID].o_products }}</label>
                    </div>

                    <div class="col-md-4 mb-2">
                        <label class="form-label fw-bold">Sipariş Veren:</label>
                    </div>
                    <div class="col-md-8 mb-2">
                        <label class="form-label">{{ orders[detailID].o_person }}</label>
                    </div>

                    <div class="col-md-4 mb-2">
                        <label class="form-label fw-bold">Sipariş Adresi:</label>
                    </div>
                    <div class="col-md-8 mb-2">
                        <label class="form-label">{{ orders[detailID].o_address }}</label>
                    </div>

                    <div class="col-md-4 mb-2">
                        <label class="form-label fw-bold">Toplam Tutar:</label>
                    </div>
                    <div class="col-md-8 mb-2">
                        <label class="form-label">{{ orders[detailID].o_amount }}₺</label>
                    </div>

                    <div class="col-md-4 mb-2">
                        <label class="form-label fw-bold">Sipariş Tarihi:</label>
                    </div>
                    <div class="col-md-8 mb-2">
                        <label class="form-label">{{ orders[detailID].o_date }}</label>
                    </div>

                    <div class="col-md-4 mb-2">
                        <label class="form-label fw-bold">Durumu:</label>
                    </div>
                    <div class="col-md-8 mb-2">
                        <label class="form-label">{{ orders[detailID].o_status }}</label>
                    </div>

                    <br>
                </div>
            </div>
        </div>
    </div>

</template>


<script>

export default {
    data() {
        return {
            orders: [],
            baseUrl: "http://localhost:3001",
            error:null
        };
    },

    mounted() {
        this.getOrders()
    },

    watch: {

    },

    computed: {

    },

    methods: {
        deleteItem(value, index) {
            if (value == 'order') {
                this.orders.splice(index, 1)
                this.detailID=0
            }
        },

        // Ordersları çek
        async getOrders() {
            try {
                const res = await fetch(`${this.baseUrl}/api/orders`);
                if (!res.ok) throw new Error("Orders endpoint hatası");
                this.orders = await res.json();
            } 
            
            catch (e) {
               console.log(e.message);
            }
        },

        //POST - Sipariş ekleme 
        async addOrder() {
            try {
                const res = await fetch(`${this.baseUrl}/api/orders`, { //istekte bulunduğumuz yer.
                    method: "POST", //POST isteğinde buluyoruz.
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ //istekle beraber neleri yolluyorsun?
                        name: this.newOrder[0].name,
                        stock: this.newOrder[0].stock,
                        price: this.newOrder[0].price
                    })
                });
                if (!res.ok) throw new Error("addOrder endpoint hatası");
                const data = await res.json();
                this.orderMessage=data;

                this.getProducts(); //Ekleme işleminden sonra tekrardan verileri çek.
                this.newOrder[0].name = "";
                this.newOrder[0].stock = 0;
                this.newOrder[0].price = 0;
            }
            catch (e) {
                this.orderMessage=e.message;
            }
        },

        //PUT - Sipariş güncelle 
        async updateOrders(id, status) {
            try {
                const res = await fetch(`${this.baseUrl}/api/orders/${id}`, { //istekte bulunduğumuz yer.
                    method: "PUT", //PUT isteğinde buluyoruz.
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({  //istekle beraber neleri yolluyorsun?
                        status: status,
                    })
                });
                if (!res.ok){
                    if(res.status==400) throw new Error("Hatalı veri");
                } 

                const data = await res.json();
                if(data) alert("Sipariş güncellendi.")
                this.getOrders(); //Güncelle işleminden sonra tekrardan verileri çek.
            }
            catch (error) {
                console.log(error.message);
            }
        },

    }
};
</script>

<style scoped></style>