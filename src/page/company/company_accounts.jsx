import { Button, Empty, Select, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { GoAlertFill } from "react-icons/go";
import { useOutletContext } from "react-router-dom";
import { useUser } from "../../components/context/userContext";
import Locked from "../../components/layout/Locked";
import api from "../../components/api";
import { FaLock, FaPlus } from "react-icons/fa";
import { MdLockReset } from "react-icons/md";
import { TbAlertSquareRoundedFilled, TbLockPause } from "react-icons/tb";
import app from "../../components/app";

const Company_accounts = () => {
  const { menu } = useOutletContext();
  const { user } = useUser();
  const [locked, setLocked] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const loadAccounts = () => {
    api
      .get("/accounts/", user.token)
      .then((res) => {
        if (res.results) {
          setLocked(false);
          setAccounts(res.results);
        }
      })
      .catch((e) => {})
      .finally(() => {});
  };
  const addAccount = () => {};
  useEffect(() => {
    loadAccounts();
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
        <div className="flex whitebox !shadow-none !p-0 text-[#d84f00] border-[#d84f00] border-1">
          <div className="flex icon p-3 border-r-1">
            <GoAlertFill />
          </div>
          <div className="flex items-center ml-2 font-[500]">
            Chỉ admin mới được thêm mới tài khoản
          </div>
        </div>
        <div className="whitebox h-full flex flex-col !p-0">
          {!locked ? (
            <>
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
                <Button
                  type="primary"
                  className="ml-auto"
                  icon={<FaPlus />}
                  onClick={addAccount}
                >
                  Thêm tài khoản
                </Button>
              </div>
              <div className="mr-0.5 my-0.5 flex flex-col overflow-y-auto px-1">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="flex gap-2 items-center p-2 py-1.5 border-b-1 duration-300
                  border-[#6a80ad33] relative hover:bg-[#f4f7fd] transition-all text-[13px]"
                  >
                    <div className="flex flex-col w-[50px] items-center">
                      <div className="avatar w-[40px] h-[40px] bg-[#0003] rounded-xl"></div>
                    </div>
                    <div className="flex flex-col w-[160px]">
                      <div className="flex name">Mã NV: {acc.cardID}</div>
                      <div className="flex name">Tài khoản: {acc.username}</div>
                    </div>
                    <div className="flex flex-col w-[180px]">
                      <div className="flex name">
                        {acc.Ban
                          ? "Đã ban"
                          : acc.isSuperAdmin
                          ? "Giám đốc"
                          : acc.isAdmin
                          ? "Admin"
                          : "Nhân viên"}
                      </div>
                      <div className="flex name">
                        Trạng thái:
                        {acc.isActive ? " Hoạt đông" : " Đã tắt"}
                      </div>
                    </div>
                    <div className="flex flex-col w-[120px]">
                      <div className="flex name">
                        Sửa: {app.timeSince(acc.updated_at)}
                      </div>
                      <div className="flex name">
                        Tạo: {app.timeSince(acc.created_at)}
                      </div>
                    </div>
                    <div className="tools flex gap-2 ml-auto mr-2">
                      {user.info.isSuperAdmin && !acc.isSuperAdmin ? (
                        <>
                          <Tooltip title="Lock: Chặn đăng nhập">
                            <Button
                              className="!text-[#0003] hover:!text-[#6c8eff]"
                              icon={<FaLock />}
                            />
                          </Tooltip>
                          <Tooltip title="Reset: Đặt lại mật khẩu">
                            <Button
                              className="!text-[#0003] hover:!text-[#6c8eff]"
                              icon={<TbLockPause />}
                            />
                          </Tooltip>
                        </>
                      ) : !acc.isAdmin &&
                        !acc.isSuperAdmin &&
                        user.info.isAdmin ? (
                        <>
                          <Tooltip title="Lock: Chặn đăng nhập">
                            <Button
                              className="!text-[#0003] hover:!text-[#6c8eff]"
                              icon={<FaLock />}
                            />
                          </Tooltip>
                          <Tooltip title="Reset: Đặt lại mật khẩu">
                            <Button
                              className="!text-[#0003] hover:!text-[#6c8eff]"
                              icon={<TbLockPause />}
                            />
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip
                          title="Bị hạn chế do là tài khoản admin hoặc giám đốc"
                          className="text-[#f59d4b] flex gap-1 items-center text-[12px] font-[500]"
                        >
                          <TbAlertSquareRoundedFilled size={18} /> Hạn chế
                        </Tooltip>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
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
