import { Empty, Tooltip } from "antd";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";

const Db_dilam_card = ({ user }) => {
  return (
    <div className="flex flex-col flex-1">
      <div className="text-[15px] text-[#666] font-[500] flex justify-between">
        Thống kê đi làm
        <Tooltip
          color="white"
          title={
            <div className="text-[#636363] max-w-[200px] p-1">
              Dựa theo dữ liệu báo cáo đi làm hằng ngày của nhân viên
            </div>
          }
        >
          <div className="ml-auto text-[#c4c4c4] transition-all duration-300 hover:text-[#666] cursor-pointer">
            <FaInfoCircle />
          </div>
        </Tooltip>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Empty description="Đang phát triển!" />
      </div>
    </div>
  );
};

export default Db_dilam_card;
