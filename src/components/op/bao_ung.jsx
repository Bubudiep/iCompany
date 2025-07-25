import {
  Tooltip,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Descriptions,
  InputNumber,
} from "antd";
import React, { useEffect, useState } from "react";
import api from "../api";
import { dayjs } from "dayjs";
import Card_bank_user from "../cards/user-bank-card";

const { Option } = Select;

const OP_baoung = ({ children, op, user, callback, className }) => {
  const [open, setOpen] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [form] = Form.useForm();
  const [nguoiThuHuong, setNguoiThuHuong] = useState(null);
  const [hinhThuc, setHinhThuc] = useState(null);

  useEffect(() => {
    if (open && op) {
      form.resetFields();
      setNguoiThuHuong(null);
      setHinhThuc(null);
    }
  }, [open, op, form]);

  const handleClick = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      setIsSend(true);
      const values = await form.validateFields();
      api
        .post(`/ops/${op.id}/baoung/`, values, user.token)
        .then((res) => {
          message.success("Báo ứng thành công!");
          callback(res);
          setOpen(false);
          form.resetFields();
        })
        .catch((e) => {
          api.error(e);
        })
        .finally(() => setIsSend(false));
    } catch (err) {
      message.warning("Vui lòng điền đầy đủ thông tin bắt buộc!");
    }
  };

  return (
    <>
      <Tooltip title={false} className={className}>
        <span onClick={handleClick} style={{ cursor: "pointer" }}>
          {children}
        </span>
      </Tooltip>
      <Modal
        open={open}
        onCancel={onClose}
        title={`${op?.ho_ten || ""} - Báo ứng`}
        className="popupcontent !w-[800px]"
        footer={[
          <Button key="cancel" onClick={onClose}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isSend}
            onClick={handleSave}
          >
            Lưu
          </Button>,
        ]}
      >
        <div className="flex flex-col gap-2">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Họ và tên">
              {op?.ho_ten}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {op?.ngaysinh}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {op?.gioi_tinh}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {op?.sdt}
            </Descriptions.Item>
            <Descriptions.Item label="Số CCCD">{op?.so_cccd}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{op?.diachi}</Descriptions.Item>
          </Descriptions>

          <div className="text-lg font-semibold mt-4">Thông tin báo ứng</div>

          <Form layout="vertical" className="form-baoung" form={form}>
            <Form.Item
              label="Số tiền"
              name="soTien"
              rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
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
                addonAfter="vnđ"
              />
            </Form.Item>

            <Form.Item
              label="Lý do"
              name="lyDo"
              rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
            >
              <Input placeholder="Nhập lý do báo ứng" />
            </Form.Item>

            <Form.Item
              label="Người thụ hưởng"
              name="nguoiThuhuong"
              rules={[{ required: true, message: "Chọn người thụ hưởng" }]}
            >
              <Select
                placeholder="Chọn người thụ hưởng"
                className="w-[200px]"
                onChange={(val) => {
                  setNguoiThuHuong(val);
                  form.setFieldsValue({ hinhThuc: undefined });
                }}
              >
                <Option value="opertor">Người lao động</Option>
                <Option value="staff">Người tuyển</Option>
                <Option value="other">Người khác nhận hộ</Option>
              </Select>
            </Form.Item>

            {nguoiThuHuong && (
              <Form.Item
                label="Hình thức"
                name="hinhthucThanhtoan"
                rules={[
                  { required: true, message: "Chọn hình thức giải ngân" },
                ]}
              >
                <Select
                  placeholder="Chọn hình thức"
                  className="w-[200px]"
                  onChange={setHinhThuc}
                >
                  <Option value="bank">Chuyển khoản</Option>
                  <Option value="money">Thanh toán tiền mặt</Option>
                </Select>
              </Form.Item>
            )}

            {hinhThuc === "bank" && nguoiThuHuong === "opertor" && (
              <Card_bank_user
                user_id={op.id}
                user_type="op"
                sotien={form.getFieldValue("soTien")}
              />
            )}

            {hinhThuc === "bank" && nguoiThuHuong === "staff" && (
              <Card_bank_user
                user_id={op.nguoituyen}
                user_type="staff"
                sotien={form.getFieldValue("soTien")}
              />
            )}

            {hinhThuc === "bank" && nguoiThuHuong === "other" && (
              <>
                <Form.Item
                  label="Ngân hàng"
                  name="khacNganhang"
                  rules={[{ required: true, message: "Chọn ngân hàng" }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="label"
                    className="w-[200px]"
                    options={user?.banks?.data?.map((bank) => ({
                      value: bank.bin,
                      label: `${bank.shortName} - ${bank.name}`,
                    }))}
                    filterOption={(input, option) =>
                      option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Số tài khoản"
                  name="khacStk"
                  rules={[{ required: true, message: "Nhập số tài khoản" }]}
                >
                  <Input className="w-[200px]" />
                </Form.Item>

                <Form.Item
                  label="Tên chủ tài khoản"
                  name="khacCtk"
                  rules={[
                    { required: true, message: "Nhập tên chủ tài khoản" },
                  ]}
                >
                  <Input className="w-[200px]" />
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default OP_baoung;
