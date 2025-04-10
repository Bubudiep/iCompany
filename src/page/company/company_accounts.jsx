import { Empty, Select } from "antd";
import React from "react";
import { GoAlertFill } from "react-icons/go";
import { useOutletContext } from "react-router-dom";
import { useUser } from "../../components/context/userContext";
import Locked from "../../components/layout/Locked";

const Company_accounts = () => {
  const { menu } = useOutletContext();
  const { user } = useUser();
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{menu.icon}</div>
          {menu.label}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop">
        <div className="flex whitebox !shadow-none !p-0 text-[#d84f00] border-[#d84f00] border-1">
          <div className="flex icon p-3 border-r-1">
            <GoAlertFill />
          </div>
          <div className="flex items-center ml-2 font-[500]">
            Chỉ admin mới được thêm mới tài khoản
          </div>
        </div>
        <div className="whitebox h-full flex flex-col !p-0">
          {!user?.info?.isAdmin ? (
            <div className="flex p-2 border-b-1 border-[#0002] gap-2">
              <Select
                defaultValue="all"
                placeholder="Phân loại tài khoản"
                className="min-w-[150px]"
              >
                <Select.Option value="all">Tất cả tài khoản</Select.Option>
                <Select.Option value="SuperAdmin">SuperAdmin</Select.Option>
                <Select.Option value="Admin">Admin</Select.Option>
                <Select.Option value="User">User</Select.Option>
              </Select>
              <Select
                defaultValue="all"
                placeholder="Phòng ban"
                className="min-w-[160px]"
              >
                <Select.Option value="all">Tất cả phòng ban</Select.Option>
              </Select>
              <Select
                defaultValue="all"
                placeholder="Chức vụ"
                className="min-w-[160px]"
              >
                <Select.Option value="all">Tất cả chức vụ</Select.Option>
              </Select>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <Locked description="Bạn không có quyền truy cập" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Company_accounts;
