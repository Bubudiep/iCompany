import React, { useEffect, useState } from "react";
import { useUser } from "../components/context/userContext";
import { useCookies } from "react-cookie";
import { data, Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/icon/icon.png";
import { io } from "socket.io-client";
import api from "../components/api";
import App_tools from "./layout/app-tools";
import App_lists from "./layout/app-list";
import { notification } from "antd";
import app from "../components/app";
const removeQueryParam = (key) => {
  const url = new URL(window.location.href);
  url.searchParams.delete(key);
  window.history.replaceState({}, document.title, url.toString());
};
const Homepage_layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [cookies] = useCookies(["newversion_token"]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [checkauthfade, setCheckauthfade] = useState(false);
  const [checkauth, setCheckauth] = useState(true);
  const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET;
  const APP_NAME = import.meta.env.APP_NAME;
  const [listOnline, setListOnline] = useState([]);
  const mapLinks = {
    app: "Trang chủ",
    chat: "Trò chuyện",
    contacts: "Danh bạ",
    settings: "Cài đặt",
    all: "Tất cả",
    operators: "Nhân lực",
    add: "Thêm mới",
    work_report: "Báo cáo đi làm",
    group: "Nhóm",
    department: "Bộ phận",
    chatted: "Đã nhắn tin",
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
    if (location.search.includes("f=1")) {
      app.send("maximized");
      removeQueryParam("f");
    }
  }, [location.pathname]);
  useEffect(() => {
    const token = cookies.newversion_token;
    if (token) {
      console.log("Có token:", token);
      api
        .get("/user/", token)
        .then(async (res) => {
          if (location.search.includes("f=2")) {
            app.send("maximized");
            removeQueryParam("f");
          }
          if (!res?.id) navigate("/login/");
          const banks = await api.get("/banks/");
          setUser({ ...res, token: token, banks: banks });
          if (window?.electron) {
            window.electron.on("message-from-main", (event, arg) => {
              console.log("data:", { event });
              if (event.type === "notification-click") {
                if (event.data.type === "user_chat") {
                  const chat_data = event.data.data;
                  const room = chat_data.room;
                  const room_link = `/app/chat/${room}`;
                  navigate(room_link);
                }
              }
            });
          }
          if (res) {
            window.socket = io(SOCKET_SERVER_URL, {
              extraHeaders: {
                ApplicationKey: api.key,
                Authorization: "Bearer " + token,
              },
            });
            window.socket.on("connect", () => {
              console.log("Connected to server");
              window.socket.emit("user_online");
            });
            window.socket.on("disconnect", () => {
              console.log("Disconnected from server");
            });
            window.socket.on("error", (error) => {
              console.error("Socket error:", error);
            });
          }
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
    } else {
      console.log("Không tìm thấy token!");
      navigate("/login");
    }
    return () => {
      if (window?.socket) window.socket.disconnect();
      if (window.electron)
        window.electron.removeAllListeners("message-from-main");
    };
  }, []);
  useEffect(() => {
    if (window.socket && user) {
      window.socket.on("online_users", (data) => {
        console.log("Online users:", data);
        if (data?.action === "all_users") {
          setListOnline(data.data);
          setUser((old) => ({
            ...old,
            onlines: data.data,
          }));
        }
        if (data?.action === "dissconnect") {
          setListOnline((old) => [
            ...old.filter((item) => item.user.id !== data.data.id),
          ]);
          setUser((old) => ({
            ...old,
            onlines: old.onlines.filter(
              (item) => item.user.id !== data.data.id
            ),
          }));
        }
        if (data?.action === "connect") {
          setListOnline((old) => [
            ...old.map((item) =>
              item.user.id !== data.data.id ? item : data.data
            ),
          ]);
          setUser((old) => {
            const in_old = old.onlines.find((item) => item.id === data.data.id);
            if (in_old) {
              return {
                ...old,
                onlines: old.onlines.map((item) =>
                  item.id === data.data.id ? data.data : item
                ),
              };
            } else {
              return {
                ...old,
                onlines: [...old.onlines, data.data],
              };
            }
          });
        }
      });
      window.socket.on("message", (data) => {
        console.log("Data from socket messages: ", data);
        if (data.type === "message") {
          const sender = user?.company?.Staff.find(
            (staff) => staff.id === data.data.sender
          );
          const room_link = `/app/chat/${data.data.room}`;

          if (!location.pathname.includes(room_link) && sender) {
            window?.electron?.send("Notice", {
              appname: APP_NAME,
              silent: true,
              icon: sender?.profile?.avatar || undefined,
              click_data: {
                type: "user_chat",
                data: data.data,
              },
              title:
                sender?.profile?.full_name ||
                `${sender?.username} (${sender?.cardID})`,
              body: data?.data?.message,
            });
          }
          // Chỉ tăng chat_not_read nếu không ở trong phòng chat hiện tại
          setUser((old) => {
            const config = old.app_config || {};
            return {
              ...old,
              app_config: {
                ...config,
                chat_not_read: (config.chat_not_read || 0) + 1,
              },
            };
          });
        }
      });
      return () => {
        window.socket.off("online_users");
        window.socket.off("message");
      };
    }
  }, [location.pathname, window.socket]);
  const mapBreadcrumb = (name) => mapLinks[name] || decodeURIComponent(name);
  return (
    <div className="app">
      {checkauth && (
        <div
          className={`loading_box ${checkauthfade ? "fadeOut" : ""}`}
          role="status"
          aria-live="polite"
        >
          <div className="loader">
            <div className="square"></div>
            <div className="square"></div>
            <div className="square"></div>
            <div className="square"></div>
          </div>
        </div>
        // <div className={`loading_box ${checkauthfade ? "fadeOut" : ""}`}>
        //   <div className="box">
        //     <img src={logo} />
        //     <div className="loader"></div>
        //   </div>
        // </div>
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
                        <Link to={crumb.path}>{mapBreadcrumb(crumb.name)}</Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="app-tools">
                <App_tools user={user} />
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
