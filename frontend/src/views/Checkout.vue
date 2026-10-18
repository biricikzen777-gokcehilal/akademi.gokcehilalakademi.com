<!-- bu sayfayı router'a tanıt /checkout adresine gidince bu sayfa gözükcek -->
<!-- Template, script, style yapımızı buraya ekle -->
<!-- bootstrap'tan indirdiğimiz checkout sayfasını buradaki template yapıştır -->
<!-- bootstraptaki index.html içerisinde cssleri bu sayfaya style scope içerisine eklemelisin. -->

<template>

    <div class="container">
        <main>
            <div class="py-5 text-center">
                <img class="d-block mx-auto mb-4" src="" alt="" width="57"
                    height="57" />
                <h1 class="h2">Ödeme Sayfası</h1>
                <p class="lead">
                   
                </p>
            </div>

            
            <div class="row g-5">
                <!--! Sepet kısmı -->
                <div class="col-md-5 col-lg-4 order-md-last">
                    <h4 class="d-flex justify-content-between align-items-center mb-3">
                        <span class="text-primary">Sepet</span>
                        <span class="text">{{ sepet.length }} Ürün mevcut</span>
                    </h4>
                    <ul class="list-group mb-3">
                        <li class="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                                <h6 class="my-0">Ürün adı: </h6>
                                <small class="text-body-secondary">Brief description</small>
                            </div>
                            <span class="text-body-secondary">Fiyat(₺)</span>
                        </li>

                        <!--  Sepeti Döndüreceğiz  -->
                        <li v-for="value in sepet" class="list-group-item d-flex justify-content-between">
                            <div>
                                <h6 class="my-0">{{value.name}}</h6>
                                <small class="text-body-secondary">Ürün eklendi!</small>
                            </div>
                            <span class="text-body-secondary">{{value.price}}₺
                                <div class="col-1" >
                                    <i style="cursor: pointer;" @click.self="deleteItem(index)"
                                    class="bi bi-trash3"></i>
                                </div>
                            </span>
                        </li>

                        <li class="list-group-item d-flex justify-content-between">
                            <span>Toplam Tutar: </span> <strong>{{ Math.round(toplamTutar * 100)/100 }}₺</strong>
                        </li>

                        <li class="list-group-item d-flex justify-content-between">
                            <span>KDV Tutar(%20): </span> <strong>{{  Math.round(toplamTutar * 0.2 * 100)/100 }}₺</strong>
                        </li>

                        <li class="list-group-item d-flex justify-content-between">
                            <span>KDV'li Toplam Tutar: </span> <strong>{{  Math.round(toplamTutar * 1.2 * 100)/100 }}₺</strong>
                        </li>
                    </ul>
                </div>

                <!--! Adres kısmı  -->
                <div class="col-md-7 col-lg-8">
                    <h4 class="mb-3">Fatura Adresi</h4>
                    <form class="needs-validation" @submit="checkOut()">
                        <div class="row g-3">

                            <div class="col-sm-12">
                                <label  class="form-label">TC Kimlik No: </label>
                                <input type="text" class="form-control"  placeholder="Fatura için zorunludur."
                                 v-model="order[0].TC"  required />
                            </div>

                            <div class="col-sm-6">
                                <label  class="form-label">Ad: </label>
                                <input type="text" class="form-control"  placeholder="" v-model="order[0].firstName"
                                    required />
                            </div>

                            <div class="col-sm-6">
                                <label  class="form-label">Soyad: </label>
                                <input type="text" class="form-control" placeholder="" v-model="order[0].lastName"
                                    required />
                            </div>
                        
                            <div class="col-6">
                                <label  class="form-label">Email</label>
                                <input type="email" class="form-control"  placeholder="ornek@example.com" v-model="order[0].email"/>
                            </div>

                            <div class="col-6">
                                <label  class="form-label">Tel: </label>
                                <input type="tel" class="form-control"  placeholder="+90(888)888 88 88" v-model="order[0].phone"/>
                            </div>

                            <div class="col-12">
                                <label class="form-label">Adres: </label>
                                <textarea class="form-control"  placeholder="Adresinizi giriniz..."
                                 v-model="order[0].address" required></textarea>
                            </div>
                         
                            <div class="col-md-5">
                                <label  class="form-label">Ülke: </label>
                                <select class="form-select" v-model="order[0].country" required>
                                    <option value="Türkiye" >Türkiye</option>
                                    <option>...</option>
                                </select>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Şehir: </label>
                                <select class="form-select" v-model="order[0].state" required>
                                    <option value="Adana">Adana</option>
                                    <option value="Ankara">Ankara</option>
                                </select>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Posta Kodu: </label>
                                <input type="text" class="form-control" v-model="order[0].zip" placeholder="" required />
                            </div>

                        </div>

                        <hr class="my-4" />

                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" />
                            <label class="form-check-label" for="same-address">Sipariş adresi ile Fatura adresim aynı.</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input"  />
                            <label class="form-check-label" for="save-info">Bilgilerimi sonraki siparişlerim için kaydet.</label>
                        </div>

                         <!-- ! Kart Bilgileri -->

                        <hr class="my-4" />
                        <h4 class="mb-3">Ödeme</h4>
                        <div class="my-3">
                            <div class="form-check">
                                <input id="credit" name="paymentMethod" type="radio" class="form-check-input" checked
                                    required />
                                <label class="form-check-label" for="credit">Kredi Kartı</label>
                            </div>
                            <div class="form-check">
                                <input id="debit" name="paymentMethod" type="radio" class="form-check-input" required />
                                <label class="form-check-label" for="debit">Debit Kart</label>
                            </div>
                            <div class="form-check">
                                <input id="paypal" name="paymentMethod" type="radio" class="form-check-input"
                                    required />
                                <label class="form-check-label" for="paypal">PayPal ile Ödeme</label>
                            </div>
                        </div>
                        <div class="row gy-3">
                            <div class="col-md-6">
                                <label  class="form-label">Kart sahibi: </label>
                                <input v-model="payment[0].name" type="text" class="form-control"  placeholder="" required />
                                <small class="text-body-secondary">Kart üstündeki ismi eksiksiz giriniz.</small>
                                <div class="invalid-feedback">Name on card is required</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Kart numarası: </label>
                                <input v-model="payment[0].number" type="text" class="form-control"  placeholder="" required />
                                <div class="invalid-feedback">
                                    Credit card number is required
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label  class="form-label">SKT: </label>
                                <input v-model="payment[0].exp" type="text" class="form-control"  placeholder="" required />
                                <div class="invalid-feedback">Expiration date required</div>
                            </div>
                            <div class="col-md-3">
                                <label for="cc-cvv" class="form-label">CVV</label>
                                <input v-model="payment[0].cvv" type="text" class="form-control" id="cc-cvv" placeholder="" required />
                                <div class="invalid-feedback">Security code required</div>
                            </div>
                        </div>
                        <hr class="my-4" />
                        <button class="w-100 btn btn-primary btn-lg" type="submit">
                            Siparişi Tamamla
                        </button>

                        {{ order }}
                        <hr>
                        {{ sepet }}
                       <hr> 
                        {{ payment }}

                    </form>
                </div>
            </div>
        </main>

        <footer class="my-5 pt-5 text-body-secondary text-center text-small">
            <p class="mb-1">&copy; 2017–2025 Company Name</p>
            <ul class="list-inline">
                <li class="list-inline-item"><a href="#">Privacy</a></li>
                <li class="list-inline-item"><a href="#">Terms</a></li>
                <li class="list-inline-item"><a href="#">Support</a></li>
            </ul>
        </footer>
    </div>

