import React from "react";
import { HiMiniUserGroup } from "react-icons/hi2";
import { Outlet } from "react-router-dom";

const Operator_list = () => {
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{<HiMiniUserGroup />}</div>
          Danh sách người lao động
        </div>
      </div>
      <div className="flex flex-1 p-2 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default Operator_list;
