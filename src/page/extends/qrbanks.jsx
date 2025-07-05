import React, { useEffect, useState } from "react";
import { useUser } from "../../components/context/userContext";
import QrCodeComponent from "../../components/qc_code";
import {
  Input,
  InputNumber,
  Select,
  Typography,
  Divider,
  Empty,
  Button,
  Upload,
  message,
} from "antd";
import qrcode from "../../components/qrcode";
import app from "../../components/app";
const { Title } = Typography;
import * as XLSX from "xlsx";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
const QR_banks = () => {
  const { user } = useUser();
  const [qrString, setQrString] = useState(null);
  const [bankCode, setBankCode] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [comment, setComment] = useState("Chuyen tien");
  const [amount, setAmount] = useState(null);
  const [multipleQR, setMultipleQR] = useState([]);
  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setMultipleQR(jsonData);
      message.success("Tải file thành công!");
    };
    reader.readAsArrayBuffer(file);
    return false; // Ngăn AntD tự upload
  };
  const downloadSampleExcel = () => {
    const sampleData = [
      {
        "Chủ tài khoản": "Nguyen Van A",
        "Số tài khoản": "0123456789",
        "Ngân hàng (BIN)": "970418",
        "Số tiền": 500000,
        "Nội dung": "Thanh toan hoa don",
      },
    ];
    const danhSachSheet = XLSX.utils.json_to_sheet(sampleData);
    const bankList =
      user?.banks?.data?.map((bank) => ({
        BIN: bank.bin,
        CODE: bank.code,
        shortName: bank.shortName,
        name: bank.name,
      })) || [];
    const bankSheet = XLSX.utils.json_to_sheet(bankList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, danhSachSheet, "Danh sách");
    XLSX.utils.book_append_sheet(workbook, bankSheet, "DS_BANK");
    XLSX.writeFile(workbook, "mau_chuyen_khoan.xlsx");
  };

  useEffect(() => {
    if (accountNumber && amount && bankCode && comment) {
      const banktoQR = qrcode.BankQR(accountNumber, bankCode, amount, comment);
      setQrString(banktoQR);
    }
  }, [accountNumber, bankCode, amount, comment]);
  return (
    <div className="flex flex-1 flex-col items-center p-4 fadeInTop gap-2">
      <div className="flex w-full max-w-[800px]">
        <div className="flex gap-2 ml-auto items-center">
          <Button
            icon={<DownloadOutlined />}
            onClick={downloadSampleExcel}
            type="primary"
          >
            Tải file mẫu
          </Button>
          <Upload
            beforeUpload={handleUpload}
            accept=".xlsx,.xls"
            className="flex gap-1"
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Tải lên file Excel</Button>
          </Upload>
        </div>
      </div>
      {multipleQR.length > 0 ? (
        <div className="flex flex-1 items-center justify-center gap-2">
          <Empty description="Chức năng đang được tối ưu lại" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-[800px] space-y-6">
          <Title level={4} className="text-center">
            Tạo mã QR ngân hàng
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Chủ tài khoản</label>
              <Input
                placeholder="Nhập tên chủ tài khoản"
                value={accountName}
                onChange={(e) => {
                  setAccountName(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Số tài khoản</label>
              <Input
                placeholder="Nhập số tài khoản"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Số tiền</label>
              <InputNumber
                placeholder="Nhập số tiền"
                suffix="VNĐ"
                className="!w-full"
                step={100000}
                max={900000000}
                min={0}
                value={amount}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                onChange={(val) => setAmount(val)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Ngân hàng</label>
              <Select
                placeholder="Chọn ngân hàng"
                options={user?.banks?.data?.map((i) => ({
                  value: i.bin,
                  label: (
                    <div className="flex items-center gap-2 py-0.5">
                      <img src={i.logo} className="h-4" />[{i.code}]{" "}
                      {i.shortName} - {i.name}
                    </div>
                  ),
                  search: `${i.code} ${i.shortName} ${i.name}`,
                }))}
                showSearch
                value={bankCode}
                onChange={(val) => setBankCode(val)}
                filterOption={(input, option) =>
                  (option?.search ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">
              Nội dung chuyển khoản
            </label>
            <Input
              placeholder="Nhập nội dung chuyển khoản"
              value={comment}
              onChange={(e) => setComment(app.removeSpecial(e.target.value))}
            />
          </div>
          <Divider />
          <div className="flex justify-center">
            <div className="borderrounded-md p-4">
              {accountNumber && amount && bankCode && comment ? (
                <QrCodeComponent
                  width={180}
                  height={180}
                  color="#000"
                  data={qrString || ""}
                  image={user?.info?.profile?.avatar_base64}
                />
              ) : (
                <Empty description="Chưa nhập đủ thông tin" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QR_banks;
