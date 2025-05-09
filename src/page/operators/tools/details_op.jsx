import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaHistory,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../components/api";
import { useUser } from "../../../components/context/userContext";
import { Button, Descriptions, message, Modal, Spin, Tooltip } from "antd";
import { IoCaretDown } from "react-icons/io5";
import { TbMessage2Check, TbMessage2X, TbMessageReport } from "react-icons/tb";
import { LuMessageSquareDot, LuMessageSquareLock } from "react-icons/lu";
import Staff_view from "../../../components/by_id/staff_view";
import OP_dilam from "../../../components/op/bao_dilam";
import Customer_view from "../../../components/by_id/customer_view";
import OP_nghiviec from "../../../components/op/bao_nghiviec";
import TimeSinceText from "../../../components/ui/timesinceText";
import OP_baoung from "../../../components/op/bao_ung";

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
      <p className="text-[#000102] font-[400]">{value || "—"}</p>
    </div>
  );
  useEffect(() => {
    if (op_id) {
      setLoading(true);
      api
        .get(`/ops/${op_id}/`, user.token)
        .then((res) => {
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
    <div className="relative flex flex-col overflow-hidden flex-1 gap-2">
      {loading && (
        <div className="p-1 absolute w-full h-full">
          <div className="flex items-center-safe justify-center !p-5">
            <Spin size="large" />
          </div>
        </div>
      )}
      {!loading && (
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-col gap-2 flex-1 p-2 pr-1 pb-0 overflow-hidden fadeInTop">
            <div className="flex gap-2 flex-1 items-start overflow-hidden">
              <div className="flex flex-col w-[240px] min-w-[240px] gap-2">
                <div onClick={() => navigate(-1)} className="whitebox back-btn">
                  <FaArrowLeft />
                  Quay lại
                </div>
                <div className="whitebox !p-3">
                  <div className="flex flex-col justify-center flex-1 items-center">
                    {op.avatar ? (
                      <img
                        src={op.avatar ? `${op.avatar}` : "/no-avatar.png"}
                        alt="Avatar"
                        className="w-32 h-32 rounded-[16px] object-cover border-3 border-[#fff] shadow-md"
                      />
                    ) : (
                      <div
                        className="w-32 h-32 rounded-[16px] object-cover border-3 border-[#fff] shadow-md
                        flex items-center justify-center bg-[#67a6ff] text-white text-[50px]"
                      >
                        <FaUser />
                      </div>
                    )}
                    <div className="text-center mt-2">
                      <p className="text-sm text-[#0477b9] text-[17px] font-[600] mb-1">
                        {op.ho_ten || "Chưa có tên"}
                      </p>
                      <p className="text-sm text-[#00407c] text-[13px] font-[600]">
                        ID: {op.ma_nhanvien || "Chưa có mã NV"}
                      </p>
                    </div>
                  </div>
                </div>
                {op?.congty_danglam ? (
                  <div className="flex justify-center p-2 bg-[#008cff] rounded-sm text-[#fff]">
                    Đang đi làm
                  </div>
                ) : (
                  <div className="flex justify-center p-2 bg-[#ff7b00] rounded-sm text-[#fff]">
                    Chưa đi làm
                  </div>
                )}
                <div className="whitebox op-right-tools">
                  <OP_baoung
                    op={op}
                    user={user}
                    className="item"
                    callback={(data) => setOp((old) => ({ ...old, ...data }))}
                  >
                    <div className="icon">
                      <LuMessageSquareDot />
                    </div>
                    Báo ứng lương
                  </OP_baoung>
                  <OP_dilam
                    op={op}
                    user={user}
                    className="item"
                    callback={(data) => setOp((old) => ({ ...old, ...data }))}
                  >
                    <div className="icon">
                      <TbMessage2Check />
                    </div>
                    Báo đi làm
                  </OP_dilam>
                  <OP_nghiviec
                    op={op}
                    user={user}
                    className="item"
                    callback={(data) => setOp((old) => ({ ...old, ...data }))}
                  >
                    <div className="icon">
                      <TbMessage2X />
                    </div>
                    Báo nghỉ việc
                  </OP_nghiviec>
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
                          value={
                            op?.congty_danglam ? (
                              <>
                                Làm việc tại{" "}
                                <Customer_view id={op?.congty_danglam} />
                              </>
                            ) : (
                              "Chưa đi làm"
                            )
                          }
                        />
                        <Info label="Phân loại" value={0} />
                        <Info
                          label="Đang ứng"
                          value={
                            op?.baoung?.reduce((sum, item) => {
                              return item.payment_status === "done" &&
                                item.retrieve_status === "not"
                                ? sum + parseInt(item.amount)
                                : sum;
                            }, 0) + " vnđ"
                          }
                        />
                        <Info label="Đang giữ lương" value={"0 vnđ"} />
                        <Info
                          label="Chờ duyệt ứng"
                          value={
                            op?.baoung
                              ?.reduce((sum, item) => {
                                return item.payment_status === "not"
                                  ? sum + parseInt(item.amount)
                                  : sum;
                              }, 0)
                              .toLocaleString() + " vnđ"
                          }
                        />
                        <Info label="Ghi chú" value={op.ghichu || "Không có"} />
                      </div>
                    </div>
                  </div>
                  <div className="whitebox flex-1 !p-0">
                    <div className="header">Thống kê</div>
                    <div className="md:col-span-2 space-y-3 p-3">
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                        <Info
                          label="Tổng ứng"
                          value={
                            op?.baoung
                              ?.reduce((sum, item) => {
                                return item.payment_status === "done"
                                  ? sum + parseInt(item.amount)
                                  : sum;
                              }, 0)
                              .toLocaleString() + " vnđ"
                          }
                        />
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
                        <Info
                          label="Người tuyển"
                          value={<Staff_view id={op.nguoituyen} />}
                        />
                        <Info
                          label="Người quản lý"
                          value={<Staff_view id={op.nguoibaocao} />}
                        />
                        <Info label="Ngày cập nhập" value={0} />
                        <Info label="Ngày khởi tạo" value={0} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="op-left-tools overflow-hidden !w-0 !min-w-0 2xl:!min-w-[300px] 2xl:!w-[300px] fadeInLeft">
            <div className="hd-1 font-[500] items-center px-3 flex justify-between h-[50px]">
              <div>Lịch sử tác động</div>
              <FaHistory />
            </div>
            <div className="his-items pl-2 pb-1 pr-1  gap-2 flex flex-1 flex-col h-[calc(100%-54px)] overflow-auto mr-1">
              {/* <Modal
                className="popupcontent text-center !w-[900px]"
                title="Chi tiết lịch sử tác động"
                open={modalData}
                onCancel={() => setModalData(false)}
                footer={null}
              >
                <div className="w-full overflow-hidden max-h-[600px] flex flex-col">
                  <div className="overflow-auto">
                    <Descriptions column={2} bordered>
                      {modalData?.new_data &&
                        Object.keys(modalData?.new_data).map((newDT) => {
                          return (
                            ![
                              "id",
                              "created_at",
                              "updated_at",
                              "cccd_back",
                              "avatar",
                              "cccd_front",
                            ].includes(newDT) &&
                            modalData?.old_data?.[newDT] !=
                              modalData?.new_data?.[newDT] && (
                              <Descriptions.Item
                                label={
                                  newDT === "ho_ten"
                                    ? "Họ tên"
                                    : newDT === "sdt"
                                    ? "Điện thoại"
                                    : newDT === "ghichu"
                                    ? "Ghi chú"
                                    : newDT === "vendor"
                                    ? "Vendor"
                                    : newDT === "quequan"
                                    ? "Quê quán"
                                    : newDT === "ten_goc"
                                    ? "Tên gốc"
                                    : newDT === "ngaysinh"
                                    ? "Ngày sinh"
                                    : newDT === "gioi_tinh"
                                    ? "Giới tính"
                                    : newDT === "so_cccd"
                                    ? "Số CCCD"
                                    : newDT === "diachi"
                                    ? "Địa chỉ"
                                    : newDT === "ngay_phongvan"
                                    ? "Ngày phỏng vấn"
                                    : newDT === "congty_danglam"
                                    ? "Công ty đang làm"
                                    : newDT === "nguoituyen"
                                    ? "Người tuyển"
                                    : newDT === "nguoibaocao"
                                    ? "Người báo cáo"
                                    : newDT === "chu_taikhoan"
                                    ? "Chủ tài khoản"
                                    : newDT === "company"
                                    ? "Công ty"
                                    : newDT === "nganhang"
                                    ? "Ngân hàng"
                                    : newDT === "nhachinh"
                                    ? "Nhà chính"
                                    : newDT === "trangthai"
                                    ? "Trạng thái"
                                    : newDT === "ma_nhanvien"
                                    ? "Mã nhân viên"
                                    : newDT === "so_taikhoan"
                                    ? "Số tài khoản"
                                    : newDT === "ghichu_taikhoan"
                                    ? "Ghi chú tài khoản"
                                    : newDT
                                }
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
                            )
                          );
                        })}
                    </Descriptions>
                  </div>
                </div>
              </Modal> */}
              {op?.history?.map((his) => (
                <div
                  key={his.id}
                  color="white"
                  className="item bg-[#d0e3f1] rounded-md max-w-none cursor-pointer"
                  // onClick={() => setModalData(his)}
                >
                  <div
                    className="title flex text-[11px] justify-between 
                    p-2 pb-1 text-[#424d6d]"
                  >
                    <div className="name text-[#0045ac] font-[600]">
                      {his?.changed_by?.id ? (
                        <Staff_view id={his?.changed_by?.id} />
                      ) : (
                        "Hệ thống"
                      )}
                    </div>
                    <div className="time">
                      {his?.changed_at ? (
                        <TimeSinceText createdAt={his?.changed_at} />
                      ) : (
                        <>-</>
                      )}
                    </div>
                  </div>
                  <div className="content text-[13px] px-2 pb-2 text-[#03132b]">
                    {his?.notes || "..."}
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
