import './assets/main.css' //! main.css dosyamızı import ettik
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'


import { createApp } from 'vue' //! vue modülü içerisinden createApp fonksiyonunu çağırdık. Erişebilir olduk.
import App from './App.vue' //! App.vue dosyamızı artık App adıyla kullancağımızı belirttik.
import router from './router' //! Sayfalar veya componentler arasındaki yönlendiricimizi import ettik. Router adıyla kullanacağımızı belrittik. /about, /contact

const app = createApp(App) //! App.vue'yu ana vue olarak tanıttık.

app.use(router) //! Vue projemize router ı dahil ettik.

app.mount('#app') //! tüm ayarları yani app'i  #app'e monte ettik. # = id demek.
