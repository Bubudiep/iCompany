import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../../../components/api";
import { useUser } from "../../../components/context/userContext";
import { Button, message, Select, Spin } from "antd";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import Staff_view from "../../../components/by_id/staff_view";
import { FaAnglesRight } from "react-icons/fa6";
import { FaCaretLeft, FaCheckCircle } from "react-icons/fa";
import { MdSettingsBackupRestore } from "react-icons/md";
import app from "../../../components/app";
import TimeSinceText from "../../../components/ui/timesinceText";
import Request_card from "./request_card";

const Approve_all = () => {
  const [total, setTotal] = useState(9999);
  const { approve_id, type } = useParams();
  const [filterText, setFilterText] = useState("");
  const [filter, setFilter] = useState({ staff: 0, status: 0 });
  const [approve, setApprove] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const pageRef = useRef(1);
  const { user, setUser } = useUser();
  const scrollRef = useRef(null);
  const loadApprove = () => {
    setLoading(true);
    api
      .get(
        `approve/?from=app${
          filter?.staff !== 0 ? `&staff=${filter?.staff}` : ``
        }${filter?.status !== 0 ? `&status=${filter?.status}` : ""}${
          type === "baoung"
            ? "&type=Báo ứng"
            : type === "chitieu"
            ? "&type=Chi tiêu"
            : type === "giuluong"
            ? "&type=Báo giữ lương"
            : ""
        }&page=${pageRef.current}&page_size=15`,
        user?.token
      )
      .then((res) => {
        setTotal(res?.count);
        setApprove((old) => [...old, ...res?.results]);
        pageRef.current += 1;
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    setApprove([]);
    pageRef.current = 1;
    loadApprove();
  }, [type, filter]);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100; // gần cuối
      if (isBottom) {
        if (approve.length < total) {
          loadApprove();
        }
      }
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="min-h-[60px] bg-white flex border-b-1 border-[#0003]"></div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
          <div className="flex gap-2 whitebox items-center overflow-hidden fadeInTop mt-2 mx-2">
            <div className="search !p-1">
              <div className="searchbox">
                <label className="icon p-2">
                  <IoSearchOutline />
                </label>
                <input
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="!w-[240px]"
                  type="text"
                  placeholder="Tìm kiếm..."
                />
              </div>
            </div>
            <Select
              className="w-[200px] !h-[40px]"
              placeholder="Người tuyển"
              allowClear={true}
              value={filter?.staff}
              showSearch
              onChange={(e) => setFilter((old) => ({ ...old, staff: e }))}
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
              options={[
                { value: 0, label: "Của tất cả nhân viên" },
                ...user?.company?.Staff?.map((emp) => ({
                  label: emp?.profile?.full_name,
                  value: emp?.id,
                })),
              ]}
            />
            <div className="flex p-1 gap-2 ml-auto">
              {/* <Select
                className="w-[160px] !h-[40px]"
                placeholder="Trạng thái"
                allowClear={true}
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "pending", label: "Chờ phê duyệt" },
                  { value: "paying", label: "Chờ giải ngân" },
                  { value: "retrive", label: "Chờ thu hồi" },
                  { value: "complete", label: "Hoàn thành" },
                ]}
              /> */}
            </div>
          </div>
          <div className="flex flex-1 gap-2 overflow-hidden pb-2 px-2">
            <div
              className={`overflow-auto relative ${
                approve_id ? "max-w-[500px]" : "min-w-[460px]"
              } whitebox flex-1 h-full flex flex-col fadeInTop approve_list`}
            >
              {loading && (
                <div
                  className="absolute flex-col gp-5 py-5 flex items-center justify-center
                    w-full"
                >
                  <Spin size="large" />
                  <div className="text-[#579ad8]">Đang tải dữ liệu...</div>
                </div>
              )}
              <div className="overflow-y-auto pr-1" ref={scrollRef}>
                {approve.map((apv) => (
                  <Request_card approve={apv} key={apv?.id} />
                ))}
              </div>
            </div>
            <Outlet
              context={{
                list: approve,
                callback: (res) =>
                  setApprove((old) =>
                    old.map((arv) => (arv.id === res.id ? res : arv))
                  ),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Approve_all;
