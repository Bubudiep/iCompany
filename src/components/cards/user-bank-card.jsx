import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Select, message, Tooltip } from "antd";
import { useUser } from "../context/userContext";
import api from "../api";
import { FaEdit } from "react-icons/fa";
const Card_bank_user = ({ user_id, user_type, sotien }) => {
  const { user, setUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fullname, setFullname] = useState("");
  const [banknumber, setBanknumber] = useState("");
  const [bankname, setBankname] = useState("");

  useEffect(() => {
    console.log(user_type);
    if (user_type === "new") {
      setIsModalOpen(true);
    }
    if (user_id && user_type === "op") {
      api.get(`/ops/${user_id}/`, user.token).then((res) => {
        setFullname(res?.chu_taikhoan);
        setBanknumber(res?.so_taikhoan);
        setBankname(res?.nganhang);
      });
    }
    if (user_type === "staff") {
      console.log(user);
      setFullname(user?.info?.profile?.chu_taikhoan);
      setBanknumber(user?.info?.profile?.so_taikhoan);
      setBankname(user?.info?.profile?.nganhang);
    }
  }, [user_type]);

  const handleSave = () => {
    if (user_id && user_type === "op") {
      api
        .post(
          `/ops/${user_id}/bank/`,
          { fullname, banknumber, bankname },
          user.token
        )
        .then((res) => {
          message.success("Lưu thành công!");
          setIsModalOpen(false);
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (user_type === "staff") {
      api
        .patch(
          `/profile/${user?.info?.profile?.id}/`,
          {
            chu_taikhoan: fullname,
            so_taikhoan: banknumber,
            nganhang: bankname,
          },
          user.token
        )
        .then((res) => {
          message.success("Lưu thành công!");
          setIsModalOpen(false);
          setUser({ ...user, info: { ...user?.info, profile: res } });
        })
        .catch((e) => {
          console.log(e);
        });
    }
    // TODO: Gọi API lưu dữ liệu
  };

  return (
    <>
      <div className="whitebox flex gap-3 p-4 rounded-xl shadow-md bg-white relative">
        <div className="avatar h-[80px] rounded-xl flex items-center justify-center text-[#c7c7c7] text-xl">
          {bankname &&
            user?.banks?.data?.find((bank) => bank.bin === bankname)?.logo && (
              <img
                className="w-[210px] max-h-[200px]"
                src={
                  user?.banks?.data?.find((bank) => bank.bin === bankname)?.logo
                }
              />
            )}
        </div>
        <div className="info flex-1 relative leading-5.5">
          <div className="bankname text-[16px] text-semibold text-[#707070]">
            {bankname
              ? user?.banks?.data?.find((bank) => bank.bin === bankname)?.name
              : "-"}
          </div>
          <div className="bankname text-[16px] font-[600] text-[#0a0a0a]">
            {bankname
              ? user?.banks?.data?.find((bank) => bank.bin === bankname)
                  ?.shortName
              : "-"}
          </div>
          <div className="fullname font-semibold text-shadow-2xs text-lg text-[#106fc7]">
            {fullname || "Chưa có thông tin"}
          </div>
          <div
            className="banknumber tracking-wider font-[600] text-[16px] text-[#777777] 
          text-shadow-2xs text-shadow-zinc-700 -text-shadow-zinc-950"
          >
            {banknumber || "0000"}
          </div>
          <Tooltip
            title="Sửa"
            onClick={() => setIsModalOpen(true)}
            className="hover:text-blue-500 text-[#999] hover:underline text-sm absolute 
            top-1 right-2 cursor-pointer transition-all duration-300"
          >
            <FaEdit />
          </Tooltip>
        </div>
      </div>

      <Modal
        title="Chỉnh sửa thông tin ngân hàng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
        className="popupcontent"
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
          <Select
            placeholder="Tên ngân hàng"
            value={bankname}
            onChange={(e) => {
              setBankname(e);
            }}
            options={user?.banks?.data?.map((bank) => ({
              value: bank.bin,
              label: `${bank.shortName} - ${bank.name}`,
            }))}
            showSearch={true}
            allowClear={true}
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>
      </Modal>
    </>
  );
};

export default Card_bank_user;
