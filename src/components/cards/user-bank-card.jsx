import React, { useEffect, useState } from "react";
import { Modal, Input, Button } from "antd";
import { useUser } from "../context/userContext";

const Card_bank_user = ({ user_id, user_type, sotien }) => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fullname, setFullname] = useState("");
  const [banknumber, setBanknumber] = useState("");
  const [bankname, setBankname] = useState("");

  useEffect(() => {
    if (user_type === "new") {
      setIsModalOpen(true);
    }
  }, [user_type]);

  const handleSave = () => {
    console.log("Lưu thông tin:", { fullname, banknumber, bankname });
    setIsModalOpen(false);
    // TODO: Gọi API lưu dữ liệu
  };

  return (
    <>
      <div className="whitebox flex gap-3 p-4 rounded-xl shadow-md bg-white relative">
        <div className="avatar w-[80px] h-[80px] bg-[#eee] rounded-xl flex items-center justify-center text-[#c7c7c7] text-xl">
          N/A
        </div>
        <div className="info flex-1">
          <div className="fullname font-semibold text-lg">
            {fullname || "Chưa có thông tin"} ({user_type})
          </div>
          <div className="banknumber text-sm text-gray-600">
            {banknumber || "0000"}
          </div>
          <div className="bankname text-sm text-gray-600">
            {bankname || "-"}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-500 hover:underline text-sm absolute top-1 right-2 cursor-pointer"
          >
            Sửa
          </button>
        </div>
      </div>

      <Modal
        title="Chỉnh sửa thông tin ngân hàng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
      >
        <div className="space-y-3 flex flex-col gap-2">
          <Input
            placeholder="Họ tên chủ tài khoản"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <Input
            placeholder="Số tài khoản"
            value={banknumber}
            onChange={(e) => setBanknumber(e.target.value)}
          />
          <Input
            placeholder="Tên ngân hàng"
            value={bankname}
            onChange={(e) => setBankname(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
};

export default Card_bank_user;
