// src/pages/AdminPage.js
import "../components/admin/admin.css";
import React, { useContext, useEffect, createContext, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
// import NotFound from './NotFound';
import Dashboard from "../components/admin/Dashboard";

import Profiles from "../components/admin/Profile/Profiles";
import ProfileAdd from "../components/admin/Profile/Add";

import Products from "../components/admin/Products/Products";
import ProductDetails from "../components/admin/Products/ProductDetails";
import ProductUpload from "../components/admin/Products/ProductUpload";
import ProductAdd from "../components/admin/Products/ProductAdd";

import CategoryAdd from "../components/admin/Categories/Add";

import Notifications from "../components/admin/Notifications/Notification";
// import ProductDetails from "../components/admin/Products/ProductDetails";
// import ProductUpload from "../components/admin/Products/ProductUpload";
// import ProductAdd from "../components/admin/Products/ProductAdd";

// import AdminSidebar from "../components/common/Sidebar/AdminSidebar";
// import NotFound from "../pages/NotFound";
import { AdminContext } from "../App";

import Disscounts from "../components/admin/Disscount/Disscount";

import Orders from "../components/admin/Orders/Order";

import Messages from "../components/admin/Messages/Messages";
import Payments from "../components/admin/Payment/Payment";
import DisscountAdd from "../components/admin/Disscount/Add";
import PaymentAdd from "../components/admin/Payment/Add";
import NotificationAdd from "../components/admin/Notifications/Add";
import Category from "../components/admin/Categories/Category";
import CategoriesDetails from "../components/admin/Categories/Details";
import CategoryUpload from "../components/admin/Categories/Upload";
import api, { checkTokenExpiration, refreshAccessToken } from "../api/api";
import { baseURL_,base_ } from "../utils/env";
const AdminPage = () => {
  const context = useContext(AdminContext);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!context.isLogin || !context.shop) {
  //     navigate('/login');
  //   }
  // }, [context, navigate]);
  const accessToken = localStorage.getItem("accessToken");
  const shopp = localStorage.getItem("shop");


  console.log("Access", context);
  console.log("accessToken", accessToken);

  // useEffect(() => {
  //   const U_Data = localStorage.getItem("userData");
  //   const Token = localStorage.getItem("accessToken");

  //   // if (U_Data) {
  //   //   setUserData(U_Data);
  //   //   setRole(JSON.parse(U_Data).role);
  //   // }

  //   // const checkAndRefreshToken = async () => {
  //   //   if (Token) {
  //   //     if (checkTokenExpiration(Token)) {
  //   //       const newAccessToken = await refreshAccessToken();
  //   //       if (newAccessToken) {
  //   //         setAccessToken(newAccessToken);
  //   //         setIsLogin(true);
  //   //       } else {
  //   //         setIsLogin(false);
  //   //       }
  //   //     } else {
  //   //       setAccessToken(Token);
  //   //       setIsLogin(true);
  //   //     }
  //   //   }
  //   // };

  //   // checkAndRefreshToken();
  // }, [isLogin]);
  useEffect(() => {
    if (context.role === "admin") {
      getAdminProducts();
    }
    if (shopp===false) {
      navigate("/login");
    }
    context.setIsLogin(true)
    context.setShop(true)
  }, []);

  const getAdminProducts = async () => {
    try {
      const res = await api.get(`${baseURL_}/auth/user`);
      console.log("resdevice", res.data.data);
      localStorage.setItem("user_", JSON.stringify(res.data.data));
    } catch (error) {
      console.log("error", error);
    }
  };

  // const params = useParams();
  // console.log(params);
  // const { isHideSidebarAndHeader, isToggleSidebar,isLogin,shop,isOnline,role } = useContext(MyContext);
  // const accessToken = localStorage.getItem('accessToken');

  const { isHideSidebarAndHeader, isToggleSidebar, isLogin, shop } =
    useContext(AdminContext);
  // console.log('isHideSidebarAndHeader',isHideSidebarAndHeader);
  return (
    <div>
      <Routes>
        {/* {isLogin && shop && accessToken ?( */}
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {context.role &&
            context.role ==='admin' &&
               (
                <>
                  <Route path="/category" element={<Category />} />
                  <Route
                    path="/category/details/:id"
                    element={<CategoriesDetails />}
                  />
                  <Route path="/category/add" element={<CategoryAdd />} />
                  <Route
                    path="/category/upload/:id"
                    element={<CategoryUpload />}
                  />
                </>
              )}

          <Route path="/products" element={<Products />} />
          <Route path="/product/details/:id" element={<ProductDetails />} />
          <Route path="/product/add" element={<ProductAdd />} />
          <Route path="/product/upload/:id" element={<ProductUpload />} />

          <Route path="/notification" element={<Notifications />} />
          <Route path="/notification/add" element={<NotificationAdd />} />

          <Route path="/disscount" element={<Disscounts />} />
          {/* <Route path="/product/details/:id" element={ <ProductDetails /> } /> */}
          <Route path="/disscount/add" element={<DisscountAdd />} />
          {/* <Route path="/product/upload/:id" element={<ProductUpload />} /> */}

          <Route path="/order" element={<Orders />} />
          {/* <Route path="/product/details/:id" element={ <ProductDetails /> } />
            <Route path="/product/add"  element={<ProductAdd /> }/>
            <Route path="/product/upload/:id" element={<ProductUpload />} /> */}

          <Route path="/message" element={<Messages />} />
          {/* <Route path="/product/details/:id" element={ <ProductDetails /> } />
            <Route path="/product/add"  element={<ProductAdd /> }/>
            <Route path="/product/upload/:id" element={<ProductUpload />} /> */}

          <Route path="/payment" element={<Payments />} />
          {/* <Route path="/product/details/:id" element={ <ProductDetails /> } /> */}
          <Route path="/payment/add" element={<PaymentAdd />} />
          {/* <Route path="/product/upload/:id" element={<ProductUpload />} /> */}

          <Route path="/profile" element={<Profiles />} />
          {/* <Route path="/product/details/:id" element={ <ProductDetails /> } /> */}
          <Route path="/profile/add" element={<ProfileAdd />} />
          {/* <Route path="/product/upload/:id" element={<ProductUpload />} /> */}
        </>
        {/* ):(
            <Route path="/" element={<Navigate to="/user/home" replace />} />
          )}   */}
      </Routes>
    </div>
  );
};

{
  /* <MyContext.Provider value={values}> */
}
//     {
//       isHideSidebarAndHeader !== true &&
//       <Header />
//     }
//     <div className='main d-flex'>
//       {
//         isHideSidebarAndHeader !== true &&
//         <div className={`sidebarWrapper ${isToggleSidebar === true ? 'toggle' : ''}"}>
//           <Sidebar />
//         </div>
//       }
//       <div className={`content ${isHideSidebarAndHeader===true && 'full'} ${isToggleSidebar === true ? 'toggle' : ''}`}>
//       <Routes>
//           <Route path="/" element={isLogin && shop && accessToken ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
//           <Route path="/dashboard" element={isLogin && shop && accessToken && isOnline ? <Dashboard /> : <Navigate to="/login" />} />
//           <Route path="/login" element={!isLogin || !shop || !accessToken || !isOnline ? <Login /> : <Navigate to="/dashboard" />} />
//           <Route path="/signUp" element={<SignUp />} />
//           {/* categori */}
//           <Route path="/category" element={isLogin && shop && accessToken && isOnline ? <Products /> : <Navigate to="/login" />} />
//           {/* <Route path="/category/details/:id" element={isLogin && shop && accessToken && isOnline ? <AddCategory /> : <Navigate to="/login" />} /> */}
//           <Route path="/category/add" element={isLogin && shop && accessToken && isOnline ? <CategoryAdd /> : <Navigate to="/login" />} />
//           {/* <Route path="/category/upload/:id" element={isLogin && shop && accessToken && isOnline ? <ProductUpload /> : <Navigate to="/login" />} /> */}
//           {/* //product */}
//           <Route path="/products" element={isLogin && shop && accessToken && isOnline ? <Products /> : <Navigate to="/login" />} />
//           <Route path="/product/details/:id" element={isLogin && shop && accessToken && isOnline ? <ProductDetails /> : <Navigate to="/login" />} />
//           <Route path="/product/add" element={isLogin && shop && accessToken && isOnline ? <ProductAdd /> : <Navigate to="/login" />} />
//           <Route path="/product/upload/:id" element={isLogin && shop && accessToken && isOnline ? <ProductUpload /> : <Navigate to="/login" />} />
//         </Routes>
//       </div>
//     </div>
//     <ToastContainer />
export default AdminPage;
