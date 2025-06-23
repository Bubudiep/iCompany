import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/icon/icon.png";
import { FaGear, FaUser } from "react-icons/fa6";
import chat_icon from "../../assets/icon/chat_app.png";
import approve_icon from "../../assets/icon/approve_app.png";
import contacts_icon from "../../assets/icon/contacts_app.png";
import company_icon from "../../assets/icon/company_app.png";
import users_app from "../../assets/icon/user_report.png";
import user_pers from "../../assets/icon/user_pers.png";
import logout from "../../assets/icon/logout.png";
import { Modal, Tooltip } from "antd";
import { useCookies } from "react-cookie";
import { useUser } from "../../components/context/userContext";

const menuItems = [
  {
    id: 1,
    show: true,
    name: "Chat",
    icon: chat_icon,
    link: "/app/chat",
    unread_field: "chat_not_read",
  },
  {
    id: 6,
    show: true,
    name: "Phê duyệt",
    icon: approve_icon,
    link: "/app/approve",
  },
  {
    id: 2,
    show: true,
    name: "Nhân lực",
    icon: users_app,
    link: "/app/operators",
  },
  {
    id: 3,
    show: true,
    name: "Danh bạ",
    icon: contacts_icon,
    link: "/app/contacts",
  },
  {
    id: 4,
    show: true,
    name: "Công ty",
    icon: company_icon,
    link: "/app/companys",
  },
  // {
  //   id: 5,
  //   show: true,
  //   name: "Phân quyền",
  //   icon: user_pers,
  //   link: "/app/permission",
  // },
];

const App_lists = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies();
  const location = useLocation();
  const { user } = useUser();
  const [activeItemId, setActiveItemId] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0 });
  const itemsRef = useRef({}); // Lưu tham chiếu của các item theo id
  const userItems = [
    {
      id: 101,
      name: "",
      icon: (
        <div
          className="w-[50px] h-[50px] flex items-center justify-center
          bg-white rounded-[8px] overflow-hidden"
        >
          {user?.info?.profile?.avatar_base64 ? (
            <img src={user?.info?.profile?.avatar_base64} className="!w-full" />
          ) : (
            <FaUser size={20} />
          )}
        </div>
      ),
      link: "/app/user",
    },
    { id: 102, name: "Configs", icon: <FaGear />, link: "/app/config" },
  ];

  // Cập nhật `activeItemId` khi URL thay đổi
  useEffect(() => {
    const activeItem = [...userItems, ...menuItems].find((item) =>
      location.pathname.includes(item.link)
    );

    if (activeItem) {
      setActiveItemId(activeItem.id);
    }
  }, [location.pathname]);

  // Cập nhật vị trí indicator khi `activeItemId` thay đổi
  useEffect(() => {
    if (activeItemId && itemsRef.current[activeItemId]) {
      const { offsetTop } = itemsRef.current[activeItemId];
      setIndicatorStyle({ top: `${offsetTop}px` });
    }
  }, [activeItemId, user]);
  const handleLogout = () => {
    // Hiển thị modal xác nhận
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất không?",
      okText: "Đăng xuất",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        // Thực hiện đăng xuất nếu người dùng xác nhận
        setCookie("newversion_token", null, {
          path: "/",
          sameSite: "Strict", // Chống CSRF
        });
        navigate("/login");
      },
      onCancel: () => {
        console.log("Đăng xuất bị hủy");
      },
    });
  };
  return (
    <div className="app-list">
      <div className="logo">
        <Link
          to="/app/dashboard"
          className="box"
          onClick={() => {
            setActiveItemId(0);
            setIndicatorStyle({
              top: `0px`,
            });
          }}
        >
          <img src={logo} />
        </Link>
      </div>
      <div className="app-lists">
        <div className="indicator" style={indicatorStyle}>
          <div
            className="bar"
            style={{ width: activeItemId ? "3px" : 0 }}
          ></div>
        </div>
        {menuItems.map(
          (item) =>
            item.show && (
              <Link
                key={item.id}
                to={item.link}
                ref={(el) => (itemsRef.current[item.id] = el)}
                className={`item ${activeItemId === item.id ? "active" : ""}`}
                onClick={() => setActiveItemId(item.id)}
              >
                {item?.unread_field &&
                  user?.app_config?.[item?.unread_field] > 0 && (
                    <div className="unread">
                      {user?.app_config?.[item?.unread_field] > 9
                        ? "9+"
                        : user?.app_config?.[item?.unread_field]}
                    </div>
                  )}
                <div className="icon">
                  <img src={item.icon} alt={item.name} />
                </div>
                <div className="name">{item.name}</div>
              </Link>
            )
        )}
        <div className="flex flex-col mt-auto">
          {userItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              ref={(el) => (itemsRef.current[item.id] = el)}
              className={`item ${
                activeItemId === item.id && item.id !== 101 ? "active" : ""
              }`}
              onClick={() => setActiveItemId(item.id)}
            >
              <div className="icon">{item.icon}</div>
              <div className="name">{item.name}</div>
            </Link>
          ))}
          <Tooltip title="Đăng xuất" onClick={handleLogout} className="item">
            <div className="icon">
              <img src={logout} alt="Đăng xuất" />
            </div>
            <div className="name"></div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default App_lists;
