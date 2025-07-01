import { Empty, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";

const Db_pheduyet_card = ({ user }) => {
  const [chartData, setChartData] = useState([]);
  const [labelSeries, setLabelSeries] = useState([]);
  useEffect(() => {
    const dashboardData = user?.company?.Dashboard?.approve || {};
    console.log(dashboardData);
    const allDatesSet = new Set();
    const map = {};
    dashboardData?.baoung?.forEach((item) => {
      const date = dayjs(item?.created_at).format("DD-MM");
      allDatesSet.add(date);
      if (!map[date]) map[date] = {};
      map[date][item?.status] =
        (map?.[date]?.[item?.status] || 0) + parseInt(item?.amount);
    });
    const allDates = Array.from(allDatesSet).sort((a, b) =>
      dayjs(a, "DD-MM").diff(dayjs(b, "DD-MM"))
    );
    const timeout = setTimeout(() => {
      setChartData([
        {
          name: "Chờ duyệt",
          data: allDates.map((date) => {
            return dashboardData?.baoung
              ?.filter(
                (item) =>
                  dayjs(item?.created_at).format("DD-MM") === date &&
                  item?.payment_status === "not" &&
                  item?.status === "pending"
              )
              .reduce((sum, item) => sum + parseInt(item.amount || 0), 0);
          }),
        },
        {
          name: "Hoàn tất",
          data: allDates.map((date) => {
            return dashboardData?.baoung
              ?.filter(
                (item) =>
                  dayjs(item?.created_at).format("DD-MM") === date &&
                  item?.payment_status === "done"
              )
              .reduce((sum, item) => sum + parseInt(item.amount || 0), 0);
          }),
        },
        {
          name: "Từ chối",
          data: allDates.map((date) => {
            return dashboardData?.baoung
              ?.filter(
                (item) =>
                  dayjs(item?.created_at).format("DD-MM") === date &&
                  item?.status === "reject"
              )
              .reduce((sum, item) => sum + parseInt(item.amount || 0), 0);
          }),
        },
        {
          name: "Hủy",
          data: allDates.map((date) => {
            return dashboardData?.baoung
              ?.filter(
                (item) =>
                  dayjs(item?.created_at).format("DD-MM") === date &&
                  item?.status === "cancel"
              )
              .reduce((sum, item) => sum + parseInt(item.amount || 0), 0);
          }),
        },
      ]);
      setLabelSeries(allDates);
    }, 300);
    return () => clearTimeout(timeout);
  }, [user?.company?.Dashboard]);
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
        borderRadiusApplication: "end", // hoặc "end"
        borderRadiusWhenStacked: "all",
        columnWidth: "50%",
        borderWidth: 1, // 👈 Không có tác dụng
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "12px",
              fontWeight: 500,
              color: "#999",
            },
            formatter: function (val) {
              return (val / 1000000).toFixed(1) + " tr";
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: labelSeries,
      labels: {
        style: {
          fontSize: "11px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => (val / 1000000).toFixed(1) + " tr",
        style: {
          fontSize: "11px",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toLocaleString()} vnđ`, // ✅ chỉ tooltip mới có "người"
      },
    },
    legend: {
      position: "top",
    },
    colors: [
      "#008FFB",
      "#00E396",
      "#FEB019",
      "#FF4560",
      "#775DD0",
      "#3F51B5",
      "#546E7A",
      "#D4526E",
      "#8D5B4C",
      "#F86624",
    ],
  };
  return (
    <div className="flex flex-col flex-1 h-[320px]">
      <div className="text-[15px] text-[#666] font-[500] flex justify-between">
        Thống kê phê duyệt báo ứng
        <Tooltip
          color="white"
          title={
            <div className="text-[#636363] max-w-[200px] p-1">
              Dựa theo dữ liệu báo cáo đi làm hằng ngày của nhân viên (TOP 10)
            </div>
          }
        >
          <div className="ml-auto text-[#c4c4c4] transition-all duration-300 hover:text-[#666] cursor-pointer">
            <FaInfoCircle />
          </div>
        </Tooltip>
      </div>

      <div className="flex-1 mt-4 min-w-[500px]">
        <ReactApexChart
          options={chartOptions}
          series={chartData}
          type="bar"
          height={288}
        />
      </div>
    </div>
  );
};

export default Db_pheduyet_card;
