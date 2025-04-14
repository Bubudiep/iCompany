import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import api from "../../../components/api";
import { useUser } from "../../../components/context/userContext";
import { Button, message, Spin } from "antd";
import { IoCaretDown } from "react-icons/io5";
import { TbMessage2Check, TbMessage2X, TbMessageReport } from "react-icons/tb";
import { LuMessageSquareDot, LuMessageSquareLock } from "react-icons/lu";

const Details_op = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [op, setOp] = useState({});
  const { op_id } = useParams();
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
      {loading ? (
        <div className="whitebox">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex gap-2 flex-1">
          <div className="flex flex-col gap-2 flex-1 p-2">
            <div className="flex justify-between gap-2">
              <Link
                to="/app/operators/all"
                className="whitebox flex items-center gap-2 !p-2 !px-3 text-nowrap 
          text-[#7c7c7c] hover:text-[#000] transition-all duration-300"
              >
                <FaArrowLeft />
                Quay lại
              </Link>
            </div>
            <div className="flex gap-2 flex-1 items-start">
              <div className="whitebox w-[300px] !p-3">
                <div className="flex flex-col justify-center flex-1 items-center">
                  <img
                    src={op.avatar ? `${op.avatar}` : "/no-avatar.png"}
                    alt="Avatar"
                    className="w-32 h-32 rounded-[16px] object-cover border-3 border-[#fff] shadow-md"
                  />
                  <div className="text-center mt-2">
                    <h2 className="text-xl font-bold text-gray-800">
                      {op.ho_ten || "Không tên"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {op.ma_nhanvien || "Chưa có mã NV"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {op.gioi_tinh || "Không có giới tính"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {op.congty_danglam ? <></> : "Chưa đi làm"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="whitebox flex-1 !p-2 w-[600px]">
                <div className="md:col-span-2 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                    <Info label="Số điện thoại" value={op.sdt} />
                    <Info label="Ngày sinh" value={op.ngaysinh} />
                    <Info label="Số CCCD" value={op.so_cccd} />
                    <Info label="Ngày phỏng vấn" value={op.ngay_phongvan} />
                    <Info label="Địa chỉ" value={op.diachi} />
                    <Info label="Quê quán" value={op.quequan} />
                    <Info label="Ngân hàng" value={op.nganhang} />
                    <Info label="Số tài khoản" value={op.so_taikhoan} />
                    <Info
                      label="Ghi chú tài khoản"
                      value={op.ghichu_taikhoan || "Không có"}
                    />
                    <Info label="Ghi chú" value={op.ghichu || "Không có"} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" op-left-tools">
            <div className="item">
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
            <div className="item">
              <div className="icon">
                <TbMessage2X />
              </div>
              Báo nghỉ việc
            </div>
            <div className="item">
              <div className="icon">
                <LuMessageSquareLock />
              </div>
              Báo giữ lương
            </div>
            <div className="item text-[red]">
              <div className="icon">
                <FaTrash />
              </div>
              Xóa
            </div>
            <div className="hd-1 font-[500] py-2 px-3 flex justify-between">
              Lịch sử tác động
              <IoCaretDown />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details_op;
