import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'
import About from '@/views/About.vue'
import faq from '@/views/faq.vue'
import Contact from '@/views/Contact.vue'
import Product from '@/views/Product.vue'
import Admin from '@/views/Admin.vue'
import User from '@/views/User.vue'
import Checkout from '@/views/Checkout.vue'
import Forbidden from '@/views/403.vue'

// DIKKAT: Express ve App tanımlamaları tarayıcıyı çökerteceği için buradan tamamen kaldırıldı!

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/about',
            name: 'about',
            component: About,
        },
        {
            path: '/contact',
            name: 'contact',
            component: Contact,
        },
        {
            path: '/Product',
            name: 'Product',
            component: Product,
        },
        {
            path: '/faq',
            name: 'faq',
            component: faq,
        },
        {
            path: '/admin',
            name: 'admin',
            component: Admin,
            meta: { requiresAuth: true, roles: ["1"] } 
        },
        {
            path: '/user',
            name: 'user',
            component: User,
            meta: { requiresAuth: true, roles: ["0"] } 
        },
        {
            path: '/checkout',
            name: 'checkout',
            component: Checkout,
        },
        {
            path: '/403',
            name: '403',
            component: Forbidden,
        },
    ],
});

// Vue 3 standartlarına uygun, güvenli yönlendirme (Navigation Guard) kontrolü
router.beforeEach((to) => {     
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "1";    
    const role = sessionStorage.getItem("role"); // "0" veya "1" string olarak gelir

    // 1. Giriş yapılmadıysa ve korumalı bir sayfaya gidilmeye çalışılıyorsa ana sayfaya at
    if (to.meta.requiresAuth && !isLoggedIn) {     
        return "/"; 
    }

    // 2. Giriş yapılmış ama kullanıcının rolü bu sayfa için yetersizse 403 sayfasına at
    if (to.meta.roles && !to.meta.roles.includes(role)) {
        return "/403";    
    }
    
    // Eğer hiçbir engele takılmadıysa sayfa sorunsuz açılır (return true veya boş bırakılır)
});

export default router
