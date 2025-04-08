import React, { useState } from "react";
import { GrContactInfo } from "react-icons/gr";
import { HiOutlineSearch, HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineContacts } from "react-icons/md";
import { RiContactsBook3Line } from "react-icons/ri";
import { Link, Outlet } from "react-router-dom";
import LeftNav from "../../components/layout/LeftNav";

const Contacts_layout = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const filterList = [
    {
      id: "all",
      label: "Tất cả liên hệ",
      icon: <RiContactsBook3Line />,
      link: "/app/contacts/all",
    },
    {
      id: "group",
      label: "Danh sách nhóm",
      icon: <MdOutlineContacts />,
      link: "/app/contacts/group",
    },
    {
      id: "department",
      label: "Đồng nghiệp cùng bộ phận",
      icon: <HiOutlineUserGroup />,
      link: "/app/contacts/department",
    },
    {
      id: "chatted",
      label: "Đã nhắn tin",
      icon: <GrContactInfo />,
      link: "/app/contacts/chatted",
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
      <Outlet
        context={{
          activeFilter: filterList.find((item) => item.id === activeFilter),
        }}
      />
    </div>
  );
};

export default Contacts_layout;
