import React, { useState } from "react";
import { Modal, Input, message } from "antd";
import api from "../../../components/api";

const Update_amount = ({ approve, user, setApprove, children }) => {
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState(parseInt(approve?.amount || 0));
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      const res = await api.post(
        `approve/${approve?.request_code}/update_amount/`,
        { amount },
        user?.token
      );
      setApprove(res);
      message.success("Cập nhập số tiền thành công!");
      setVisible(false);
    } catch (e) {
      message.error(e?.response?.data?.detail || "Lỗi không xác định!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Cái gì bọc trong Update_amount thì sẽ thành nút mở modal */}
      <div onClick={() => setVisible(true)}>{children}</div>

      <Modal
        title="Cập nhập số tiền"
        open={visible}
        onOk={handleOk}
        confirmLoading={loading}
        onCancel={() => setVisible(false)}
        maskClosable
        okText="Cập nhập"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập số tiền mới"
          value={amount.toLocaleString()}
          onChange={(e) =>
            setAmount(Number(e.target.value?.replace(/[.,]/g, "")) || 0)
          }
        />
      </Modal>
    </>
  );
};

export default Update_amount;
