import React, { useEffect, useState } from "react";
import api from "../../../components/api";
import { Button, Form, Input, message, Modal, Select } from "antd";
import { FaLock } from "react-icons/fa";

const Edit_accounts = ({
  editModal,
  selectedAccount,
  setEditModal,
  user,
  isAdmin,
  isSuper,
  editForm,
  setAccounts,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState(
    editForm.getFieldValue("department")
  );
  const [password, setPassword] = useState("******");
  const blockFields = ["username", "password"];
  const [updating, setUpdating] = useState(false);
  const { confirm } = Modal;
  const handleUpdateAccount = () => {
    setUpdating(true);
    editForm.validateFields().then((values) => {
      const { role, ...rest } = values;

      const updatedFields = {};
      const newPayload = {
        ...rest,
        isSuperAdmin: role === "SuperAdmin",
        isAdmin: role === "Admin",
      };
      Object.keys(newPayload).forEach((key) => {
        if (blockFields.includes(key)) return;
        if (newPayload[key] !== selectedAccount[key]) {
          updatedFields[key] = newPayload[key];
        }
      });
      if (Object.keys(updatedFields).length === 0) {
        message.info("Không có thay đổi nào để cập nhật");
        setUpdating(false);
        return;
      }
      api
        .patch(`/accounts/${selectedAccount.id}/`, updatedFields, user.token)
        .then((res) => {
          setAccounts((old) =>
            old.map((acc) => (acc.id === res.id ? res : acc))
          );
          message.success("Cập nhật tài khoản thành công");
          setEditModal(false);
          editForm.resetFields();
        })
        .catch((e) => {
          console.log(e);
          message.error(
            e?.response?.data?.detail ||
              "Lỗi khi cập nhật: " + e?.response?.toString()
          );
        })
        .finally(() => {
          setUpdating(false);
        });
    });
  };
  const handleResetPassword = () => {
    const userId = selectedAccount;
    confirm({
      title: "Xác nhận đặt lại mật khẩu?",
      content:
        "Bạn có chắc chắn muốn đặt lại mật khẩu cho người dùng này không?",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => {
        api
          .post(`/accounts/${userId.id}/reset-password/`, {}, user.token)
          .then((res) => {
            const newPass = res.new_password;
            setPassword(newPass);
            navigator.clipboard.writeText(newPass).then(() => {
              message.success(`Mật khẩu mới đã được sao chép: ${newPass}`);
            });
            message.success(`Đã cấp mật khẩu mới!`);
          })
          .catch((err) => {
            message.error(
              err.response?.data?.detail || "Đặt lại mật khẩu thất bại"
            );
          });
      },
    });
  };
  useEffect(() => {
    setPassword("******");
    setSelectedDepartment(editForm.getFieldValue("department"));
  }, [editModal]);
  return (
    <Modal
      title="Sửa tài khoản"
      open={editModal}
      onCancel={() => setEditModal(false)}
      onOk={handleUpdateAccount}
      okText="Cập nhật"
      cancelText="Hủy"
      className="popupcontent"
      confirmLoading={updating}
    >
      <Form form={editForm} layout="vertical" className="flex flex-col gap-1">
        <div className="flex gap-2">
          <Form.Item label="Tài khoản" name="username" className="!mb-2 flex-1">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Mật khẩu" name="password" className="!mb-2 flex-1">
            <div className="flex gap-2">
              <Input disabled={password === "******"} value={password} />
              <Button
                type="primary"
                className="!px-2"
                icon={<FaLock />}
                onClick={handleResetPassword} // truyền ID người dùng vào
              >
                Reset
              </Button>
            </div>
          </Form.Item>
        </div>
        <div className="flex gap-2">
          <Form.Item label="Mã NV" name="cardID" className="!mb-2 flex-1">
            <Input />
          </Form.Item>
          <Form.Item label="Vai trò" name="role" className="!mb-2 flex-1">
            <Select
              options={[
                isSuper && { value: "SuperAdmin", label: "Boss" },
                isAdmin && { value: "Admin", label: "Admin" },
                { value: "Staff", label: "Staff" },
              ].filter(Boolean)}
            />
          </Form.Item>
        </div>
        <div className="flex gap-2">
          <Form.Item label="Phòng ban" name="department" className="flex-1">
            <Select
              placeholder="Chọn phòng ban..."
              onChange={(val) => {
                setSelectedDepartment(val);
                editForm.setFieldsValue({ possition: undefined });
              }}
              options={user.company.Department.map((dep) => {
                return {
                  value: dep.name,
                  label: dep.name,
                };
              })}
            />
          </Form.Item>
          <Form.Item label="Chức vụ" name="possition" className="flex-1">
            <Select
              placeholder="Chọn chức vụ..."
              options={user.company.Department.find(
                (dep) => dep.name === selectedDepartment
              )?.Possition.map((pos) => {
                return {
                  value: pos.name,
                  label: pos.name,
                };
              })}
            />
          </Form.Item>
        </div>
        <Form.Item
          label="Là quản lý của công ty"
          name="managerCustomer"
          className="flex-1"
        >
          <Select
            mode="multiple"
            placeholder="Chọn nhiều công ty..."
            options={user?.company?.Customer.map((company) => {
              return {
                value: company.id,
                label: `${company.name}${
                  company.fullname ? ` - ${company.fullname}` : ""
                }`,
              };
            })}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Edit_accounts;
