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
import Card_bank_user from "../../components/cards/user-bank-card";
import { FaCircleCheck } from "react-icons/fa6";
const QR_banks = () => {
  const { user } = useUser();
  const [qrString, setQrString] = useState(null);
  const [bankCode, setBankCode] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [comment, setComment] = useState("Chuyen tien");
  const [amount, setAmount] = useState(null);
  const [seletedQR, setSeletedQR] = useState(null);
  const [multipleQR, setMultipleQR] = useState([]);
  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      console.log(jsonData);
      setMultipleQR(jsonData.map((d, i) => ({ ...d, id: i, done: false })));
      message.success("Tải file thành công!");
    };
    reader.readAsArrayBuffer(file);
    return false;
  };
  const downloadSampleExcel = () => {
    const sampleData = [
      {
        "Chủ tài khoản": "Nguyen Van A",
        "Số tài khoản": "0123456789",
        "Ngân hàng (CODE)": "ICB",
        "Ngân hàng (shortName)": "VietinBank",
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
    const handleKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const isEditable = e.target.isContentEditable;
      if (tag === "input" || tag === "textarea" || isEditable) return;
      if (seletedQR?.done) return;
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault(); // Ngăn cuộn trang

        if (multipleQR.length === 0) return;

        setMultipleQR((prevList) => {
          if (!seletedQR) {
            setSeletedQR(prevList[0]);
            return prevList;
          }

          const updatedList = prevList.map((item) =>
            item.id === seletedQR.id ? { ...item, done: true } : item
          );

          const currentIndex = updatedList.findIndex(
            (item) => item.id === seletedQR.id
          );
          const nextIndex = (currentIndex + 1) % updatedList.length;
          setSeletedQR(updatedList[nextIndex]);
          return updatedList;
        });
        message.success("Đã xong!!");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [multipleQR, seletedQR]);

  useEffect(() => {
    if (accountNumber && amount && bankCode && comment) {
      const banktoQR = qrcode.BankQR(accountNumber, bankCode, amount, comment);
      setQrString(banktoQR);
    }
  }, [accountNumber, bankCode, amount, comment]);
  return (
    <div className="flex flex-1 flex-col">
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
        <div className="flex flex-1 gap-2">
          <div className="flex flex-col bg-white border-r-1 border-[#0003] min-w-[400px] w-[400px] relative">
            {multipleQR.map((b) => {
              const bank =
                user?.banks?.data?.find(
                  (i) =>
                    i.code.toLowerCase() ==
                    b?.["Ngân hàng (CODE)"]?.toLowerCase()
                ) ||
                user?.banks?.data?.find(
                  (i) =>
                    i.shortName.toLowerCase() ==
                    b?.["Ngân hàng (shortName)"]?.toLowerCase()
                );
              return (
                <div
                  className={`flex items-center p-1 py-3 
                  hover:cursor-pointer 
                  hover:bg-[#dfe5f0] gap-1 
                  overflow-hidden border-[#779acf]
                  ${
                    seletedQR?.id === b.id
                      ? "border-l-2 bg-[#dfe5f0]"
                      : "border-l-0 "
                  }
                  ${b.done ? "!bg-[#bdf1c1] text-[#006d09]" : ""}
                  transition-colors duration-300`}
                  key={b.id}
                  onClick={() => setSeletedQR({ ...b, bank: bank?.bin })}
                >
                  <div className="flex flex-col">
                    <div className="flex">
                      <img src={bank?.logo} className="h-6" />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="text-nowrap">{b["Chủ tài khoản"]}</div>
                    <div className="flex text-nowrap">{b["Số tài khoản"]}</div>
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="text-nowrap">{b["Số tiền"]}</div>
                    <div className="text-nowrap overflow-ellipsis overflow-hidden">
                      {b["Nội dung"]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-1 items-start">
            {seletedQR ? (
              <div className="flex flex-1 flex-col py-2 gap-2">
                {seletedQR?.done && (
                  <div
                    className="text-[#00910c] text-[22px] p-5 flex items-center gap-2
                    bg-white shadow rounded-[8px] mr-2 font-[500]"
                  >
                    <FaCircleCheck /> Đã xong
                  </div>
                )}
                <Card_bank_user
                  user_type="other"
                  user_id={{
                    khacCtk: seletedQR["Chủ tài khoản"],
                    khacStk: seletedQR["Số tài khoản"],
                    khacNganhang: seletedQR["bank"],
                  }}
                  showQR={true}
                  show_logo={false}
                  sotien={seletedQR["Số tiền"]}
                  comment={seletedQR["Nội dung"]}
                  className="flex flex-1 mr-2"
                />
                {!seletedQR?.done && (
                  <div className="text-center mt-2 text-[18px] text-[#929cb4] italic">
                    Bấm dấu cách để đánh dấu là đã xong!
                  </div>
                )}
              </div>
            ) : (
              <Empty description="Chọn một" />
            )}
          </div>
        </div>
      ) : (
        <div className="flex bg-white  flex-1 gap-2 pt-2 justify-center items-start fadeInTop">
          <div className="p-6 w-full max-w-[500px] space-y-6 ">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex gap-1 items-center">
                <label className="font-medium w-36 text-gray-700">
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
              <div className="flex gap-1 items-center">
                <label className="font-medium w-36 text-gray-700">
                  Số tài khoản
                </label>
                <Input
                  placeholder="Nhập số tài khoản"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
              <div className="flex gap-1 items-center">
                <label className="!font-[500] text-gray-700 w-36">
                  Số tiền
                </label>
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
              <div className="flex gap-1 items-center">
                <label className="font-medium w-36 text-gray-700">
                  Ngân hàng
                </label>
                <Select
                  placeholder="Chọn ngân hàng"
                  options={user?.banks?.data?.map((i) => ({
                    value: i.bin,
                    label: (
                      <div className="flex items-center gap-2 py-0.5 overflow-ellipsis overflow-hidden">
                        <img src={i.logo} className="h-4" />[{i.code}]{" "}
                        {i.shortName} - {i.name}
                      </div>
                    ),
                    search: `${i.code} ${i.shortName} ${i.name}`,
                  }))}
                  className="max-w-[320px] w-full"
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
            <div className="flex gap-1 items-center">
              <label className="font-medium text-gray-700 w-36">
                Nội dung CK
              </label>
              <Input
                placeholder="Nhập nội dung chuyển khoản"
                value={comment}
                onChange={(e) => setComment(app.removeSpecial(e.target.value))}
              />
            </div>
          </div>
          <div className="flex w-[300px] p-4 h-full border-l border-l-[#0001] items-baseline">
            <div className="flex flex-col flex-1 items-center justify-center">
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
                    image={user?.info?.profile?.avatar_preview || false}
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
                <div className="flex flex-col mt-12">
                  <QrCodeComponent
                    width={180}
                    height={180}
                    color="#0003"
                    data={
                      location.href +
                      "/?share=true&data=true&from=qr_bank_function&blankk=false&data=null&user=1"
                    }
                  />
                  <div className="text-center text-[#0003] font-[500]">
                    Chưa có tông tin!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QR_banks;