</template>


<script>

export default {
    inject: ['sepet'],
    data() {
        return {
            toplam: 0,
            order:[
                {TC:"", firstName:"", lastName:"", email:"", phone:"", address:"", country:"Türkiye", state:"", zip:""}
            ],
            payment:[
                {name:"", number:"", exp:"", cvv:""}
            ],
        
            baseUrl: "http://localhost:3001"

        };
    },

    mounted() {

    },

    watch: {

    },

    computed: {
        toplamTutar() {
            this.toplam = this.sepet.reduce(
                (toplam, urun) => toplam + urun.price, 0 
            )
            return this.toplam
        }

    },

    methods: {

      //! POST - Ceckout
        async checkOut() {
            try {
                const res = await fetch('${this.baseUrl}/api/orders', {
                   method: "POST", //POST isteğinde bulunuyoruz 
                   headers: {
                    "Content-Type": "application/json"
                   },
                   body: JSON.stringify({ // istekle beraber neleri yolluyoruz?
                    sepet: this.sepet,
                    order: this.order,
                    amount: this.toplam*1.2,
                   })
                });
                if (!res.ok) throw new Error("Contact endpoint hatası!")
                const data = await res.json();

                
                if(data) alert=("Sipariş alındı.");    
            }
            catch (e) {
                console.log(e.message);
            }
        },

        deleteItem(index) {
            this.sepet.splice(index,1);
        }

    }
};
</script>

<style scoped>

    .bd-placeholder-img {
      font-size: 1.125rem;
      text-anchor: middle;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }

    @media (min-width: 768px) {
      .bd-placeholder-img-lg {
        font-size: 3.5rem;
      }
    }

    .b-example-divider {
      width: 100%;
      height: 3rem;
      background-color: #0000001a;
      border: solid rgba(0, 0, 0, 0.15);
      border-width: 1px 0;
      box-shadow:
        inset 0 0.5em 1.5em #0000001a,
        inset 0 0.125em 0.5em #00000026;
    }

    .b-example-vr {
      flex-shrink: 0;
      width: 1.5rem;
      height: 100vh;
    }

    .bi {
      vertical-align: -0.125em;
      fill: currentColor;
    }

    .nav-scroller {
      position: relative;
      z-index: 2;
      height: 2.75rem;
      overflow-y: hidden;
    }

    .nav-scroller .nav {
      display: flex;
      flex-wrap: nowrap;
      padding-bottom: 1rem;
      margin-top: -1px;
      overflow-x: auto;
      text-align: center;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
    }

    .btn-bd-primary {
      --bd-violet-bg: #712cf9;
      --bd-violet-rgb: 112.520718, 44.062154, 249.437846;
      --bs-btn-font-weight: 600;
      --bs-btn-color: var(--bs-white);
      --bs-btn-bg: var(--bd-violet-bg);
      --bs-btn-border-color: var(--bd-violet-bg);
      --bs-btn-hover-color: var(--bs-white);
      --bs-btn-hover-bg: #6528e0;
      --bs-btn-hover-border-color: #6528e0;
      --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);
      --bs-btn-active-color: var(--bs-btn-hover-color);
      --bs-btn-active-bg: #5a23c8;
      --bs-btn-active-border-color: #5a23c8;
    }

    .bd-mode-toggle {
      z-index: 1500;
    }

    .bd-mode-toggle .bi {
      width: 1em;
      height: 1em;
    }

    .bd-mode-toggle .dropdown-menu .active .bi {
      display: block !important;
    }
</style>