import {
  Button,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Select,
  Spin,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { GoAlertFill } from "react-icons/go";
import { useOutletContext } from "react-router-dom";
import { useUser } from "../../components/context/userContext";
import Locked from "../../components/layout/Locked";
import api from "../../components/api";
import { FaEdit, FaLock, FaPlus } from "react-icons/fa";
import { TbAlertSquareRoundedFilled, TbLockPause } from "react-icons/tb";
import app from "../../components/app";
import Alert_box from "../../components/alert-box";
import Add_account from "./account/add_accounts";
import Edit_accounts from "./account/edit_accounts";
import { length } from "./../../../node_modules/stylis/src/Tokenizer";

const Company_accounts = () => {
  const { menu } = useOutletContext();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuper, setIsAdminSuper] = useState(false);
  const [filters, setFilters] = useState({
    role: "all",
    department: "all",
    position: "all",
  });
  const [editModal, setEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editForm] = Form.useForm();
  const openEditAccount = (acc) => {
    setSelectedAccount(acc);
    console.log(acc);
    editForm.setFieldsValue({
      password: "******",
      username: acc.username,
      cardID: acc.cardID,
      department: acc.department_name,
      possition: acc.possition_name,
      managerCustomer: acc.managerCustomer,
      role: acc.isSuperAdmin ? "SuperAdmin" : acc.isAdmin ? "Admin" : "Staff",
    });
    setEditModal(acc);
  };

  useEffect(() => {
    setLoading(true);
    setIsAdminSuper(user?.info?.isSuperAdmin);
    setIsAdmin(user?.info?.isAdmin);
    api
      .get("/accounts/", user.token)
      .then((res) => {
        if (res.results) {
          setLocked(false);
          setAccounts(res.results);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const renderRole = (acc) =>
    acc.Ban
      ? "Đã ban"
      : acc.isSuperAdmin
      ? "Boss"
      : acc.isAdmin
      ? "Admin"
      : "Staff";

  const renderTools = (acc) => {
    const canEdit =
      (isSuper && !acc.isSuperAdmin) ||
      (isAdmin && !acc.isAdmin && !acc.isSuperAdmin);
    return canEdit ? (
      <>
        <Tooltip title="Sửa tài khoản">
          <Button
            className="!text-[#0003] hover:!text-[#6c8eff]"
            icon={<FaEdit />}
            onClick={() => openEditAccount(acc)}
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
    );
  };

  const renderAccount = (acc) => (
    <div
      key={acc.id}
      className="flex gap-2 items-center p-2 py-1.5 border-b-1 border-[#6a80ad33] relative hover:bg-[#f4f7fd] transition-all text-[13px]"
    >
      <div className="flex flex-col w-[50px] items-center">
        <div
          className="avatar w-[50px] h-[50px] rounded-xl flex items-center 
        justify-center font-[500] text-[#fff] text-[18px]"
          style={{
            backgroundColor: acc?.profile?.avatar_base64
              ? undefined
              : app.stringToColor(acc?.profile?.full_name || "G"),
          }}
        >
          {acc?.profile?.avatar_base64 ? (
            <img src={acc?.profile?.avatar_base64} alt="" />
          ) : acc?.profile?.full_name ? (
            acc?.profile?.full_name.toUpperCase().split(" ").pop()[0]
          ) : (
            "?"
          )}
        </div>
      </div>
      <div className="flex flex-col w-[160px]">
        <div className="name">
          {acc?.profile?.full_name ? (
            <div className="font-[500] text-[15px]">
              {acc?.profile?.full_name}
            </div>
          ) : (
            "Chưa đặt tên"
          )}
        </div>
        <div className="name">
          {acc.managerCustomer.length > 0
            ? `Quản lý ${acc.managerCustomer.length} công ty`
            : renderRole(acc)}
        </div>
      </div>
      <div className="flex flex-col w-[180px]">
        <div className="name">
          {acc.department_name}{" "}
          {acc.possition_name && ` - ${acc.possition_name}`}
        </div>
        <div className="name">{acc.isActive ? "Hoạt động" : "Đã tắt"}</div>
      </div>
      <div className="flex flex-col w-[120px]">
        <div className="name">Sửa: {app.timeSince(acc.updated_at)}</div>
        <div className="name">Tạo: {app.timeSince(acc.created_at)}</div>
      </div>
      <div className="tools flex gap-2 ml-auto mr-2">{renderTools(acc)}</div>
    </div>
  );
  const filterOption = {
    "Tài khoản": [
      { value: "all", label: "Tất cả level" },
      { value: "SuperAdmin", label: "Boss" },
      { value: "Admin", label: "Admin" },
      { value: "Staff", label: "Staff" },
    ],
    "Phòng ban": [
      { value: "all", label: "Tất cả phòng" },
      ...user?.company?.Department.map((dpt) => {
        return { value: dpt.id, label: dpt.name };
      }),
    ],
    "Chức vụ": [
      { value: "all", label: "Tất cả chức vụ" },
      ...Array.from(
        new Set(
          user?.company?.Department?.flatMap((dep) =>
            dep.Possition.map((pos) => pos.name)
          )
        )
      ).map((name) => ({
        value: name,
        label: name,
      })),
    ],
  };
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{menu.icon}</div>
          {menu.label}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop min-w-[720px] overflow-hidden">
        <Alert_box text="Chỉ boss và admin mới được thêm mới tài khoản" />
        <div className="whitebox h-full flex flex-col !p-0 overflow-hidden">
          {loading ? (
            <div className="flex flex-1 justify-center items-center">
              <Spin size="large" />
            </div>
          ) : !locked ? (
            <>
              <div className="flex p-2 border-b-1 border-[#0002] gap-2">
                {["Tài khoản", "Phòng ban", "Chức vụ"].map((label, idx) => (
                  <Select
                    key={idx}
                    defaultValue="all"
                    placeholder={label}
                    className="min-w-[160px]"
                    options={filterOption[label]}
                    onChange={(value) => {
                      const mapKey = {
                        "Tài khoản": "role",
                        "Phòng ban": "department",
                        "Chức vụ": "position",
                      };
                      handleFilterChange(mapKey[label], value);
                    }}
                  />
                ))}
                <Add_account
                  setAccounts={setAccounts}
                  user={user}
                  setUser={setUser}
                  isSuper={isSuper}
                  isAdmin={isAdmin}
                />
                <Edit_accounts
                  editModal={editModal}
                  editForm={editForm}
                  setEditModal={setEditModal}
                  selectedAccount={selectedAccount}
                  setAccounts={setAccounts}
                  user={user}
                  setUser={setUser}
                  isSuper={isSuper}
                  isAdmin={isAdmin}
                />
              </div>
              <div className="mr-0.5 my-0.5 flex flex-col overflow-y-auto px-1 fadeInTop">
                {accounts
                  .filter((acc) => {
                    if (filters.role !== "all") {
                      if (filters.role === "SuperAdmin" && !acc.isSuperAdmin)
                        return false;
                      if (filters.role === "Admin" && !acc.isAdmin)
                        return false;
                      if (
                        filters.role === "Staff" &&
                        (acc.isAdmin || acc.isSuperAdmin)
                      )
                        return false;
                    }
                    if (
                      filters.department !== "all" &&
                      acc.department !== filters.department
                    )
                      return false;
                    if (
                      filters.position !== "all" &&
                      acc.possition_name !== filters.position
                    )
                      return false;
                    return true;
                  })
                  .map(renderAccount)}
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
