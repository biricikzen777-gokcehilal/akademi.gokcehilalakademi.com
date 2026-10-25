<template>
    <!-- SLIDER / CAROUSEL SARMALAYICISI -->
    <div id="carouselExampleIndicators" class="carousel slide custom-carousel shadow-sm">
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img src="../assets/img/slider1.jpg" class="d-block w-100 carousel-img" alt="slider1">
            </div>
            <div class="carousel-item">
                <img src="../assets/img/slider2.jpg" class="d-block w-100 carousel-img" alt="slider2">
            </div>
            <div class="carousel-item">
                <img src="../assets/img/Slider3.jpg" class="d-block w-100 carousel-img" alt="slider3">
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Geri</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">İleri</span>
        </button>
    </div>

    <!-- AKADEMİ İÇERİK ALANI -->
    <div class="container section-wrapper">

        <!-- 1. BÖLÜM: MİSYON (SOL GÖRSEL - SAĞ METİN) -->
        <div class="row justify-content-center align-items-center grid-row">
            
            <!-- Görsel Alanı -->
            <div class="col-12 col-md-5 text-center mb-4 mb-md-0 position-relative image-hover-zoom">
                <img src="../assets/img/misyon.jpg" class="img-fluid rounded-3 section-img" alt="Misyon Görseli">
            </div>
            
            <!-- Metin Alanı -->
            <div class="col-12 col-md-5">
                <div class="ps-md-5 d-flex flex-column text-start">
                    <div class="title-wrapper mb-3">
                        <h3 class="section-title fw-semibold">MİSYON</h3>
                        <div class="title-line"></div>
                    </div>
                    
                    <ul class="list-unstyled custom-list-group">
                        <li><span class="list-dash">-</span> Ruhlara rehberlik etmek.</li>
                        <li><span class="list-dash">-</span> Ruhların uyanışını başlatmak.</li>
                        <li><span class="list-dash">-</span> Ruhların ışığını parlatmak ve yükseltmek.</li>
                        <li><span class="list-dash">-</span> Ruhun, beden ve zihin üzerindeki gücünü arttırmak.</li>
                        <li><span class="list-dash">-</span> Ruhun, ruhsal alemde ilerlemesi için rehberlik yapmak.</li>
                        <li><span class="list-dash">-</span> İnsanın bilinç ve frekans seviyesinin yükselmesini sağlamak.</li>
                        <li><span class="list-dash">-</span> Kendine yabancılaşan insanı, arındırarak Öz’üne uyandırmak.</li>
                        <li><span class="list-dash">-</span> İnsanların travma, blokaj og negatif enerjilerden arınmalarını sağlamak.</li>
                        <li><span class="list-dash">-</span> Ruhların tüm alemlerde olgunlaşmalarını ve yükselmelerine rehberlik yapmak.</li>
                    </ul>
                </div>
            </div>

        </div>

        <!-- 2. BÖLÜM: VİZYON (SOL METİN - SAĞ GÖRSEL) -->
        <div class="row justify-content-center align-items-center grid-row">
            
            <!-- Metin Alanı (DÜZELTİLDİ: Tire işaretleri maddelerin başına alındı, sağa tam hizalama korundu) -->
            <div class="col-12 col-md-5 order-2 order-md-1">
                <div class="pe-md-5 d-flex flex-column align-items-start align-items-md-end text-start text-md-end">
                    <div class="title-wrapper mb-3 d-flex flex-column align-items-start align-items-md-end">
                        <h3 class="section-title text-success fw-semibold">VİZYON</h3>
                        <div class="title-line"></div>
                    </div>
                    
                    <ul class="list-unstyled custom-list-group-end w-100">
                        <li><span class="list-dash order-md-2 ms-md-2 me-2 me-md-0">-</span><span class="order-md-1">Ruhları uyandırmak.</span></li>
                        <li><span class="list-dash order-md-2 ms-md-2 me-2 me-md-0">-</span><span class="order-md-1">Ruhsallığı güçlendirmek.</span></li>
                        <li><span class="list-dash order-md-2 ms-md-2 me-2 me-md-0">-</span><span class="order-md-1">Ruhların ışığını yükseltmek.</span></li>
                        <li><span class="list-dash order-md-2 ms-md-2 me-2 me-md-0">-</span><span class="order-md-1">İnsanlığı Öz benliğine uyandırmak.</span></li>
                        <li><span class="list-dash order-md-2 ms-md-2 me-2 me-md-0">-</span><span class="order-md-1">Evreni uyanmış ruhlarla aydınlatmak.</span></li>
                        <li><span class="list-dash order-md-2 ms-md-2 me-2 me-md-0">-</span><span class="order-md-1">Evrenin huzur, sevgi ve barışına hizmet etmek.</span></li>
                    </ul>
                </div>
            </div>
            
            <!-- Görsel Alanı -->
            <div class="col-12 col-md-5 order-1 order-md-2 text-center mb-4 mb-md-0 position-relative image-hover-zoom">
                <img src="../assets/img/vizyon.jpg" class="img-fluid rounded-3 section-img" alt="Vizyon Görseli">
            </div>

        </div>

               <!-- ==========================================================================
           3. BÖLÜM: MARKA DEĞERİ BİLDİRİM ALANI
           ========================================================================== -->
        <div class="row justify-content-center text-center grid-row mt-4">
            <div class="col-12 col-md-10 d-flex flex-column align-items-center">
                <!-- Marka Değeri Başlığı (Koyu Pembe Tonu ve Ortalanmış Alt Çizgi Düzeni) -->
                <div class="title-wrapper d-flex flex-column align-items-center mb-3">
                    <h2 class="shop-main-title fw-semibold">MARKA DEĞERİ</h2>
                    <div class="brand-title-line"></div>
                </div>
                
                <!-- İçerik Metni (Birebir Aynı Tutuldu) -->
                <p class="brand-text m-0 px-lg-5">
                    Ruhsal Şifa İlmi markalaşma süreci 5 Ağustos 2022 tarihinde başlatıldı ve 23 Aralık 2022 tarihinde tamamlandı. 5 Ağustos 2022 tarihinden itibaren yayımlanan tüm içeriklerin ve uygulanan çalışmaların isim, telif, kullanım, yayım-basım, eğitim, seminer, sempozyum düzenleme, medya…vb tüm yasal hakları Gökçe Hilal’e aittir. İhlali durumunda yasal işlem başlatılır.
                </p>
            </div>
        </div>



    </div>
