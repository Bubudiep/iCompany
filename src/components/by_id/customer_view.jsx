import React from "react";
import { useUser } from "../context/userContext";
import { Descriptions, Tooltip } from "antd";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

const Customer_view = ({ id, working, className }) => {
  const { user } = useUser();
  const customer = user?.company?.Customer?.find(
    (customer) => customer.id === id
  );
  return customer ? (
    <Tooltip
      title={
        <div className="flex flex-col !w-[300px] text-[#000] gap-2">
          <div className="fullname p-2 flex flex-1 items-center justify-center flex-col gap-1">
            <div
              className="flex items-center justify-center rounded-full border-[2px] border-[#fff]
              shadow-2xl w-[80px] h-[80px] bg-[#c2d3eb] text-[#fff]"
            >
              {customer?.avatar_base64 ? (
                <img src={customer?.avatar_base6} />
              ) : (
                <>
                  <HiOutlineOfficeBuilding size={40} />
                </>
              )}
            </div>
            <div>{customer?.name || "Chưa cập nhập"}</div>
            <div>{customer?.fullname || "Chưa cập nhập"}</div>
          </div>
          <Descriptions column={1} className="card-format">
            {working?.ma_nhanvien && (
              <Descriptions.Item label="Mã nhân viên">
                {(
                  <div className="font-[500] text-[#007ce2]">
                    {working?.ma_nhanvien}
                  </div>
                ) || "-"}
              </Descriptions.Item>
            )}
            {working?.start_date && (
              <Descriptions.Item label="Ngày vào làm">
                {<div className=" text-[#007ce2]">{working?.start_date}</div> ||
                  "-"}
              </Descriptions.Item>
            )}
            <div className="border-b-1 pt-1 mb-1 border-[#d3d3d3]" />
            <Descriptions.Item label="Điện thoại">
              {customer?.hotline || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {customer?.email || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              <Tooltip title={customer?.address || "-"}>
                <div className="text-clamp-2 max-w-[200px]">
                  {customer?.address || "-"}
                </div>
              </Tooltip>
            </Descriptions.Item>
          </Descriptions>
        </div>
      }
      color="white"
      className={`transition-all duration-300 text-[#115ed1] !max-w-full
      hover:underline hover:text-[#0066ff] cursor-pointer font-[500] ${className}`}
    >
      {customer?.name ?? "-"}
    </Tooltip>
  ) : (
    <>-</>
  );
};

export default Customer_view;
