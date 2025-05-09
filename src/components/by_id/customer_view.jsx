import React from "react";
import { useUser } from "../context/userContext";
import { Descriptions, Tooltip } from "antd";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

const Customer_view = ({ id }) => {
  const { user } = useUser();
  const customer = user?.company?.Customer?.find(
    (customer) => customer.id === id
  );
  console.log(customer);
  return customer ? (
    <Tooltip
      title={
        <div className="flex flex-col w-[200px] text-[#000] gap-2">
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
            <div>{customer?.fullname || "Chưa cập nhập"}</div>
          </div>
          <Descriptions column={1} className="card-format">
            <Descriptions.Item label="Điện thoại">
              {customer?.hotline || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {customer?.email || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {customer?.address || "-"}
            </Descriptions.Item>
          </Descriptions>
        </div>
      }
      color="white"
      className="transition-all duration-300 text-[#115ed1] 
      hover:underline hover:text-[#0066ff] cursor-pointer font-[500]"
    >
      {customer?.name ?? "-"}
    </Tooltip>
  ) : (
    <>-</>
  );
};

export default Customer_view;
