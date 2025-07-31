import React from "react";
import { useUser } from "../context/userContext";
import { Descriptions, Tooltip } from "antd";
import { FaUser } from "react-icons/fa";

const Staff_view = ({ id, className }) => {
  const { user } = useUser();
  const staff = user?.company?.Staff?.find((staff) => staff.id == id);
  return staff ? (
    <Tooltip
      title={
        <div className="flex flex-col w-[300px] text-[#000] gap-2">
          <div className="fullname p-2 flex flex-1 items-center justify-center flex-col gap-1">
            <div
              className="flex items-center justify-center rounded-full border-[2px] border-[#fff]
              shadow-2xl w-[80px] h-[80px] bg-[#c2d3eb] text-[#fff]"
            >
              {staff?.profile?.avatar_preview ? (
                <img src={staff?.profile?.avatar_preview} />
              ) : (
                <>
                  <FaUser size={40} />
                </>
              )}
            </div>
            <div>{staff?.profile?.full_name || "Chưa cập nhập"}</div>
          </div>
          <Descriptions column={1} className="card-format">
            <Descriptions.Item label="Bộ phận">
              {staff?.department_name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Vị trí">
              {staff?.possition_name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Mã nhân viên">
              {staff?.cardID || "-"}
            </Descriptions.Item>
          </Descriptions>
        </div>
      }
      color="white"
      className={`transition-all duration-300 text-[#115ed1] 
      hover:underline hover:text-[#0066ff] cursor-pointer ${className}`}
    >
      {staff?.profile?.full_name ?? staff?.cardID ?? "-"}
    </Tooltip>
  ) : (
    <>-</>
  );
};

export default Staff_view;
