import { Button, Select, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../../components/api";
import { useUser } from "../../../components/context/userContext";
import Customer_view from "../../../components/by_id/customer_view";
import app from "../../../components/app";
import { IoSearchOutline } from "react-icons/io5";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import Staff_view from "../../../components/by_id/staff_view";

const List_operators = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
  });
  const { user } = useUser();

  const fetchData = (params = {}) => {
    setLoading(true);
    api
      .get(`/ops/?page_size=99999`, user.token)
      .then((res) => {
        setData(res.results);
        setPagination({
          total: res.count,
        });
      })
      .catch((err) => {
        message.error("Lỗi tải dữ liệu");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);
  const columns = [
    {
      title: "Họ tên",
      dataIndex: "ho_ten",
      key: "ho_ten",
      sorter: true,
      render: (text, record) => (
        <div className="flex items-center">
          <div
            className="avatar"
            style={{
              backgroundColor: record?.avatar
                ? "transparent"
                : app.getRandomColorFromString(record?.ho_ten || "user"),
            }}
          >
            {record?.avatar ? (
              <img
                src={record.avatar}
                className="w-full h-full object-cover rounded-[8px]"
              />
            ) : (
              record.ho_ten.split(" ").pop()?.[0] || "?"
            )}
          </div>
          <div className="flex flex-col flex-1 w-[180px] ml-3">
            <div className="flex font-[500] text-[14px]">
              {record?.ho_ten || "Chưa đặt tên"}
            </div>
            <div className="flex text-[13px] text-[#5f5f5f]">
              {record?.ma_nhanvien}
            </div>
            <div className="flex text-[13px] text-[#5f5f5f]">
              {record?.congty_danglam ? (
                <Customer_view id={record?.congty_danglam} />
              ) : (
                "Chưa đi làm"
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Mã nhân viên",
      dataIndex: "ma_nhanvien",
      key: "ma_nhanvien",
      render: (text, record) => (
        <div className="block md:!max-w-[180px] md:!w-[180px] md:!ml-[0px]">
          <div className="flex text-[13px]">CCCD: {record?.so_cccd || "-"}</div>
          <div className="flex text-[13px] text-[#5f5f5f]">
            Ngày sinh:{" "}
            {record?.ngaysinh
              ? new Date(record?.ngaysinh).toLocaleDateString()
              : "-"}
          </div>
          <div title={record?.quequan} className="text-[13px] text-[#5f5f5f]">
            {record?.quequan || "-"}
          </div>
        </div>
      ),
    },
    {
      title: "Ngày phỏng vấn",
      dataIndex: "ngay_phongvan",
      key: "ngay_phongvan",
      render: (text, record) => (
        <div className="max-w-0 lg:!max-w-[180px] lg:!w-[180px] block">
          <div className="flex text-[13px] text-[#5f5f5f]  text-nowrap">
            Người tuyển:{" "}
            {record?.nguoituyen ? (
              <Staff_view className="ml-1" id={record?.nguoituyen} />
            ) : (
              "-"
            )}
          </div>
          <div className="flex text-[13px] text-[#5f5f5f]  text-nowrap">
            Báo cáo:{" "}
            {record?.nguoibaocao ? (
              <Staff_view className="ml-1" id={record?.nguoibaocao} />
            ) : (
              "-"
            )}
          </div>
          <div className="flex text-[13px] text-[#5f5f5f]  text-nowrap">
            Ngày phỏng vấn: {text || "-"}
          </div>
        </div>
      ),
    },
  ];
  const handleExport = () => {
    // Tạo một sheet với tiêu đề
    const headers = [
      [
        "Mã nhân viên",
        "Họ tên",
        "Số điện thoại",
        "Giới tính",
        "Số CCCD",
        "Ngày sinh",
        "Địa chỉ",
        "Mã ngân hàng",
        "Số tài khoản",
        "Chủ tài khoản",
        "Ghi chú tài khoản",
        "Người tuyển",
        "Vendor",
        "Nhà chính",
        "Công ty đang làm",
        "Ngày vào làm",
        "Ghi chú",
      ],
      ...data.map((item) => [
        item?.ma_nhanvien,
        item?.ho_ten,
        item?.sdt,
        item?.gioi_tinh,
        item?.so_cccd,
        item?.ngaysinh,
        item?.diachi,
        item?.nganhang,
        item?.so_taikhoan,
        item?.chu_taikhoan,
        item?.ghichu_taikhoan,
        item?.nguoituyen,
        item?.vendor,
        item?.nhachinh,
        item?.congty_danglam,
        item?.ghichu,
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Total");
    XLSX.writeFile(
      workbook,
      `Danhsach_nguoilaodong_${dayjs().format("YYMMDDHHmmss")}.xlsx`
    );
  };
  const filteredData = data.filter((item) =>
    item.ho_ten.toLowerCase().includes(filterText.toLowerCase())
  );
  const navigate = useNavigate();
  const onRowClick = (record) => {
    return {
      onClick: () => navigate(`/app/operators/all/${record.id}`),
    };
  };
  return (
    <div className="fadeInTop flex flex-col flex-1 overflow-hidden">
      <div
        className="flex gap-2 items-center min-h-[54px] bg-white overflow-hidden
      border-b-1 border-[#0003]"
      >
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
        <div className="flex p-1 gap-2 flex-1">
          <Select
            className="w-30 !h-[40px]"
            placeholder="Trạng thái"
            allowClear={true}
          >
            <Select.Option value="working">Đang đi làm</Select.Option>
            <Select.Option value="notworking">Chưa đi làm</Select.Option>
          </Select>
          <Select
            className="w-40 !h-[40px]"
            placeholder="Công ty"
            allowClear={true}
          >
            <Select.Option value="companyA">Công ty A</Select.Option>
            <Select.Option value="companyB">Công ty B</Select.Option>
          </Select>
          <Button
            icon={<PiMicrosoftExcelLogoFill size={20} className="mt-1" />}
            type="primary"
            className="ml-auto !h-[40px]"
            onClick={handleExport}
          >
            Xuất Excel
          </Button>
        </div>
      </div>
      <Table
        showHeader={false}
        className="full-table items"
        columns={columns}
        rowKey={(record) => record.id}
        rowClassName="user-item"
        dataSource={filteredData}
        loading={loading}
        scroll={{ y: 600 }}
        onRow={onRowClick}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />
    </div>
  );
};

export default List_operators;
