import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Select, message, Tooltip, Spin } from "antd";
import { useUser } from "../context/userContext";
import api from "../api";
import { FaEdit } from "react-icons/fa";
import QrCodeComponent from "../qc_code";
import app from "../app";
import qrcode from "../qrcode";
const Card_bank_user = ({
  user_id,
  comment = "TT",
  user_type,
  sotien,
  show_logo = true,
  shadow = true,
  showQR = false,
}) => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fullname, setFullname] = useState("");
  const [banknumber, setBanknumber] = useState("");
  const [bankname, setBankname] = useState("");
  const [bankCode, setBankCode] = useState("");

  useEffect(() => {
    console.log(user_type);
    if (user_type === "new") {
      setIsModalOpen(true);
    }
    if (user_id && (user_type === "op" || user_type === "opertor")) {
      setLoading(true);
      api
        .get(`/ops/${user_id}/`, user.token)
        .then((res) => {
          setFullname(res?.chu_taikhoan);
          setBanknumber(res?.so_taikhoan);
          setBankname(res?.nganhang);
          const banktoQR = qrcode.BankQR(
            res?.so_taikhoan,
            res?.nganhang,
            sotien,
            comment
          );
          setBankCode(banktoQR);
          setLoading(false);
        })
        .finally(() => setLoading(false));
    }
    if (user_type === "staff") {
      setFullname(user?.info?.profile?.chu_taikhoan);
      setBanknumber(user?.info?.profile?.so_taikhoan);
      setBankname(user?.info?.profile?.nganhang);
      const banktoQR = qrcode.BankQR(
        user?.info?.profile?.so_taikhoan,
        user?.info?.profile?.nganhang,
        sotien,
        comment
      );
      setBankCode(banktoQR);
      setLoading(false);
    }
  }, [user_type, isModalOpen]);

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
  };

  return (
    <>
      {loading ? (
        <div className="h-[120px] pt-10 pb-2 gap-2 rounded-xl flex items-center flex-col flex-1 justify-center text-[#c7c7c7]">
          <Spin size="large" />
          <div className="text text-[#54a7eb]">Đang lấy thông tin...</div>
        </div>
      ) : (
        <div
          className={`whitebox min-w-[400px] fadeInTop flex gap-3 p-4 rounded-xl bg-white relative ${
            shadow ? "shadow-md" : "!shadow-none"
          }`}
        >
          {show_logo && (
            <div className="avatar h-[80px] rounded-xl flex items-center justify-center text-[#c7c7c7] text-xl">
              {bankname &&
                user?.banks?.data?.find((bank) => bank.bin === bankname)
                  ?.logo && (
                  <img
                    className="w-[210px] max-h-[200px]"
                    src={
                      user?.banks?.data?.find((bank) => bank.bin === bankname)
                        ?.logo
                    }
                  />
                )}
            </div>
          )}
          <div className="info flex-1 relative">
            {sotien ? (
              <div className="flex w-full">
                <div className="flex flex-1 gap-2 border-1 border-[#cfcfcf] shadow p-4 rounded-[8px] leading-4.5">
                  {showQR && (
                    <QrCodeComponent
                      width={180}
                      height={180}
                      color="#000"
                      data={bankCode}
                    />
                  )}
                  <div className="flex flex-col justify-baseline text-[12px] ml-4 w-full">
                    <div className="flex items-center justify-center">
                      {bankname &&
                        user?.banks?.data?.find((bank) => bank.bin === bankname)
                          ?.logo && (
                          <img
                            className="max-h-[60px]"
                            src={
                              user?.banks?.data?.find(
                                (bank) => bank.bin === bankname
                              )?.logo
                            }
                          />
                        )}
                    </div>
                    <div className="flex mt-2 flex-nowrap">
                      <div className="text-[#999]">Số tiền:</div>
                      <div className="font-[700] text-[15px] flex ml-auto">
                        {parseInt(sotien).toLocaleString()} vnđ
                      </div>
                    </div>
                    <div className="flex gap-3 text-shadow-2xs flex-nowrap">
                      <div className="text-[#999] text-nowrap">
                        Chủ tài khoản:
                      </div>
                      <div className="flex ml-auto font-[500] text-nowrap">
                        {fullname?.toUpperCase() || "Chưa có thông tin"}
                      </div>
                    </div>
                    <div
                      className="flex gap-3 tracking-wider
                  text-shadow-zinc-700 -text-shadow-zinc-950"
                    >
                      <div className="text-[#999] text-nowrap">
                        Số tài khoản:
                      </div>
                      <div className="flex ml-auto font-[500] text-nowrap">
                        {banknumber || "0000"}
                      </div>
                    </div>
                    <div
                      className="flex gap-3 tracking-wider
                  text-shadow-zinc-700 -text-shadow-zinc-950"
                    >
                      <div className="text-[#999] text-nowrap">Ngân hàng:</div>
                      <div className="flex ml-auto font-[500] text-nowrap">
                        {bankname
                          ? user?.banks?.data
                              ?.find((bank) => bank.bin === bankname)
                              ?.shortName?.toUpperCase()
                          : "-"}
                      </div>
                    </div>
                    <div
                      className="flex gap-3 tracking-wider
                  text-shadow-zinc-700 -text-shadow-zinc-950"
                    >
                      <div className="text-[#999] text-nowrap">
                        Nội dung CK:
                      </div>
                      <div className="flex ml-auto max-w-[160px]">
                        {app.removeSpecial(comment)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bankname font-[600] text-[16px] text-semibold text-[#c95101]">
                  {parseInt(sotien).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </div>
                <div className="font-semibold text-shadow-2xs text-[#106fc7]">
                  {fullname || "Chưa có thông tin"}
                </div>
                <div
                  className="banknumber tracking-wider font-[600] text-[#777777] 
              text-shadow-zinc-700 -text-shadow-zinc-950"
                >
                  {banknumber || "0000"}
                </div>
                <div className="bankname text-semibold text-[#707070]">
                  {bankname
                    ? user?.banks?.data?.find((bank) => bank.bin === bankname)
                        ?.shortName
                    : "-"}{" "}
                  -{" "}
                  {bankname
                    ? user?.banks?.data?.find((bank) => bank.bin === bankname)
                        ?.name
                    : "-"}
                </div>
              </>
            )}
            <Tooltip
              title="Sửa"
              onClick={() => setIsModalOpen(true)}
              className="hover:text-blue-500 text-[#999] hover:underline text-sm absolute 
              top-2 right-2 cursor-pointer transition-all duration-300"
            >
              <div>
                <FaEdit />
              </div>
            </Tooltip>
          </div>
        </div>
      )}

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
