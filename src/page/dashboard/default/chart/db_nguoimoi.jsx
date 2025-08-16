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
import Customer_view from "../../../../components/by_id/customer_view";
import { Link } from "react-router-dom";
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
  const [range, setRange] = useState("last_7_days");
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
        `/ophist/?page_size=99999&start_date_from=${from}&start_date_to=${to}`,
        user?.token
      )
      .then((res) => {
        const results = res?.results || [];
        const dateMap = {};
        results.forEach((item) => {
          const date = dayjs(item.start_date).format("DD-MM");
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
            (item) => dayjs(item.start_date).format("DD-MM") === date
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
    <>
      <div className="flex gap-4 w-full">
        <div
          className="flex bg-white p-2 flex-col rounded-[8px] shadow pr-8 flex-1 
          cursor-pointer hover:-translate-y-1 transition-all duration-300"
          onClick={() => {
            setSelectedDate(dayjs().format("DD-MM"));
            setFilteredData(
              rawData.filter(
                (item) =>
                  dayjs(item.start_date).format("DD-MM") ===
                  dayjs().format("DD-MM")
              )
            );
            setVisible(true);
          }}
        >
          <div className="text-[15px] font-[500] text-nowrap">
            Người mới hôm nay
          </div>
          <div className="text-[30px] p-4 pt-2 font-bold text-nowrap">
            {
              rawData.filter(
                (i) =>
                  dayjs(i.start_date).format("YYYY-MM-DD") ===
                  dayjs().format("YYYY-MM-DD")
              ).length
            }
            <b className="font-[500] text-[13px] text-[#999]"> Người</b>
          </div>
        </div>
        <div className="flex bg-white p-2 flex-col rounded-[8px] shadow pr-8 flex-1">
          <div className="text-[15px] font-[500] text-nowrap">
            Vẫn đang đi làm
          </div>
          <div className="text-[30px] p-4 pt-2 font-bold text-nowrap">
            {
              user?.company?.Operator.filter(
                (i) => i.congty_danglam && !i.vendor
              ).length
            }
            <b className="font-[500] text-[13px] text-[#999]"> Người</b>
          </div>
        </div>
        <div className="flex bg-white p-2 flex-col rounded-[8px] shadow pr-8 flex-1">
          <div className="text-[15px] font-[500] text-nowrap">
            Vẫn đi làm (Vendor)
          </div>
          <div className="text-[30px] p-4 pt-2 font-bold text-nowrap">
            {
              user?.company?.Operator.filter(
                (i) => i.congty_danglam && i.vendor
              ).length
            }
            <b className="font-[500] text-[13px] text-[#999]"> Người</b>
          </div>
        </div>
      </div>
      <div className="flex whitebox flex-1/10">
        <div className="flex flex-col flex-1 h-[310px]">
          <div className="text-[15px] text-[#666] font-[500] flex justify-between ">
            <div className="flex flex-col">
              <div className="flex gap-4 items-center relative ml-1">
                Người lao động đi làm
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
              <div className="flex ml-1 text-[12px] font-[400]">
                Danh sách người lao động báo đi làm hằng ngày
              </div>
            </div>
            <div className="ml-auto flex gap-1">
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
            title={`Người lao động đi làm ${selectedDate} (${filteredData.length} người)`}
            footer={null}
            width={900}
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
                        Công ty
                      </td>
                      <td className="text-[12px] font-[500] text-[#999] pb-2">
                        Mã NV
                      </td>
                      <td className="text-[12px] font-[500] text-[#999] pb-2">
                        Họ và tên
                      </td>
                      <td className="text-[12px] font-[500] text-[#999] pb-2">
                        Nhà chính
                      </td>
                      <td className="text-[12px] font-[500] text-[#999] pb-2">
                        Vendor
                      </td>
                      <td className="text-[12px] font-[500] text-[#999] pb-2">
                        Người tuyển
                      </td>
                      <td className="text-[12px] font-[500] text-[#999] pb-2">
                        Người báo cáo
                      </td>
                      <td className="text-[12px] font-[500] text-[#999] pb-2">
                        Ngày vào làm
                      </td>
                    </tr>
                    {filteredData.map((item, idx) => {
                      const op = user?.company?.Operator?.find(
                        (o) => o?.id === item.operator
                      );
                      return (
                        <tr
                          key={idx}
                          className="border-b-[#c2c2c2] border-b text-[#555] text-[13px]"
                        >
                          <td className="py-2">
                            <Customer_view id={item?.customer} />
                          </td>
                          <td className="py-2">{item?.ma_nhanvien || "--"}</td>
                          <td className="py-2">
                            <Link
                              to={`/app/operators/all/${op?.id}`}
                              className="flex flex-col"
                            >
                              <div className="flex text-[#000]">
                                {op?.ho_ten || "--"}
                              </div>
                              <div className="flex text-[#999] leading-3 text-[10px]">
                                {op?.ma_nhanvien || "--"}
                              </div>
                            </Link>
                          </td>
                          <td>
                            {op?.nhachinh ? (
                              <div className="relative flex items-center gap-1">
                                <div className="text-[9px] px-1 bg-[#008cff] text-[#fff] rounded-[4px]">
                                  vendor
                                </div>
                                <Vendor_view id={op?.nhachinh} />
                              </div>
                            ) : (
                              "--"
                            )}
                          </td>
                          <td>
                            {op?.vendor ? (
                              <div className="relative flex items-center gap-1">
                                <div className="text-[9px] px-1 bg-[#008cff] text-[#fff] rounded-[4px]">
                                  vendor
                                </div>
                                <Vendor_view id={op?.vendor} />
                              </div>
                            ) : (
                              item?.vendor && <Vendor_view id={item?.vendor} />
                            )}
                          </td>
                          <td>
                            {item?.nguoituyen ? (
                              <Staff_view id={item?.nguoituyen} />
                            ) : item?.vendor ? (
                              <div className="flex gap-1">
                                <div
                                  className="flex text-[#fff] bg-[#106c97] px-1 rounded-[4px]
                                  text-[9px] items-center justify-center"
                                >
                                  Vendor
                                </div>
                                <Vendor_view id={item?.vendor} />
                              </div>
                            ) : (
                              <>--</>
                            )}
                          </td>
                          <td>
                            <Staff_view id={item?.nguoibaocao} />
                          </td>
                          <td>
                            <b className="text-[#999] font-[400]">
                              {dayjs(item.start_date).format("DD/MM/YYYY")}
                            </b>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
};

export default DB_nguoimoi_card;
