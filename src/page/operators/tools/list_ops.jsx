import { Button, message, Modal, Popover, Select, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Link, useOutletContext } from "react-router-dom";
import api from "../../../components/api";
import { useUser } from "../../../components/context/userContext";
import app from "../../../components/app";
import { FaEllipsisH, FaTrash } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

const List_operators = () => {
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [listOP, setListOP] = useState([]);
  const [banks, setBanks] = useState([]);
  const [page, setPage] = useState({ total: 0, page_now: 1 });
  const filterOperators = () => {
    return listOP;
  };
  const handleDelete = (op) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Tất cả thông tin của người lao động này sẽ bị xóa!",
      onOk: () => {
        console.log(op);
        message.warning("Chưa được phép");
      },
    });
  };
  const handleExport = () => {};
  const getOP = () => {
    setLoading(true);
    api.get("/banks/").then((res) => {
      setBanks(res.data);
    });
    api
      .get("/ops/", user.token)
      .then((res) => {
        setListOP(res.results);
        setPage((old) => ({
          ...old,
          total: res.count,
        }));
      })
      .catch((e) => {
        console.log(e);
        message.error(
          e?.response?.data?.details ||
            "Phát sinh lỗi khi tải dữ liệu người lao động!"
        );
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getOP();
  }, []);
  return (
    <div className="overflow-hidden fadeInTop flex flex-col gap-2 flex-1 p-2 ">
      <div className="flex gap-2 whitebox overflow-hidden">
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
            <Select.Option value="resigned">Đã nghỉ việc</Select.Option>
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
      <div className="whitebox h-full flex flex-col overflow-hidden">
        <div className="flex gap-1">
          <div className="flex gap-2 items-center px-2 font-[500]">
            <div className="total">Tổng: {page.total}</div>
          </div>
        </div>
        <div className="items mt-2 h-full overflow-auto fadeInTop">
          {filterOperators().map((item) => (
            <div className="contact-item" key={item.id}>
              <Link
                to={`/app/operators/all/${item.id}`}
                className="flex items-center"
              >
                <div className="flex">
                  <div
                    className="avatar"
                    style={{
                      backgroundColor: item?.avatar
                        ? "transparent"
                        : app.getRandomColorFromString(
                            item?.profile?.full_name || "user"
                          ),
                    }}
                  >
                    {item?.avatar ? (
                      <img
                        src={item?.avatar}
                        className="w-full h-full object-cover rounded-[8px]"
                      />
                    ) : (
                      item?.ho_ten?.split(" ").pop()?.[0] || "?"
                    )}
                  </div>
                </div>
                <div className="flex flex-col flex-1 w-[180px] ml-3">
                  <div className="flex font-[500] text-[14px]">
                    {item?.ho_ten || "Chưa đặt tên"}
                  </div>
                  <div className="flex text-[13px] text-[#5f5f5f]">
                    {item?.ma_nhanvien}
                  </div>
                  <div className="flex text-[13px] text-[#5f5f5f]">
                    {item?.congty_danglam ?? "Chưa đi làm"}
                  </div>
                </div>
                <div className="block md:!max-w-[180px] md:!w-[180px] md:!ml-[0px]">
                  <div className="flex text-[13px]">
                    CCCD: {item?.so_cccd || "-"}
                  </div>
                  <div className="flex text-[13px] text-[#5f5f5f]">
                    Ngày sinh:{" "}
                    {item?.ngaysinh
                      ? new Date(item?.ngaysinh).toLocaleDateString()
                      : "-"}
                  </div>
                  <div
                    title={item?.quequan}
                    className="text-[13px] text-[#5f5f5f]"
                  >
                    {item?.quequan || "-"}
                  </div>
                </div>
                <div className="max-w-0 lg:!max-w-[180px] lg:!w-[180px] block">
                  <div className="flex text-[13px] text-[#5f5f5f]  text-nowrap">
                    Thâm niên: 0 ngày
                  </div>
                  <div className="flex text-[13px] text-[#5f5f5f]  text-nowrap">
                    Tổng công: 0 công
                  </div>
                  <div className="flex text-[13px] text-[#5f5f5f]  text-nowrap">
                    Ngày phỏng vấn: {item?.ngay_phongvan || "-"}
                  </div>
                </div>
                <div className="flex flex-col flex-1 ml-4 w-[180px]">
                  <div className="flex text-[13px] text-[#5f5f5f]">
                    Giữ lương: 0đ
                  </div>
                  <div className="flex text-[13px] text-[#5f5f5f]">
                    Đang ứng: 0đ
                  </div>
                  <div className="flex text-[13px] text-[#5f5f5f]">
                    {item?.ghichu || "-"}
                  </div>
                </div>
              </Link>
              <div className="flex items-center tools ml-auto mr-2 gap-2">
                <Popover
                  content={
                    <div className="flex flex-col items">
                      <div
                        onClick={() => handleDelete(item)}
                        className="item p-2 flex gap-2 items-center text-[#c22f2f] transition-all duration-300 hover:text-[#ff0000]"
                      >
                        <FaTrash />
                        Xóa
                      </div>
                    </div>
                  }
                  trigger="click"
                  placement="leftTop"
                >
                  <Button type="more">
                    <FaEllipsisH />
                  </Button>
                </Popover>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List_operators;
