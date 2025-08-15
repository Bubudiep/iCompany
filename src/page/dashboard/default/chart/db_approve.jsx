import React, { useEffect, useState } from "react";
import Db_baoung_card from "./db_approve/db_baoung";
import Db_baogiu_card from "./db_approve/db_baogiu";
import Db_baokhac_card from "./db_approve/db_baokhac";
import DB_nguoimoi_card from "./db_nguoimoi";
import api from "../../../../components/api";
import dayjs from "dayjs";
import Db_pheduyet_card from "./db_approve/db_pheduyet";

const Db_approve = ({ user }) => {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("last_7_days");
  const [customRange, setCustomRange] = useState([
    dayjs().subtract(6, "day"),
    dayjs(),
  ]);
  const getDateRange = () => {
    const today = dayjs();
    if (range === "custom" && customRange.length === 2) {
      return {
        from: customRange[0].format("YYYY-MM-DD"),
        to: customRange[1].format("YYYY-MM-DD"),
      };
    }
    if (range === "last_7_days") {
      return {
        from: today.subtract(6, "day").format("YYYY-MM-DD"),
        to: today.format("YYYY-MM-DD"),
      };
    }
    if (range === "this_week") {
      return {
        from: today.startOf("isoWeek").format("YYYY-MM-DD"),
        to: today.endOf("isoWeek").format("YYYY-MM-DD"),
      };
    }
    if (range === "last_week") {
      const lastWeek = today.subtract(1, "week");
      return {
        from: lastWeek.startOf("isoWeek").format("YYYY-MM-DD"),
        to: lastWeek.endOf("isoWeek").format("YYYY-MM-DD"),
      };
    }
    const monthMap = {
      this_month: 0,
      last_month: 1,
      last_2_month: 2,
      last_3_month: 3,
    };
    const offset = monthMap[range] || 0;
    const target = today.subtract(offset, "month");
    return {
      from: target.startOf("month").format("YYYY-MM-DD"),
      to: target.endOf("month").format("YYYY-MM-DD"),
    };
  };

  useEffect(() => {
    const { from, to } = getDateRange();
    setLoading(true);
    api
      .get(
        `/approvel/?page_size=9999&created_at_from=${from}&created_at_to=${to}`,
        user?.token
      )
      .then((res) => {
        const results = res?.results || [];
        const dateMap = {};
        results.forEach((item) => {
          const date = dayjs(item.created_at).format("DD-MM");
          dateMap[date] = (dateMap[date] || 0) + parseInt(item.amount || 0);
        });
        setRawData(results);
        setLoading(false);
      });
  }, [range, customRange]);
  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex gap-4">
        <div className="flex bg-white p-2 flex-col rounded-[8px] shadow flex-1">
          <div className="text-[15px] font-[500]">Báo ứng chưa giải ngân</div>
          <div className="text-[30px] p-4 pt-2 font-bold text-nowrap">
            {rawData
              .filter(
                (i) =>
                  i.requesttype === "Báo ứng" &&
                  i.payment_status === "not" &&
                  ["approved", "pending"].includes(i.status)
              )
              .reduce((sum, item) => sum + parseInt(item.amount || 0), 0)
              .toLocaleString()}
            <b className="font-[500] text-[13px] text-[#999]"> VNĐ</b>
          </div>
        </div>
        <div className="flex bg-white p-2 flex-col rounded-[8px] shadow flex-1">
          <div className="text-[15px] font-[500]">Báo ứng đã giải ngân</div>
          <div className="text-[30px] p-4 pt-2 font-bold text-nowrap">
            {rawData
              .filter(
                (i) =>
                  i.requesttype === "Báo ứng" && i.payment_status === "done"
              )
              .reduce((sum, item) => sum + parseInt(item.amount || 0), 0)
              .toLocaleString()}
            <b className="font-[500] text-[13px] text-[#999]"> VNĐ</b>
          </div>
        </div>
        <div className="flex bg-white p-2 flex-col rounded-[8px] shadow flex-1">
          <div className="text-[15px] font-[500]">Đang giữ lương</div>
          <div className="text-[30px] p-4 pt-2 font-bold text-nowrap">
            {rawData
              .filter(
                (i) =>
                  i.requesttype === "Báo giữ lương" && i.status === "approved"
              )
              .reduce((sum, item) => sum + parseInt(item.amount || 0), 0)
              .toLocaleString()}
            <b className="font-[500] text-[13px] text-[#999]"> VNĐ</b>
          </div>
        </div>
      </div>
      <div className="flex gap-4 flex-1">
        <Db_baoung_card rawData={rawData} loading={loading} />
        <div className="flex flex-col gap-4 w-full">
          <Db_baokhac_card rawData={rawData} loading={loading} />
          <Db_baogiu_card rawData={rawData} loading={loading} />
        </div>
      </div>
      <div className="flex whitebox flex-1/10">
        <Db_pheduyet_card
          rawData={rawData}
          user={user}
          range={range}
          customRange={customRange}
          setRange={setRange}
          setCustomRange={setCustomRange}
          loading={loading}
          getDateRange={getDateRange}
        />
      </div>
    </div>
  );
};

export default Db_approve;
