import { Empty, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import ReactApexChart from "react-apexcharts";

const Db_dilam_card = ({ user }) => {
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  useEffect(() => {
    const labels = Object.keys(user?.company?.Dashboard?.op?.by_customer);
    const values = Object.values(user?.company?.Dashboard?.op?.by_customer);
    const data = {
      labels: labels,
      values: values,
    };
    const timeout = setTimeout(() => {
      setChartData(data);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);
  const chartOptions = {
    chart: {
      type: "bar",
      height: 500,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: "50%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: chartData.labels,
      labels: { style: { fontSize: "13px" } },
    },
    colors: ["#1890ff"],
  };
  const chartSeries = [
    {
      name: "Đang đi làm",
      data: chartData.values,
    },
  ];
  return (
    <div className="flex flex-col flex-1">
      <div className="text-[15px] text-[#666] font-[500] flex justify-between">
        Thống kê nhân lực theo nhà chính
        <Tooltip
          color="white"
          title={
            <div className="text-[#636363] max-w-[200px] p-1">
              Dựa theo dữ liệu báo cáo đi làm hằng ngày của nhân viên
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
          series={chartSeries}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default Db_dilam_card;
