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

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/about', name: 'about', component: About },
        { path: '/contact', name: 'contact', component: Contact },
        { path: '/Product', name: 'Product', component: Product },
        { path: '/faq', name: 'faq', component: faq },
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
        { path: '/checkout', name: 'checkout', component: Checkout },
        { path: '/403', name: '403', component: Forbidden },
    ],
});

// HOCANIN İSTEDİĞİ CANLI JWT DOĞRULAMALI GÜVENLİK DUVARI (Navigation Guard)
router.beforeEach(async (to, from, next) => {     
    // Session storage'da saklanan şifreli anahtarı alıyoruz
    const token = sessionStorage.getItem("token");

    // Eğer gidilecek sayfa korumalı (admin veya user) ise
    if (to.meta.requiresAuth) {
        if (!token) {
            // Token yoksa doğrudan ana sayfaya fırlatır
            return next("/");
        }

        try {
            // Canlı olarak backend sunucumuzdan token'ı ve rolü sorguluyoruz
            const response = await fetch("http://localhost:3001/api/verify-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: token })
            });

            if (!response.ok) {
                sessionStorage.removeItem("token");
                return next("/");
            }

            const data = await response.json();

            if (data && data.valid) {
                // Veritabanındaki canlı rol, sayfanın izin verdiği rollerde var mı kontrol et
                if (to.meta.roles && to.meta.roles.includes(data.role)) {
                    return next(); // İzin ver, sayfa açılsın
                } else {
                    return next("/403"); // Yetkisiz giriş, 403 sayfasına fırlat
                }
            } else {
                sessionStorage.removeItem("token");
                return next("/");
            }

        } catch (error) {
            console.error("Router guard güvenlik hatası:", error);
            return next("/");
        }
    } else {
        // Korumalı olmayan sayfalar (Anasayfa, İletişim vb.) için geçişe doğrudan izin ver
        next();
    }
});

export default router;
