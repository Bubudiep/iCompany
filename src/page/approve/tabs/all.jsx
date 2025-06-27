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
import { Button, message, Select, Spin, Tooltip } from "antd";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import Staff_view from "../../../components/by_id/staff_view";
import { FaAnglesRight } from "react-icons/fa6";
import { FaCaretLeft, FaCheckCircle } from "react-icons/fa";
import { MdSettingsBackupRestore } from "react-icons/md";
import app from "../../../components/app";
import TimeSinceText from "../../../components/ui/timesinceText";
import Request_card from "./request_card";
import { BsChatSquareQuote } from "react-icons/bs";
import Export_approve_all from "../../../components/export/export_approve_all";

const Approve_all = () => {
  const [total, setTotal] = useState(9999);
  const { approve_id, type } = useParams();
  const [filterText, setFilterText] = useState("");
  const [filter, setFilter] = useState({ staff: 0, status: 0 });
  const [approve, setApprove] = useState([]);
  const location = useLocation();
  const [nextpage, setNextpage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUser();
  const scrollRef = useRef(null);
  const loadApprove = (zt) => {
    setLoading(true);
    api
      .get(
        nextpage && !zt
          ? "approve/" + nextpage.split("/").pop()
          : `approve/?from=app${
              filter?.type ? `&banktype=${filter?.type}` : ``
            }${filter?.staff !== 0 ? `&staff=${filter?.staff}` : ``}${
              filter?.status !== 0 ? `&status=${filter?.status}` : ""
            }${
              type === "baoung"
                ? "&type=Báo ứng"
                : type === "chitieu"
                ? "&type=Chi tiêu"
                : type === "giuluong"
                ? "&type=Báo giữ lương"
                : ""
            }&page_size=15`,
        user?.token
      )
      .then((res) => {
        if (res?.results) {
          setTotal(res?.count);
          setNextpage(res.next);
          if (zt === 1) {
            setApprove(res?.results);
          } else {
            setApprove((old) => [
              ...old?.filter((item) =>
                res?.results.findIndex((i) => i.id === item.id)
              ),
              ...res?.results,
            ]);
          }
        }
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    loadApprove(1);
  }, [filter, type]);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100;
      if (isBottom && !loading && approve.length < total) {
        loadApprove();
      }
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [loading, approve.length, total]);
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="min-h-[60px] bg-white items-center px-5 text-[16px] flex
        gap-3 border-b-1 border-[#0003] fadeInBot"
      >
        <BsChatSquareQuote />
        {type === "all" ? "Tất cả yêu cầu phê duyệt" : ""}
      </div>
      <div className="flex flex-1 overflow-hidden fadeInTop">
        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
          <div className="flex gap-2 whitebox items-center overflow-hidden fadeInTop mt-2 mx-2">
            {/* <div className="search !p-1">
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
            </div> */}
            <Select
              className="w-[200px] !h-[40px]"
              placeholder="Người tuyển"
              value={filter?.staff}
              showSearch
              onChange={(e) => {
                setFilter((old) => ({ ...old, staff: e }));
              }}
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
            <Select
              className="w-[200px] !h-[40px]"
              placeholder="Phân loại"
              value={filter?.type || ""}
              showSearch
              onChange={(e) => {
                setFilter((old) => ({ ...old, type: e }));
              }}
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
              options={[
                { value: "", label: "Tất cả" },
                { value: "bank", label: "Chuyển khoản" },
                { value: "money", label: "Tiền mặt" },
              ]}
            />
            <div className="flex p-1 gap-2 ml-auto">
              <Tooltip
                title={
                  <div className="flex items-start flex-col gap-1.5 min-w-[120px] p-2">
                    <div className="text-[#000] mb-2">Chọn loại dữ liệu:</div>
                    <div className="flex flex-col gap-1.5 ml-2">
                      <Export_approve_all option="pending">
                        <Button
                          icon={
                            <PiMicrosoftExcelLogoFill
                              size={20}
                              className="mt-1"
                            />
                          }
                          type="primary"
                          className="!h-[40px]"
                        >
                          Chờ giải ngân
                        </Button>
                      </Export_approve_all>
                      <Export_approve_all option="complete">
                        <Button
                          icon={
                            <PiMicrosoftExcelLogoFill
                              size={20}
                              className="mt-1"
                            />
                          }
                          type="primary"
                          className="!h-[40px]"
                        >
                          Đã hoàn thành
                        </Button>
                      </Export_approve_all>
                      <Export_approve_all option="rejected">
                        <Button
                          icon={
                            <PiMicrosoftExcelLogoFill
                              size={20}
                              className="mt-1"
                            />
                          }
                          type="primary"
                          className="!h-[40px]"
                        >
                          Đã bị rejected
                        </Button>
                      </Export_approve_all>
                      <Export_approve_all>
                        <Button
                          icon={
                            <PiMicrosoftExcelLogoFill
                              size={20}
                              className="mt-1"
                            />
                          }
                          type="primary"
                          className="!h-[40px]"
                        >
                          Tất cả phê duyệt
                        </Button>
                      </Export_approve_all>
                    </div>
                  </div>
                }
                color="white"
              >
                <div
                  className="flex ml-auto items-center p-2 border-1 hover:border-[#007add] 
                  text-[#999] transition-all duration-300
                hover:text-[#007add] px-4 rounded-[8px] gap-2 cursor-pointer border-[#999]"
                >
                  <PiMicrosoftExcelLogoFill size={20} />
                  Xuất Excel
                </div>
              </Tooltip>
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
              className={`overflow-auto relative min-w-[440px] ${
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
              <div
                className="overflow-y-auto pr-1 min-w-[460px]"
                ref={scrollRef}
              >
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
