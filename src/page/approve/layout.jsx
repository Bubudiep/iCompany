import React, { useState } from "react";
import { GrContactInfo } from "react-icons/gr";
import { HiOutlineSearch, HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineContacts, MdOutlineCopyAll } from "react-icons/md";
import { RiContactsBook3Line } from "react-icons/ri";
import { Link, Outlet } from "react-router-dom";
import LeftNav from "../../components/layout/LeftNav";
import { BsCashCoin } from "react-icons/bs";
import { LiaCashRegisterSolid } from "react-icons/lia";
import { TbBrandShopee } from "react-icons/tb";

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
  return (
    <div className="flex flex-1">
      <LeftNav>
        <div className="top-nav">
          <div className="search">
            <div className="searchbox">
              <div className="icon">
                <HiOutlineSearch />
              </div>
              <input type="text" placeholder="Tìm kiếm..." />
            </div>
          </div>
        </div>
        <div className="items">
          {filterList.map((filter) => (
            <Link
              key={filter.id}
              to={filter.link}
              className={`item ${activeFilter === filter.id ? "active" : ""}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              <div className="icon">{filter.icon}</div>
              <div className="name">{filter.label}</div>
            </Link>
          ))}
        </div>
      </LeftNav>
      <Outlet />
    </div>
  );
};

export default Approves_layout;
