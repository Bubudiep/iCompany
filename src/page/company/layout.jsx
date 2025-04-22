import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import LeftNav from "../../components/layout/LeftNav";
import { BsBuildingsFill, BsFillDiagram2Fill } from "react-icons/bs";
import { FaUsersCog } from "react-icons/fa";
import { TbBuildingCommunity, TbManualGearbox } from "react-icons/tb";
import { FaGears, FaUsersGear } from "react-icons/fa6";
import { MdOutlineDatasetLinked } from "react-icons/md";
import { PiFactoryFill } from "react-icons/pi";
const menus = [
  // {
  //   id: 0,
  //   icon: <TbBuildingCommunity />,
  //   label: "Thông tin công ty",
  //   link: "/app/companys/infomation",
  // },
  // {
  //   id: 1,
  //   icon: <FaGears />,
  //   label: "Cài đặt chung",
  //   link: "/app/companys/configurations",
  // },
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
  {
    id: 4,
    icon: <PiFactoryFill />,
    label: "Khách hàng",
    link: "/app/companys/customers",
  },
  {
    id: 5,
    icon: <MdOutlineDatasetLinked />,
    label: "Công ty cung ứng",
    link: "/app/companys/partners",
  },
];
const Company_layout = () => {
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
      <Outlet context={{ menu: activeMenu }} />
    </div>
  );
};

export default Company_layout;
