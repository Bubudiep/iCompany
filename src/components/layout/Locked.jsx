import React from "react";
import locked_icon from "../../assets/icon/locked.png";
const Locked = ({
  description = "Bạn không có quyền truy cập nội dung này!",
}) => {
  return (
    <div className="flex flex-col text-[#999] text-[16px] gap-4 items-center">
      <div className="icon w-30 opacity-50">
        <img src={locked_icon} />
      </div>
      <div className="text">{description}</div>
    </div>
  );
};

export default Locked;
