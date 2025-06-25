import React from "react";
import { useUser } from "../../components/context/userContext";
import Db_baoung_card from "./default/db_baoung";
import Db_baogiu_card from "./default/db_baogiu";
import Db_dilam_card from "./default/chart/db_dilam";
import { Empty, Tooltip } from "antd";
import Db_op_card from "./default/db_op";
import Staff_view from "../../components/by_id/staff_view";
import { FaChartSimple, FaMoneyBillTransfer } from "react-icons/fa6";
import Db_top_staff from "./default/db_top_staff";
import Db_pheduyet_card from "./default/chart/db_pheduyet";
import { FaInfoCircle } from "react-icons/fa";
import Db_baokhac_card from "./default/db_baokhac";

const Dashboard_index = () => {
  const { user } = useUser();
  return (
    <div className="flex flex-1 overflow-hidden dashboard">
      <div className="flex flex-1 fadeInTop">
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto p-2">
          <div className="flex gap-4">
            <div className="flex gap-4 flex-1">
              <Db_baoung_card user={user} />
              <div className="flex flex-col gap-4">
                <Db_baokhac_card />
                <Db_baogiu_card user={user} />
              </div>
            </div>
            <div className="flex whitebox flex-1/10">
              <Db_pheduyet_card user={user} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex gap-4 flex-1">
              <Db_op_card user={user} />
              <Db_top_staff user={user} />
            </div>
            <div className="flex whitebox flex-1/10">
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
