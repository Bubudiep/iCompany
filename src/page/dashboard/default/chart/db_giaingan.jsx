import { Empty, Modal, Select, Spin, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import api from "../../../../components/api";
import Staff_view from "../../../../components/by_id/staff_view";
import Operator_view from "../../../../components/by_id/op_view";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
dayjs.extend(isoWeek);
const { Option } = Select;

const DB_giaingan_card = ({ user }) => {
  const [chartData, setChartData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [customRange, setCustomRange] = useState([dayjs(), dayjs()]);
  const [range, setRange] = useState("this_week"); // this_week | last_week | this_month

  const getDateRange = () => {
    const today = dayjs();
    if (range === "custom" && customRange.length === 2) {
      return {
        from: customRange[0].format("YYYY-MM-DD"),
        to: customRange[1].format("YYYY-MM-DD"),
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
        `/approvehis/?page_size=9999&payout=1&created_at_from=${from}&created_at_to=${to}`,
        user?.token
      )
      .then((res) => {
        const results = res?.results || [];
        const dateMap = {};
        results.forEach((item) => {
          const date = dayjs(item.created_at).format("DD-MM");
          dateMap[date] = (dateMap[date] || 0) + parseInt(item.amount || 0);
        });
        const allDates = Object.keys(dateMap).sort((a, b) =>
          dayjs(a, "DD-MM").diff(dayjs(b, "DD-MM"))
        );

        setLabels(allDates);
        setRawData(results);
        setChartData([
          { name: "Hoàn tất", data: allDates.map((d) => dateMap[d]) },
        ]);
        setLoading(false);
      });
  }, [range, customRange]);

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, { dataPointIndex }) => {
          const date = labels[dataPointIndex];
          const matched = rawData.filter(
            (item) => dayjs(item.created_at).format("DD-MM") === date
          );
          setSelectedDate(date);
          setFilteredData(matched);
          setVisible(true);
        },
      },
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
      categories: labels,
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
  };
  return (
    <div className="flex flex-col flex-1 h-[310px]">
      <div className="text-[15px] text-[#666] font-[500] flex justify-between ">
        <div className="flex gap-4 items-center relative ml-1">
          Thống kê giải ngân
          <Tooltip
            color="white"
            title={
              <div className="text-[#636363] max-w-[200px] p-1">
                Dựa theo dữ liệu phê duyệt
              </div>
            }
          >
            <div
              className="text-[#c4c4c4] hover:text-[#666] cursor-pointer absolute
              top-0 -right-8"
            >
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
              onChange={(dates) => {
                setCustomRange(dates || []);
              }}
            />
          )}
        </div>
      </div>
      <div className="flex-1 mt-4 min-w-[500px]">
        {loading ? (
          <div className="text-center flex flex-col gap-2 text-sm text-gray-400 pt-24">
            <Spin size="large" />
            Đang tải...
          </div>
        ) : chartData.length === 0 ? (
          <Empty description="Không có dữ liệu" />
        ) : (
          <ReactApexChart
            options={chartOptions}
            series={chartData}
            type="bar"
            className="-mt-5"
            height={278}
          />
        )}
      </div>

      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        title={`Chi tiết giải ngân ngày ${selectedDate} (${filteredData.length} đơn)`}
        footer={null}
        width={800}
        className="popupcontent !top-10"
      >
        {filteredData.length === 0 ? (
          <Empty description="Không có dữ liệu" />
        ) : (
          <div className="max-h-[600px] overflow-auto text-sm">
            <table className="w-full">
              <tbody>
                <tr className="sticky top-0 bg-[#fff] z-10 shadow">
                  <th className="text-[12px] font-[500] text-[#999] pb-2">
                    CODE
                  </th>
                  <th className="text-[12px] font-[500] text-[#999] pb-2">
                    Người tạo
                  </th>
                  <th className="text-[12px] font-[500] text-[#999] pb-2">
                    Người lao động
                  </th>
                  <th className="text-[12px] font-[500] text-[#999] pb-2">
                    Số tiền
                  </th>
                  <th className="text-[12px] font-[500] text-[#999] pb-2">
                    Thời gian
                  </th>
                </tr>
                {filteredData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b-[#c2c2c2] border-b text-[#555] text-[13px]"
                  >
                    <td className="py-2">
                      <a className="font-[500]">{item?.code || "N/A"}</a>
                    </td>
                    <td>
                      {item?.requester ? (
                        <Staff_view id={item?.requester} />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {item?.operator ? (
                        <Operator_view id={item?.operator} />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      <b className="text-[#5a9e00] font-[500]">
                        {parseInt(item.amount).toLocaleString()} đ
                      </b>
                    </td>
                    <td>
                      <b className="text-[#999] font-[400]">
                        {dayjs(item.created_at).format("HH:mm DD/MM/YYYY")}
                      </b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DB_giaingan_card;
