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
import dayjs from "dayjs";

const { Option } = Select;

const OP_dilamroi = ({ children, op, user, callback, className }) => {
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
        .post(
          `/ops/${op.id}/dilamroi/`,
          {
            ...values,
            ngaybatdau: dayjs(values.ngaybatdau).format("YYYY-MM-DD"),
            ngaynghi: dayjs(values.ngaynghi).format("YYYY-MM-DD"),
          },
          user.token
        )
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
          op?.congty_danglam
            ? `Đang làm việc tại ${
                user?.company?.Customer?.find(
                  (cpn) => cpn.id === op?.congty_danglam
                )?.name
              }`
            : false
        }
        className={className}
      >
        <span onClick={handleClick} style={{ cursor: "pointer" }}>
          {children}
        </span>
      </Tooltip>
      <Modal
        title="Thêm lịch sử đi làm"
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        className="popupcontent mini"
      >
        <Form
          layout="vertical"
          className="thinform"
          form={form}
          initialValues={{
            ten: op?.ho_ten,
            nguoituyen: op?.nguoituyen,
            cccd: op?.so_cccd,
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
                value: cpn.name,
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
            label="Ngày nghỉ làm"
            name="ngaynghi"
            rules={[{ required: true, message: "Chọn ngày nghỉ" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Nhà chính" name="nhachinh">
            <Select
              showSearch
              placeholder="Chọn nhà chính"
              options={user?.company?.Vendor?.map((staff) => ({
                value: staff.name,
                label: `${staff?.name}`,
              }))}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item label="Mã nhân viên" name="manhanvien">
            <Input />
          </Form.Item>
          <Form.Item label="Số CCCD" name="cccd">
            <Input />
          </Form.Item>
          <Form.Item label={`Tên đi làm`} name="fullname">
            <Input />
          </Form.Item>
          <Form.Item label="Công việc" name="congviec">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OP_dilamroi;
