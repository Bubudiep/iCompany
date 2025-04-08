import React from "react";
import { FaUserTimes } from "react-icons/fa";

const Operator_offwork_report = () => {
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{<FaUserTimes />}</div>
          Báo cáo nghỉ làm
        </div>
      </div>
    </div>
  );
};

export default Operator_offwork_report;
