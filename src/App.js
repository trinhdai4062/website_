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
import { getToken, onMessage } from "firebase/messaging";
import { KEY_NOTIFICATION } from "./utils/env";

import { Provider } from "react-redux";
import store from "./redux/store";

const AdminContext = createContext();

function App() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [themeMode, setThemeMode] = useState(true);
  const [role, setRole] = useState(false);
  const [shop, setShop] = useState(false);

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token")
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
    getFCMToken();
    receiveNotification();
  }, []);
  const getFCMToken = async () => {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: KEY_NOTIFICATION,
      });
      if (currentToken) {
        console.log("Current token:", currentToken);
      }
    } catch (error) {
      console.error("Error retrieving FCM token:", error);
    }
  };
  const receiveNotification = async () => {
    const aa = await onMessage(messaging, (payload) => {
      console.log("Received message:", payload);

      // Customize notification display (e.g., toast, alert)
      toast.info(payload.notification.title);
      alert(`New notification: ${payload.notification.title}`);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const shop = localStorage.getItem("shop");
    const role = localStorage.getItem("setRole");
    // console.log('Token', token);
    role==='admin'?setRole(true) : setRole(false);
    if (token &&shop) {
      setShop(true);
      setIsLogin(true);
    } else {
      setShop(false);
      setIsLogin(false);
    }
  }, [accessToken]);

  // console.log('acctoken',accessToken)

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,
    themeMode,
    role,
    setThemeMode,
  };

  return (
    <Provider store={store}>
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
              className={`content ${
                isHideSidebarAndHeader === true && "full"
              } ${isToggleSidebar === true ? "toggle" : ""}`}
            >
              <Routes>
                <Route
                  path={`/login`}
                  element={
                    <Login
                      setIsLogin={setIsLogin}
                      setAccessToken={setAccessToken}
                    />
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
                <Route
                  path="/"
                  element={<Navigate to="/user/home" replace />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
          <ToastContainer />
        </AdminContext.Provider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
export { AdminContext };
