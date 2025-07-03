import { Empty, Modal, Select, Spin, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { FaInfoCircle, FaUserTie } from "react-icons/fa";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import api from "../../../../components/api";
import Staff_view from "../../../../components/by_id/staff_view";
import Operator_view from "../../../../components/by_id/op_view";
import Vendor_view from "./../../../../components/by_id/vendor_view";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

dayjs.extend(isoWeek);
const { Option } = Select;

const DB_nguoimoi_card = ({ user }) => {
  const [chartData, setChartData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [customRange, setCustomRange] = useState([dayjs(), dayjs()]);
  const [range, setRange] = useState("this_week");

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
        `/op_all/?page_size=99999&created_at_from=${from}&created_at_to=${to}`,
        user?.token
      )
      .then((res) => {
        const results = res?.results || [];
        const dateMap = {};
        results.forEach((item) => {
          const date = dayjs(item.created_at).format("DD-MM");
          // ✅ chỉ đếm số lượng người tuyển được mỗi ngày
          dateMap[date] = (dateMap[date] || 0) + 1;
        });

        let allDates = Object.keys(dateMap).sort((a, b) =>
          dayjs(a, "DD-MM").diff(dayjs(b, "DD-MM"))
        );

        // ✅ Giới hạn chỉ 8 ngày gần nhất
        if (allDates.length > 8) {
          allDates = allDates.slice(-8);
        }

        setLabels(allDates);
        setRawData(results);
        setChartData([
          { name: "Người mới", data: allDates.map((d) => dateMap[d]) },
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
        columnWidth: "30%",
        dataLabels: {
          total: {
            enabled: true,
            style: { fontSize: "11px", fontWeight: 600, color: "#999" },
            formatter: (val) => `${val}`,
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
        formatter: (val) => `${val}`,
        style: { fontSize: "11px" },
      },
    },
    tooltip: {
      y: { formatter: (val) => `${val} người` },
    },
  };
  return (
    <div className="flex flex-col flex-1 h-[310px]">
      <div className="text-[15px] text-[#666] font-[500] flex justify-between ">
        <div className="flex gap-4 items-center relative ml-1">
          Người lao động mới được thêm vào
          <Tooltip
            color="white"
            title={
              <div className="text-[#636363] max-w-[200px] p-1">
                Dựa theo dữ liệu báo cáo đi làm hàng ngày của nhân viên.
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
        <div className="ml-auto flex gap-1">
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
          <div className="max-h-[600px] min-h-[300px] overflow-auto text-sm">
            <table className="w-full">
              <tbody>
                <tr className="sticky top-0 bg-[#fff] z-10 shadow">
                  <td className="text-[12px] font-[500] text-[#999] pb-2">
                    Mã NV
                  </td>
                  <td className="text-[12px] font-[500] text-[#999] pb-2">
                    Họ và tên
                  </td>
                  <td className="text-[12px] font-[500] text-[#999] pb-2">
                    Người tuyển
                  </td>
                  <td className="text-[12px] font-[500] text-[#999] pb-2">
                    Người báo cáo
                  </td>
                  <td className="text-[12px] font-[500] text-[#999] pb-2">
                    Thời gian
                  </td>
                </tr>
                {filteredData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b-[#c2c2c2] border-b text-[#555] text-[13px]"
                  >
                    <td className="py-2">{item?.ma_nhanvien || "N/A"}</td>
                    <td className="py-2">{item?.ho_ten || "N/A"}</td>
                    <td>
                      {item?.nguoituyen ? (
                        <Staff_view id={item?.nguoituyen} />
                      ) : (
                        <div className="flex gap-1">
                          <div
                            className="flex text-[#fff] bg-[#106c97] px-1 rounded-[4px]
                            text-[9px] items-center justify-center"
                          >
                            Vendor
                          </div>
                          <Vendor_view id={item?.vendor} />
                        </div>
                      )}
                    </td>
                    <td>
                      <Staff_view id={item?.nguoibaocao} />
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

export default DB_nguoimoi_card;
