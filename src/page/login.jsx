import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import app from "../components/app";
import api from "../components/api";
import "../assets/css/login.css";
import { Input, Button, message, notification, Popconfirm } from "antd";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const author = import.meta.env.VITE_AUTHOR;
  const version = import.meta.env.VITE_VERSION;
  const passwordRef = useRef();
  const checkAuth = async () => {
    try {
      const token = app.getCookie("token");
      console.log(token);
      if (token) {
        api.get("/user/", token).then((res) => {
          navigate("/app/?from=login");
        });
      } else {
        // Kiểm tra localStorage
        const savedUsername = localStorage.getItem("username");
        const savedPassword = localStorage.getItem("password");
        if (savedUsername && savedPassword) {
          setUsername(savedUsername);
          setPassword(savedPassword);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    checkAuth();
    try {
      api.send("unmaximize");
      api.send("resize", false);
    } catch (err) {
      console.error("Not support electron!", err);
    }
  }, []);

  const handleLogin = (e) => {
    setLoading(true);
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    if (username && password) {
      api
        .post("/login/", {
          username: username,
          password: password,
        })
        .then((response) => {
          const token = response.access_token;
          const expirationTime = new Date();
          expirationTime.setTime(
            expirationTime.getTime() + 7 * 24 * 60 * 60 * 1000
          );
          document.cookie = `token=${token}; expires=${expirationTime.toUTCString()}; path=/`;
          navigate("/app/?from=login");
        })
        .catch((err) => {
          notification.error({
            message: "Lỗi",
            description: err?.response?.data?.detail ?? "Không xác định!",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      message.info("Chưa nhập đủ thông tin!");
      setLoading(false);
    }
  };

  return (
    <div className="login-page h-screen flex items-center justify-center">
      {/* Left Section */}
      <div className="video-container hidden md:block w-1/2 p-2 bg-gray-50">
        <img
          src="https://noithatduckhang.com/wp-content/uploads/2021/12/1-18.jpg"
          alt="Dashboard"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Section */}
      <div className="login-container w-full md:w-1/2 p-8">
        <div className="login-box">
          <div className="header text-2xl font-bold text-blue-600 mb-2">
            Xin chào,
          </div>
          <div className="hi text-blue-500 mb-6">
            Chào mừng bạn quay trở lại!
          </div>
          <div className="form">
            <div className="items mb-4">
              <div className="name block text-sm font-medium text-gray-700">
                Tài khoản
              </div>
              <div className="value mt-1 block w-70 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 sm:text-sm">
                <Input
                  type="text"
                  id="username"
                  className="input-login outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="tên truy cập...."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") passwordRef.current.select();
                  }}
                />
              </div>
            </div>
            <div className="items mb-4">
              <div className="name block text-sm font-medium text-gray-700">
                Mật khẩu
              </div>
              <div className="value w-70 border-2 border-gray-300 rounded-md">
                <Input.Password
                  type="password"
                  id="password"
                  className="password-login block w-70"
                  value={password}
                  ref={passwordRef}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                  required
                  placeholder="mật khẩu...."
                />
              </div>
            </div>
          </div>
          <div className="login-btn">
            <Button
              className="w-70 bg-blue-700 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md border-2 border-black-700 transition duration-200"
              id="login-btn"
              onClick={handleLogin}
              loading={loading}
            >
              Đăng nhập
            </Button>
          </div>
          <div className="with-zalo">
            <button className="w-70 mt-4 bg-white border-1 border-blue-500  hover:bg-blue-200 hover:text-white-700 text-blue-600 font-medium text-1xl py-2 px-4 rounded-md transition duration-200 cursor-pointer">
              Đăng nhập bằng Zalo
            </button>
          </div>
          <div className="fc g4">
            <div className="flex register hover:underline mt-6 justify-between text-sm text-blue-600 cursor-pointer">
              Đăng ký tài khoản mới
            </div>
            <div
              className="flex forget-pass hover:underline cursor-pointer"
              href="#"
            >
              Quên mật khẩu?
            </div>
            <div className="flex">
              <Popconfirm
                title="Thoát"
                description="Bạn thật sự muốn thoát?"
                onConfirm={() => {
                  api.send("exit");
                }}
              >
                <div className="exit mt-1 text-sm text-gray-600 hover:underline cursor-pointer">
                  Thoát
                </div>
              </Popconfirm>
            </div>
          </div>
          <div className="app-version">
            <div className="version">{version}</div>
            <div className="logo">{author}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
