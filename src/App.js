import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { createContext, useEffect, useState } from 'react';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Products from './pages/Products/Products';
import ProductDetails from './pages/Products/ProductDetails';
import ProductUpload from './pages/Products/ProductUpload';
import ProductAdd from './pages/Products/ProductAdd';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api, { checkTokenExpiration, refreshAccessToken } from './api/api'; 

const MyContext = createContext();

function App() {

  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [themeMode, setThemeMode] = useState(true);
  const [role, setRole] = useState('');
  const [shop, setShop] = useState(false);
  const [userData, setUserData] = useState();
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Thêm trạng thái kết nối internet

  useEffect(()=>{

    const theme_Mode = localStorage.getItem('themeMode');

   if(themeMode===true){
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    localStorage.setItem('themeMode','light');
   }
   else{
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    localStorage.setItem('themeMode','dark');
   }
  },[themeMode]);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const U_Data = localStorage.getItem('userData');
    const Token = localStorage.getItem('accessToken');

    if (U_Data) {
      setUserData(U_Data);
      setRole(JSON.parse(U_Data).role);
    }

    const checkAndRefreshToken = async () => {
      if (Token) {
        if (checkTokenExpiration(Token)) {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            setAccessToken(newAccessToken);
            setIsLogin(true);
          } else {
            setIsLogin(false);
          }
        } else {
          setAccessToken(Token);
          setIsLogin(true);
        }
      }
    };

    checkAndRefreshToken();
  }, [isLogin]);



  // useEffect(()=>{
  //   const U_Data = localStorage.getItem('userData');
  //   const Token = localStorage.getItem('accessToken');
  // //  console.log('userData',userData);
  //  if(U_Data) { setUserData(U_Data);setRole(JSON.parse(U_Data).role)}
  //  if(Token){ setAccessToken(Token)}

  // },[isLogin]);

  // console.log('setUserData',userData)
  // console.log('acctoken',accessToken)

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,
    themeMode,
    setThemeMode,
    role,
    shop,
    setShop
  }

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        {
          isHideSidebarAndHeader !== true &&
          <Header />
        }
        <div className='main d-flex'>
          {
            isHideSidebarAndHeader !== true &&
            <div className={`sidebarWrapper ${isToggleSidebar === true ? 'toggle' : ''}`}>
              <Sidebar />
            </div>
          }
          <div className={`content ${isHideSidebarAndHeader===true && 'full'} ${isToggleSidebar === true ? 'toggle' : ''}`}>
          <Routes>
              <Route path="/" element={isLogin && shop && accessToken ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
              <Route path="/dashboard" element={isLogin && shop && accessToken && isOnline ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/login" element={!isLogin || !shop || !accessToken || !isOnline ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/products" element={isLogin && shop && accessToken && isOnline ? <Products /> : <Navigate to="/login" />} />
              <Route path="/product/details/:id" element={isLogin && shop && accessToken && isOnline ? <ProductDetails /> : <Navigate to="/login" />} />
              <Route path="/product/add" element={isLogin && shop && accessToken && isOnline ? <ProductAdd /> : <Navigate to="/login" />} />
              <Route path="/product/upload/:id" element={isLogin && shop && accessToken && isOnline ? <ProductUpload /> : <Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
        <ToastContainer />
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext }
