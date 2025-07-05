import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import api from "../api";
import { useUser } from "../context/userContext";

const Update_op_nguoituyen = ({ op, children, className, update }) => {
  const { user, setUser } = useUser();
  const [visible, setVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [form] = Form.useForm();
  const showModal = () => {
    setVisible(true);
    form.setFieldsValue(op); // set dữ liệu ban đầu vào form
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Thông tin đã cập nhật:", values);
        setUpdating(true);
        api
          .patch(`ops/${op.id}/`, values, user?.token)
          .then((res) => {
            update(res);
            message.success("Cập nhập thành công!");
            setVisible(false);
          })
          .catch((e) =>
            message.error(e?.response?.data?.detail || "Lỗi khi cập nhập!")
          )
          .finally(() => setUpdating(false));
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };
  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <>
      <div className={className} onClick={showModal}>
        {children}
      </div>

      <Modal
        title="Cập nhật thông tin"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={updating}
        okText="Lưu"
        className="popupcontent vendor-edit"
        cancelText="Hủy"
      >
        <Form form={form} layout="horizontal" initialValues={op}>
          <Form.Item name="vendor" label="Vendor">
            <Select
              placeholder="Vendor"
              options={user?.company?.Vendor?.map((cus) => ({
                value: cus.id,
                label: cus?.fullname || cus?.name,
              }))}
              className="w-[160px]"
              allowClear={true}
              showSearch={true}
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item name="nguoituyen" label="Người tuyển">
            <Select
              placeholder="Nhân viên"
              options={user?.company?.Staff?.map((cus) => ({
                value: cus.id,
                label: cus?.profile?.full_name,
              }))}
              className="w-[160px]"
              allowClear={true}
              showSearch={true}
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item name="nguoibaocao" label="Người báo cáo">
            <Select
              placeholder="Nhân viên"
              options={user?.company?.Staff?.map((cus) => ({
                value: cus.id,
                label: cus?.profile?.full_name,
              }))}
              className="w-[160px]"
              allowClear={true}
              showSearch={true}
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Update_op_nguoituyen;
