import React, { useEffect, useState,useContext } from "react";
import Banner1 from "../../../assets/images/banner1.jpg";
import Banner2 from "../../../assets/images/banner2.jpg";
import Banner3 from "../../../assets/images/banner3.jpg";

import "./style.css";
import api from "../../../api/api";
import { baseURL_, baseIMG_ } from "../../../utils/env";
import { UserContext } from "../../../pages/UserPage";
const Banners = () => {
  const [dataIMG, setDataIMG] = useState([]);
  const context = useContext(UserContext);

  useEffect(() => {
    listIMG();
  }, [context]);

  const listIMG = async () => {
    let arr = [];
    const list = await api.get(`${baseURL_}/imgshose`);
    const findImage = list.data.data.map((img) => img.images).flat();
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * findImage.length);
      arr.push(findImage[randomIndex]);
    }
    setDataIMG(arr);
  };
  
  const resizeIMG = context.windowWidth<992
  const dataToDisplay = resizeIMG ? dataIMG.slice(0, 2) : dataIMG;


  return (
    <div className="bannerSection">
      <div className="container-fluid">
        <div className="row">
          {dataToDisplay &&
            dataToDisplay.length > 0 &&

            dataToDisplay.map((item, index) => (
              <div className="col" key={index}>
                <div className="box">
                  <img
                    src={
                      `${baseURL_}/resize?url=` + item + "&width=200&height=100"
                    }
                    className="w-100 transition"
                    style={{ objectFit: "cover" }}
                    alt={`Image ${index}`}
                  />
                  <span className="new-label">NEW</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Banners;
