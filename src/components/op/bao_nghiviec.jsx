import { DatePicker, Form, Input, message, Modal, Select, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../api";

const OP_nghiviec = ({ children, op, user, callback, className }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(op);
  }, [op]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      api
        .post(`/ops/${op.id}/nghiviec/`, values, user.token)
        .then((res) => {
          message.success("Thành công!");
          callback(res);
          setOpen(false);
          form.resetFields();
        })
        .catch((e) => {
          api.error(e);
        });
    });
  };
  return (
    <>
      <Tooltip
        title={!op?.congty_danglam ? `Chưa đi làm` : false}
        className={className}
      >
        <span
          onClick={() => {
            console.log(op.congty_danglam);
            if (op?.congty_danglam) handleClick();
          }}
          style={{ cursor: "pointer" }}
        >
          {children}
        </span>
      </Tooltip>
      <Modal
        title="Xác nhận nghỉ làm"
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        className="popupcontent"
      >
        <Form
          layout="vertical"
          className="thinform"
          form={form}
          initialValues={{
            ngayNghi: dayjs(),
          }}
        >
          <Form.Item
            label="Ngày nghỉ việc"
            name="ngayNghi"
            rules={[{ required: true, message: "Chọn ngày nghỉ việc" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Lý do nghỉ" name="lyDo">
            <Input.TextArea rows={3} placeholder="Lý do thôi việc..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OP_nghiviec;
