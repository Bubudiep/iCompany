import React, { useState } from "react";
import {
  FaSmile,
  FaPaperclip,
  FaMicrophone,
  FaImage,
  FaPaperPlane,
  FaEllipsisH,
} from "react-icons/fa";
import {
  Input,
  Tooltip,
  Button,
  Upload,
  message,
  Popover,
  Dropdown,
  Menu,
} from "antd";
import Picker from "emoji-picker-react"; // Thư viện chọn emoji

const MessageInput = ({ value, onChange, onSend, onKeyDown }) => {
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

  // Xử lý chọn emoji (cho phép chọn nhiều emoji)
  const handleEmojiClick = (emojiObject) => {
    const newMessage = value + emojiObject.emoji;
    onChange({ target: { value: newMessage } });
    // Không đóng bảng chọn emoji, cho phép chọn tiếp
  };

  // Xử lý upload file
  const handleFileUpload = (info) => {
    if (info.file.status === "done") {
      message.success(`File ${info.file.name} đã được chọn để gửi!`);
      // Bạn có thể thêm logic gửi file lên server ở đây
    } else if (info.file.status === "error") {
      message.error(`Không thể tải file ${info.file.name}.`);
    }
  };

  // Xử lý upload hình ảnh
  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      message.success(`Hình ảnh ${info.file.name} đã được chọn để gửi!`);
      // Bạn có thể thêm logic gửi hình ảnh lên server ở đây
    } else if (info.file.status === "error") {
      message.error(`Không thể tải hình ảnh ${info.file.name}.`);
    }
  };

  // Xử lý ghi âm (giả lập)
  const handleMicrophoneClick = () => {
    message.info("Bắt đầu ghi âm... (Tính năng giả lập)");
    setTimeout(() => {
      message.success("Ghi âm hoàn tất! (Tính năng giả lập)");
    }, 2000);
  };

  // Menu cho action More
  const moreMenu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => message.info("Tạo bình chọn được chọn")}
      >
        Tạo bình chọn
      </Menu.Item>
      <Menu.Item key="2" onClick={() => message.info("Tạo nhắc hẹn được chọn")}>
        Tạo nhắc hẹn
      </Menu.Item>
      <Menu.Item key="3" onClick={() => message.info("Giao việc được chọn")}>
        Giao việc
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-white p-3 border-t shadow-md mt-2">
      <div className="flex">
        {/* Nút Smile (Emoji Picker) */}
        <Popover
          content={<Picker onEmojiClick={handleEmojiClick} />}
          trigger="click"
          open={isEmojiPickerVisible}
          onOpenChange={(visible) => setIsEmojiPickerVisible(visible)}
        >
          <Tooltip title="Chọn biểu cảm">
            <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
              <FaSmile className="text-gray-600" />
            </div>
          </Tooltip>
        </Popover>

        {/* Nút Paperclip (Upload file) */}
        <Upload
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleFileUpload}
        >
          <Tooltip title="Đính kèm file">
            <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
              <FaPaperclip className="text-gray-600" />
            </div>
          </Tooltip>
        </Upload>

        {/* Nút Microphone (Ghi âm) */}
        <Tooltip title="Ghi âm">
          <div
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={handleMicrophoneClick}
          >
            <FaMicrophone className="text-gray-600" />
          </div>
        </Tooltip>

        {/* Nút Image (Upload hình ảnh) */}
        <Upload
          showUploadList={false}
          beforeUpload={() => false}
          accept="image/*"
          onChange={handleImageUpload}
        >
          <Tooltip title="Gửi hình ảnh">
            <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
              <FaImage className="text-gray-600" />
            </div>
          </Tooltip>
        </Upload>

        {/* Nút More (Tùy chọn bổ sung) */}
        <Dropdown overlay={moreMenu} trigger={["click"]}>
          <Tooltip title="Tùy chọn khác">
            <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
              <FaEllipsisH size={20} className="text-gray-600" />
            </div>
          </Tooltip>
        </Dropdown>
      </div>

      <div className="flex items-center">
        <Input
          className="flex-1 p-2 rounded-lg border border-gray-300 focus:border-blue-500 transition-colors"
          placeholder="Nhập tin nhắn..."
          value={value}
          onChange={(e) => onChange(e)}
          onKeyDown={onKeyDown}
          style={{ height: "40px" }}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<FaPaperPlane />}
          onClick={onSend}
          className="ml-2"
          style={{
            height: "40px",
            width: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1890ff",
            borderColor: "#1890ff",
          }}
        />
      </div>
    </div>
  );
};

export default MessageInput;
