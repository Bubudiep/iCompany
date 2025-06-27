import React from "react";
import Staff_view from "../../../components/by_id/staff_view";
import { Link, useParams } from "react-router-dom";
import TimeSinceText from "../../../components/ui/timesinceText";
import { FaCaretLeft, FaCheckCircle } from "react-icons/fa";
import { MdSettingsBackupRestore } from "react-icons/md";
import app from "../../../components/app";

const Request_card = ({ approve }) => {
  const { approve_id } = useParams();
  return (
    <Link
      to={`/app/approve/all/${approve?.request_code}`}
      className={`flex item gap-2 items-center relative !text-[12px] ${
        approve.request_code === approve_id ? "active" : ""
      }`}
    >
      <div className="w-[180px] flex flex-col gap-1">
        <div
          className="flex text-[#3993cf] hover:text-[#0076c5] transition-all 
                          duration-300 font-[500] hover:underline"
        >
          {approve?.request_code}
        </div>
        <div className="flex gap-1 items-center">
          <div
            className={`type t${app.removeSpecial(
              approve?.requesttype?.replaceAll(" ", "")?.toLowerCase()
            )} text-nowrap`}
          >
            {approve?.requesttype}
          </div>
          <div className="text-[11px] text-[#474747]  text-nowrap">
            {approve?.created_at && (
              <TimeSinceText createdAt={approve?.created_at} />
            )}
          </div>
        </div>
      </div>
      <div
        className={`flex ${
          approve_id ? "w-[20px]" : "w-[100px]"
        } flex-col gap-1`}
      >
        <div className={`status flex ${approve?.status} flex-nowrap`}>
          {approve?.status === "approved" ? (
            <div className="text-[#00a30e] flex items-center gap-1">
              <FaCheckCircle />
              {!approve_id && "Đã duyệt"}
            </div>
          ) : approve?.status === "pending" ? (
            <div className="text-[#dd6300]">{!approve_id && "Chờ duyệt"}</div>
          ) : approve?.status === "cancel" ? (
            <div className="text-[#464646]">{!approve_id && "Đã hủy"}</div>
          ) : approve?.status === "reject" ? (
            <div className="text-[#d62b00]">{!approve_id && "Đã reject"}</div>
          ) : (
            <div className="text-[#00a30e]">
              {!approve_id && approve?.status}
            </div>
          )}
        </div>
        {approve?.payment_status === "not" ? (
          <div className={`status flex ${approve?.payment_status}`}>
            {!approve_id && approve?.payment_status_display}
          </div>
        ) : approve?.requesttype?.need_retrive ? (
          <div className={`status flex`}>
            {approve?.retrieve_status === "not" ? (
              <div className="text-[#ec6a00] flex items-center gap-1 font-[500]">
                <MdSettingsBackupRestore size={15} />
                {!approve_id && "Chờ thu"}
              </div>
            ) : (
              <div className="text-[#00a30e] flex items-center gap-1">
                <FaCheckCircle />
                {!approve_id && "Đã thu"}
              </div>
            )}
          </div>
        ) : (
          <div className="text-[#00a30e] flex items-center gap-1">
            <FaCheckCircle />
            {!approve_id && "Hoàn thành"}
          </div>
        )}
      </div>
      <>
        <div className="flex w-[120px] flex-col gap-1">
          <div className="flex">
            <Staff_view id={approve?.requester} />
          </div>
          <div className="flex">{approve?.operator || "-"}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex">
            {parseInt(approve?.amount)?.toLocaleString() || 0}{" "}
            <div className="font-[500] text-[#999] ml-1">vnđ</div>
          </div>
          <div className="flex text-nowrap">
            {approve?.hinhthucThanhtoan_display || "-"}
          </div>
        </div>
      </>
      {approve_id == approve.request_code && (
        <div className="flex flex-col justify-between gap-1 items-end ml-auto w-[30px]">
          <div className="flex ml-auto text-[#3993cf] text-[20px]">
            <FaCaretLeft />
          </div>
        </div>
      )}
    </Link>
  );
};

export default Request_card;
