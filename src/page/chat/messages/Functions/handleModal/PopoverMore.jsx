import React from "react";
import { Popover } from "antd";

const PopoverMore = ({ onAction = handleAction, children }) => {
  const ACTIONS = {
    "Bỏ ghim hội thoại": () => console.log("Bỏ ghim"),
    "Chuyển sang mục Khác": () => console.log("Chuyển mục"),
    "Phân loại": () => console.log("Phân loại hội thoại"),
    "Đánh dấu đã/chưa đọc": () => console.log("Toggle read/unread"),
    "Bật/Tắt thông báo": () => console.log("Toggle notifications"),
    "Ẩn trò chuyện": () => console.log("Ẩn chat"),
    "Tin nhắn tự xóa": () => console.log("Tin nhắn tự xóa"),
    "Xóa hội thoại": () => console.log("Xóa hội thoại"),
    "Báo xấu": () => console.log("Báo cáo xấu"),
  };

  function handleAction(item) {
    const action = ACTIONS[item];
    if (action) {
      action();
    } else {
      console.log("Hành động chưa định nghĩa:", item);
    }
  }

  return (
    <Popover
      content={
        <div className="flex flex-col">
          {Object.keys(ACTIONS).map((item, index) => (
            <button
              key={index}
              className={`text-left py-2 px-4 hover:bg-gray-100 rounded flex items-center ${
                item === "Xóa hội thoại" ? "text-red-500" : "text-gray-700"
              }`}
              onClick={() => onAction(item)}
            >
              {item}
            </button>
          ))}
        </div>
      }
      trigger="click"
      placement="bottomLeft"
    >
      {children}
    </Popover>
  );
};

export default PopoverMore;
