import { Modal } from "antd";
import React, { useEffect } from "react";

const Baoung_OP = ({ op, open, update }) => {
  useEffect(() => {
    console.log(op);
  }, []);
  return (
    <>
      <Modal title="Báo ứng cho người lao động"></Modal>
    </>
  );
};

export default Baoung_OP;
