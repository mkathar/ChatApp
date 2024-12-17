<template>
  <div class="ourGallery">
    <h1 class="ourGallery__title">Our Gallery</h1>
    <div class="ourGallery__slider">
      <swiper
        :slidesPerView="5"
        :spaceBetween="30"
        :pagination="{
          clickable: true,
        }"
      >
        <swiper-slide
          ><img src="../assets/img/gallery-img-01.jpg" alt=""
        /></swiper-slide>
        <swiper-slide
          ><img src="../assets/img/gallery-img-02.jpg" alt="" /></swiper-slide
        ><swiper-slide
          ><img src="../assets/img/gallery-img-03.jpg" alt=""
        /></swiper-slide>
        <swiper-slide
          ><img src="../assets/img/gallery-img-04.jpg" alt="" /></swiper-slide
        ><swiper-slide
          ><img src="../assets/img/gallery-img-05.jpg" alt=""
        /></swiper-slide>
        <swiper-slide
          ><img src="../assets/img/gallery-img-06.jpg" alt="" /></swiper-slide
        ><swiper-slide
          ><img src="../assets/img/gallery-img-07.jpg" alt=""
        /></swiper-slide>
        <swiper-slide
          ><img src="../assets/img/gallery-img-08.jpg" alt="" /></swiper-slide
        ><swiper-slide
          ><img src="../assets/img/gallery-img-09.jpg" alt=""
        /></swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";

import "swiper/css/pagination";
export default {
  setup() {
    return { modules: [Pagination] };
  },
  components: {
    Swiper,
    SwiperSlide,
  },
};
</script>
