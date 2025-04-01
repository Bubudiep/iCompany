import { Button, Input, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import api from "../components/api";
import app from "../components/app";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../components/context/userContext";
import { io } from "socket.io-client";
import Chat from "./chat";

const Homepage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [searchParams] = useSearchParams();
  const [appLoading, setAppLoading] = useState(true);
  const [loadOut, setLoadOut] = useState(false);
  const [loadShow, setLoadShow] = useState(false);
  const key = import.meta.env.VITE_KEY;
  const author = import.meta.env.VITE_AUTHOR;
  const version = import.meta.env.VITE_VERSION;
  const socketServer = import.meta.env.VITE_SOCKET;
  const [message, setMessage] = useState("");
  const handleSend = () => {
    if (message.trim() === "") return;
    window.socket.emit("message", {
      type: "user",
      to: 1, // bạn có thể thay bằng userId hoặc chọn từ danh sách
      message: message.trim(),
    });
    setMessage(""); // clear sau khi gửi
  };
  const checkUser = async (token) => {
    await api
      .get("/user/", token)
      .then((res) => {
        setUser({
          ...res,
          key: key,
          token: token,
        });
        const isFirstLoad = searchParams.get("fistLoad");
        const isFromLogin = searchParams.get("fromLogin");
        if (isFirstLoad || isFromLogin) {
          try {
            api.send("resize", true);
            api.send("maximized");
          } catch (e) {}
        }
        setTimeout(() => {
          setLoadOut(true);
          setTimeout(() => {
            setLoadShow(true);
            setAppLoading(false);
          }, 400);
        }, 1000); // 1000 ms = 1 giây
      })
      .catch((err) => {
        console.log(err);
        navigate("/login");
      })
      .finally(() => {
        setTimeout(() => {
          setLoadOut(true);
          setTimeout(() => {
            setLoadShow(true);
            setAppLoading(false);
          }, 300);
        }, 1000); // 1000 ms = 1 giây
      });
  };
  useEffect(() => {
    setAppLoading(true);
    const token = app.getCookie("token");
    if (token) {
      console.log("Có token:", token);
      checkUser(token);
      window.socket = io(socketServer, {
        extraHeaders: {
          ApplicationKey: api.key,
          Authorization: "Bearer " + token,
        },
      });
      socket.on("online_users", (data) => {
        console.log(data);
      });
      socket.on("message", (data) => {
        console.log(data);
        if (data.type === "message") {
          notification.open({
            message: data?.user?.full_name,
            description: data?.data?.message,
            duration: 3,
          });
        }
      });
      socket.emit("user_online");
      return () => {
        console.log("👋 Disconnect socket");
        socket.disconnect();
      };
    } else {
      console.log("Không tìm thấy token!");
      navigate("/login");
    }
  }, []);
  return (
    <>
      {/* <div className="flex flex-col">
        <div className="flex gap-2 p-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            onPressEnter={handleSend}
          />
          <Button type="primary" onClick={handleSend}>
            Gửi
          </Button>
        </div>
      </div> */}
      <Chat />
    </>
  );
};

export default Homepage;
