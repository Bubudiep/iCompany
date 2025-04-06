import React, { useState } from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import { FaUserClock } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import { HiMiniUserGroup } from "react-icons/hi2";
import { TiGroup } from "react-icons/ti";
import { Link, Outlet } from "react-router-dom";

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
      id: "work",
      label: "Báo cáo đi làm",
      icon: <FaUserClock />,
      link: "/app/operators/work_report",
    },
  ];
  return (
    <div className="flex flex-1">
      <div className="left-menu">
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
      </div>
      <Outlet context={{}} />
    </div>
  );
};

export default Operators_layout;
