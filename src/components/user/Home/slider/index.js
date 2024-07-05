import React, { useEffect, useContext, useState, useRef } from "react";
import Slider from "react-slick";
import "./index.css";
import Newsletter from "../../../common/newsletter";
import { UserContext } from "../../../../pages/UserPage";
import api from "../../../../api/api";
import { baseURL_ } from "../../../../utils/env";

const HomeSlider = () => {
  const [dataIMG, setDataIMG] = useState([]);
  const [animationCompleted, setAnimationCompleted] = useState(true);
  const context = useContext(UserContext);
  const sliderRef = useRef(null);

  useEffect(() => {
    listIMG();
  }, []);

  const listIMG = async () => {
    const list = await api.get(`${baseURL_}/imgshose`);
    const findImage = list.data.data.map((img) => img.images).flat();
    const uniqueImages = [...new Set(findImage)];
    setDataIMG(uniqueImages);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current && animationCompleted ) {
        sliderRef.current.slickNext();
        setAnimationCompleted(false)
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRandomImages = () => {
    let selectedImages = [];
    let availableImages = [...dataIMG];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * availableImages.length);
      selectedImages.push(availableImages[randomIndex]);
      availableImages.splice(randomIndex, 1);
    }
    return selectedImages;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    fade: true,
    afterChange: (currentSlide) => {
        const images = document.querySelectorAll(".image");
        images.forEach((image) => image.classList.remove("active"));
        setTimeout(() => {
          images.forEach((image) => image.classList.add("active"));
          setAnimationCompleted(true);
        }, 6000); 
      },                
  };

  return (
    <section className="homeSlider">
      <div className="container-fluid position-relative">
        <Slider ref={sliderRef} {...settings} className="home_slider_Main">
          {dataIMG.length >= 4 &&
            Array.from({ length: Math.ceil(dataIMG.length / 4) }).map(
              (_, index) => {
                const [leftImage, topImage, rightImage, bottomImage] =
                  getRandomImages();
                return (
                  <div key={index} className="item">
                    <div className="image-merge-container">
                      <div className={`zoom-out ${animationCompleted ? 'hidden' : ''}`}>
                        <div className="left-image">
                          <img
                            src={`${baseURL_}/resize?url=${leftImage}&width=500&height=600`}
                            alt="Left Image"
                            className="image slide-from-left"
                          />
                        </div>
                        <div className="top-image">
                          <img
                            src={`${baseURL_}/resize?url=${topImage}&width=500&height=600`}
                            alt="Top Image"
                            className="image slide-from-top"
                          />
                        </div>
                        <div className="right-image">
                          <img
                            src={`${baseURL_}/resize?url=${rightImage}&width=500&height=600`}
                            alt="Right Image"
                            className="image slide-from-right"
                          />
                        </div>
                      </div>
                      <div className={`bottom-image ${animationCompleted ? '' : 'hidden'}`}>
                        <img
                          src={`${baseURL_}/resize?url=${bottomImage}&width=1000&height=600`}
                          alt="Bottom Image"
                          className={`image zoom-in ${animationCompleted ? "active" : ""}`}
                        />
                      </div>
                    </div>
                    <div className="info">
                      <h2 className="mb-4">
                        Don’t miss amazing
                        <br />
                        grocery deals
                      </h2>
                      <p>Sign up for the daily newsletter</p>
                    </div>
                  </div>
                );
              }
            )}
        </Slider>

        {context.windowWidth > 992 && <Newsletter />}
      </div>
    </section>
  );
};

export default HomeSlider;
