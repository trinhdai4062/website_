import React, { useEffect, useState, useContext } from "react";
import "./style.css";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlined from "@mui/icons-material/FavoriteOutlined";
import CompareArrowsOutlinedIcon from "@mui/icons-material/CompareArrowsOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import {formatVND} from '../../../utils/formart'
import { UserContext } from "../../../pages/UserPage";
import {baseIMG_} from '../../../utils/env';

const Product = (props) => {
  const [productData, setProductData] = useState();
  const [isAdded, setIsadded] = useState(false);

  const context = useContext(UserContext);

  useEffect(() => {
    setProductData(props.item);
  }, [props.item]);

  const setProductCat = () => {
    sessionStorage.setItem("parentCat", productData.parentCatName);
    sessionStorage.setItem("subCatName", productData.subCatName);
  };
  const handleFavorite=()=>{
    console.log("handleFavorite")
  }
  const addToCart = (item) => {
    context.addToCart(item);
    setIsadded(true);
  };
  return (
    <div className="productThumb" onClick={setProductCat}>
      {productData && productData.discount > 0 && (
        <span className={`badge ${productData.discount}`}>
          Giảm giá {productData.discount}%
        </span>
      )}
      {productData && (
        <>
          <Link to={`/user/product/${productData._id}`}>
            <div className="imgWrapper">
              <div className="image-wrapper p-4 wrapper">
                <img src={baseIMG_+productData.imageUrl} className="w-100" />
              </div>
              <div className="overlay transition">
                <ul className="list list-inline mb-0">
                  <li className="list-inline-item">
                      <a
                        link="favorite"
                        className="cursor"
                        tooltip="Add to Wishlist"
                        onClick={() => handleFavorite()}
                      >
                        <FavoriteBorderOutlinedIcon />
                      </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="cursor" tooltip="Compare">
                      <CompareArrowsOutlinedIcon />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="cursor" tooltip="Quick View">
                      <RemoveRedEyeOutlinedIcon />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Link>

          <div className="info">
            <span className="d-block catName">{productData.brand}</span>
            <h4
              className="title"
              style={{ wordWrap: "break-word", height: 50 }}
            >
              <Link>{productData.name.substr(0, 50) + "..."}</Link>
            </h4>
            <Rating
              name="half-rating-read"
              value={parseFloat(productData.star)}
              precision={0.5}
              readOnly
            />
            <div>
              <span className="oldPrice ml-auto">
                Giá ban đầu {formatVND(productData.price)}
              </span>
            </div>

            <div className="d-flex align-items-center mt-3">
              <div className="d-flex align-items-center w-100">
                <span className="price text-g font-weight-bold">
                  Giá hiện tại {" "}
                  {productData.discount
                    ? formatVND(
                        productData.price -
                          productData.price * (productData.discount / 100)
                      )
                    : formatVND(productData.price)}
                </span>
                {/* <span className='oldPrice ml-auto'>Sale {formatPrice(productData.price)}</span> */}
              </div>
            </div>
            <Button
              className="w-100 transition mt-3"
              onClick={() => addToCart(productData)}
            >
              <ShoppingCartOutlinedIcon />
              {isAdded === true ? "Đã mua" : "Mua ngay"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
