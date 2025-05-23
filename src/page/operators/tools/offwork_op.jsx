import { Button, Empty } from "antd";
import React from "react";
import { FaDownload, FaPlus, FaUpload, FaUserTimes } from "react-icons/fa";

const Operator_offwork_report = () => {
  const handleDownloadTemplate = () => {};
  const handleImportExcel = () => {};
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{<FaUserTimes />}</div>
          Báo cáo nghỉ làm
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
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col">
              <Empty description="Tính năng đang được phát triển" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operator_offwork_report;
