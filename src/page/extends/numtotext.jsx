import { InputNumber, Button, message, Tooltip } from "antd";
import React, { useState } from "react";
import { BsFillChatTextFill } from "react-icons/bs";
import { CopyOutlined } from "@ant-design/icons";
import { values } from "lodash";

const numberToWords = (num) => {
  if (num === 0) return "không đồng";

  const ones = [
    "",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const tens = [
    "",
    "",
    "hai mươi",
    "ba mươi",
    "bốn mươi",
    "năm mươi",
    "sáu mươi",
    "bảy mươi",
    "tám mươi",
    "chín mươi",
  ];
  const units = [
    "",
    "nghìn",
    "triệu",
    "tỷ",
    "nghìn tỷ",
    "triệu tỷ",
    "tỷ tỷ",
    "nghìn tỷ tỷ",
    "vạn tỷ",
  ];

  let words = [];
  let unitIndex = 0;

  while (num > 0) {
    let chunk = num % 1000;
    if (chunk > 0) {
      let chunkWords = [];
      let hundred = Math.floor(chunk / 100);
      let ten = Math.floor((chunk % 100) / 10);
      let one = chunk % 10;

      if (hundred > 0) chunkWords.push(ones[hundred], "trăm");
      if (ten > 1) {
        chunkWords.push(tens[ten]);
        if (one > 0) chunkWords.push(ones[one]);
      } else if (ten === 1) {
        chunkWords.push("mười");
        if (one > 0) chunkWords.push(ones[one]);
      } else if (one > 0) {
        chunkWords.push(ones[one]);
      }

      chunkWords.push(units[unitIndex] || "");
      words.unshift(chunkWords.join(" "));
    }
    num = Math.floor(num / 1000);
    unitIndex++;
  }

  return words.join(" ").replace(/\s+/g, " ").trim() + " đồng";
};

// helpers
const toSentenceCase = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const toTitleCase = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const toUpperCase = (str) => str.toUpperCase();

const Numtotext = () => {
  const [amount, setAmount] = useState(16541645598);
  const text = numberToWords(amount);

  const lines = [
    text, // thường
    toSentenceCase(text), // hoa chữ đầu câu
    toTitleCase(text), // hoa chữ đầu mỗi từ
    toUpperCase(text), // hoa hết
  ];

  const copyToClipboard = (str) => {
    navigator.clipboard.writeText(str).then(() => {
      message.success("Đã copy vào clipboard!");
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-3">
          <div className="icon text-[20px]">
            <BsFillChatTextFill />
          </div>
          Số tiền sang dạng chữ
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col p-2 gap-3">
          <div className="flex font-[500] text-[15px] items-center gap-2 px-3 rounded-[8px] shadow bg-[white] p-2">
            Nhập số tiền
            <InputNumber
              step={10000}
              className="!w-[240px] !text-[15px]"
              placeholder="Nhập số tiền..."
              value={amount}
              autoFocus
              formatter={(value) =>
                value
                  ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : ""
              }
              parser={(value) => value.replace(/,/g, "")}
              onChange={(value) => setAmount(value || 0)}
            />
          </div>
          <div className="flex flex-col mt-3 pl-6">
            {amount > 0 && (
              <div className="flex flex-col gap-2">
                {lines.map((line, idx) => (
                  <Tooltip title="Click để coppy" placement="topLeft">
                    <div
                      key={idx}
                      onClick={() => copyToClipboard(line)}
                      className="flex items-center gap-2 hover:text-[#07f] cursor-pointer 
                    transition-all duration-300 bg-gray-50 px-2 py-1 rounded"
                    >
                      <div className="text-[12px] p-1 text-[#999]">
                        <CopyOutlined />
                      </div>
                      <span>{line}</span>
                    </div>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Numtotext;
