import React from "react";
import { useUser } from "../context/userContext";
import { Descriptions, Tooltip } from "antd";
import { FaUser } from "react-icons/fa";

const Operator_view = ({ id, className }) => {
  const { user } = useUser();
  const op = user?.company?.Operator?.find((op) => op.id == id);
  return op ? (
    <Tooltip
      title={
        <div className="flex flex-col w-[300px] text-[#000] gap-2">
          <div className="fullname p-2 flex flex-1 items-center justify-center flex-col gap-1">
            <div
              className="flex items-center justify-center rounded-full border-[2px] border-[#fff]
              shadow-2xl w-[80px] h-[80px] bg-[#c2d3eb] text-[#fff]"
            >
              <FaUser size={40} />
            </div>
            <div>{op?.ho_ten || "Chưa cập nhập"}</div>
          </div>
          <Descriptions column={1} className="card-format">
            <Descriptions.Item label="Mã nhân viên">
              {op?.ma_nhanvien || "-"}
            </Descriptions.Item>
          </Descriptions>
        </div>
      }
      color="white"
      className={`transition-all duration-300 text-[#115ed1] 
      hover:underline hover:text-[#0066ff] cursor-pointer ${className}`}
    >
      {op?.ho_ten || "-"}
    </Tooltip>
  ) : (
    <>-</>
  );
};

export default Operator_view;
