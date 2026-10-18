<script setup>
import AdminProducts from '@/components/admin-products.vue';
import AdminOrders from '@/components/admin-orders.vue';
import router from '@/router'
</script>

<template>
    <div style="width: 200px;" class="bg-primary offcanvas offcanvas-start show" tabindex="0">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" style="color: white;">Kullanıcı <br>Yönetim Paneli</h5>
        </div>
        <div class="offcanvas-body">
            <div style="color: white; float: left;">
                <button @click="state = 'products'"
                    :class="state == 'products' ? 'btn btn-light w-100 mb-2' : 'btn btn-outline-light w-100 mb-2'">Ürünler</button>
                <button @click="state = 'orders'"
                    :class="state == 'orders' ? 'btn btn-light w-100 mb-2' : 'btn btn-outline-light w-100 mb-2'">Siparişler</button>
            </div>
            <div style="bottom: 20px; position: absolute;">
                <div class="mb-2">
                    <h5 class="text-white" >{{Username}}</h5>
                </div>
                <div>
                    <button class="btn btn-light btn" @click="setProfile()"><i class="bi bi-gear-fill"></i></button>
                    <button style="margin-left: 10px;" class="btn btn-light btn" @click="logout()"><i class="bi bi-box-arrow-right"></i></button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="state == 'products'">
        <AdminProducts />
    </div>
    <div v-if="state == 'orders'">
        <AdminOrders />
    </div>
</template>
<script>
export default {
    data() {
        return {
            state: "products",
            Username:"Test",
            baseUrl: "http://localhost:3001",
        };
    },
    mounted() { 
        this.getUsername()
    },
    methods: {
        async getUsername() {
            const id=sessionStorage.getItem("userId");
            try {
                const res = await fetch(`${this.baseUrl}/api/getUsername`, { 
                    method: "POST", 
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        id:id
                    })
                });
                if (!res.ok) throw new Error(res.error);
                const data = await res.json();
                if(data) this.Username=data
            }
            catch (e) {
                console.log(e);
            }
        },
        logout(){
            sessionStorage.removeItem("isLoggedIn")
            sessionStorage.removeItem("role")
            sessionStorage.removeItem("userId")
            router.push("/"); 
        }
    },
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