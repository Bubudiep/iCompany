import { Tooltip } from "antd";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { TbPigMoney } from "react-icons/tb";

const Db_op_card = ({ user }) => {
  const operator = user?.company?.Dashboard?.op || {};
  const statusConfigs = [
    {
      label: "Tất cả",
      condition: operator.total,
      bg: "#e2f2ff",
      textColor: "#008cff",
    },
    {
      label: "Hôm nay",
      condition: operator.homnay,
      bg: "#d7fff1",
      textColor: "#2ca97e",
    },
    {
      label: "Đang đi làm",
      condition: operator.dilam,
      bg: "#e9e8ff",
      textColor: "#5c56ce",
    },
    {
      label: "Của nhà khác",
      condition: operator.nhachinh,
      bg: "#ffe9d7",
      textColor: "#c77e4d",
    },
  ];
  return (
    <div className="flex whitebox flex-col h-[200px] w-full">
      <div className="text-[15px] text-[#666] font-[500] flex justify-between">
        Nhân lực
        <Tooltip
          color="white"
          title={
            <div className="text-[#636363] max-w-[200px] p-1">
              Dữ liệu lấy từ danh sách người lao động
            </div>
          }
        >
          <div className="ml-auto text-[#c4c4c4] transition-all duration-300 hover:text-[#666] cursor-pointer">
            <FaInfoCircle />
          </div>
        </Tooltip>
      </div>
      <div className="text-[13px] text-[#999] flex gap-1 items-center">
        <TbPigMoney className="text-[17px]" />
        Thông kê người lao động
      </div>
      <div className="flex mt-auto gap-1">
        <div className="grid grid-cols-2 gap-2 mt-auto flex-1">
          {statusConfigs.map(({ label, condition, bg, textColor }, index) => {
            return (
              <div
                key={index}
                className="flex flex-1 flex-col rounded-[4px] p-1 px-2 text-[13px] font-[500]"
                style={{ backgroundColor: bg, color: textColor }}
              >
                <div className="flex flex-col justify-between">
                  <div className="name">{label}</div>
                  <div className="value text-[22px] pb-1.5 flex justify-center">
                    {condition}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Db_op_card;
