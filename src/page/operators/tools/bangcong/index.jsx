import { Button, Empty, message, Table } from "antd";
import React, { useState } from "react";
import { FaDownload, FaUpload } from "react-icons/fa";
import { RiHourglass2Fill } from "react-icons/ri";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import api from "../../../../components/api";
import app from "../../../../components/app";

const OP_giolamviec = () => {
  const handleDownloadTemplate = () => {
    const headers = [
      [
        "Mã NV",
        "Tên CTY",
        "Ngày làm việc",
        "Đến ngày",
        "HS-30",
        "HS-50",
        "HS-70",
        "HS-90",
        "HS-100",
        "HS-150",
        "HS-200",
        "HS-300",
        "HS-400",
      ],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "NLD");
    XLSX.writeFile(workbook, "File_mẫu_giờ_làm_việc.xlsx");
  };
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
      const cols = Object.keys(data[0]).map((key) => ({
        title: key,
        dataIndex: key,
        key,
      }));
      const dataWithKeys = data.map((row, index) => ({
        key: index,
        ...row,
        "Ngày làm việc":
          row["Ngày làm việc"] &&
          dayjs(app.excelDateToJSDate(row["Ngày làm việc"])).format(
            "YYYY-MM-DD"
          ),
        "Đến ngày":
          row["Đến ngày"] &&
          dayjs(app.excelDateToJSDate(row["Đến ngày"])).format("YYYY-MM-DD"),
      }));
      if (data.length) {
        const keys = Object.keys(data[0]);
        const dynamicColumns = keys.map((key, index) => ({
          title: key,
          dataIndex: key,
          key,
          className: index >= 4 ? "non-fixed-column" : "",
          fixed: index < 4 ? "left" : false,
        }));
        const totalColumn = {
          title: "Tổng (100%)",
          key: "total",
          fixed: "right",
          width: 120,
          render: (_, record) => {
            const sum = keys.reduce((acc, key) => {
              let val = 0;
              if (key.startsWith("HS-")) {
                const hs = parseInt(key.replace("HS-", ""));
                val = parseFloat((record[key] * hs) / 100);
              }
              return acc + (isNaN(val) ? 0 : val);
            }, 0);
            return sum.toFixed(2);
          },
        };
        const finalColumns = [...dynamicColumns, totalColumn];
        setColumns(finalColumns);
        setDataSource(dataWithKeys);
      } else {
        message.warning("Không có dữ liệu");
      }
      e.target.value = null;
    };
    reader.readAsArrayBuffer(file);
    return false;
  };
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{<RiHourglass2Fill />}</div>
          Báo cáo giờ làm việc
        </div>
      </div>
      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop overflow-hidden">
        <div className="flex p-2 gap-2 justify-center w-full">
          <Button
            icon={<FaDownload />}
            onClick={handleDownloadTemplate}
            className="!p-8"
          >
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
            <label htmlFor="import-excel" className="btn bg-white !px-8">
              <FaUpload />
              Nhập từ Excel
            </label>
          </>
        </div>
        {dataSource.length > 0 ? (
          <div className="whitebox">
            <Table
              columns={columns}
              dataSource={dataSource}
              bordered
              size="middle"
              className="ant-mini"
              scroll={{ x: "max-content" }}
            />
          </div>
        ) : (
          <div className="whitebox flex flex-col !p-2 !rounded-[4px] text-[13px]">
            <div className="flex font-[700]">Lưu ý:</div>
            <ul className="ml-5">
              <li>
                <a className="font-[600]">Mã NV</a>: là mã nhân viên của công ty
                mình
              </li>
              <li>
                <a className="font-[600]">Tên CTY</a>: là công ty mà NLĐ đang
                làm việc hoặc đã làm việc
              </li>
              <li>
                <a className="font-[600]">Ngày làm việc</a>: Là ngày làm việc
              </li>
              <li>
                <a className="font-[600]">HS-XXX</a>: XXX là hệ số tính % lương
                của giờ làm việc (VD: HS-100 là hệ số lương 100%)
              </li>
              <li>
                <a className="font-[600]">Đến ngày</a>: Trong trường hợp là tổng
                số ngày từ ngày làm việc A đến ngày làm việc B thì điền, bằng
                không thì để trống
              </li>
              <li>
                <a className="font-[600]">Ví dụ 1</a>: Nhân viên NLD-00001 đi
                làm tại công ty Compal ngày 20-5-2025, số giờ làm việc 100%
                lương cơ bản là 8h, tăng ca 150% là 3h thì:
                <table className="demo my-1 ml-5">
                  <thead>
                    <tr>
                      <th>Mã NV</th>
                      <th>Tên CTY</th>
                      <th>Ngày làm việc</th>
                      <th>Đến ngày</th>
                      <th>HS-100</th>
                      <th>HS-150</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>NLD-00001</td>
                      <td>Compal</td>
                      <td>20-05-2025</td>
                      <td></td>
                      <td>8</td>
                      <td>3</td>
                    </tr>
                  </tbody>
                </table>
              </li>
              <li>
                <a className="font-[600]">Ví dụ 2</a>: nhân viên NLD-00001 đi
                làm tại công ty Compal từ ngày 20-5-2025 đến 30-5-2025, số giờ
                làm việc 100% lương cơ bản là đạt được tổng dải ngày đấy là 80h,
                tăng ca 150% là 30h thì:
                <table className="demo my-1 ml-5">
                  <thead>
                    <tr>
                      <th>Mã NV</th>
                      <th>Tên CTY</th>
                      <th>Ngày làm việc</th>
                      <th>Đến ngày</th>
                      <th>HS-100</th>
                      <th>HS-150</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>NLD-00001</td>
                      <td>Compal</td>
                      <td>20-05-2025</td>
                      <td>30-05-2025</td>
                      <td>80</td>
                      <td>30</td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OP_giolamviec;
