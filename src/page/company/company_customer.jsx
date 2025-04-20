import React from "react";
import { useOutletContext } from "react-router-dom";

const Company_customer = () => {
  const { menu } = useOutletContext();
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{menu.icon}</div>
          {menu.label}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop">
        <div className="flex whitebox"></div>
        <div className="whitebox h-full flex flex-col"></div>
      </div>
    </div>
  );
};

export default Company_customer;
