import { Modal, Input, Form, message, Button } from "antd";
import React, { useState } from "react";
import { useUser } from "../context/userContext";
import api from "../api";

const Change_pass = ({ children, className }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoad, setConfirmLoad] = useState(false);
  const [form] = Form.useForm();
  const { user } = useUser();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { oldPass, newPass } = values;
      setConfirmLoad(true);
      api
        .post(
          "info/change_pass/",
          {
            old_pass: oldPass,
            new_pass: newPass,
          },
          user?.token
        )
        .then((res) => {
          message.success("Đổi mật khẩu thành công!");
          setOpen(false);
          form.resetFields();
        })
        .catch((e) => {
          message.error(e?.response?.data?.detail || "Phát sinh lỗi!");
        })
        .finally(() => setConfirmLoad(false));
    } catch (error) {
      // Form chưa hợp lệ, không làm gì
    }
  };

  return (
    <>
      <div onClick={handleOpen} className={className}>
        {children}
      </div>
      <Modal
        open={open}
        title="Đổi mật khẩu"
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={confirmLoad}
        okText="Xác nhận"
        cancelText="Hủy"
        className="popupcontent"
      >
        <Form form={form} layout="vertical" className="mini">
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPass"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu cũ..." />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPass"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới..." />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu mới"
            name="confirmPass"
            dependencies={["newPass"]}
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPass") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Mật khẩu nhập lại không khớp");
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Change_pass;
