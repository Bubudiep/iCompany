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
  Tooltip,
} from "antd";
import qrcode from "../../components/qrcode";
import app from "../../components/app";
const { Title } = Typography;
import * as XLSX from "xlsx";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { FaQrcode } from "react-icons/fa";
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
    <div className="flex flex-1 flex-col gap-2">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-3">
          <div className="icon text-[20px]">
            <FaQrcode />
          </div>
          Tạo QR ngân hàng
        </div>
        <div className="flex gap-2 ml-auto items-center">
          <Tooltip
            color="white"
            title={
              <div className="flex flex-col gap-1 text-[#000]">
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
            }
            trigger="click"
          >
            <div
              className="text-[13px] border-1 p-2 border-[#999] rounded-[6px] px-3
            text-[#999] cursor-pointer transition-all duration-300
              hover:text-[#007dd1] hover:border-[#007dd1]"
            >
              Tạo hàng loạt
            </div>
          </Tooltip>
        </div>
      </div>
      {multipleQR.length > 0 ? (
        <div className="flex flex-1 items-center justify-center gap-2">
          <Empty description="Chức năng đang được tối ưu lại" />
        </div>
      ) : (
        <div className="flex flex-1 p-2 justify-center items-start fadeInTop">
          <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-[800px] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">
                  Chủ tài khoản
                </label>
                <Input
                  placeholder="Nhập tên chủ tài khoản"
                  value={accountName}
                  onChange={(e) => {
                    setAccountName(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">
                  Số tài khoản
                </label>
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
            <div className="flex flex-col items-center justify-center">
              {accountNumber && amount && bankCode && comment ? (
                <>
                  <div className="text-[#5f5f5f]">
                    {bankCode && (
                      <img
                        src={
                          user?.banks?.data?.find((i) => i.bin === bankCode)
                            ?.logo
                        }
                        className="h-12"
                      />
                    )}
                  </div>
                  <QrCodeComponent
                    width={180}
                    height={180}
                    color="#1b2e47"
                    data={qrString || ""}
                    image={user?.info?.profile?.avatar_base64 || false}
                  />
                  <div className="text-center text-[#1b2e47] text-[15px] font-[700]">
                    {accountName}
                  </div>
                  <div className="text-center text-[#006eff] text-[13px] font-[500]">
                    {amount?.toLocaleString()} VNĐ
                  </div>
                  <div className="text-[#5f5f5f]">
                    {bankCode &&
                      user?.banks?.data?.find((i) => i.bin === bankCode)?.name}
                  </div>
                </>
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
