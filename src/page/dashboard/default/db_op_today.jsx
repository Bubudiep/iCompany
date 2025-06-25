import { Tooltip } from "antd";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { TbPigMoney } from "react-icons/tb";
import Staff_view from "./../../../components/by_id/staff_view";

const Db_op_today = ({ user }) => {
  const operator = user?.company?.Dashboard?.op || {};
  let op_data = {};
  operator?.homnay?.map((op) => {
    if (!op_data[op.nguoibaocao]) op_data[op.nguoibaocao] = 0;
    op_data[op.nguoibaocao] = op_data[op.nguoibaocao] + 1;
  });
  const statusConfigs = [
    {
      label: "Tất cả",
      condition: operator?.homnay?.length,
      bg: "#e2f2ff",
      textColor: "#008cff",
    },
    ...Object.keys(op_data).map((op) => {
      return {
        label: <Staff_view id={parseInt(op)} />,
        condition: op_data[op],
        bg: "#e2f2ff",
        textColor: "#008cff",
      };
    }),
  ];
  return (
    <div className="flex whitebox flex-col h-[186px] w-full !min-w-[300px]">
      <div className="text-[15px] text-[#666] font-[500] flex justify-between">
        Người mới hôm nay
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
      <div className="flex mt-auto gap-1">
        <div className="grid grid-cols-2 gap-2 mt-auto flex-1">
          {statusConfigs.map(({ label, condition, bg, textColor }, index) => {
            return (
              index < 4 && (
                <div
                  key={index}
                  className="flex flex-1 flex-col rounded-[4px] p-1.5 px-2 text-[13px] font-[500]"
                  style={{ backgroundColor: bg, color: textColor }}
                >
                  <div className="flex flex-col justify-between">
                    <div className="name">{label}</div>
                    <div className="value text-[22px] pb-1.5 flex justify-center">
                      {condition}
                    </div>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Db_op_today;
