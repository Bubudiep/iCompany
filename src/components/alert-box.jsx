import React from "react";
import { GoAlertFill } from "react-icons/go";

const Alert_box = ({ show, icon, text }) => {
  return (
    <div
      className={`${
        show === false && "hidden"
      } flex whitebox min-w-[600px] !shadow-none !p-0 text-[#d84f00] border-[#d84f00] border-1`}
    >
      <div className="icon p-3 border-r-1">{icon ?? <GoAlertFill />}</div>
      <div className="flex items-center p-2 ml-2 font-[500]">{text}</div>
    </div>
  );
};

export default Alert_box;
