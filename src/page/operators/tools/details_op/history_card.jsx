import React from "react";
import Customer_view from "../../../../components/by_id/customer_view";
import { FaEdit } from "react-icons/fa";
import { Modal, Form, Input, DatePicker, message, Popconfirm } from "antd";
import dayjs from "dayjs";
import api from "../../../../components/api";
import { useUser } from "../../../../components/context/userContext";

const OP_History_card = ({ work, onDelete, callback }) => {
  const [open, setOpen] = React.useState(false);
  const { user } = useUser();
  const [form] = Form.useForm();
  const showModal = () => {
    form.setFieldsValue({
      ...work,
      start_date: work?.start_date ? dayjs(work.start_date) : null,
      end_date: work?.end_date ? dayjs(work.end_date) : null,
    });
    setOpen(true);
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Success:", values);
        api
          .patch(
            `ophist/${work.id}/`,
            {
              ...values,
              start_date: values?.start_date
                ? dayjs(values.start_date).format("YYYY-MM-DD")
                : null,
              end_date: values?.end_date
                ? dayjs(values.end_date).format("YYYY-MM-DD")
                : null,
            },
            user.token
          )
          .then((res) => {
            callback(res);
            message.success("Cập nhật thành công!");
            setOpen(false);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <div className="whitebox !p-2 min-w-[260px] op-hist" key={work?.id}>
      <div className="text-[13px] font-[600] flex gap-2">
        <Customer_view id={work?.customer} />
        <div className="edit ml-auto cursor-pointer" onClick={showModal}>
          <FaEdit />
        </div>
        <Modal
          open={open}
          title="Chỉnh sửa thông tin công việc"
          onCancel={() => setOpen(false)}
          className="popupcontent"
          footer={[
            <Popconfirm
              key="delete"
              title="Bạn có chắc chắn muốn xoá mục này?"
              onConfirm={() => {
                onDelete?.(work); // gọi callback từ component cha
                setOpen(false);
                message.success("Đã xoá công việc");
              }}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Xoá
              </button>
            </Popconfirm>,
            <button
              key="cancel"
              onClick={() => setOpen(false)}
              className="ml-auto px-3 py-1 rounded border border-gray-300"
            >
              Huỷ
            </button>,
            <button
              key="submit"
              onClick={handleOk}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Lưu
            </button>,
          ]}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="ma_nhanvien" label="Mã nhân viên">
              <Input />
            </Form.Item>
            <Form.Item name="vitri" label="Công việc">
              <Input />
            </Form.Item>
            <Form.Item name="start_date" label="Ngày bắt đầu">
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>
            <Form.Item name="end_date" label="Ngày kết thúc">
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>
            <Form.Item name="reason" label="Lý do nghỉ">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div className="flex text-[13px] gap-3">
        Thời gian:
        <div className="flex gap-1 ml-auto">
          <a className="text-[#09f]">{work?.start_date}</a>
          đến
          {<a className="text-[#09f]">{work?.end_date ?? "Hiện tại"}</a>}
        </div>
      </div>
      <div className="flex text-[13px] gap-1">
        Mã nhân viên:
        <a className="flex ml-auto">{work?.ma_nhanvien || "N/A"}</a>
      </div>
      <div className="flex text-[13px] gap-1">
        Công việc:
        <a className="flex ml-auto">{work?.vitri || "N/A"}</a>
      </div>
      {work?.end_date && (
        <div className="flex text-[13px] gap-1">
          Lý do nghỉ:
          <a className="flex ml-auto">{work?.reason || "Không có"}</a>
        </div>
      )}
    </div>
  );
};

export default OP_History_card;
