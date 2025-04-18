import React from "react";
import { FaUserCheck } from "react-icons/fa";

const Operator_work_report = () => {
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{<FaUserCheck />}</div>
          Báo cáo đi làm
        </div>
      </div>
    </div>
  );
};

export default Operator_work_report;
