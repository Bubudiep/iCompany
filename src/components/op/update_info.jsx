import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import api from "../api";
import { useUser } from "../context/userContext";

const Update_op_info = ({ op, children, className, update }) => {
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
          <Form.Item name="ho_ten" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gioi_tinh" label="Giới tính">
            <Input />
          </Form.Item>
          <Form.Item name="ngaysinh" label="Ngày sinh">
            <Input />
          </Form.Item>
          <Form.Item name="sdt" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="so_cccd" label="Số CCCD">
            <Input />
          </Form.Item>
          <Form.Item name="diachi" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="ghichu" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="nhập ghi chú..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Update_op_info;
