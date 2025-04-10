import React from "react";
import { GoAlertFill } from "react-icons/go";
import { useOutletContext } from "react-router-dom";

const Company_accounts = () => {
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
        <div className="flex whitebox !p-0 text-[#f77001] border-[#f77001] border-1">
          <div className="flex icon p-3 border-r-1">
            <GoAlertFill />
          </div>
          <div className="flex items-center ml-2">
            Chỉ admin mới được thêm mới tài khoản
          </div>
        </div>
        <div className="whitebox h-full flex flex-col"></div>
      </div>
    </div>
  );
};

export default Company_accounts;
