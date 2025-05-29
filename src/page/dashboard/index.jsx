import React from "react";
import { useUser } from "../../components/context/userContext";
import Db_baoung_card from "./default/db_baoung";
import Db_baogiu_card from "./default/db_baogiu";
import Db_dilam_card from "./default/db_dilam";
import { Empty } from "antd";
import Db_op_card from "./default/db_op";

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
              <div className="flex whitebox h-[200px] w-full items-center justify-center">
                <Empty description="Chưa có dữ liệu" />
              </div>
            </div>
            <div className="flex whitebox flex-1">
              <Db_dilam_card user={user} />
            </div>
          </div>
          <div className="flex gap-4 fadeInTop">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard_index;
