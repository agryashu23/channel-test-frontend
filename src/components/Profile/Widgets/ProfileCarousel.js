import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/ProfileCarousel.css";

const ProfileCarousel = ({images}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dotsClass: "slick-dots slick-thumb vertical-dots"
  };



  return (
    <div className="w-full">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="h-full flex items-center justify-center rounded-md ">
            <img src={image.url} alt={`Slide ${index}`} className=" w-full h-full object-cover rounded-md" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProfileCarousel;
