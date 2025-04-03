import React, { useEffect, useState } from "react";
import { useUser } from "../components/context/userContext";
import { useCookies } from "react-cookie";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/icon/icon.png";
import { io } from "socket.io-client";
import api from "../components/api";
import App_tools from "./layout/app-tools";
import App_lists from "./layout/app-list";

const Homepage_layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [cookies] = useCookies(["newversion_token"]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [checkauthfade, setCheckauthfade] = useState(false);
  const [checkauth, setCheckauth] = useState(true);
  const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET;
  const [listOnline, setListOnline] = useState([]);
  const checkUserAuth = async (token) => {
    if (!token) {
      setTimeout(() => {
        navigate("/login/");
      }, 1000);
      return;
    }
    api
      .get("/user/", token)
      .then((res) => {
        if (!res?.id) navigate("/login/");
        setUser({ ...res, token: token });
        // api.send("maximized");
        setTimeout(() => {
          setCheckauthfade(true);
          setTimeout(() => {
            setCheckauth(false);
          }, 400);
        }, 600);
      })
      .catch((error) => {
        console.error("Authentication failed:", error);
        navigate("/login/");
      });
  };
  const mapLinks = {
    app: "Trang chủ",
    chat: "Trò chuyện",
  };
  useEffect(() => {
    const basePath = "/app";
    let pathname = location.pathname.startsWith(basePath)
      ? location.pathname.slice(basePath.length)
      : location.pathname;
    const pathnames = pathname.split("/").filter((x) => x);
    let breadcrumbPath = basePath;

    const newBreadcrumbs = pathnames.map((name) => {
      breadcrumbPath += `/${name}`;
      return { name: decodeURIComponent(name), path: breadcrumbPath };
    });

    setBreadcrumbs(newBreadcrumbs);
  }, [location.pathname]);
  useEffect(() => {
    const token = cookies.newversion_token;
    // setAppLoading(true);
    if (token) {
      console.log("Có token:", token);
      checkUserAuth(token);
      window.socket = io(SOCKET_SERVER_URL, {
        extraHeaders: {
          ApplicationKey: api.key,
          Authorization: "Bearer " + token,
        },
      });
      window.socket.on("online_users", (data) => {
        console.log(data);
        const seenIds = new Set();
        const uniqueUsers = [];
        for (const item of data) {
          const id = item.user.id;
          if (!seenIds.has(id)) {
            seenIds.add(id);
            uniqueUsers.push(item);
          }
        }
        if (user)
          setListOnline(uniqueUsers.filter((item) => item.user.id !== user.id));
      });
      window.socket.on("message", (data) => {
        console.log(data);
        if (data.type === "message") {
          notification.open({
            message: data?.user?.full_name,
            description: data?.data?.message,
            duration: 3,
          });
        }
      });
      window.socket.emit("user_online");
      return () => {
        console.log("👋 Disconnect socket");
        window.socket.disconnect();
      };
    } else {
      console.log("Không tìm thấy token!");
      navigate("/login");
    }
  }, []);
  return (
    <div className="app">
      {checkauth && (
        <div className={`loading_box ${checkauthfade ? "fadeOut" : ""}`}>
          <div className="box">
            <img src={logo} />
            <div className="loader"></div>
          </div>
        </div>
      )}
      {checkauthfade && (
        <>
          <App_lists />
          <div className="main-list">
            <div className="top-container">
              <div className="router">
                <div className="view">
                  <div className="breadcrumb">
                    <Link to="/app">
                      <i className="fa-solid fa-house"></i>
                    </Link>
                    {breadcrumbs.map((crumb, index) => (
                      <div key={index}>
                        <i className="fa-solid fa-caret-right icon"></i>
                        <Link to={crumb.path}>
                          {mapLinks[decodeURIComponent(crumb.name)] ??
                            crumb.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="app-tools">
                <App_tools />
              </div>
            </div>
            <div className="main-container">
              <Outlet />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Homepage_layout;
