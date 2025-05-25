import React, { useEffect, useState } from "react";
import { GrContactInfo } from "react-icons/gr";
import { HiOutlineSearch, HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineContacts, MdOutlineCopyAll } from "react-icons/md";
import { RiContactsBook3Line } from "react-icons/ri";
import { Link, Outlet, useLocation } from "react-router-dom";
import LeftNav from "../../components/layout/LeftNav";
import { BsCashCoin } from "react-icons/bs";
import { LiaCashRegisterSolid } from "react-icons/lia";
import { TbBrandShopee } from "react-icons/tb";
import { Tooltip } from "antd";
import { LuNotebookText } from "react-icons/lu";

const Approves_layout = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const filterList = [
    {
      id: "all",
      label: "Tất cả yêu cầu",
      icon: <MdOutlineCopyAll />,
      link: "/app/approve/all",
    },
    {
      id: "baoung",
      label: "Báo ứng",
      icon: <BsCashCoin />,
      link: "/app/approve/baoung",
    },
    {
      id: "baogiu",
      label: "Báo giữ lương",
      icon: <LiaCashRegisterSolid />,
      link: "/app/approve/giuluong",
    },
    {
      id: "chitieu",
      label: "Chi tiêu khác",
      icon: <TbBrandShopee />,
      link: "/app/approve/chitieu",
    },
  ];
  const location = useLocation();
  useEffect(() => {
    filterList.map((item) => {
      if (location.pathname.includes(item.link)) setActiveFilter(item.id);
    });
  }, [location]);
  return (
    <div className="flex flex-1 overflow-hidden">
      <LeftNav>
        <div className="top-nav">
          <div className="search w-full">
            <div className="searchbox w-full">
              <div className="icon">
                <HiOutlineSearch />
              </div>
              <input type="text" placeholder="Tìm kiếm..." />
            </div>
            <Tooltip title="Hướng dẫn">
              <div
                className="w-16 ml-2 cursor-pointer flex items-center justify-center text-[#999] 
                transition-all duration-300 hover:text-[#1677ff]"
              >
                <LuNotebookText size={20} />
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="items">
          {filterList.map((filter) => (
            <Link
              key={filter.id}
              to={filter.link}
              className={`item ${activeFilter === filter.id ? "active" : ""}`}
            >
              <div className="icon">{filter.icon}</div>
              <div className="name">{filter.label}</div>
            </Link>
          ))}
        </div>
      </LeftNav>
      <Outlet context={{}} />
    </div>
  );
};

export default Approves_layout;
