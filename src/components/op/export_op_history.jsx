import React, { useState } from "react";
import { Modal, Table, Button } from "antd";
import * as XLSX from "xlsx";
import api from "../api";
import { useUser } from "../context/userContext";

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
              } else if (key === "h_start_date" || key === "h_end_date") {
                result[fieldMap[key]] = item[key]
                  ? new Date(item[key]).toLocaleDateString("vi-VN")
                  : "-";
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
    const ws = XLSX.utils.json_to_sheet(data);
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
            if (key === "h_nguoituyen") {
              column.render = (text, rc) =>
                text
                  ? user?.company?.Staff?.find((cp) => cp.id === text)?.profile
                      ?.full_name
                  : user?.company?.Staff?.find((cp) => cp.id === rc?.nguoituyen)
                      ?.profile?.full_name;
            }
            if (key === "h_customer") {
              column.render = (text) =>
                user?.company?.Customer?.find((cp) => cp.id === text)?.name;
            }
            if (key === "h_start_date" || key === "h_end_date") {
              column.render = (text) =>
                text ? new Date(text).toLocaleDateString("vi-VN") : "-";
            }
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
