import React, { useState } from "react";
import { Modal, Table, Button } from "antd";
import * as XLSX from "xlsx";
import api from "../api";
import { useUser } from "../context/userContext";
import dayjs from "dayjs";

const Export_op_history = ({ children }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const fieldMap = {
    ma_nhanvien: "ID",
    ho_ten: "Họ tên",
    gioi_tinh: "Giới tính",
    so_cccd: "Số CCCD",
    ngaysinh: "Ngày sinh",
    h_customer: "Công ty",
    h_ho_ten: "Tên đi làm",
    h_ma_nhanvien: "Mã nhân viên đi làm",
    h_so_cccd: "Số CCCD đi làm",
    h_nguoituyen: "Người tuyển",
    h_start_date: "Ngày vào làm",
    h_end_date: "Ngày nghỉ",
    h_reason: "Lý do nghỉ",
    h_vitri: "Công việc",
  };
  const handleExportHistory = () => {
    setVisible(true);
    setData([]);
    setLoading(true);
    api
      .get("/ops/export_history/", user?.token)
      .then((res) => {
        const merged = res
          .map((item) => {
            const otherFields = { ...item };
            delete otherFields.work;
            return (item.work || []).map((workItem) => {
              const newWork = {};
              Object.entries(workItem).forEach(([key, value]) => {
                newWork[`h_${key}`] = value;
              });
              return {
                ...otherFields,
                ...newWork,
              };
            });
          })
          .flat();
        const cleaned = merged.map((item) => {
          const result = {};
          Object.keys(fieldMap).forEach((key) => {
            if (key in item) {
              if (key === "h_nguoituyen") {
                const staff = user?.company?.Staff?.find(
                  (cp) => cp.id == (item[key] || item.nguoituyen)
                );
                result[fieldMap[key]] = staff?.profile?.full_name || "";
              } else if (key === "h_customer") {
                const cust = user?.company?.Customer?.find(
                  (cp) => cp.id == item[key]
                );
                result[fieldMap[key]] = cust?.name || "";
              } else {
                result[fieldMap[key]] = item[key];
              }
            }
          });
          return result;
        });
        setData(cleaned || []);
      })
      .finally(() => setLoading(false));
  };

  const handleDownload = () => {
    const dateKeys = ["Ngày sinh", "Ngày vào làm", "Ngày nghỉ"]; // tên tiêu đề cột
    const formattedData = data.map((row) => {
      const newRow = { ...row };
      dateKeys.forEach((key) => {
        const value = newRow[key];
        if (!value) return;
        let parsedDate = null;
        if (value?.includes("-")) {
          const temp = new Date(value);
          if (!isNaN(temp)) {
            parsedDate = temp;
          }
        }
        if (parsedDate instanceof Date && !isNaN(parsedDate)) {
          newRow[key] = parsedDate;
        }
      });
      return newRow;
    });
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const colLetter = XLSX.utils.encode_col(C);
      const colName = Object.keys(formattedData[0])[C];
      if (!dateKeys.includes(colName)) continue;
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        const cellAddress = `${colLetter}${R + 1}`;
        const cell = ws[cellAddress];
        if (cell && cell.v instanceof Date) {
          cell.t = "d"; // kiểu date
          cell.z = "mm/dd/yyyy"; // định dạng hiển thị
        }
      }
    }
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "History");
    XLSX.writeFile(wb, "op_history.xlsx");
    setVisible(false);
  };

  return (
    <>
      <div onClick={handleExportHistory} style={{ cursor: "pointer" }}>
        {children}
      </div>

      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>
            Đóng
          </Button>,
          <Button key="download" type="primary" onClick={handleDownload}>
            Lưu Excel
          </Button>,
        ]}
        width={1000}
        title="Xem trước dữ liệu xuất Excel"
        className="popupcontent !top-10"
      >
        <Table
          dataSource={data}
          loading={loading}
          columns={Object.keys(fieldMap).map((key) => {
            const column = {
              title: fieldMap[key],
              dataIndex: fieldMap[key],
              key,
            };
            return column;
          })}
          rowKey={(record, idx) => idx}
          pagination={{ pageSize: 15 }}
          scroll={{ x: "max-content" }}
          className="ant-mini"
        />
      </Modal>
    </>
  );
};

export default Export_op_history;
