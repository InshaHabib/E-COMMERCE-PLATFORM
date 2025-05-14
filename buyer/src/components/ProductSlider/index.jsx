import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// import required modules
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";
import ProductItem from "../ProductItem";

const ProductSlider = (props) => {
  return (
    <div className="productslider py-3">
      <Swiper
        slidesPerView={props.items}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
            <ProductItem/>
        </SwiperSlide>
        <SwiperSlide>
            <ProductItem/>
        </SwiperSlide>
        <SwiperSlide>
            <ProductItem/>
        </SwiperSlide>
        <SwiperSlide>
            <ProductItem/>
        </SwiperSlide>
        <SwiperSlide>
            <ProductItem/>
        </SwiperSlide>
        <SwiperSlide>
            <ProductItem/>
        </SwiperSlide>
        <SwiperSlide>
            <ProductItem/>
        </SwiperSlide>
        <SwiperSlide>
            <ProductItem/>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default ProductSlider;