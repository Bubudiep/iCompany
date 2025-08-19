import { Spin, Tooltip } from "antd";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { LuCalendarRange } from "react-icons/lu";
import { TbPigMoney, TbReportAnalytics } from "react-icons/tb";

const Db_baoung_card = ({ rawData, loading }) => {
  const baoung = rawData?.filter((i) => i?.requesttype === "Báo ứng") || [];
  const statusConfigs = [
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
      bg: "#dbffcb",
      textColor: "#3d963d",
    },
    {
      label: "Chờ thu hồi",
      condition: (item) =>
        item.status === "approve" &&
        item.payment_status === "done" &&
        item.retrieve_status === "not",
      bg: "#dbdbdb",
      textColor: "#636363",
    },
    {
      label: "Đã từ chối",
      condition: (item) => item.status === "reject",
      bg: "#ffdfcf",
      textColor: "#e94e00",
    },
    {
      label: "Đã hủy",
      condition: (item) => item.status === "cancel",
      bg: "#ffd7d7",
      textColor: "#c74d4d",
    },
  ];
  return (
    <div className="flex whitebox flex-col h-[340px] sm:text-[12px] w-full !min-w-[200px]">
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="fadeIn flex flex-col flex-1">
          <div className="text-[13px]  text-[#666] font-[500] flex justify-between ml-0.5 ">
            Báo ứng
            <Tooltip
              color="white"
              title={
                <div className="text-[#636363] max-w-[200px] p-1">
                  Dữ liệu lấy từ danh sách báo ứng của công ty từ trước đến nay.
                </div>
              }
            >
              <div className="ml-auto text-[#c4c4c4] transition-all duration-300 hover:text-[#666] cursor-pointer">
                <FaInfoCircle />
              </div>
            </Tooltip>
          </div>
          <div className="text-[13px] text-[#999] flex gap-1 items-center">
            <div className="icon w-5 flex justify-center">
              <TbReportAnalytics className="text-[17px]" />
            </div>
            Thống kê báo ứng
          </div>
          <div className="text-[13px] text-[#999] flex gap-1 items-center">
            <div className="icon w-5 flex justify-center">
              <LuCalendarRange className="text-[14px]" />
            </div>
            Dữ liệu đang lấy từ trước đến nay
          </div>
          <div className="flex mt-auto gap-2">
            <div className="flex flex-col w-[50%] gap-2">
              <div className="flex w-full h-full flex-col bg-[#e2f2ff] text-[#008cff] rounded-[4px] px-2 py-3">
                <div className="flex flex-1 items-center justify-center text-[45px] font-[500]">
                  {baoung?.length || 0}
                </div>
                <div className="text-right text-[13px]">Yêu cầu đã tạo</div>
              </div>
              <div className="flex w-full h-full flex-col bg-[#e2ffe2] text-[#00b109] rounded-[4px] px-2 py-3">
                <div className="flex flex-1 items-center justify-center text-[45px] font-[500]">
                  {baoung?.filter?.(
                    (item) =>
                      item?.status === "approved" &&
                      item?.payment_status === "done"
                  )?.length || 0}
                </div>
                <div className="text-right text-[13px]">Hoàn thành</div>
                <div className="text-right text-[13px] flex justify-end gap-1">
                  <div className="font-[500]">
                    {(
                      baoung
                        ?.filter?.(
                          (item) =>
                            item?.status === "approved" &&
                            item?.payment_status === "done"
                        )
                        ?.reduce(
                          (sum, item) => sum + parseInt(item.amount || 0),
                          0
                        ) || 0
                    ).toLocaleString()}
                  </div>
                  <div className="text">vnđ</div>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 justify-between">
              {statusConfigs.map(
                ({ label, condition, bg, textColor }, index) => {
                  const filtered = baoung.filter(condition);
                  const totalAmount = filtered.reduce(
                    (sum, item) => sum + parseInt(item.amount || 0),
                    0
                  );
                  return (
                    <div
                      key={index}
                      className="flex flex-col rounded-[4px] p-1 px-2 text-[13px] font-[500]"
                      style={{ backgroundColor: bg, color: textColor }}
                    >
                      <div className="flex justify-between">
                        <div className="name">{label}</div>
                        <div className="value">{filtered.length}</div>
                      </div>
                      <div className="flex">
                        {totalAmount.toLocaleString()} vnđ
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Db_baoung_card;
