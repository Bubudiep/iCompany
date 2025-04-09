import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import LeftNav from "../../components/layout/LeftNav";
import { BsBuildingsFill, BsFillDiagram2Fill } from "react-icons/bs";
import { FaUsersCog } from "react-icons/fa";
import { TbManualGearbox } from "react-icons/tb";
import { FaGears, FaUsersGear } from "react-icons/fa6";

const menus = [
  {
    id: 0,
    icon: <BsBuildingsFill />,
    label: "Thông tin công ty",
    link: "/app/companys/infomation",
  },
  {
    id: 1,
    icon: <FaGears />,
    label: "Cài đặt chung",
    link: "/app/companys/configurations",
  },
  {
    id: 2,
    icon: <FaUsersGear />,
    label: "Quản lý tài khoản",
    link: "/app/companys/accounts",
  },
  {
    id: 3,
    icon: <TbManualGearbox />,
    label: "Phòng ban & chức vụ",
    link: "/app/companys/roles",
  },
];
const Company_layout = () => {
  const [activeMenu, setActiveMenu] = useState(menus[0]);
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
      <Outlet context={{ menu: activeMenu }} />
    </div>
  );
};

export default Company_layout;
