import { Empty, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import ReactApexChart from "react-apexcharts";

const Db_dilam_card = ({ user }) => {
  const [chartData, setChartData] = useState([]);
  const [labelSeries, setLabelSeries] = useState([]);
  useEffect(() => {
    const dashboardData = user?.company?.Dashboard?.op?.by_customer || {};
    const labels = Object.keys(dashboardData);
    const labelsWithTotal = labels.map((label) => {
      const subCompanies = dashboardData[label];
      const total = Object.values(subCompanies).reduce(
        (sum, val) => sum + val,
        0
      );
      return { label, total };
    });
    const top10Labels = labelsWithTotal
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map((item) => item.label);
    const tatCaCongTyCon = Array.from(
      new Set(
        top10Labels.flatMap((label) => Object.keys(dashboardData[label] || {}))
      )
    );
    const series = tatCaCongTyCon.map((ctyCon) => ({
      name: ctyCon,
      data: top10Labels.map((label) => dashboardData[label]?.[ctyCon] || 0),
    }));
    const timeout = setTimeout(() => {
      setChartData(series);
      setLabelSeries(top10Labels); // nếu cần set lại labels biểu đồ
    }, 300);
    return () => clearTimeout(timeout);
  }, []);
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
              fontSize: "10px",
              fontWeight: 500,
              color: "#999",
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
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val}`,
        style: {
          fontSize: "13px",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} người`, // ✅ chỉ tooltip mới có "người"
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
    <div className="flex flex-col flex-1">
      <div className="text-[15px] text-[#666] font-[500] flex justify-between">
        Thống kê nhân lực theo nhà chính
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

      <div className="flex-1 mt-4">
        <ReactApexChart
          options={chartOptions}
          series={chartData}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default Db_dilam_card;
