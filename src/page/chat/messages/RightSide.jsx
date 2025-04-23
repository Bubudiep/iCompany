import React from "react";
import { Avatar, Button, Collapse, message } from "antd";
import { Tooltip } from "antd";
import {
  BellOutlined,
  PushpinOutlined,
  UserAddOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useUser } from "../../../components/context/userContext";
import { MdOutlineDelete, MdOutlineReportProblem } from "react-icons/md";
import { CiLogout } from "react-icons/ci";

const { Panel } = Collapse;

const RightSide = ({ members, avatar, chatName, isGroupChat, ghim }) => {
  const { user } = useUser();

  const handleTurnOffNotification = () => {
    message.success("Thông báo đã tắt!");
  };
  const pinChatbox = () => {
    message.success("Pin chatbox thành công!");
  };
  const handleAddMember = () => {
    message.success("Thêm thành viên thành công!");
  };
  const handleManageGroup = () => {
    message.success("Quản lý nhóm thành công!");
  };

  const handleReport = () => {
    message.success("Báo cáo thành công!");
  };

  const handleClearHistory = () => {
    message.success("Xóa lịch sử trò chuyện thành công!");
  };

  const handleLeaveGroup = () => {
    message.success("Bạn đã rời khỏi cuộc trò chuyện nây!");
  };
  console.log("ghim", ghim);

  return (
    <div className="w-full md:w-1/3 bg-white dark:bg-gray-900 text-black dark:text-white p-4 rounded-lg shadow overflow-y-auto h-full">
      <h1 className="text-xl font-bold text-center mb-6">
        {isGroupChat ? "Thông tin nhóm" : "Thông tin người hội thoại"}
      </h1>

      <div className="text-center mb-4">
        <Avatar
          size={64}
          src={
            avatar ||
            "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
          }
          className="mx-auto mb-2"
        />
        <div className="font-bold text-lg">
          {isGroupChat
            ? chatName
            : members.find((member) => member.id !== user.id)?.username ||
              "Unknown"}
        </div>
      </div>

      <div className="flex justify-around text-xl text-gray-700 dark:text-white mb-6">
        <Tooltip title="Tắt thông báo">
          <div className="flex flex-col items-center cursor-pointer hover:text-blue-500">
            <BellOutlined onClick={handleTurnOffNotification} />
          </div>
        </Tooltip>
        <Tooltip title="Ghim hội thoại">
          <div className="flex flex-col items-center cursor-pointer hover:text-blue-500">
            <PushpinOutlined onClick={pinChatbox} />
          </div>
        </Tooltip>

        {isGroupChat && (
          <>
            <Tooltip title="Thêm thành viên">
              <div className="flex flex-col items-center cursor-pointer hover:text-blue-500">
                <UserAddOutlined onClick={handleAddMember} />
              </div>
            </Tooltip>
            <Tooltip title="Quản lý nhóm">
              <div className="flex flex-col items-center cursor-pointer hover:text-blue-500">
                <SettingOutlined onClick={handleManageGroup} />
              </div>
            </Tooltip>
          </>
        )}
      </div>

      <Collapse bordered={false} defaultActiveKey={["1"]} className="mb-6">
        {isGroupChat && (
          <Panel
            header={<span className="font-bold">Thành viên nhóm</span>}
            key="1"
          >
            <p className="text-sm mb-2 text-center">
              <i className="fas fa-users mr-2"></i> {members.length} thành viên
            </p>
            {members.map((member) => (
              <p key={member.id} className="flex items-center text-sm mb-1">
                <Avatar
                  size={30}
                  src={
                    member.profile?.avatar ||
                    "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                  }
                  className="mr-2"
                />
                {member.profile?.full_name || member.username || "Unknown"}
                {member.isActive && (
                  <span className="ml-auto text-green-500">
                    ● Đang hoạt động
                  </span>
                )}
              </p>
            ))}
          </Panel>
        )}

        {isGroupChat && (
          <Panel
            header={<span className="font-bold">Bảng tin nhóm</span>}
            key="2"
          >
            <h2 className="text-sm mb-2">Tin nhắn ghim:</h2>
            {/* {ghim.length > 0 ? (
              ghim.map((msg) => (
                <p key={msg.id} className="text-sm mb-1">
                  {members.find((member) => member.id === msg.sender)?.username}
                  :{" "}
                  {msg.message.length > 50
                    ? msg.message.slice(0, 50) + "..."
                    : msg.message}
                </p>
              ))
            ) : ( */}
            <p className="text-sm text-gray-500">Chưa có tin nhắn ghim</p>
            {/* )} */}
            <p className="text-sm mt-2">Danh sách nhắc hẹn (Chưa có dữ liệu)</p>
            <p className="text-sm">Ghi chú, bình chọn (Chưa có dữ liệu)</p>
          </Panel>
        )}

        <Panel header={<span className="font-bold">Ảnh/Video</span>} key="3">
          <div className="overflow-y-auto max-h-72 pr-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[...Array(15)].map((_, index) => (
                <img
                  key={index}
                  src={`https://picsum.photos/200/300?random=${index}`}
                  alt={`Image ${index}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          </div>
          <Button type="primary" block shape="round" className="mt-4">
            Xem tất cả
          </Button>
        </Panel>

        <Panel header={<span className="font-bold">File</span>} key="4">
          <div className="flex items-center space-x-2 text-sm mb-2">
            <img
              src={`https://picsum.photos/200/300?random=1`}
              alt="img"
              width={24}
              height={24}
            />
            <span>153 B</span>
            <span>29/03/2025</span>
          </div>
        </Panel>

        <Panel header={<span className="font-bold">Link</span>} key="5">
          <p className="text-sm text-gray-500">
            Chưa có Link được chia sẻ trong hội thoại này
          </p>
        </Panel>

        <Panel
          header={<span className="font-bold">Thiết lập bảo mật</span>}
          key="6"
        >
          <p className="text-sm text-gray-500">
            Chưa có thiết lập bảo mật nào được chia sẻ trong hội thoại này
          </p>
        </Panel>
      </Collapse>

      <div className="mt-4 space-y-2">
        <Button onClick={handleReport} icon={<MdOutlineReportProblem />} block>
          Báo cáo hội thoại
        </Button>
        <Button
          onClick={handleClearHistory}
          icon={<MdOutlineDelete />}
          block
          danger
        >
          Xóa lịch sử cuộc trò chuyện
        </Button>
        {/* if group, have button leave */}
        {isGroupChat && (
          <Button onClick={handleLeaveGroup} icon={<CiLogout />} block danger>
            Rời khỏi nhóm
          </Button>
        )}
      </div>
    </div>
  );
};

export default RightSide;
