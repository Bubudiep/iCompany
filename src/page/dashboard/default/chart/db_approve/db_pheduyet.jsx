import { Empty, Select, Tooltip, DatePicker, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

const { Option } = Select;
const { RangePicker } = DatePicker;

const Db_pheduyet_card = ({
  rawData,
  range,
  setRange,
  loading,
  customRange,
  setCustomRange,
  getDateRange,
}) => {
  const [chartData, setChartData] = useState([]);
  const [labelSeries, setLabelSeries] = useState([]);
  useEffect(() => {
    const dashboardData = rawData;
    const raw =
      dashboardData?.filter((i) => i?.requesttype === "Báo ứng") || [];
    const { from, to } = getDateRange();
    const dateMap = {};
    raw.forEach((item) => {
      const created = dayjs(item.created_at);
      if (created.isBefore(from) || created.isAfter(to)) return;
      const date = created.format("DD-MM");
      if (!dateMap[date])
        dateMap[date] = { pending: 0, done: 0, reject: 0, cancel: 0 };
      if (item.status === "pending" && item.payment_status === "not")
        dateMap[date].pending += parseInt(item.amount || 0);
      else if (item.payment_status === "done")
        dateMap[date].done += parseInt(item.amount || 0);
      else if (item.status === "reject")
        dateMap[date].reject += parseInt(item.amount || 0);
      else if (item.status === "cancel")
        dateMap[date].cancel += parseInt(item.amount || 0);
    });
    const allDates = Object.keys(dateMap).sort((a, b) =>
      dayjs(a, "DD-MM").diff(dayjs(b, "DD-MM"))
    );
    setLabelSeries(allDates);
    setChartData([
      { name: "Chờ duyệt", data: allDates.map((d) => dateMap[d].pending) },
      { name: "Hoàn tất", data: allDates.map((d) => dateMap[d].done) },
      { name: "Từ chối", data: allDates.map((d) => dateMap[d].reject) },
      { name: "Hủy", data: allDates.map((d) => dateMap[d].cancel) },
    ]);
  }, [rawData, range, customRange]);
  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 6,
        columnWidth: "50%",
        dataLabels: {
          total: {
            enabled: true,
            style: { fontSize: "12px", fontWeight: 500, color: "#999" },
            formatter: (val) => (val / 1e6).toFixed(1) + " tr",
          },
        },
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: labelSeries,
      labels: { style: { fontSize: "11px" } },
    },
    yaxis: {
      labels: {
        formatter: (val) => (val / 1e6).toFixed(1) + " tr",
        style: { fontSize: "11px" },
      },
    },
    tooltip: {
      y: { formatter: (val) => `${val.toLocaleString()} vnđ` },
    },
    legend: { position: "top" },
    colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560"],
  };

  return (
    <div className="flex flex-col flex-1 h-[330px] relative">
      {loading && (
        <div className="absolute flex w-full h-full items-center justify-center">
          <Spin size="large" />
        </div>
      )}
      <div className="text-[15px] text-[#666] font-[500] flex justify-between">
        <div className="flex gap-4 items-center relative ml-1">
          Thống kê phê duyệt
          <Tooltip
            color="white"
            title={
              <div className="text-[#636363] max-w-[200px] p-1">
                Dựa theo dữ liệu báo cáo đi làm hằng ngày của nhân viên (TOP 10)
              </div>
            }
          >
            <div className="ml-2 text-[#c4c4c4] hover:text-[#666] cursor-pointer">
              <FaInfoCircle />
            </div>
          </Tooltip>
        </div>
        <div className="flex gap-1 ml-auto items-center">
          <Select
            value={range}
            onChange={setRange}
            className="w-[150px] !text-[11px] !h-[32px]"
          >
            <Option value="last_7_days">7 ngày gần nhất</Option>
            <Option value="this_week">Tuần này</Option>
            <Option value="last_week">Tuần trước</Option>
            <Option value="this_month">Tháng này</Option>
            <Option value="last_month">Tháng trước</Option>
            <Option value="last_2_month">Tháng trước nữa</Option>
            <Option value="last_3_month">3 tháng trước</Option>
            <Option value="custom">Tuỳ chọn</Option>
          </Select>
          {range === "custom" && (
            <RangePicker
              allowClear={false}
              className="!h-[32px] !text-[10px] w-[220px] font-[400]"
              size="small"
              format="DD-MM-YYYY"
              value={customRange}
              onChange={(dates) => setCustomRange(dates || [])}
            />
          )}
        </div>
      </div>

      <div className="flex-1 mt-4 min-w-[500px]">
        {chartData.length === 0 ? (
          <Empty description="Không có dữ liệu" />
        ) : (
          <ReactApexChart
            options={chartOptions}
            series={chartData}
            type="bar"
            height={288}
          />
        )}
      </div>
    </div>
  );
};

export default Db_pheduyet_card;
