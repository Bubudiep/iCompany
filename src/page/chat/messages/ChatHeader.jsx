import React, { useState } from "react";
import { Avatar, Button, Modal, Input, Tooltip, Divider } from "antd";
import { FaPhone, FaVideo } from "react-icons/fa";
import { FaCubesStacked } from "react-icons/fa6";
import {
  EditOutlined,
  SettingOutlined,
  CopyOutlined,
  ShareAltOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { IoIosInformationCircle } from "react-icons/io";
import { IoPersonAddSharp } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { AddNewMemberModal } from "./handleModal";
const { Search } = Input;

const ChatHeader = ({
  chatName,
  isGroupChat,
  members,
  avatar,
  receiver,
  toggleRightSide,
  handleSearch,
  handleAudioCall,
  handleVideoCall,
}) => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);

  const handleAvatarClick = () => {
    setIsAvatarModalOpen(true);
  };

  const handleNameClick = () => {
    setIsNameModalOpen(true);
  };

  return (
    <div className="flex items-center justify-between bg-white !h-[60px] p-4 border-b">
      {/* Thông tin đoạn chat */}
      <div className="flex items-center">
        <div className="relative">
          <Avatar
            onClick={handleAvatarClick}
            className="rounded-full cursor-pointer"
            size={40}
            src={avatar}
          />
        </div>
        <div className="ml-2 relative group">
          <div className="flex items-center space-x-2">
            <h1 className="font-bold">{chatName}</h1>
            <Tooltip title="Chỉnh sửa">
              <EditOutlined
                className="opacity-0 group-hover:opacity-100 text-sm cursor-pointer transition-opacity"
                onClick={handleNameClick}
              />
            </Tooltip>
          </div>
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            {isGroupChat ? (
              <>
                <CiUser className="inline mr-1" />
                <span>{members.length} thành viên</span>
              </>
            ) : (
              <span className="text-sm text-green-500">
                {receiver?.status || "Đang hoạt động"}
              </span>
            )}
            <Divider type="vertical" className="h-4 border-black-solid w-2" />
            <Tooltip title="Phân loại đoạn chat">
              <FaCubesStacked className="icon-hover cursor-pointer" />
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Các nút điều khiển */}
      <div className="flex items-center space-x-4 cursor-pointer">
        <Search
          placeholder="Tìm tin nhắn..."
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Tooltip title="Thêm bạn vào nhóm">
          <IoPersonAddSharp onClick={() => setIsAddMemberModalVisible(true)} />
        </Tooltip>
        <Tooltip title="Cuộc gọi thoại">
          <FaPhone className="icon-hover" onClick={handleAudioCall} />
        </Tooltip>
        <Tooltip title="Cuộc gọi video">
          <FaVideo className="icon-hover" onClick={handleVideoCall} />
        </Tooltip>
        <Tooltip title="Thông tin cuộc trò chuyện">
          <IoIosInformationCircle
            size={20}
            className="icon-hover"
            onClick={toggleRightSide}
          />
        </Tooltip>
      </div>

      {/* Modal đổi tên */}
      <Modal
        title={isGroupChat ? "Đổi tên nhóm" : "Đặt tên gợi nhớ"}
        open={isNameModalOpen}
        onOk={() => setIsNameModalOpen(false)}
        onCancel={() => setIsNameModalOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar size={64} src={avatar} />
            <div className="absolute -bottom-1 right-0 bg-white border rounded-full p-1">
              📷
            </div>
          </div>
          {isGroupChat ? (
            <p className="text-center mt-4 text-gray-600">
              Bạn có chắc chắn muốn đổi tên nhóm, khi xác nhận tên nhóm mới sẽ
              hiển thị với tất cả thành viên.
            </p>
          ) : (
            <p className="text-center mt-4 text-gray-600">
              Hãy đặt tên cho ... {chatName} một cái tên dễ nhớ.
              <br />
              Lưu ý: Tên gợi nhớ sẽ chỉ hiện thị với riêng bạn.
            </p>
          )}
          <Input className="mt-3" value={chatName} />
        </div>
      </Modal>

      {/* Modal thông tin đoạn chat */}
      <Modal
        centered
        title={isGroupChat ? "Thông tin nhóm" : "Thông tin đoạn chat"}
        open={isAvatarModalOpen}
        onOk={() => setIsAvatarModalOpen(false)}
        onCancel={() => setIsAvatarModalOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <div className="flex flex-col items-center">
          <div className="relative cursor-pointer">
            <Avatar src={avatar} size={72} />
            <span className="text-lg font-semibold ml-4 mr-2">{chatName}</span>
            <Tooltip title="Đổi tên nhóm">
              <EditOutlined
                onClick={() => setIsNameModalOpen(true)}
                className="cursor-pointer text-gray-500"
              />
            </Tooltip>
          </div>
          <Button className="mt-4 w-full" type="default">
            Nhắn tin
          </Button>
          <div className="w-full mt-5">
            <div className="mb-1 font-bold">Thành viên ({members.length})</div>
            <div className="flex items-center gap-[-8px]">
              {members.map((src, idx) => (
                <Avatar key={idx} size={32} src={avatar} className="-ml-1" />
              ))}
              <Avatar size={32}>...</Avatar>
            </div>
          </div>
          <div className="w-full mt-5">
            <div className="text-gray-500 mb-1">Ảnh/Video</div>
            <div className="flex gap-2 overflow-x-auto">
              <img alt="media" className="h-16 w-16 rounded object-cover" />
              <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center text-xl">
                →
              </div>
            </div>
          </div>
          <Divider />
          <div className="w-full flex items-center justify-between mb-2">
            <h1>Link tham gia</h1>
            <a
              href="https://hl.djc.me/g/rfgqjg415"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 truncate"
            >
              https://hl.djc.me/g/rfgqjg415
            </a>
            <div>
              <Tooltip title="Sao chép">
                <CopyOutlined className="cursor-pointer mr-2" />
              </Tooltip>
              <Tooltip title="Chia sẻ">
                <ShareAltOutlined className="cursor-pointer" />
              </Tooltip>
            </div>
          </div>
          <Button icon={<SettingOutlined />} className="w-full mb-2">
            Quản lý nhóm
          </Button>
        </div>
      </Modal>

      {/* Modal thêm thành viên */}
      <AddNewMemberModal
        visible={isAddMemberModalVisible}
        onClose={() => setIsAddMemberModalVisible(false)}
      />
    </div>
  );
};

export default ChatHeader;
