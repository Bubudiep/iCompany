import {
  Modal,
  Avatar,
  Upload,
  Input,
  Tabs,
  Checkbox,
  Skeleton,
  Button,
} from "antd";
import React from "react";

const { TabPane } = Tabs;
const ShowMoreModal = ({ visible, onClose, onAction }) => {
  return (
    <Modal
      style={{ top: 300 }}
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={300}
      // style={{ top: 100 }}
    >
      <div className="flex flex-col">
        <button
          className="text-left py-2 px-4 hover:bg-gray-100 rounded flex items-center text-gray-700"
          onClick={() => onAction("Bỏ ghim hội thoại")}
        >
          <span className="text-red-500 mr-2">⬛</span> Bỏ ghim hội thoại
        </button>
        <button
          className="text-left py-2 px-4 hover:bg-gray-100 rounded flex items-center text-gray-700"
          onClick={() => onAction("Chuyển sang mục Khác")}
        >
          <span className="text-red-500 mr-2">⬛</span> Chuyển sang mục Khác
        </button>
        <button
          className="text-left py-2 px-4 hover:bg-gray-100 rounded flex items-center text-gray-700"
          onClick={() => onAction("Phân loại")}
        >
          <span className="text-red-500 mr-2">⬛</span> Phân loại
          <span className="ml-auto text-gray-500">Study</span>
        </button>
        <button
          className="text-left py-2 px-4 hover:bg-gray-100 rounded flex items-center text-gray-700"
          onClick={() => onAction("Đánh đầu chưa đọc")}
        >
          <span className="text-red-500 mr-2">⬛</span> Đánh đầu chưa đọc
        </button>
        <button
          className="text-left py-2 px-4 hover:bg-gray-100 rounded flex items-center text-gray-700"
          onClick={() => onAction("Tắt thông báo")}
        >
          <span className="text-red-500 mr-2">⬛</span> Tắt thông báo
        </button>
        <button
          className="text-left py-2 px-4 hover:bg-gray-100 rounded flex items-center text-gray-700"
          onClick={() => onAction("Ẩn trò chuyện")}
        >
          <span className="text-red-500 mr-2">⬛</span> Ẩn trò chuyện
        </button>
        <button
          className="text-left py-2 px-4 hover:bg-gray-100 rounded flex items-center text-gray-700"
          onClick={() => onAction("Tin nhắn tự xóa")}
        >
          <span className="text-red-500 mr-2">⬛</span> Tin nhắn tự xóa
        </button>
        <button
          className="text-left py-2 px-4 hover:bg-gray-100 rounded flex items-center text-gray-700"
          onClick={() => onAction("Chặn hội thoại")}
        >
          <span className="text-red-500 mr-2">⬛</span> Chặn hội thoại
        </button>
        <button
          className="text-left py-2 px-4 hover:bg-gray-100 rounded flex items-center text-red-600"
          onClick={() => onAction("Báo xấu")}
        >
          <span className="text-red-500 mr-2">⬛</span> Báo xấu
        </button>
      </div>
    </Modal>
  );
};

export default ShowMoreModal;
