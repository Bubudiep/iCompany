import { Button } from "antd";
import React, { useEffect, useState } from "react";
import api from "../components/api";
import app from "../components/app";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../components/context/userContext";
import { io } from "socket.io-client";

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
      window.socket = io("http://localhost:5000", {
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
      });
      socket.emit("user_online");
    } else {
      console.log("Không tìm thấy token!");
      navigate("/login");
    }
  }, []);
  return <div className="flex flex-col p-2">Heelo</div>;
};

export default Homepage;
