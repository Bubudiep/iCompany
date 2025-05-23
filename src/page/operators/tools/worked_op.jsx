import { Button } from "antd";
import React from "react";
import { FaDownload, FaUpload, FaUserClock } from "react-icons/fa";
import * as XLSX from "xlsx";

const Operator_worked_report = () => {
  const handleDownloadTemplate = () => {
    const headers = [
      [
        "STT",
        "Mã nhân viên (trên hệ thống)",
        "Công ty (viết tắt)",
        "Tên đi làm",
        "Mã nhân viên (tại công ty)",
        "Công việc chính (công đoạn)",
        "Ngày bắt đầu",
        "Thời nghỉ việc",
      ],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "NLD");
    XLSX.writeFile(workbook, "File_mẫu_Lịch_sử_đi_làm.xlsx");
  };
  const handleImportExcel = () => {};
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{<FaUserClock />}</div>
          Cập nhập lịch sử đi làm
        </div>
      </div>
      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop overflow-hidden">
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
            <div className="ml-auto flex gap-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operator_worked_report;
