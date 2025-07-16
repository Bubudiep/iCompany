import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../api";

const OP_giuluong = ({ children, op, user, callback, className }) => {
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
        .post(`/ops/${op.id}/baogiu/`, values, user.token)
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
            handleClick();
          }}
          style={{ cursor: "pointer" }}
        >
          {children}
        </span>
      </Tooltip>
      <Modal
        title="Giữ lương người lao động"
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
            label="Số tiền"
            name="sotien"
            rules={[{ required: true, message: "Nhập số tiền" }]}
          >
            <InputNumber
              className="!w-[200px]"
              min={20000}
              max={20000000}
              step={100000}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              }
              parser={(value) =>
                value.replace(/\./g, "").replace(/[^0-9]/g, "")
              }
              placeholder="Nhập số tiền"
              addonAfter={<div className="text-[#999]">VNĐ</div>}
            />
          </Form.Item>
          <Form.Item label="Lý do" name="lydo">
            <Input.TextArea rows={3} placeholder="nhập lý do..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OP_giuluong;
