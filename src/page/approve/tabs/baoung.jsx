import React, { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../../../components/api";
import { useUser } from "../../../components/context/userContext";
import { Button, Empty, message, Select } from "antd";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import Staff_view from "../../../components/by_id/staff_view";
import { FaAnglesRight } from "react-icons/fa6";
import { FaCaretLeft } from "react-icons/fa";

const Approve_baoung = () => {
  const { approve_id } = useParams();
  const [filterText, setFilterText] = useState("");
  const [approve, setApprove] = useState([]);
  const location = useLocation();
  const { user, setUser } = useUser();
  const loadApprove = () => {
    api.get(`approve/?type=Báo ứng&page_size=999`, user?.token).then((res) => {
      setApprove(res?.results || []);
    });
  };
  useEffect(() => {
    loadApprove();
  }, []);

  useEffect(() => {
    console.log(approve_id);
  }, [location]);
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="min-h-[60px] bg-white flex border-b-1 border-[#0003]"></div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
          <div className="flex gap-2 whitebox overflow-hidden fadeInTop mt-2 mx-2">
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
            <div className="flex p-1 gap-2 ml-auto">
              <Select
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
              />
            </div>
          </div>
          <div className="flex flex-1 gap-2 overflow-hidden pb-2 px-2">
            <div
              className={`overflow-hidden ${
                approve_id ? "max-w-[500px]" : ""
              } whitebox min-w-[400px] flex-1 h-full flex flex-col fadeInTop approve_list`}
            >
              {approve.length > 0 ? (
                approve.map((apv) => {
                  return (
                    <div
                      key={apv.id}
                      className={`flex item gap-2 items-center relative ${
                        apv.request_code === approve_id ? "active" : ""
                      }`}
                    >
                      <div className="w-[160px] flex flex-col gap-1">
                        <div className="flex font-[500]">
                          {apv?.request_code}
                        </div>
                        <div className="flex">
                          <div className={`type t${apv?.requesttype?.id}`}>
                            {apv?.requesttype?.typecode}
                          </div>
                        </div>
                      </div>
                      <div className="flex w-[120px] flex-col gap-1">
                        <div className={`status flex ${apv?.status}`}>
                          {apv?.status_display}
                        </div>
                        <div className={`status flex ${apv?.payment_status}`}>
                          {apv?.payment_status_display}
                        </div>
                      </div>
                      {!approve_id && (
                        <>
                          <div className="flex w-[120px] flex-col gap-1">
                            <div className="flex">
                              <Staff_view id={apv?.requester?.id} />
                            </div>
                            <div className="flex">
                              {apv?.operator?.ho_ten || "-"}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex">
                              {parseInt(apv?.amount)?.toLocaleString() || 0}{" "}
                              <div className="font-[500] text-[#999] ml-1">
                                vnđ
                              </div>
                            </div>
                            <div className="flex">
                              {apv?.hinhthucThanhtoan_display || "-"}
                            </div>
                          </div>
                        </>
                      )}
                      {approve_id == apv.request_code ? (
                        <div
                          key={apv.request_code}
                          className="flex ml-auto text-[#3993cf] text-[20px]"
                        >
                          <FaCaretLeft />
                        </div>
                      ) : (
                        <Link
                          to={`/app/approve/all/${apv?.request_code}`}
                          className="flex ml-auto text-[#3993cf] hover:text-[#0076c5] transition-all 
                      duration-300 items-center gap-1 font-[500] hover:underline"
                        >
                          Chi tiết <FaAnglesRight />
                        </Link>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <Empty description="Danh sách trống" />
                </div>
              )}
            </div>
            <Outlet context={{ list: approve }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Approve_baoung;
