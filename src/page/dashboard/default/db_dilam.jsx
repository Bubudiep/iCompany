import { Empty, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import ReactApexChart from "react-apexcharts";

const Db_dilam_card = ({ user }) => {
  const [chartData, setChartData] = useState({});
  useEffect(() => {
    const labels = Object.keys(user?.company?.Dashboard?.op?.by_customer);
    const tatCaCongTyCon = Array.from(
      new Set(
        labels.flatMap((nc) =>
          Object.keys(user?.company?.Dashboard?.op?.by_customer[nc])
        )
      )
    );
    const series = tatCaCongTyCon.map((ctyCon) => ({
      name: ctyCon,
      data: labels.map(
        (nc) => user?.company?.Dashboard?.op?.by_customer[nc][ctyCon] || 0
      ),
    }));
    const timeout = setTimeout(() => {
      setChartData(series);
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
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: Object.keys(user?.company?.Dashboard?.op?.by_customer),
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
          series={chartData}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default Db_dilam_card;
