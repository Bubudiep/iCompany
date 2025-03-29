import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import app from "../components/app";
import api from "../components/api";
import { Button, message, notification, Popconfirm } from "antd";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
          navigate("/electron/?fromLogin=true");
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
      console.error("Not support electron!");
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
          navigate("/electron/?fromLogin=true");
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
    <div className="login-page">
      <div className="video-container">
        <div className="video-description">
          <div className="box-sizing"></div>
        </div>
      </div>
      <div className="login-container">
        <div className="login-box">
          <div className="header">Xin chào,</div>
          <div className="hi">Chào mừng bạn quay trờ lại!</div>
          <div className="form">
            <div className="items">
              <div className="name">Tài khoản</div>
              <div className="value">
                <input
                  type="text"
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
            <div className="items">
              <div className="name">Mật khẩu</div>
              <div className="value">
                <input
                  type="password"
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
            <Button id="login-btn" onClick={handleLogin} loading={loading}>
              Đăng nhập
            </Button>
          </div>
          <div className="with-zalo">
            <button>Đăng nhập bằng Zalo</button>
          </div>
          <div className="fc g4">
            <div className="flex register">Đăng ký tài khoản mới</div>
            <div className="flex forget-pass">Quên mật khẩu?</div>
            <div className="flex">
              <Popconfirm
                title="Thoát"
                description="Bạn thật sự muốn thoát?"
                onConfirm={() => {
                  api.send("exit");
                }}
              >
                <div className="exit">Thoát</div>
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
