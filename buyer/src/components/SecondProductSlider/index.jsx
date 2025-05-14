import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductItem from "../ProductItem";

const products = [
  {
    img1: "https://api.spicezgold.com/download/file_1734529297930_fiorra-women-s-teapot-blue-pure-cotton-a-line-kurta-with-sharara-and-dupatta-product-images-rvo9n8udfg-1-202307260626.jpg",
    img2: "https://api.spicezgold.com/download/file_1734529297929_fiorra-women-s-teapot-blue-pure-cotton-a-line-kurta-with-sharara-and-dupatta-product-images-rvo9n8udfg-0-202307260626.jpg",
    name: " A-Line Kurti With Sharara & Dupatta",
    brand: "Sangria",
    oldPrice: "$65.00",
    newPrice: "$58.00",
    rating: 4,
    discount:"10%",
  },
  {
    img1: "https://demos.codezeel.com/prestashop/PRS21/PRS210502/130-home_default/customizable-mug.jpg",
    img2: "https://demos.codezeel.com/prestashop/PRS21/PRS210502/133-home_default/customizable-mug.jpg",
    name: " A-Line Kurti With Sharara & Dupatta",
    brand: "Sangria",
    oldPrice: "$65.00",
    newPrice: "$58.00",
    rating: 4,
    discount:"10%",
  },
  {
    img1: "https://demos.codezeel.com/prestashop/PRS21/PRS210502/42-home_default/the-adventure-begins-framed-poster.jpg",
    img2: "https://demos.codezeel.com/prestashop/PRS21/PRS210502/48-home_default/the-adventure-begins-framed-poster.jpg",
    name: " A-Line Kurti With Sharara & Dupatta",
    brand: "Sangria",
    oldPrice: "$65.00",
    newPrice: "$58.00",
    rating: 4,
    discount:"20%",
  },
  {
    img1: "https://api.spicezgold.com/download/file_1734529297930_fiorra-women-s-teapot-blue-pure-cotton-a-line-kurta-with-sharara-and-dupatta-product-images-rvo9n8udfg-1-202307260626.jpg",
    img2: "https://api.spicezgold.com/download/file_1734529297929_fiorra-women-s-teapot-blue-pure-cotton-a-line-kurta-with-sharara-and-dupatta-product-images-rvo9n8udfg-0-202307260626.jpg",
    name: " A-Line Kurti With Sharara & Dupatta",
    brand: "Sangria",
    oldPrice: "$65.00",
    newPrice: "$58.00",
    rating: 4,
    discount:"30%",
  },
  {
    img1: "https://res.cloudinary.com/duqoh8gf5/image/upload/v1736936052/1736936051385_siril-georgette-brown-color-saree-with-blouse-piece-product-images-rvegeptjtj-0-202308161431.webp",
    img2: "https://res.cloudinary.com/duqoh8gf5/image/upload/v1736936054/1736936051713_siril-georgette-brown-color-saree-with-blouse-piece-product-images-rvegeptjtj-1-202308161431.jpg",
    name: "Siril Georgette Brown Color Saree",
    brand: "GESPO",
    oldPrice: "$1450",
    newPrice: "$1650",
    rating: 5,
    discount:"40%",
  },
  {
    img1: "https://res.cloudinary.com/duqoh8gf5/image/upload/v1736936052/1736936051385_siril-georgette-brown-color-saree-with-blouse-piece-product-images-rvegeptjtj-0-202308161431.webp",
    img2: "https://res.cloudinary.com/duqoh8gf5/image/upload/v1736936054/1736936051713_siril-georgette-brown-color-saree-with-blouse-piece-product-images-rvegeptjtj-1-202308161431.jpg",
    name: "Siril Georgette Brown Color Saree",
    brand: "GESPO",
    oldPrice: "$1450",
    newPrice: "$1650",
    rating: 5,
    discount:"10%",
  },
  {
    img1: "https://res.cloudinary.com/duqoh8gf5/image/upload/v1736936052/1736936051385_siril-georgette-brown-color-saree-with-blouse-piece-product-images-rvegeptjtj-0-202308161431.webp",
    img2: "https://res.cloudinary.com/duqoh8gf5/image/upload/v1736936054/1736936051713_siril-georgette-brown-color-saree-with-blouse-piece-product-images-rvegeptjtj-1-202308161431.jpg",
    name: "Siril Georgette Brown Color Saree",
    brand: "GESPO",
    oldPrice: "$1450",
    newPrice: "$1650",
    rating: 5,
    discount:"10%",
  },
  {
    img1: "https://res.cloudinary.com/duqoh8gf5/image/upload/v1736936052/1736936051385_siril-georgette-brown-color-saree-with-blouse-piece-product-images-rvegeptjtj-0-202308161431.webp",
    img2: "https://res.cloudinary.com/duqoh8gf5/image/upload/v1736936054/1736936051713_siril-georgette-brown-color-saree-with-blouse-piece-product-images-rvegeptjtj-1-202308161431.jpg",
    name: "Siril Georgette Brown Color Saree",
    brand: "GESPO",
    oldPrice: "$1450",
    newPrice: "$1650",
    rating: 5,
    discount:"10%",
  }
];

const SecondProductSlider = ({ items }) => {
    return (
      <div className="productslider py-3">
        <Swiper
          slidesPerView={items}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
        >
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <ProductItem
                img1={product.img1}
                img2={product.img2}
                name={product.name}
                brand={product.brand}
                oldPrice={product.oldPrice}
                newPrice={product.newPrice}
                rating={product.rating}
                discount={product.discount}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };


export default SecondProductSlider;