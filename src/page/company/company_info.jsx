import React, { useEffect, useState } from "react";
import { GoAlertFill } from "react-icons/go";
import { useOutletContext } from "react-router-dom";
import { useUser } from "../../components/context/userContext";
import Alert_box from "../../components/alert-box";

const Company_info = () => {
  const { menu } = useOutletContext();
  const { user, setUser } = useUser();
  useEffect(() => {
    console.log(user);
  }, []);
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{menu.icon}</div>
          {menu.label}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop">
        <Alert_box text="Chỉ boss và admin mới có quyền thay đổi thông tin công ty" />
        <div className="whitebox h-full flex flex-col">
          <div className="flex justify-between p-2 border-b-1 border-[#0003]">
            <div className="name">Tên công ty</div>
            <div className="name">-</div>
          </div>
          <div className="flex justify-between p-2 border-b-1 border-[#0003]">
            <div className="name">Mã số thuế</div>
            <div className="name">-</div>
          </div>
          <div className="flex justify-between p-2 border-b-1 border-[#0003]">
            <div className="name">Code nhân viên</div>
            <div className="name">-</div>
          </div>
          <div className="flex justify-between p-2 border-b-1 border-[#0003]">
            <div className="name">Code tài liệu</div>
            <div className="name">-</div>
          </div>
          <div className="flex justify-between p-2 border-b-1 border-[#0003]">
            <div className="name">Số tài khoản</div>
            <div className="name">-</div>
          </div>
          <div className="flex justify-between p-2 border-b-1 border-[#0003]">
            <div className="name">Ngân hàng</div>
            <div className="name">-</div>
          </div>
          <div className="flex justify-between p-2 border-b-1 border-[#0003]">
            <div className="name">Link facebook</div>
            <div className="name">-</div>
          </div>
          <div className="flex justify-between p-2 border-b-1 border-[#0003]">
            <div className="name">Link Zalo</div>
            <div className="name">-</div>
          </div>
          <div className="flex justify-between p-2 border-b-1 border-[#0003]">
            <div className="name">Liên hệ</div>
            <div className="name">-</div>
          </div>
          <div className="flex justify-between p-2 border-b-1 border-[#0003]">
            <div className="name">Hotline CSKH</div>
            <div className="name">-</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company_info;
