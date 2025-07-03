import { Button, Select, Table, Tooltip, message } from "antd";
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
import Export_op_history from "../../../components/op/export_op_history";
import Vendor_view from "../../../components/by_id/vendor_view";

const List_operators = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterOption, setFilterOption] = useState({
    working: 0,
    company: 0,
  });
  const [pagination, setPagination] = useState({
    total: 0,
  });
  const { user } = useUser();

  const fetchData = (
    params = {},
    link = `/ops/?page_size=99999`,
    replace = true
  ) => {
    setLoading(true);
    api
      .get(link, user.token)
      .then((res) => {
        if (replace) {
          setData(res.results);
          setPagination({
            total: res.count,
          });
        } else {
          setData((old) => [...old, ...res.results]);
        }
        if (res?.next) {
          fetchData(params, res?.next?.replace("http", "https"), false);
        }
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
              record?.ho_ten?.split(" ").pop()?.[0] || "?"
            )}
          </div>
          <div className="flex flex-col flex-1 w-[180px] ml-3">
            <div className="flex font-[500] text-[14px]">
              {record?.ho_ten
                ? app.beautifyName(record?.ho_ten)
                : "Chưa đặt tên"}
            </div>
            <div className="flex text-[13px] text-[#5f5f5f]">
              {record?.congty_hientai ? (
                <div className="flex gap-1">
                  <div className="text-[#02338d]">
                    {record?.congty_hientai?.ma_nhanvien}
                  </div>
                  ({record?.congty_hientai?.start_date})
                </div>
              ) : (
                record?.ma_nhanvien
              )}
            </div>
            <div className="flex text-[13px] text-[#5f5f5f]">
              {record?.congty_danglam ? (
                <>
                  <Customer_view
                    id={record?.congty_danglam}
                    working={record?.congty_hientai}
                  />
                </>
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
              record?.vendor && (
                <div className="flex gap-1 ml-1">
                  <div
                    className="flex px-1 py-0 bg-[#6a4396] rounded-[4px] text-[10px]
                  items-center justify-center text-[#fff] font-[500]"
                  >
                    Vendor
                  </div>{" "}
                  <Vendor_view id={record?.vendor} />
                </div>
              )
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
            Ghi chú: {record?.ghichu || "-"}
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
        "Ngày phỏng vấn",
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
        item?.nguoituyen
          ? user?.company?.Staff?.find((staff) => staff.id === item?.nguoituyen)
              ?.profile?.full_name
          : "-",
        item?.vendor
          ? user?.company?.Vendor?.find((ven) => ven.id === item?.vendor)?.name
          : "-",
        item?.nhachinh
          ? user?.company?.Vendor?.find((ven) => ven.id === item?.nhachinh)
              ?.name
          : "-",
        item?.congty_danglam
          ? user?.company?.Customer?.find(
              (ven) => ven.id === item?.congty_danglam
            )?.name
          : "-",
        item?.ngay_phongvan,
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
  const filteredData = data.filter(
    (item) =>
      `${item?.ho_ten}${item?.ma_nhanvien}`
        ?.toLowerCase()
        .includes(filterText?.toLowerCase()) &&
      (filterOption?.working !== 0
        ? filterOption?.working === "working"
          ? item?.congty_danglam !== null
          : filterOption?.working === "notworking"
          ? item?.congty_danglam === null
          : false
        : true) &&
      (filterOption?.company !== 0
        ? item.congty_danglam === filterOption?.company
        : true)
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
            className="w-40 !h-[40px]"
            placeholder="Trạng thái"
            value={filterOption?.working || 0}
            onChange={(e) => setFilterOption((old) => ({ ...old, working: e }))}
          >
            <Select.Option value={0}>Tất cả ({data?.length})</Select.Option>
            <Select.Option value="working">
              Đang đi làm (
              {data?.filter((d) => d.congty_danglam !== null)?.length})
            </Select.Option>
            <Select.Option value="notworking">
              Chưa đi làm (
              {data?.filter((d) => d.congty_danglam === null)?.length})
            </Select.Option>
          </Select>
          <Select
            className="w-40 !h-[40px]"
            placeholder="Công ty"
            value={filterOption?.company || 0}
            onChange={(e) => setFilterOption((old) => ({ ...old, company: e }))}
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
            showSearch
            options={[
              {
                value: 0,
                label: "Tất cả công ty",
              },
              ...user?.company?.Customer?.map((dpm) => ({
                value: dpm?.id,
                label: `${dpm?.name} (${
                  data?.filter((d) => d.congty_danglam === dpm.id)?.length
                })`,
              })),
            ]}
          />
          <Tooltip
            title={
              <div className="flex items-start flex-col gap-1.5 min-w-[120px] p-2">
                <div className="text-[#000] mb-2">Chọn kiểu dữ liệu</div>
                <div className="flex flex-col gap-1.5 ml-2">
                  <Button
                    icon={
                      <PiMicrosoftExcelLogoFill size={20} className="mt-1" />
                    }
                    type="primary"
                    className="!h-[40px]"
                    onClick={handleExport}
                  >
                    Danh sách hiện tại
                  </Button>
                  <Export_op_history>
                    <Button
                      icon={
                        <PiMicrosoftExcelLogoFill size={20} className="mt-1" />
                      }
                      type="primary"
                      className="!h-[40px]"
                    >
                      Kèm lịch sử làm việc
                    </Button>
                  </Export_op_history>
                </div>
              </div>
            }
            color="white"
          >
            <div className="flex ml-auto items-center p-2 bg-[#007add] text-[white] px-4 rounded-[8px] gap-2">
              <PiMicrosoftExcelLogoFill size={20} />
              Xuất Excel
            </div>
          </Tooltip>
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
        pagination={{ pageSize: 20, showSizeChanger: false }}
      />
    </div>
  );
};

export default List_operators;
