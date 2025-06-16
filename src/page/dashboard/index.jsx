import React from "react";
import { useUser } from "../../components/context/userContext";
import Db_baoung_card from "./default/db_baoung";
import Db_baogiu_card from "./default/db_baogiu";
import Db_dilam_card from "./default/db_dilam";
import { Empty } from "antd";
import Db_op_card from "./default/db_op";
import Staff_view from "../../components/by_id/staff_view";
import { FaMoneyBillTransfer } from "react-icons/fa6";

const Dashboard_index = () => {
  const { user } = useUser();
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-1">
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto p-2">
          <div className="flex gap-4 fadeInTop">
            <div className="flex flex-col gap-4 w-[calc(25%-12px)] min-w-[300px]">
              <Db_baoung_card user={user} />
              <Db_baogiu_card user={user} />
            </div>
            <div className="flex flex-col gap-4 w-[calc(25%-12px)]">
              <Db_op_card user={user} />
              <div className="flex whitebox flex-col h-[200px] w-full">
                <div className="text-[15px] text-[#666] font-[500] flex justify-between">
                  Top tuyển dụng
                </div>
                <div className="text-[13px] text-[#999] flex gap-1 items-center">
                  <FaMoneyBillTransfer className="text-[16px] mt-0.5" />
                  Thống kê giữ lương NLĐ
                </div>
                <div className="flex mt-auto gap-1">
                  <div className="flex w-[50%] flex-col bg-[#e2f2ff] text-[#008cff] rounded-[4px] px-2 py-1">
                    <div className="flex px-1 py-1 font-[500]">TOP 1</div>
                    <div className="flex flex-1 flex-col items-center justify-center text-[40px] font-[500] pb-5">
                      {user?.company?.Dashboard?.op?.by_nguoituyen?.[0]?.total}
                      <div className="text-[14px]">
                        {
                          <Staff_view
                            className="mt-2"
                            id={
                              user?.company?.Dashboard?.op?.by_nguoituyen?.[0]
                                ?.nguoituyen__id
                            }
                          />
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col">
                    {user?.company?.Dashboard?.op?.by_nguoituyen?.map(
                      (op, idx) => {
                        return (
                          idx > 0 && (
                            <div
                              key={op?.nguoituyen__id}
                              className="justify-between flex flex-col px-2 py-1 bg-[#d1f6ff] rounded-[4px]"
                            >
                              <div className="flex flex-1 font-[700] text-[10px] gap-1">
                                TOP {idx + 1}
                              </div>
                              <div className="flex justify-between">
                                <Staff_view id={op?.nguoituyen__id} />
                                <div className="text-[#000] font-[500] flex gap-0.5 items-baseline">
                                  {op?.total}{" "}
                                  <div className="font-[400] text-[11px]">
                                    người
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex whitebox flex-1">
              <Db_dilam_card user={user} />
            </div>
          </div>
          {/* <div className="flex gap-4 fadeInTop">
            <div className="flex whitebox h-[240px] w-full items-center justify-center">
              <Empty description="Chưa có dữ liệu" />
            </div>
            <div className="flex whitebox h-[240px] w-full items-center justify-center">
              <Empty description="Chưa có dữ liệu" />
            </div>
            <div className="flex whitebox h-[240px] w-full items-center justify-center">
              <Empty description="Chưa có dữ liệu" />
            </div>
            <div className="flex whitebox h-[240px] w-full items-center justify-center">
              <Empty description="Chưa có dữ liệu" />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard_index;
