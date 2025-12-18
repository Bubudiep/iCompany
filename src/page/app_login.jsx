import React, { useEffect, useState } from "react";
import api from "../components/api";
import { Button, message } from "antd";
import { GoAlertFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import logo from "../assets/icon/icon.png";
import hldjc from "../assets/icon/hldjc.png";
import hrpro from "../assets/icon/hr-pro.jpg";
const APP_NAME = import.meta.env.VITE_APP_NAME;
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
      message.warning("Chưa nhập đủ thông tin!");
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
          navigate("/app/?f=1");
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
  useEffect(() => {
    if (window?.electron) {
      window?.electron.send("size", {
        width: 450,
        height: 600,
      });
    }
  }, []);
  return (
    <div className="login-modal">
      <div className="form mb-5 select-none drag">
        {APP_NAME === "HL" && (
          <>
            <div className="flex justify-center">
              <img src={hldjc} className="!w-[120px]" />
            </div>
            <div className="hint leading-4 mb-5 text-center font-[700] text-[24px] text-[#007e26]">
              HOÀNG LONG DJC
            </div>
          </>
        )}
        {APP_NAME === "HL2" && (
          <>
            <div className="flex justify-center">
              <img src={hldjc} className="!w-[120px]" />
            </div>
            <div className="hint leading-4 mb-5 text-center font-[700] text-[24px] text-[#007e26]">
              HOÀNG LONG 2 DJC
            </div>
          </>
        )}
        {APP_NAME === "HRPRO" && (
          <div className="flex justify-center">
            <img src={hrpro} className="!w-[400px] -my-20" />
          </div>
        )}
        <div className="flex-column">
          <label>Tài khoản </label>
        </div>
        <div className="inputForm">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            className="no-drag"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex-column">
          <label>Mật khẩu </label>
        </div>
        <div className="inputForm">
          <input
            type="password"
            placeholder="Mật khẩu"
            autoComplete="off"
            value={password}
            className="no-drag"
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
          Liên hệ admin để thêm tài khoản (nếu cần)
        </div>
        <Button
          loading={loging}
          className="button-submit no-drag"
          onClick={handleLogin}
        >
          Đăng nhập
        </Button>
      </div>
    </div>
  );
};

export default LoginModal;
