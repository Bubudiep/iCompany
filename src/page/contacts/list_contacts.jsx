import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useUser } from "../../components/context/userContext";
import { IoSearchOutline } from "react-icons/io5";
import { Button, Popconfirm, Popover, Select } from "antd";
import { FaEllipsisH } from "react-icons/fa";
import app from "../../components/app";

const Contacts_list = () => {
  const { activeFilter } = useOutletContext();
  const { user } = useUser();
  const [filterText, setFilterText] = useState("");
  const filterStaff = () => {
    return user.company.Staff.filter((item) => item.id !== user.id);
  };

  useEffect(() => {
    console.log(user, activeFilter);
  }, [activeFilter]);
  return (
    <div
      className="flex flex-1 overflow-hidden flex-col contacts-page"
      key={activeFilter.id}
    >
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{activeFilter.icon}</div>
          {activeFilter.label}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop">
        <div className="flex whitebox">
          <div className="search !p-1">
            <div className="searchbox">
              <label className="icon p-2">
                <IoSearchOutline />
              </label>
              <input
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="!w-[240px]"
                type="text"
                placeholder="Tìm kiếm..."
              />
            </div>
          </div>
        </div>
        <div className="whitebox h-full flex flex-col">
          <div className="flex gap-1">
            <Select className="w-30" placeholder="Sắp xếp" allowClear={true}>
              <Select.Option value="az">A-Z</Select.Option>
              <Select.Option value="za">Z-A</Select.Option>
            </Select>
            <Select className="w-40" placeholder="Bộ phận" allowClear={true}>
              <Select.Option value="az">Bộ phận A</Select.Option>
              <Select.Option value="za">Bộ phận B</Select.Option>
            </Select>
          </div>
          <div className="items mt-2">
            {filterStaff().map((item) => (
              <div className="contact-item" key={item.id}>
                <div className="flex gap-3 items-center">
                  <div className="flex">
                    <div
                      className="avatar flex flex-1 items-center justify-center text-[#fff] 
                        text-[20px] w-12 h-12 rounded-[18px]"
                      style={{
                        backgroundColor: item?.profile?.avatar
                          ? "transparent"
                          : app.getRandomColorFromString(
                              item?.profile?.full_name || "user"
                            ),
                      }}
                    >
                      {item?.profile?.avatar ? (
                        <img
                          src={item?.profile?.avatar}
                          className="w-full h-full object-cover rounded-[18px]"
                        />
                      ) : (
                        item?.profile?.full_name?.split(" ").pop()?.[0] || "?"
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex font-[500] text-[16px]">
                      {item?.profile?.full_name || "Chưa đặt tên"}
                    </div>
                    <div className="flex text-[#999]">{item?.cardID}</div>
                  </div>
                </div>
                <div className="tools ml-auto mr-2">
                  <Popover
                    content={
                      <div className="flex flex-col items">
                        <div className="item p-2">Xem thông tin</div>
                        <div className="item p-2">Đánh dấu</div>
                        <div className="item p-2">Đặt tên ghi nhớ</div>
                      </div>
                    }
                    trigger="click"
                    placement="leftTop"
                  >
                    <Button type="more">
                      <FaEllipsisH />
                    </Button>
                  </Popover>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts_list;
