import React from "react";
import Staff_view from "../../../components/by_id/staff_view";
import { FaChartSimple } from "react-icons/fa6";

const Db_top_staff = ({ user }) => {
  return (
    <div className="flex whitebox flex-col w-full !min-w-[300px]">
      <div className="text-[15px] text-[#666] font-[500] flex justify-between">
        Top tuyển dụng
      </div>
      <div className="text-[13px] text-[#999] flex gap-1.5 items-center mt-1">
        <FaChartSimple className="text-[14px]" />
        Top nhân viên nhiều nhân lực nhất
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-1">
        {user?.company?.Dashboard?.op?.by_nguoituyen?.map((op, idx) => {
          return idx > 0 ? (
            <div
              key={op?.nguoituyen__id}
              className={`justify-between flex flex-col px-2 py-1.5 bg-[#d1f6ff] rounded-[4px]`}
            >
              <div className="flex flex-1 font-[600] text-[10px]">
                TOP {idx + 1}
                <div className="text-[#000000b9] font-[500] flex gap-0.5 items-baseline ml-auto">
                  {op?.total}{" "}
                  <div className="font-[400] text-[#00000075]">người</div>
                </div>
              </div>
              <div className="flex justify-between text-[13px]">
                <Staff_view
                  className="whitespace-nowrap overflow-hidden"
                  id={op?.nguoituyen__id}
                />
              </div>
            </div>
          ) : (
            <div
              key={op?.nguoituyen__id}
              className="flex flex-col bg-[#e2f2ff] text-[#008cff] rounded-[4px] px-2 py-1 flex-1"
            >
              <div className="flex px-1 py-1 font-[700]">TOP 1</div>
              <div className="flex flex-1 flex-col items-center justify-center text-[32px] font-[500] pb-5">
                {user?.company?.Dashboard?.op?.by_nguoituyen?.[0]?.total}
                <div className="text-[13px]">
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
          );
        })}
      </div>
    </div>
  );
};

export default Db_top_staff;
