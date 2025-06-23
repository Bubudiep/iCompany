import {
  Tooltip,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import api from "../api";
import { dayjs } from "dayjs";

const { Option } = Select;

const OP_dilam = ({ children, op, user, callback, className }) => {
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
        .post(`/ops/${op.id}/dilam/`, values, user.token)
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
        title={
          op?.congty_danglam ? `Đang làm việc tại ${op?.congty_danglam}` : false
        }
        className={className}
      >
        <span onClick={handleClick} style={{ cursor: "pointer" }}>
          {children}
        </span>
      </Tooltip>
      <Modal
        title="Xác nhận đi làm"
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
            ten: op?.ho_ten,
            nguoituyen: op?.nguoituyen,
            so_cccd: op?.so_cccd,
          }}
        >
          <Form.Item
            label="Công ty"
            name="congty"
            rules={[{ required: true, message: "Chọn công ty" }]}
          >
            <Select
              showSearch
              placeholder="Chọn công ty"
              options={user?.company?.Customer?.map((cpn) => ({
                value: cpn.id,
                label: cpn.name,
              }))}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            label="Người tuyển"
            name="nguoituyen"
            rules={[{ required: true, message: "Chọn người tuyển" }]}
          >
            <Select
              showSearch
              placeholder="Chọn người tuyển"
              options={user?.company?.Staff?.map((staff) => ({
                value: staff.id,
                label: `${staff?.profile?.full_name} - ${staff?.cardID}`,
              }))}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            label="Ngày bắt đầu làm"
            name="ngaybatdau"
            rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Mã nhân viên"
            name="manhanvien"
            rules={[{ required: true, message: "Nhập mã nhân viên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={`Tên đi làm`} name="ten">
            <Input />
          </Form.Item>
          <Form.Item label={`Số CCCD`} name="cccd">
            <Input />
          </Form.Item>
          <Form.Item label="Ghi chú" name="ghichu">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OP_dilam;
