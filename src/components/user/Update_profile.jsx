import React, { useState } from "react";
import {
  Modal,
  Descriptions,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import api from "../api";
import dayjs from "dayjs";

const { Option } = Select;

const Update_profile = ({ user, setUser }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setOpen(true);
    form.setFieldsValue({
      full_name: user?.info?.profile?.full_name,
      phone: user?.info?.profile?.phone,
      date_of_birth: dayjs(user?.info?.profile?.date_of_birth),
      gender: user?.info?.profile?.gender,
      zalo: user?.info?.profile?.zalo,
      facebook: user?.info?.profile?.facebook,
    });
  };
  const handleOk = () => {
    form.validateFields().then((values) => {
      api
        .patch(
          `/info/${user?.info?.profile?.id}/`,
          {
            ...values,
            date_of_birth: values.date_of_birth.format("YYYY-MM-DD"),
          },
          user.token
        )
        .then((res) => {
          message.success("Cập nhập thành công!");
          setUser((old) => ({
            ...old,
            info: {
              ...old.info,
              profile: { ...old?.info?.profile, ...res },
            },
          }));
          setOpen(false);
        })
        .catch((e) => {
          console.log(e);
          message.error(
            e?.response?.data?.detail || "Phát sinh lỗi khi cập nhập!"
          );
        })
        .finally(() => {});
      // setOpen(false);
    });
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Cập nhật thông tin
      </Button>
      <Modal
        title="Cập nhật thông tin cá nhân"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
        className="popupcontent vendor-edit"
      >
        <Form form={form}>
          <Form.Item label="Họ và tên" name="full_name">
            <Input />
          </Form.Item>
          <Form.Item label="Điện thoại" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Sinh nhật" name="date_of_birth">
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Giới tính" name="gender">
            <Select>
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Link Zalo" name="zalo">
            <Input />
          </Form.Item>
          <Form.Item label="Link Facebook" name="facebook">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Update_profile;
