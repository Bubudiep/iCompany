import { Modal } from "antd";
import React from "react";

const ShowAllMembersModal = () => {
  return (
    <>
      <Modal
        title="Danh sách thành viên"
        className="popupcontent"
        onCancel={() => {}}
        footer={null}
        width={600}
      >
        <div>Modal Content</div>
      </Modal>
    </>
  );
};

export default ShowAllMembersModal;
