import "bootstrap/dist/css/bootstrap.min.css";
// import "./pages/Admin.css"
import { createContext, useEffect, useState } from "react";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import "react-toastify/dist/ReactToastify.css";
// import api, { checkTokenExpiration, refreshAccessToken } from "./api/api";
import {
  BrowserRouter,
  Route,
  Routes,
  Switch,
  Navigate,
} from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import NotFound from "./pages/NotFound";
import AdminHeader from "./components/common/Header/AdminHeader";
import AdminSidebar from "./components/common/Sidebar/AdminSidebar";
import { messaging } from "./firebase";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { getToken,onMessage } from 'firebase/messaging';




const AdminContext = createContext();

function App() {
  

  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [themeMode, setThemeMode] = useState(true);
  const [role, setRole] = useState("");
  const [shop, setShop] = useState(false);
  const [userData, setUserData] = useState();
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const theme_Mode = localStorage.getItem("themeMode");

    if (themeMode === true) {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      localStorage.setItem("themeMode", "light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      localStorage.setItem("themeMode", "dark");
    }
  }, [themeMode]);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
   
  }, []);

  useEffect(() => {
    
    getFCMToken()
    receiveNotification();
  }, []);

const KEY_NOTIFICATION='BM3Y2Pjac_cXYLqdMcakUzyRr18yJVgFmzLvLB6TeLaxKVWAEH-IU6waqCyrPighwscW6IGwtniojdS1diOptJA'
  const getFCMToken = async () => {
    try {
      const currentToken = await getToken(messaging, { vapidKey: KEY_NOTIFICATION });
      if (currentToken) {
        console.log('Current token:', currentToken);

      } 
    } catch (error) {
      console.error('Error retrieving FCM token:', error);
    }
  };
  const receiveNotification = async() => {
   const aa= await onMessage(messaging,(payload) => {
      console.log('Received message:', payload);

      // Customize notification display (e.g., toast, alert)
      toast.info(payload.notification.title);
      alert(`New notification: ${payload.notification.title}`);
    });
  };

  useEffect(() => {
    const U_Data = localStorage.getItem("userData");
    const Token = localStorage.getItem("accessToken");
    // console.log('Token', Token);
    if (U_Data) {
      setUserData(U_Data);
      setRole(JSON.parse(U_Data).role);
    }
    if (Token) {
      setAccessToken(Token);
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
    
  }, [accessToken]);





  

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
    setShop,
  };

  return (
    <BrowserRouter>
      <AdminContext.Provider value={values}>
        {!isHideSidebarAndHeader && <AdminHeader />}
        <div className="main d-flex">
          {isHideSidebarAndHeader !== true && (
            <div
              className={`sidebarWrapper ${
                isToggleSidebar === true ? "toggle" : ""
              }`}
            >
              <AdminSidebar />
            </div>
          )}
          <div
            className={`content ${isHideSidebarAndHeader === true && "full"} ${
              isToggleSidebar === true ? "toggle" : ""
            }`}
          >
            <Routes>
            <Route
                path={`/login`}
                element={
                  <Login setIsLogin={setIsLogin} setAccessToken={setAccessToken} />
                }
              />
              {/* <Route path={`/login`} element={<Login />} /> */}
              <Route path={`/signUp`} element={<SignUp />} />
              <Route
                path="/dashboard"
                element={
                  isLogin && shop && accessToken && isOnline ? (
                    <AdminPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="/admin/*" element={<AdminPage />} />
              <Route path="/user/*" element={<UserPage />} />
              <Route path="/" element={<Navigate to="/user/home" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
        <ToastContainer />
      </AdminContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { AdminContext };
