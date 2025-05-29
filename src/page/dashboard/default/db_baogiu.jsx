import { Tooltip } from "antd";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";

const Db_baogiu_card = ({ user }) => {
  const baoung = user?.company?.Dashboard?.approve?.baogiu || [];
  const statusConfigs = [
    {
      label: "Hoàn thành",
      condition: (item) =>
        item.status === "approved" && item.payment_status === "done",
      bg: "#dbffcb",
      textColor: "#3d963d",
    },
    {
      label: "Chờ duyệt",
      condition: (item) => item.status === "pending",
      bg: "#ffe9d7",
      textColor: "#c77e4d",
    },
    {
      label: "Chờ giải ngân",
      condition: (item) =>
        item.status === "approve" && item.payment_status === "not",
      bg: "#ffd7d7",
      textColor: "#c74d4d",
    },
    // {
    //   label: "Chờ thu hồi",
    //   condition: (item) =>
    //     item.status === "approve" &&
    //     item.payment_status === "done" &&
    //     item.retrieve_status === "not",
    //   bg: "#dbdbdb",
    //   textColor: "#636363",
    // },
  ];
  return (
    <div className="flex whitebox flex-col h-[200px] w-full">
      <div className="text-[15px] text-[#666] font-[500] flex justify-between">
        Báo giữ lương
        <Tooltip
          color="white"
          title={
            <div className="text-[#636363] max-w-[200px] p-1">
              Dữ liệu lấy từ danh sách báo giữ lương của công ty từ trước đến
              nay.
            </div>
          }
        >
          <div className="ml-auto text-[#c4c4c4] transition-all duration-300 hover:text-[#666] cursor-pointer">
            <FaInfoCircle />
          </div>
        </Tooltip>
      </div>
      <div className="text-[13px] text-[#999] flex gap-1 items-center">
        <FaMoneyBillTransfer className="text-[16px] mt-0.5" />
        Thống kê giữ lương NLĐ
      </div>
      <div className="flex mt-auto gap-1">
        <div className="flex w-[50%] flex-col bg-[#e2f2ff] text-[#008cff] rounded-[4px] px-2 py-1">
          <div className="flex px-1 py-1 font-[500]">Tất cả</div>
          <div className="flex flex-1 items-center justify-center text-[50px] font-[500] pb-5">
            {baoung?.length || 0}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1 mt-auto">
          {statusConfigs.map(({ label, condition, bg, textColor }, index) => {
            const filtered = baoung.filter(condition);
            const totalAmount = filtered.reduce(
              (sum, item) => sum + parseInt(item.amount || 0),
              0
            );
            return (
              <div
                key={index}
                className="flex flex-col rounded-[4px] p-1 px-2 text-[13px] font-[500] leading-4.5"
                style={{ backgroundColor: bg, color: textColor }}
              >
                <div className="flex justify-between">
                  <div className="name">{label}</div>
                  <div className="value">{filtered.length}</div>
                </div>
                <div className="flex">{totalAmount.toLocaleString()} vnđ</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Db_baogiu_card;
