import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/icon/icon.png";
import { FaGear, FaUser } from "react-icons/fa6";
import chat_icon from "../../assets/icon/chat_app.png";
import contacts_icon from "../../assets/icon/contacts_app.png";

const menuItems = [
  {
    id: 1,
    show: true,
    name: "Chat",
    icon: chat_icon,
    link: "/app/chat",
  },
  {
    id: 2,
    show: true,
    name: "Danh bạ",
    icon: contacts_icon,
    link: "/app/contacts",
  },
];
const userItems = [
  { id: 101, name: "User", icon: <FaUser />, link: "/app/user" },
  { id: 102, name: "Configs", icon: <FaGear />, link: "/app/config" },
];

const App_lists = () => {
  const location = useLocation();
  const [activeItemId, setActiveItemId] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0 });
  const itemsRef = useRef({}); // Lưu tham chiếu của các item theo id

  // Cập nhật `activeItemId` khi URL thay đổi
  useEffect(() => {
    const activeItem = menuItems.find((item) =>
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
  }, [activeItemId]);

  return (
    <div className="app-list">
      <div className="logo">
        <Link
          to="/app/"
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
              className={`item ${activeItemId === item.id ? "active" : ""}`}
              onClick={() => setActiveItemId(item.id)}
            >
              <div className="icon">{item.icon}</div>
              <div className="name">{item.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App_lists;
