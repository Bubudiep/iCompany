import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import api from "../../../components/api";
import { useUser } from "../../../components/context/userContext";
import { Button, Descriptions, Input, message, Spin, Tooltip } from "antd";
import dayjs from "dayjs";
import Card_bank_user from "../../../components/cards/user-bank-card";
import { FaCircleCheck, FaXmark } from "react-icons/fa6";
import { FaArrowLeft, FaCheck, FaCheckDouble } from "react-icons/fa";
import { PiMoneyDuotone } from "react-icons/pi";
import { RiBankCard2Line } from "react-icons/ri";
import { MdPayments, MdSettingsBackupRestore } from "react-icons/md";
import Staff_view from "../../../components/by_id/staff_view";

const Approve_details = () => {
  const { approve_id, type } = useParams();
  const { user, setUser } = useUser();
  const [comment, setComment] = useState("TT chuyển khoản");
  const [approveComment, setapproveComment] = useState("TT chuyển khoản");
  const [approve, setApprove] = useState({});
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [amountPay, setAmoutPay] = useState(0);
  const { list, callback } = useOutletContext();
  const navigate = useNavigate();
  const handleThuhoi = () => {
    setApproving(true);
    api
      .post(
        `approve/${approve_id}/paytrieve/`,
        { comment: approveComment },
        user?.token
      )
      .then((res) => {
        setApprove(res);
        callback(res);
        message.success("Đã thu hồi thành công!");
      })
      .catch((e) => {
        message.error(e?.response?.data?.detail || "Lỗi không xác định!");
      })
      .finally(() => {
        setApproving(false);
      });
  };
  const handleApprove = () => {
    setApproving(true);
    api
      .post(
        `approve/${approve_id}/apply/`,
        { comment: approveComment },
        user?.token
      )
      .then((res) => {
        setApprove(res);
        callback(res);
        message.success("Phê duyệt thành công!");
      })
      .catch((e) => {
        message.error(e?.response?.data?.detail || "Lỗi không xác định!");
      })
      .finally(() => {
        setApproving(false);
      });
  };
  const handleCancel = () => {
    setApproving(true);
    api
      .post(
        `approve/${approve_id}/cancel/`,
        { comment: approveComment },
        user?.token
      )
      .then((res) => {
        setApprove(res);
        callback(res);
        message.success("Đã từ chối yêu cầu này!");
      })
      .catch((e) => {
        message.error(e?.response?.data?.detail || "Lỗi không xác định!");
      })
      .finally(() => {
        setApproving(false);
      });
  };
  const handleReject = () => {
    setApproving(true);
    api
      .post(
        `approve/${approve_id}/reject/`,
        { comment: approveComment },
        user?.token
      )
      .then((res) => {
        setApprove(res);
        callback(res);
        message.success("Đã từ chối yêu cầu này!");
      })
      .catch((e) => {
        message.error(e?.response?.data?.detail || "Lỗi không xác định!");
      })
      .finally(() => {
        setApproving(false);
      });
  };
  const handlePayout = () => {
    setApproving(true);
    api
      .post(
        `approve/${approve_id}/payout/`,
        { comment: approveComment, amountPay: amountPay },
        user?.token
      )
      .then((res) => {
        setApprove(res);
        callback(res);
        message.success("Đã giải ngân thành công!");
      })
      .catch((e) => {
        message.error(e?.response?.data?.detail || "Lỗi không xác định!");
      })
      .finally(() => {
        setApproving(false);
      });
  };
  const handleApprovePayout = () => {
    setApproving(true);
    api
      .post(
        `approve/${approve_id}/apply_pay/`,
        { comment: approveComment, amountPay: amountPay },
        user?.token
      )
      .then((res) => {
        setApprove(res);
        callback(res);
        message.success("Đã phê duyệt và giải ngân thành công!");
      })
      .catch((e) => {
        message.error(e?.response?.data?.detail || "Lỗi không xác định!");
      })
      .finally(() => {
        setApproving(false);
      });
  };
  const loadApprove = () => {
    setLoading(true);
    api
      .get(`approve/${approve_id}/`, user?.token)
      .then((res) => {
        setApprove(res);
        setAmoutPay(res?.amount);
        setComment(
          localStorage.getItem(
            (res?.requesttype?.typecode || "_approve") + "_comment"
          ) || "TT chuyển khoản"
        );
      })
      .catch((e) => {
        message.error(e?.response?.data?.detail || "Lỗi không xác định!");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleSpacebar = (event) => {
    const tag = document.activeElement.tagName.toLowerCase();
    const isEditable = document.activeElement.isContentEditable;
    if (tag === "input" || tag === "textarea" || isEditable) {
      return;
    }
    if (event.code === "Space" || event.key === " ") {
      event.preventDefault();
      const this_approve = list.findIndex(
        (apv) => apv.request_code === approve_id
      );
      setLoading(true);
      api
        .post(
          `approve/${approve_id}/apply_pay/`,
          { comment: approveComment, amountPay: amountPay },
          user?.token
        )
        .then((res) => {
          setApprove(res);
          message.success(`Thành công!`);
          if (list[this_approve + 1]?.request_code == undefined) {
            message.warning("Đã là cuối trang");
            return;
          }
          navigate(
            `/app/approve/${type}/${list[this_approve + 1]?.request_code}`
          );
        })
        .catch((e) => {
          message.error(e?.response?.data?.detail || "Lỗi không xác định!");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    setApprove({});
    loadApprove();
    window.addEventListener("keydown", handleSpacebar);
    return () => {
      window.removeEventListener("keydown", handleSpacebar);
    };
  }, [approve_id]);
  return (
    <>
      {loading ? (
        <div className="flex flex-1 justify-center items-center">
          <div className="mt-8 flex flex-col">
            <Spin size="large" />
            <div className="text-[#999] mt-4">Đang tải thông tin</div>
          </div>
        </div>
      ) : (
        <div
          key={approve_id}
          className="flex flex-col flex-1 min-w-[120px] !text-[13px]
          whitebox fadeInLeft gap-1 overflow-hidden approve_details"
        >
          <div className="overflow-y-auto flex flex-col min-h-full item">
            <Descriptions
              column={2}
              bordered
              className="mini !text-[13px]"
              title={
                <div className="p-1 flex justify-between">
                  <div className="flex gap-2 items-center">
                    <Button
                      icon={<FaArrowLeft />}
                      onClick={() => navigate(`/app/approve/${type}`)}
                    />
                    Chi tiết {approve?.requesttype?.typecode}
                  </div>
                </div>
              }
            >
              <Descriptions.Item label="Số tiền">
                <div className="text-[18px] font-[600] flex justify-center p-2 text-[#e75500]">
                  {parseInt(approve?.amount || 0).toLocaleString()} VNĐ
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng">
                <div
                  className={`text-[18px] font-[600] flex justify-center p-2 status ${approve?.status}`}
                >
                  {approve?.status !== "cancel" ? (
                    approve?.status === "approved" ? (
                      approve?.payment_status === "done" ? (
                        approve?.requesttype?.need_retrive ? (
                          approve?.retrieve_status === "done" ? (
                            <div className="text-[#0b8000]">Đã thu hồi</div>
                          ) : (
                            <div className="text-[#6d8000]">
                              Hoàn tất và chờ thu hồi
                            </div>
                          )
                        ) : (
                          <div className="text-[#0b8000]">Hoàn tất</div>
                        )
                      ) : (
                        <div className="text-[#0197bd]">Chờ giải ngân</div>
                      )
                    ) : (
                      <div className="text-[#0197bd]">Chờ duyệt</div>
                    )
                  ) : (
                    <div className="text-[#f51d1d]">Đã hủy</div>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Mã đơn">
                <div className="font-[600]"> {approve?.request_code}</div>
              </Descriptions.Item>
              <Descriptions.Item label="Người yêu cầu">
                <Staff_view id={approve?.requester} />
              </Descriptions.Item>
              <Descriptions.Item label="Yêu cầu cho">
                {approve?.operator?.ho_ten}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {dayjs(approve?.created_at).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Người thụ hưởng">
                {approve?.nguoiThuhuong_display}
              </Descriptions.Item>
              <Descriptions.Item label="Hình thức TT">
                <div
                  className={`flex font-[500] items-center gap-2 ${
                    approve?.hinhthucThanhtoan === "money"
                      ? "text-[#18a306]"
                      : "text-[#06a3a3]"
                  }`}
                >
                  {approve?.hinhthucThanhtoan === "money" ? (
                    <PiMoneyDuotone />
                  ) : (
                    <RiBankCard2Line />
                  )}
                  {approve?.hinhthucThanhtoan_display}
                </div>
              </Descriptions.Item>
              {approve?.hinhthucThanhtoan === "bank" && (
                <>
                  {approve.payment_status === "not" ? (
                    <Descriptions.Item label="Nội dung CK" span={2}>
                      <div className="flex flex-col">
                        <div className="text-[#999]">
                          Hướng dẫn: {`{ten} - là tên người lao động`}
                        </div>
                        <Input
                          value={comment}
                          onChange={(e) => {
                            setComment(e.target.value);
                            localStorage.setItem(
                              (approve?.requesttype?.typecode || "approve") +
                                "_comment",
                              e.target.value
                            );
                          }}
                        />
                      </div>
                    </Descriptions.Item>
                  ) : (
                    <></>
                  )}
                  {["staff", "opertor"].includes(approve?.nguoiThuhuong) ? (
                    <Descriptions.Item label="TT chuyển khoản" span={2}>
                      {approve.payment_status === "not" ? (
                        <Card_bank_user
                          show_logo={false}
                          user_type={approve?.nguoiThuhuong}
                          user_id={
                            approve?.nguoiThuhuong === "staff"
                              ? approve?.requester
                              : approve?.operator?.id
                          }
                          shadow={false}
                          showQR={true}
                          comment={comment.replaceAll(
                            "{ten}",
                            `${approve?.operator?.ho_ten ?? "No name"}`
                          )}
                          sotien={approve?.amount}
                        />
                      ) : (
                        <div className="flex flex-col gap-1">
                          <div className="flex ml-1 justify-start">
                            <Tooltip title="Bấm để hiển thị thông tin chuyển khoản!">
                              <div
                                className="font-[500] text-[#00a716] cursor-pointer"
                                onClick={() => setShowBank(!showBank)}
                              >
                                Đã giải ngân vào tài khoản
                              </div>
                            </Tooltip>
                          </div>
                          {showBank && (
                            <Card_bank_user
                              show_logo={false}
                              user_type={approve?.nguoiThuhuong}
                              user_id={
                                approve?.nguoiThuhuong === "staff"
                                  ? approve?.requester
                                  : approve?.operator?.id
                              }
                              shadow={false}
                              showQR={true}
                              comment={comment.replaceAll(
                                "{ten}",
                                `${approve?.operator?.ho_ten ?? "No name"}`
                              )}
                              sotien={approve?.amount}
                            />
                          )}
                        </div>
                      )}
                    </Descriptions.Item>
                  ) : (
                    <Descriptions.Item label="TT chuyển khoản" span={2}>
                      {approve.payment_status === "not" ? (
                        <Card_bank_user
                          show_logo={false}
                          user_type={approve?.nguoiThuhuong}
                          user_id={approve}
                          shadow={false}
                          showQR={true}
                          comment={comment.replaceAll(
                            "{ten}",
                            `${approve?.operator?.ho_ten ?? "No name"}`
                          )}
                          sotien={approve?.amount}
                        />
                      ) : (
                        <div className="flex flex-col gap-1">
                          <div className="flex ml-1 justify-start">
                            <Tooltip title="Bấm để hiển thị thông tin chuyển khoản!">
                              <div
                                className="cursor-pointer font-[500] text-[#00a716]"
                                onClick={() => setShowBank(!showBank)}
                              >
                                Đã giải ngân vào tài khoản
                              </div>
                            </Tooltip>
                          </div>
                          {showBank && (
                            <Card_bank_user
                              show_logo={false}
                              user_type={approve?.nguoiThuhuong}
                              user_id={approve}
                              shadow={false}
                              showQR={true}
                              comment={comment.replaceAll(
                                "{ten}",
                                `${approve?.operator?.ho_ten ?? "No name"}`
                              )}
                              sotien={approve?.amount}
                            />
                          )}
                        </div>
                      )}
                    </Descriptions.Item>
                  )}
                </>
              )}
            </Descriptions>
            <div className="flex flex-col justify-between mt-auto gap-1">
              <div className="flex justify-end items-center !text-[30px] !text-[#5e5e5e] font-[600]">
                Số tiền giải ngân:
                <Input
                  placeholder="Số tiền giải ngân"
                  value={parseInt(amountPay).toLocaleString()}
                  onChange={(e) =>
                    setAmoutPay(parseInt(e.target.value.replaceAll(".", "")))
                  }
                  className="text-right !w-[220px] !text-[30px] !border-none !text-[#ff5b0e] font-[600]"
                />
                VNĐ
              </div>
              <div className="flex text-[#999] text-[13px] flex-row-reverse">
                (*) Bấm phím cách: Phê duyệt và giải ngân và qua phê duyệt tiếp
              </div>
              <div className="flex gap-1">
                {approve.status === "pending" && (
                  <Button onClick={handleCancel} danger icon={<FaXmark />}>
                    Hủy
                  </Button>
                )}
                {approve.status === "pending" && (
                  <Button
                    onClick={handleReject}
                    danger
                    icon={<FaXmark />}
                    className="mr-auto"
                  >
                    Từ chối
                  </Button>
                )}
                <div className="ml-auto flex gap-1">
                  {approve?.status === "pending" && (
                    <Button
                      onClick={handleApprove}
                      icon={<FaCheck />}
                      type="primary"
                    >
                      Phê duyệt
                    </Button>
                  )}
                  {approve?.status === "pending" &&
                    approve?.payment_status === "not" && (
                      <Button
                        onClick={handleApprovePayout}
                        icon={<FaCheck />}
                        type="primary"
                      >
                        Phê duyệt và giải ngân
                      </Button>
                    )}
                  {approve?.status === "approved" &&
                    approve?.payment_status === "not" && (
                      <Button
                        onClick={handlePayout}
                        icon={<MdPayments />}
                        type="primary"
                      >
                        Giải ngân
                      </Button>
                    )}
                  {approve?.status === "approved" &&
                    approve?.payment_status === "done" &&
                    approve?.requesttype?.need_retrive &&
                    approve?.retrieve_status === "not" && (
                      <Button
                        onClick={handleThuhoi}
                        icon={<MdSettingsBackupRestore />}
                        type="primary"
                      >
                        Thu hồi
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Approve_details;
