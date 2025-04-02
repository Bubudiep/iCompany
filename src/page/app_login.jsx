import React, { useState } from "react";
import api from "../components/api";
import { Button, message } from "antd";
import { GoAlertFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import logo from "../assets/icon/icon.png";

const LoginModal = ({ onClose }) => {
  const [cookies, setCookie] = useCookies(["newversion_token"]);
  const [username, setUsername] = useState(
    localStorage.getItem("username") ?? ""
  );
  const [password, setPassword] = useState(
    localStorage.getItem("password") ?? ""
  );
  const [error, setError] = useState("");
  const [loging, setLoging] = useState(false);
  const navigate = useNavigate();
  const handleLogin = () => {
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    if (loging == true) return;
    setLoging(true);
    if (!username || !password) {
      message.error("Please input the data!");
      setLoging(false);
      return;
    }
    api
      .post("/login/", {
        username: username,
        password: password,
      })
      .then((response) => {
        {
          if (!response.access_token) throw new Error("Login failed");
          setCookie("newversion_token", response.access_token, {
            path: "/",
            maxAge: response.expires_in, // Thời gian sống của cookie (giây)
            sameSite: "Strict", // Chống CSRF
          });
          navigate("/electron/?f=1");
        }
      })
      .finally(() => {
        setTimeout(() => {
          setLoging(false);
        }, 1000);
      })
      .catch((error) => {
        setTimeout(() => {
          setLoging(false);
          console.log(error);
          message.error("Sai tài khoản hoặc mật khẩu");
        }, 1000);
      });
  };
  return (
    <div className="login-modal">
      <div className="form">
        <div className="flex justify-center">
          <img src={logo} className="!w-[50px]" />
        </div>
        <div className="hint mt-5 mb-2 text-center font-[600] text-[24px] text-[#3e6191]">
          APP LOGIN
        </div>
        <div className="flex-column">
          <label>Email </label>
        </div>
        <div className="inputForm">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex-column">
          <label>Password </label>
        </div>
        <div className="inputForm">
          <input
            type="password"
            placeholder="Mật khẩu"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleLogin();
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2 text-[13px] justify-center pt-3 text-cyan-600">
          <GoAlertFill />
          Contact MES team if you no have account!
        </div>
        <Button
          loading={loging}
          className="button-submit"
          onClick={handleLogin}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default LoginModal;
