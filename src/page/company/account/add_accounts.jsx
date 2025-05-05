import { Button, Form, Input, message, Modal, Select } from "antd";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import api from "../../../components/api";

const Add_account = ({ setAccounts, isSuper, isAdmin, user }) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [depart, setDepart] = useState(false);
  const [addForm] = Form.useForm();
  const listCompany = user?.company?.Customer || [];
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
  return (
    <>
      <Button
        type="primary"
        className="ml-auto"
        icon={<FaPlus />}
        onClick={() => setOpenAddModal(true)}
      >
        Thêm tài khoản
      </Button>
      <Modal
        title="Thêm tài khoản nhân viên"
        open={openAddModal}
        onCancel={() => setOpenAddModal(false)}
        onOk={handleAddAccount}
        okText="Tạo tài khoản"
        cancelText="Hủy"
        className="popupcontent"
      >
        <Form form={addForm} layout="vertical" className="flex flex-col gap-1">
          <div className="flex gap-5">
            <Form.Item
              className="!mb-2 flex-1"
              label="Username"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="!mb-2 flex-1"
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password />
            </Form.Item>
          </div>
          <div className="flex gap-5">
            <Form.Item
              className="!mb-2 flex-1"
              label="Họ và tên"
              name="fullname"
              rules={[{ message: "Vui lòng nhập mã NV" }]}
            >
              <Input placeholder="họ và tên..." />
            </Form.Item>
            <Form.Item
              className="!mb-2 flex-1"
              label="Ngày sinh"
              name="birthday"
            >
              <Input type="date" />
            </Form.Item>
          </div>
          <div className="flex gap-5">
            <Form.Item
              className="!mb-2 flex-1"
              label="Mã nhân viên"
              name="cardID"
              rules={[{ message: "Vui lòng nhập mã NV" }]}
            >
              <Input placeholder="để trống sẽ tạo tự động..." />
            </Form.Item>
            <Form.Item
              className="!mb-2 flex-1"
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
          </div>
          <div className="flex gap-5">
            <Form.Item label="Phòng ban" name="department" className="flex-1">
              <Select
                placeholder="Chọn phòng ban..."
                onChange={(val) => {
                  setDepart(val);
                  addForm.setFieldsValue({ possition: undefined });
                }}
                allowClear
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
                allowClear
                placeholder="Chọn chức vụ..."
                options={user.company.Department.find(
                  (dep) => dep.name === depart
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
              options={listCompany.map((company) => {
                return {
                  value: company.id,
                  label: `${company.name} - ${company.fullname}`,
                };
              })}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Add_account;
