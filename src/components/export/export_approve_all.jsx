import React, { useState } from "react";
import { useUser } from "../context/userContext";
import { Button, Modal, Table } from "antd";
import api from "../api";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

const Export_approve_all = ({ children, option = "all" }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const fieldMap = {
    request_code: "ID",
    requesttype: "Phân loại",
    status_display: "Trạng thái",
    amount: "$ yêu cầu",
    payment_status_display: "Giải ngân",
    payout_amount: "$ giải ngân",
    retrieve_status_display: "Thu hồi",
    requester: "Người tạo",
    operator: "Người lao động",
    hinhthucThanhtoan_display: "Hình thức thanh toán",
    nguoiThuhuong_display: "Người thụ hưởng",
    created_at: "Ngày tạo",
  };
  const handleExportHistory = () => {
    setVisible(true);
    setData([]);
    setLoading(true);
    let link = "/approve/?page_size=9999";
    if (option === "pending") {
      link = "/approve/?page_size=9999&is_pending=1";
    }
    if (option === "complete") {
      link = "/approve/?page_size=9999&payout=done";
    }
    if (option === "rejected") {
      link = "/approve/?page_size=9999&status=rejected";
    }
    api
      .get(link, user?.token)
      .then((res) => {
        const cleaned = res?.results?.map((item) => {
          const result = {};
          Object.keys(fieldMap).forEach((key) => {
            if (key in item) {
              if (key === "requester") {
                const staff = user?.company?.Staff?.find(
                  (cp) => cp.id == (item[key] || item.nguoituyen)
                );
                result[fieldMap[key]] = staff?.profile?.full_name || "";
              } else if (key === "created_at") {
                result[fieldMap[key]] = dayjs(item[key]).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              } else if (key === "operator") {
                const staff = user?.company?.Operator?.find(
                  (cp) => cp.id == item[key]
                );
                result[fieldMap[key]] = staff?.ho_ten || "";
              } else if (key === "amount" || key === "payout_amount") {
                result[fieldMap[key]] = parseInt(item[key]);
              } else if (key === "khacNganhang") {
                result[fieldMap[key]] = user?.banks?.data?.find(
                  (bank) => bank?.bin == item[key]
                )?.shortName;
              } else if (
                key === "nguoiThuhuong_display" &&
                item[key] === "Người khác"
              ) {
                const bankname = user?.banks?.data?.find(
                  (bank) => bank?.bin == item["khacNganhang"]
                )?.shortName;
                result[
                  fieldMap[key]
                ] = `${item["khacCtk"]} (${item["khacStk"]}-${bankname})`;
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
    XLSX.writeFile(wb, `export_pheduyet_${option}.xlsx`);
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

export default Export_approve_all;