</template>
<script setup>
// Sayfa performansı için hafif mimari korundu
</script>

<style scoped>

/* ==========================================================================
   3. MARKA DEĞERİ BİLDİRİM ALANI STİLLERİ (BÜYÜTÜLMÜŞ & KOYU)
   ========================================================================== */
.shop-main-title {
    color: #C71585 !important; /* Diğer sayfalarla tam uyumlu asil KOYU PEMBE tonu */
    font-size: 26px !important; /* Misyon/Vizyon ile dengeli büyük vitrin puntosu */
    letter-spacing: 0.5px;
    margin: 0 !important;
}

/* Başlığın altına çekilen, diğer bölümlerle birebir uyumlu alt çizgi süsü */
.brand-title-line {
    width: 45px;
    height: 2px;
    background-color: #C71585; /* Kurumsal yeşil tonlama */
    margin-top: 6px;
    margin-bottom: 10px;
    opacity: 0.6;
    transition: width 0.3s ease;
}
.grid-row:hover .brand-title-line {
    width: 120px; /* Fareyle üzerine gelindiğinde çizgi zarifçe dikey simetriyi genişletir */
}

/* İstediğiniz gibi büyütülen, netleştirilen ve koyulaştırılan içerik metni */
.brand-text {
    font-size: 16px; /* Okunması kolay büyük punto */
    font-weight: 400; /* Belirgin font ağırlığı */
    color: #2b2b2b; /* Gözü yormayan net koyu yazı rengi */
    line-height: 1.65; /* Ferah dikey satır yayılımı */
    text-align: center;
    letter-spacing: 0.2px;
}

/* ==========================================================================
   1. DIŞ ALAN VE CAROUSEL DIŞ ÇERÇEVELERİ
   ========================================================================== */
.custom-carousel {
    max-height: 520px;
    overflow: hidden;
}
.carousel-img {
    object-fit: cover;
    max-height: 520px;
    filter: brightness(0.95);
}

.section-wrapper {
    padding-top: 40px;
    padding-bottom: 60px;
}
.grid-row {
    padding-top: 50px;
    padding-bottom: 50px;
}

/* ==========================================================================
   2. FOOTER YEŞİLİ BAŞLIK VE KILAVUZ ÇİZGİ TASARIMI
   ========================================================================== */
.section-title {
    color: #008000 !important;
    font-weight: 600 !important;
    font-size: 26px !important;
    letter-spacing: 1.5px;
    margin: 0 !important;
}

.title-line {
    width: 45px;
    height: 2px;
    background-color: #008000;
    margin-top: 6px;
    opacity: 0.6;
    transition: width 0.3s ease;
}
.grid-row:hover .title-line {
    width: 70px;
}

/* ==========================================================================
   3. BELİRGİN METİNLER VE SADE TİRE SEMBOLLERİ
   ========================================================================== */
.custom-list-group,
.custom-list-group-end {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin: 0;
    padding: 0;
}

.custom-list-group-end li {
    justify-content: flex-start;
}
@media (min-width: 768px) {
    .custom-list-group-end li {
        justify-content: flex-end; /* Masaüstünde vizyon maddelerini sağa yaslar */
    }
}

.custom-list-group li,
.custom-list-group-end li {
    font-size: 15px;
    font-weight: 400;
    color: #2b2b2b;
    line-height: 1.5;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    transition: transform 0.2s ease, color 0.2s ease;
}

/* Tire sembollerinin kurumsal yeşil tonlaması ve mesafesi */
.list-dash {
    color: #008000;
    font-weight: 600;
    opacity: 0.8;
}
.custom-list-group li .list-dash {
    margin-right: 12px;
}

/* Üzerine gelindiğinde oluşan hafif ve akıcı kayma hareketleri */
.custom-list-group li:hover {
    transform: translateX(5px);
    color: #008000;
}
.custom-list-group-end li:hover {
    transform: translateX(-5px);
    color: #008000;
}

/* ==========================================================================
   4. GÖRSEL HOVER VE DEKORASYON AYARLARI
   ========================================================================== */
.section-img {
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.02);
    transition: all 0.4s ease-in-out;
}

.image-hover-zoom:hover .section-img {
    transform: scale(1.015);
    box-shadow: 0 18px 35px rgba(0, 0, 0, 0.09);
}

</style>
