<template>
    <!--! Slider-Carousel -->
    <div id="carouselExampleIndicators" class="carousel slide">
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
                aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img src="../assets/img/slider1.jpg" class="d-block w-100" alt="slider1">
            </div>
            <div class="carousel-item">
                <img src="../assets/img/slider2.jpg" class="d-block w-100" alt="slider2">
            </div>
            <div class="carousel-item">
                <img src="../assets/img/Slider3.jpg" class="d-block w-100" alt="slider3">
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>


    <!-- BOOTSTRAP GRİD -->

    <div class="container my-5">

        <!-- 1.GRİD -->
        <!-- row içine d-flex ve justify-content-center ekleyerek sütunları yan yana hizaladık -->
        <!-- justify-content-center sayesinde içindeki sütunlar satırın tam ortasına yerleşir -->
        <div class="row justify-content-center align-items-center" style="padding-top: 50px; padding-bottom: 50px;">
            
            <!-- Resim Sütunu: 12 birimlik ana ızgaranın 3 birimini kaplar -->
            <div class="col-12 col-md-5 text-center text-md-end mb-4 mb-md-0">
                <img src="../assets/img/misyon.jpg" class="img-fluid rounded-4 w-100" alt="Misyon Görseli">
            </div>
            
            <!-- Metin Sütunu: 12 birimlik ana ızgaranın 7 birimini kaplar -->
            <!-- 3 (Resim) + 7 (Metin) = Toplam 10 birim yer kaplar ve row sayesinde ortalanır -->
            <div class="col-12 col-md-5">
                <div class="ps-md-5 d-flex flex-column justify-content-start align-items-start text-start lh-sm">
                    <h3 class="text-success mb-3">MİSYON</h3>
                    <p>Ruhlara rehberlik etmek.</p>
                    <p>Ruhların uyanışını başlatmak.</p>
                    <p>Ruhların ışığını parlatmak ve yükseltmek.</p>
                    <p>Ruhun, beden ve zihin üzerindeki gücünü arttırmak.</p>
                    <p>Ruhun, ruhsal alemde ilerlemesi için rehberlik yapmak.</p>
                    <p>İnsanın bilinç ve frekans seviyesinin yükselmesini sağlamak.</p>
                    <p>Kendine yabancılaşan insanı, arındırarak Öz’üne uyandırmak.</p>
                    <p>İnsanların travma, blokaj ve negatif enerjilerden arınmalarını sağlamak.</p>
                    <p>Ruhların tüm alemlerde olgunlaşmalarını ve yükselmelerine rehberlik yapmak.</p>
                </div>
            </div>

        </div>
        </div>
        
                <!-- 2.GRİD (VİZYON) -->
        <!-- justify-content-center sayesinde içindeki sütunlar satırın tam ortasına yerleşir -->
        <div class="row justify-content-center align-items-center" style="padding-top: 50px; padding-bottom: 50px;">
            
            <!-- METİN SÜTUNU: 12 birimlik ana ızgaranın 7 birimini kaplar -->
            <div class="col-12 col-md-5">
                <!-- align-items-end ve text-end ile içerikleri tamamen SAĞA yasladık -->
                <div class="pe-md-5 d-flex flex-column justify-content-start align-items-end text-end">
                    <h3 class="text-success mb-4">VİZYON</h3>
                    <p>Ruhları uyandırmak.</p>
                    <p>Ruhsallığı güçlendirmek.</p>
                    <p>Ruhların ışığını yükseltmek.</p>
                    <p>İnsanlığı Öz benliğine uyandırmak.</p>
                    <p>Evreni uyanmış ruhlarla aydınlatmak.</p>
                    <p>Evrenin huzur, sevgi ve barışına hizmet etmek.</p>
                </div>
            </div>
            
            <!-- RESİM SÜTUNU: 12 birimlik ana ızgaranın 3 birimini kaplar -->
            <!-- 7 (Metin) + 3 (Resim) = Toplam 10 birim yer kaplar ve row sayesinde ortalanır -->
            <div class="col-12 col-md-5 text-center text-md-start">
                <!-- w-100 ile resmin bu sütunda tam genişlikte durmasını sağladık -->
                <img src="../assets/img/vizyon.jpg" class="img-fluid rounded-4 w-100" alt="Vizyon Görseli">
            </div>

</div> <!-- Ana ROW kapanış etiketi -->



</template>


<script setup>



</script>



<style>

</style>