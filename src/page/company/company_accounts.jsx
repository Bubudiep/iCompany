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

const Company_accounts = () => {
  const { menu } = useOutletContext();
  const { user } = useUser();
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
  const [updating, setUpdating] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addForm] = Form.useForm();
  const [editModal, setEditModal] = useState(false);
  const [editForm] = Form.useForm();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const openEditAccount = (acc) => {
    setSelectedAccount(acc);
    editForm.setFieldsValue({
      username: acc.username,
      cardID: acc.cardID,
      department: acc.department_name,
      position: acc.possition_name,
      role: acc.isSuperAdmin ? "SuperAdmin" : acc.isAdmin ? "Admin" : "Staff",
    });
    setEditModal(true);
  };
  const handleUpdateAccount = () => {
    setUpdating(true);
    editForm.validateFields().then((values) => {
      const { role, ...rest } = values;
      const payload = {
        ...rest,
        isSuperAdmin: role === "SuperAdmin",
        isAdmin: role === "Admin",
      };
      api
        .patch(`/accounts/${selectedAccount.id}/`, payload, user.token)
        .then((res) => {
          setAccounts((old) => {
            const updated = old.map((acc) => (acc.id === res.id ? res : acc));
            return updated;
          });
          message.success("Cập nhật tài khoản thành công");
          setEditModal(false);
          editForm.resetFields();
        })
        .catch((e) => {
          message.error(e?.response?.data?.detail || "Lỗi khi cập nhập!");
        })
        .finally(() => {
          setUpdating(false);
        });
    });
  };

  const handleAddAccount = () => {
    addForm.validateFields().then((values) => {
      api
        .post("/user/", values, user.token)
        .then((res) => {
          message.success("Tạo tài khoản thành công!");
          setAccounts((old) => [res, ...old]);
          setOpenAddModal(false);
          addForm.resetFields();
        })
        .catch((e) => {
          message.error(e?.response?.data?.detail || "Lỗi khi tạo tài khoản!");
        });
    });
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
        {/* <Tooltip title="Lock: Chặn đăng nhập">
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
        </Tooltip> */}
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
        <div className="avatar w-[40px] h-[40px] bg-[#0003] rounded-xl"></div>
      </div>
      <div className="flex flex-col w-[160px]">
        <div className="name">Mã NV: {acc.cardID}</div>
        <div className="name">Tài khoản: {acc.username}</div>
      </div>
      <div className="flex flex-col w-[180px]">
        <div className="name">{renderRole(acc)}</div>
        <div className="name">
          Trạng thái: {acc.isActive ? "Hoạt động" : "Đã tắt"}
        </div>
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
    "Phòng ban": [{ value: "all", label: "Tất cả phòng" }],
    "Chức vụ": [{ value: "all", label: "Tất cả chức vụ" }],
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

      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop">
        <div className="flex whitebox !shadow-none !p-0 text-[#d84f00] border-[#d84f00] border-1">
          <div className="icon p-3 border-r-1">
            <GoAlertFill />
          </div>
          <div className="flex items-center ml-2 font-[500]">
            Chỉ boss và admin mới được thêm mới tài khoản
          </div>
        </div>

        <div className="whitebox h-full flex flex-col !p-0">
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
                <Button
                  type="primary"
                  className="ml-auto"
                  icon={<FaPlus />}
                  onClick={() => setOpenAddModal(true)}
                >
                  Thêm tài khoản
                </Button>
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
                      acc.position !== filters.position
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
      <Modal
        title="Sửa tài khoản"
        open={editModal}
        onCancel={() => setEditModal(false)}
        onOk={handleUpdateAccount}
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={updating}
      >
        <Form form={editForm} layout="vertical" className="flex flex-col gap-1">
          <Form.Item label="Username" name="username" className="!mb-2">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Mã NV" name="cardID" className="!mb-2">
            <Input />
          </Form.Item>
          <Form.Item label="Vai trò" name="role" className="!mb-2">
            <Select
              options={[
                isSuper && { value: "SuperAdmin", label: "Boss" },
                isAdmin && { value: "Admin", label: "Admin" },
                { value: "Staff", label: "Staff" },
              ].filter(Boolean)}
            />
          </Form.Item>
          <div className="flex gap-5">
            <Form.Item label="Phòng ban" name="department">
              <Input />
            </Form.Item>
            <Form.Item label="Chức vụ" name="position">
              <Input />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Thêm tài khoản nhân viên"
        open={openAddModal}
        onCancel={() => setOpenAddModal(false)}
        onOk={handleAddAccount}
        okText="Tạo tài khoản"
        cancelText="Hủy"
      >
        <Form form={addForm} layout="vertical" className="flex flex-col gap-1">
          <Form.Item
            className="!mb-2"
            label="Username"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="!mb-2"
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            className="!mb-2"
            label="Mã nhân viên"
            name="cardID"
            rules={[{ message: "Vui lòng nhập mã NV" }]}
          >
            <Input placeholder="để trống hệ thống sẽ tạo tự động..." />
          </Form.Item>
          <Form.Item
            className="!mb-2"
            label="Vai trò"
            name="role"
            initialValue="Staff"
          >
            <Select
              options={[
                isSuper && { value: "SuperAdmin", label: "Boss" },
                isAdmin && { value: "Admin", label: "Admin" },
                { value: "Staff", label: "Staff" },
              ].filter(Boolean)}
            />
          </Form.Item>
          <div className="flex gap-5">
            <Form.Item label="Phòng ban" name="department">
              <Input placeholder="VD: Kỹ thuật, Nhân sự..." />
            </Form.Item>
            <Form.Item label="Chức vụ" name="possition">
              <Input placeholder="VD: Nhân viên, Trưởng phòng..." />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Company_accounts;
