import { Button, message, Tooltip } from "antd";
import React, { useState } from "react";
import { FaDownload, FaSave, FaUpload, FaUserClock } from "react-icons/fa";
import * as XLSX from "xlsx";
import { useUser } from "../../../components/context/userContext";
import { TbAlertTriangleFilled } from "react-icons/tb";
import dayjs from "dayjs";
import app from "../../../components/app";
import { FaCircleCheck, FaCircleXmark, FaXmark } from "react-icons/fa6";
import api from "../../../components/api";

const Operator_worked_report = () => {
  const { user, setUser } = useUser();
  const [listUser, setListUser] = useState([]);
  const handleDownloadTemplate = () => {
    const headers = [
      [
        "STT",
        "Số CCCD",
        "Công ty (viết tắt)",
        "Nhà chính (viết tắt)",
        "Tên đi làm",
        "Mã nhân viên (tại công ty)",
        "Công việc chính (công đoạn)",
        "Ngày bắt đầu",
        "Thời nghỉ việc",
      ],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    const worksheet2 = XLSX.utils.aoa_to_sheet([
      ["Tên viết tắt", "Tên đầy đủ", "Địa chỉ"],
      ...user?.company?.Customer?.map((cpn) => [
        cpn.name,
        cpn.fullname,
        cpn.address,
      ]),
    ]);
    const worksheet3 = XLSX.utils.aoa_to_sheet([
      ["Tên viết tắt", "Tên đầy đủ", "Địa chỉ"],
      ...user?.company?.Vendor?.map((cpn) => [
        cpn.name,
        cpn.fullname,
        cpn.address,
      ]),
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "NLD");
    XLSX.utils.book_append_sheet(workbook, worksheet2, "DS Công ty");
    XLSX.utils.book_append_sheet(workbook, worksheet3, "DS Nhà chính");
    XLSX.writeFile(workbook, "File_mẫu_Lịch_sử_đi_làm.xlsx");
  };
  const handleSave = () => {
    console.log(listUser);
    api
      .post(`ops/add_lichsu/`, { data: listUser }, user?.token)
      .then((res) => {
        setListUser((old) =>
          old.map((op) => ({
            ...op,
            error_des: res?.fail?.find(
              (item) => item.so_cccd == op.cccd && item.congty == op.congty
            )?.error,
            is_save: res?.success?.find((item) => item.so_cccd == op.cccd)
              ? true
              : false,
            is_error: res?.fail?.find(
              (item) => item.so_cccd == op.cccd && item.congty == op.congty
            )
              ? true
              : false,
          }))
        );
        message.warning("Đã cập nhập!");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleImportExcel = (e) => {
    setListUser([]);
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
      if (data.length > 0) {
        if (data[0]?.["Số CCCD"]) {
          const newUsers = data
            .filter((row) => row["Số CCCD"] !== "")
            .map((row, idx) => ({
              id: idx,
              cccd: row["Số CCCD"] || null,
              congty: row["Công ty (viết tắt)"]
                ? user?.company?.Customer?.find(
                    (cpn) => cpn.name === row["Công ty (viết tắt)"]
                  )?.name || "Không hợp lệ"
                : null,
              nhachinh: row["Nhà chính (viết tắt)"]
                ? user?.company?.Customer?.find(
                    (cpn) => cpn.name === row["Nhà chính (viết tắt)"]
                  )?.name || "Không hợp lệ"
                : null,
              fullname: row["Tên đi làm"] || null,
              manhanvien: row["Mã nhân viên (tại công ty)"] || null,
              start: row["Ngày bắt đầu"]
                ? dayjs(app.excelDateToJSDate(row["Ngày bắt đầu"])).format(
                    "YYYY-MM-DD"
                  )
                : null,
              end: row["Thời nghỉ việc"]
                ? dayjs(app.excelDateToJSDate(row["Thời nghỉ việc"])).format(
                    "YYYY-MM-DD"
                  )
                : null,
              congviec: row["Công việc chính (công đoạn)"] || null,
              is_save: false,
              is_match:
                user?.info?.Operator?.find(
                  (op) => op.so_cccd == row["Số CCCD"]
                ) &&
                user?.company?.Customer?.find(
                  (cpn) => cpn.name === row["Công ty (viết tắt)"]
                )?.name
                  ? true
                  : false,
            }));
          setListUser(newUsers);
          e.target.value = "";
        } else {
          message.error("Định dạng không khớp!");
        }
      } else {
        message.error("Không có dữ liệu để import!");
      }
    };
    reader.readAsBinaryString(file);
  };
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{<FaUserClock />}</div>
          Cập nhập lịch sử đi làm
        </div>
      </div>
      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop overflow-hidden">
        <div className="flex whitebox min-w-[600px] !shadow-none !p-0 text-[#d84f00] border-[#d84f00] border-1">
          <div className="icon p-3 border-r-1">
            <TbAlertTriangleFilled />
          </div>
          <div className="flex items-center p-2">
            Chỉ cập nhập được lịch sử cho những người lao động nằm trong danh
            sách của bạn
          </div>
        </div>
        <div className="whitebox h-full flex flex-col !p-0 !rounded-[4px]">
          <div className="flex p-2 border-b-1 border-[#0003] gap-2">
            <Button icon={<FaDownload />} onClick={handleDownloadTemplate}>
              Tải Excel mẫu
            </Button>
            <>
              <input
                type="file"
                id="import-excel"
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                onChange={handleImportExcel}
              />
              <label htmlFor="import-excel" className="btn">
                <FaUpload />
                Nhập từ Excel
              </label>
            </>
            <div className="ml-auto flex gap-2">
              {listUser?.length > 0 &&
              listUser?.filter((op) => op.is_save === false).length > 0 ? (
                <Button type="primary" icon={<FaSave />} onClick={handleSave}>
                  Lưu lại (
                  {listUser?.filter((op) => op.is_save === false).length})
                </Button>
              ) : (
                <></>
              )}
            </div>
          </div>
          {listUser.length > 0 ? (
            <div className="items mt-2 h-full overflow-auto fadeInTop">
              <table className="table_list">
                <thead>
                  <tr>
                    <th className="!text-center">STT</th>
                    <th>Số CCCD</th>
                    <th>Công ty</th>
                    <th>Nhà chính</th>
                    <th>Tên đi làm</th>
                    <th>Mã nhân viên</th>
                    <th>Ngày đi làm</th>
                    <th>Ngày nghỉ làm</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {listUser.map((item) => {
                    const find = user?.info?.Operator?.find(
                      (op) => op.so_cccd == item.cccd
                    );
                    return (
                      <tr key={item.id}>
                        <td className="text-center font-[500]">
                          {item.id + 1}
                        </td>
                        <td className="">{item.cccd}</td>
                        <td className="">{item.congty}</td>
                        <td className="">{item.nhachinh || "-"}</td>
                        <td className="">{item.fullname || find?.ho_ten}</td>
                        <td className="">{item.manhanvien || "-"}</td>
                        <td className="">{item.start}</td>
                        <td className="">{item.end}</td>
                        <td className="text-[15px] font-[500]">
                          {item?.is_error ? (
                            <Tooltip title={item?.error_des || false}>
                              <div className="text-[red]">
                                <FaCircleXmark />
                              </div>
                            </Tooltip>
                          ) : item.is_match ? (
                            <Tooltip title="Người lao động hợp lệ">
                              <div
                                className={`${
                                  item.is_save
                                    ? "text-[#21a300]"
                                    : "text-[#a7a7a7]"
                                }`}
                              >
                                <FaCircleCheck />
                              </div>
                            </Tooltip>
                          ) : (
                            <div className="text-[red]">
                              <FaCircleXmark />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-1 p-8 items-center justify-center">
              Tải lên Excel file để hiển thị danh sách cập nhập
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Operator_worked_report;
