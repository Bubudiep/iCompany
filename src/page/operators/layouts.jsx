import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import { FaUserCheck, FaUserClock, FaUserTimes } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import { HiMiniUserGroup } from "react-icons/hi2";
import { LuNotebookText } from "react-icons/lu";
import { RiBookletFill } from "react-icons/ri";
import { TiGroup } from "react-icons/ti";
import { Link, Outlet, useLocation } from "react-router-dom";
import LeftNav from "../../components/layout/LeftNav";

const Operators_layout = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const filterList = [
    {
      id: "all",
      label: "Danh sách người lao động",
      icon: <HiMiniUserGroup />,
      link: "/app/operators/all",
    },
    {
      id: "add",
      label: "Thêm người lao động",
      icon: <BsPersonFillAdd />,
      link: "/app/operators/add",
    },
    {
      id: "his",
      label: "Cập nhập lịch sử đi làm",
      icon: <FaUserClock />,
      link: "/app/operators/work_history",
    },
    {
      id: "work",
      label: "Báo cáo đi làm",
      icon: <FaUserCheck />,
      link: "/app/operators/work_report",
    },
    {
      id: "off",
      label: "Báo cáo nghỉ làm",
      icon: <FaUserTimes />,
      link: "/app/operators/work_off",
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

export default Operators_layout;
