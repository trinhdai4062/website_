import React, { useEffect, useState, createContext, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/user/user.css";
import "../responsive.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserHeader from "../components/common/Header/UserHeader";
import Footer from "../components/common/footer/footer";
import Home from "../components/user/Home/index";
import About from "../components/user//About/index";
import Listing from "../components/user//Listing";
import NotFound from "./NotFound";
import DetailsPage from "../components/user/Details";
import Checkout from "../components/user/checkout";
import Cart from "../components/user/cart";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
import Loader from "../assets/images/loading.gif";
import api from "../api/api";
import { AdminContext } from "../App";
import Chat from "../components/user/Chat/chat";
import { baseURL_ } from "../utils/env";
import { UsbSharp } from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../redux/reducer/authReducer";


const UserContext = createContext();

const UserPage = () => {
  const auth=useSelector(authSelector)
  const context = useContext(AdminContext);
  const [productData, setProductData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [categoriData, setCategoriData] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [isopenNavigation, setIsopenNavigation] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const [isOpenFilters, setIsopenFilters] = useState(false);
  const [search, setSearch] = useState(false);


  useEffect(() => {
    // refreshAccessToken()
    console.log('auth',auth.userInfor.data);
    getDataProduct(`${baseURL_}/shose`);
    getDataCateGori(`${baseURL_}/categori`);

    setTimeout(() => {
      setIsLogin(false);
      setIsloading(false);
    }, 3000); 
  }, []);
  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
  }, [context]);
  // console.log('productData',productData)
  // console.log('categoriData',categoriData)

  const getCartData = async (url) => {
    try {
      await api.get(url).then((response) => {
        setCartItems(response.data);
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const getDataCateGori = async (url) => {
    try {
      await api.get(url).then((response) => {
        if (response.data.status) {
          setCategoriData(response.data.data);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const getDataProduct = async (url) => {
    try {
      await api.get(url).then((response) => {
        if (response.data.status) {
          setProductData(response.data.data);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // const signIn = () => {
  //   const is_Login = localStorage.getItem("isLogin");
  //   setIsLogin(is_Login);
  // };

  // const signOut = () => {
  //   localStorage.removeItem("isLogin");
  //   setIsLogin(false);
  // };

  // const userData = useSelector(authSelector);
  // console.log('userData',userData)

  const openFilters = () => {
    setIsopenFilters(!isOpenFilters);
  };

  const value = {
    windowWidth,
    isOpenFilters,
    // signOut,
    // signIn,
    search,
    setSearch,
    setProductData,
    openFilters,
    isopenNavigation,
    setIsLogin,
    setIsopenNavigation,
  };

  // console.log('data.productData.length',value)
  const data = {
    productData,
    categoriData,
  };
  return (
    // data.productData.length !== 0 && (
    <UserContext.Provider value={value}>
      {isLoading === true && (
        <div className="loader">
          <img src={Loader} />
        </div>
      )}

      <UserHeader data={data} />
      <Routes>
        <Route
          exact={true}
          path="/"
          element={
            <Home categoriData={categoriData} productData={productData} />
          }
        />
        <Route
          exact={true}
          path="/home"
          element={
            <Home categoriData={categoriData} productData={productData} />
          }
        />
        <Route
          exact={true}
          path="/cat/:id"
          element={<Listing categoriData={categoriData} single={true} />}
        />
        {/* <Route
              exact={true}
              path="/cat/:id/:id"
              element={<Listing data={data.productData} single={false} />}
            /> */}
        <Route
          exact={true}
          path="/product/:id"
          element={<DetailsPage productData={productData} />}
        />
        <Route exact={true} path="/cart" element={<Cart />} />
        {/* <Route exact={true} path="/signIn" element={<SignIn />} />
            <Route exact={true} path="/signUp" element={<SignUp />} /> */}
        <Route exact={true} path="/checkout" element={<Checkout />} />
        <Route exact={true} path="/chat" element={<Chat />} />
        {/* <Route exact={true} path="*" element={<NotFound />} /> */}
      </Routes>
      <Footer />
    </UserContext.Provider>
    // )
  );
};

export default UserPage;
export { UserContext };
