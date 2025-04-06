import { Select } from "antd";
import React, { useState } from "react";
import { HiMiniUserGroup } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { useOutletContext } from "react-router-dom";

const Operator_list = () => {
  const [filterText, setFilterText] = useState("");
  const {} = useOutletContext();
  const filterOperators = () => {
    return [];
  };
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{<HiMiniUserGroup />}</div>
          Danh sách người lao động
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
            <Select className="w-30" placeholder="Trạng thái" allowClear={true}>
              <Select.Option value="working">Đang đi làm</Select.Option>
              <Select.Option value="notworking">Chưa đi làm</Select.Option>
              <Select.Option value="resigned">Đã nghỉ việc</Select.Option>
            </Select>
            <Select className="w-40" placeholder="Công ty" allowClear={true}>
              <Select.Option value="companyA">Công ty A</Select.Option>
              <Select.Option value="companyB">Công ty B</Select.Option>
            </Select>
          </div>
          <div className="items mt-2">
            {filterOperators().map((item) => (
              <div className="contact-item" key={item.id}>
                <div className="flex gap-3 items-center">
                  <div className="flex">
                    <div
                      className="avatar flex flex-1 items-center justify-center text-[#fff] 
                      text-[20px] w-12 h-12 rounded-[18px]"
                      style={{
                        backgroundColor: item?.profile?.avatar
                          ? "transparent"
                          : getRandomColorFromString(
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

export default Operator_list;
