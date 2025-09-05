import React, { useEffect, useState } from "react";
import LeftNav from "../../components/layout/LeftNav";
import { FaQrcode } from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaNoteSticky } from "react-icons/fa6";
import { BsFillChatTextFill } from "react-icons/bs";
const menus = [
  {
    id: 1,
    icon: <FaQrcode />,
    label: "QRBanks",
    link: "/app/extends/qrbanks",
  },
  {
    id: 2,
    icon: <FaNoteSticky />,
    label: "Notes",
    link: "/app/extends/notes",
  },
  {
    id: 3,
    icon: <BsFillChatTextFill />,
    label: "Tiền sang chữ",
    link: "/app/extends/num2text",
  },
];
const Extends_index = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(menus[0]);
  useEffect(() => {
    menus.forEach(
      (items) => location.pathname.includes(items.link) && setActiveMenu(items)
    );
  }, []);
  return (
    <div className="flex flex-1 overflow-hidden">
      <LeftNav>
        <div className="items">
          {menus.map((menu) => (
            <Link
              key={menu.id}
              to={menu.link}
              className={`item ${activeMenu.id === menu.id ? "active" : ""}`}
              onClick={() => setActiveMenu(menu)}
            >
              <div className="icon">{menu.icon}</div>
              <div className="name">{menu.label}</div>
            </Link>
          ))}
        </div>
      </LeftNav>
      <Outlet />
    </div>
  );
};

export default Extends_index;
