import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaHistory, FaTrash } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../components/api";
import { useUser } from "../../../components/context/userContext";
import { Button, Descriptions, message, Modal, Spin, Tooltip } from "antd";
import { IoCaretDown } from "react-icons/io5";
import { TbMessage2Check, TbMessage2X, TbMessageReport } from "react-icons/tb";
import { LuMessageSquareDot, LuMessageSquareLock } from "react-icons/lu";
import app from "../../../components/app";
import Baoung_OP from "./op_tools/baoung";

const Details_op = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [op, setOp] = useState({});
  const { op_id } = useParams();
  const navigate = useNavigate();
  const [modalData, setModalData] = useState();
  const [modalBaoung, setmodalBaoung] = useState(false);
  const Info = ({ label, value }) => (
    <div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-gray-900 font-medium">{value || "—"}</p>
    </div>
  );
  useEffect(() => {
    if (op_id) {
      setLoading(true);
      api
        .get(`/ops/${op_id}/`, user.token)
        .then((res) => {
          console.log(res);
          setOp(res);
        })
        .catch((e) => {
          console.log(e);
          message.error(
            e?.response?.data?.details ||
              "Phát sinh lỗi khi tải dữ liệu người lao động!"
          );
        })
        .finally(() => setLoading(false));
    }
  }, []);
  return (
    <div className="flex flex-col overflow-hidden fadeInLeft flex-1 gap-2">
      <Baoung_OP
        user={user}
        op={op}
        open={modalBaoung}
        onClose={() => setmodalBaoung(false)}
        update={(data) => {
          setOp(data);
        }}
      />
      {loading ? (
        <div className="whitebox">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-col gap-2 flex-1 p-2 pr-1 pb-0 overflow-hidden">
            <div className="flex gap-2 flex-1 items-start overflow-hidden">
              <div className="flex flex-col w-[240px] min-w-[240px] gap-2">
                <div onClick={() => navigate(-1)} className="whitebox back-btn">
                  <FaArrowLeft />
                  Quay lại
                </div>
                <div className="whitebox !p-3">
                  <div className="flex flex-col justify-center flex-1 items-center">
                    <img
                      src={op.avatar ? `${op.avatar}` : "/no-avatar.png"}
                      alt="Avatar"
                      className="w-32 h-32 rounded-[16px] object-cover border-3 border-[#fff] shadow-md"
                    />
                    <div className="text-center mt-2">
                      <p className="text-sm text-gray-500">
                        {op.ma_nhanvien || "Chưa có mã NV"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {op.congty_danglam ? <></> : "Chưa đi làm"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="whitebox op-right-tools">
                  <div className="item" onClick={() => setmodalBaoung(true)}>
                    <div className="icon">
                      <LuMessageSquareDot />
                    </div>
                    Báo ứng lương
                  </div>
                  <div className="item">
                    <div className="icon">
                      <TbMessage2Check />
                    </div>
                    Báo đi làm
                  </div>
                  <Tooltip
                    title={op.congty_danglam ? false : "Chưa đi làm"}
                    className="item"
                  >
                    <div className="icon">
                      <TbMessage2X />
                    </div>
                    Báo nghỉ việc
                  </Tooltip>
                  <div className="item">
                    <div className="icon">
                      <LuMessageSquareLock />
                    </div>
                    Báo giữ lương
                  </div>
                  <div className="item text-[#ff5151] hover:!text-[#d60000] hover:!bg-[#ffe8e8]">
                    <div className="icon">
                      <FaTrash />
                    </div>
                    Xóa
                  </div>
                </div>
              </div>
              <div className="h-full w-full overflow-y-auto pr-1 pb-2">
                <div className="flex flex-col gap-2 w-full">
                  <div className="whitebox flex-1 !p-0">
                    <div className="header">Thông tin làm việc</div>
                    <div className="md:col-span-2 space-y-3 p-3">
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                        <Info label="Ngày phỏng vấn" value={op.ngay_phongvan} />
                        <Info label="Thâm niên" value={0} />
                        <Info
                          label="Trạng thái"
                          value={op.congty_danglam || "Chưa đi làm"}
                        />
                        <Info label="Phân loại" value={0} />
                        <Info label="Đang ứng" value="0đ" />
                        <Info label="Đang giữ lương" value={"0đ"} />
                        <Info label="Ghi chú" value={op.ghichu || "Không có"} />
                      </div>
                    </div>
                  </div>
                  <div className="whitebox flex-1 !p-0">
                    <div className="header">Thống kê</div>
                    <div className="md:col-span-2 space-y-3 p-3">
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                        <Info label="Tổng ứng" value="0đ" />
                        <Info label="Tổng thanh toán" value="0đ" />
                        <Info
                          label="Tổng giờ làm việc (hành chính)"
                          value="0h"
                        />
                        <Info label="Tổng giờ tăng ca" value="0h" />
                        <Info label="Tổng trừ" value="0đ" />
                        <Info label="Tổng ngày công" value="0 ngày" />
                      </div>
                    </div>
                  </div>
                  <div className="whitebox flex-1 !p-0">
                    <div className="header">Thông tin cá nhân</div>
                    <div className="md:col-span-2 space-y-3 p-3">
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                        <Info label="Họ và tên" value={op.ho_ten} />
                        <Info label="Ngày sinh" value={op.ngaysinh} />
                        <Info label="Giới tính" value={op.gioi_tinh} />
                        <Info label="Số điện thoại" value={op.sdt} />
                        <Info label="Số CCCD" value={op.so_cccd} />
                        <Info label="Địa chỉ" value={op.diachi} />
                      </div>
                    </div>
                  </div>
                  <div className="whitebox flex-1 !p-0">
                    <div className="header">Thông tin tài khoản</div>
                    <div className="md:col-span-2 space-y-3 p-3">
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                        <Info label="Người tuyển" value={0} />
                        <Info label="Người quản lý" value={0} />
                        <Info label="Ngày cập nhập" value={0} />
                        <Info label="Ngày khởi tạo" value={0} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="op-left-tools !w-0 !min-w-0 2xl:!min-w-[300px] 2xl:!w-[300px]">
            <div className="hd-1 font-[500] py-3 px-3 flex justify-between">
              Lịch sử tác động
              <FaHistory />
            </div>
            <div className="his-items p-2 gap-2 flex flex-col">
              <Modal
                title="Chi tiết lịch sử tác động"
                open={modalData}
                onCancel={() => setModalData(false)}
                footer={null}
              >
                <div className="w-full">
                  <Descriptions column={1} bordered>
                    {modalData?.new_data &&
                      Object.keys(modalData?.new_data).map((newDT) => (
                        <Descriptions.Item
                          label={newDT === "ho_ten" ? "Họ tên" : newDT}
                          key={newDT}
                          className="!p-2 text-nowrap"
                        >
                          <div className="flex gap-2 items-center">
                            <div className="text-nowrap">
                              {modalData?.old_data?.[newDT]}
                            </div>
                            <FaArrowRight />
                            <div className="text-nowrap">
                              {modalData?.new_data?.[newDT]}
                            </div>
                          </div>
                        </Descriptions.Item>
                      ))}
                  </Descriptions>
                </div>
              </Modal>
              {op?.history?.map((his) => (
                <div
                  key={his.id}
                  color="white"
                  className="item bg-[#eee] rounded-md max-w-none"
                  onClick={() => setModalData(his)}
                >
                  <div
                    className="title flex text-[11px] justify-between 
                    p-2 pb-1 text-[#999]"
                  >
                    <div className="name">
                      {his?.changed_by?.full_name || "Hệ thống"}
                    </div>
                    <div className="time">
                      {app.timeSince(his?.changed_at) || "-"}
                    </div>
                  </div>
                  <div className="content text-[13px] px-2 pb-2">
                    - {his?.notes || "..."}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details_op;
