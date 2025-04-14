import React, { useEffect, useState } from "react";
import {
  FaCog,
  FaUserFriends,
  FaBell,
  FaEllipsisH,
  FaHome,
  FaPlus,
  FaCamera,
} from "react-icons/fa";
import {
  Avatar,
  Badge,
  Input,
  Modal,
  Button,
  Checkbox,
  Tabs,
  Skeleton,
  Upload,
  message,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import app from "../../../components/app";
import api from "../../../components/api";

const { TabPane } = Tabs;

const LeftSide = ({ chatList, setChatList, user }) => {
  const nav = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChatList, setFilteredChatList] = useState(chatList);
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] =
    useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [groupCover, setGroupCover] = useState(null); // Trạng thái để lưu ảnh bìa nhóm
  const [groupCoverURL, setGroupCoverURL] = useState(null); // URL tạm thời để hiển thị ảnh bìa nhóm

  console.log("User in LeftSide:", user);

  // Lấy danh sách người dùng từ user.staff
  useEffect(() => {
    if (user?.staff) {
      const filteredUsers = user.staff
        .filter((u) => u.id !== user.id)
        .map((u) => ({
          id: u.id,
          fullName:
            u.first_name && u.last_name
              ? `${u.first_name} ${u.last_name}`
              : u.username || "Unknown",
          username: u.username || "Unknown",
        }));
      console.log("Available users from staff:", filteredUsers);
      console.log("Full name:", filteredUsers.department_name);
      setAvailableUsers(filteredUsers);
    }
  }, [user]);

  // Lọc danh sách chat khi searchTerm thay đổi
  useEffect(() => {
    if (!searchTerm) {
      setFilteredChatList(chatList);
    } else {
      const filtered = chatList.filter((chat) => {
        const otherMember = chat.members.find(
          (member) => member.id !== user.id
        );
        const username = otherMember?.username || "";
        return username.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredChatList(filtered);
    }
  }, [searchTerm, chatList, user]);

  // Lọc danh sách thành viên khi tìm kiếm
  const filteredMembers = availableUsers.filter((u) =>
    u.fullName.toLowerCase().includes(memberSearchTerm.toLowerCase())
  );
  // Sắp xếp danh sách thành viên theo bảng chữ cái
  const sortedMembersByAlphabet = [...filteredMembers].sort((a, b) =>
    a.fullName.localeCompare(b.fullName, "vi", { sensitivity: "base" })
  );

  const getTimeDisplay = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);

    if (diffInSeconds < 10) return "vừa xong";
    if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;

    return app.timeSince(timestamp);
  };

  // Xử lý chọn thành viên
  const handleMemberSelect = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };
  // Xử lý xóa thành viên khỏi danh sách đã chọn
  const handleRemoveMember = (memberId) => {
    setSelectedMembers((prev) => prev.filter((id) => id !== memberId));
  };
  // Xử lý chọn ảnh bìa
  const handleCoverChange = (info) => {
    if (info.file.status === "done") {
      // Kiểm tra định dạng file
      const fileType = info.file.type;
      if (!fileType.startsWith("image/")) {
        message.error("Vui lòng chọn file ảnh!");
        return;
      }
      setGroupCover(info.file.originFileObj);
    }
  };
  // Xử lý tạo group chat
  const handleCreateGroup = async () => {
    if (!groupName) {
      Modal.error({
        title: "Lỗi",
        content: "Vui lòng nhập tên group!",
      });
      return;
    }
    if (selectedMembers.length === 0) {
      Modal.error({
        title: "Lỗi",
        content: "Vui lòng chọn ít nhất một thành viên!",
      });
      return;
    }

    try {
      const createRoomResponse = await api.post(
        "/chatbox/",
        {
          name: groupName,
          is_group: true,
          members: [user.id, ...selectedMembers],
          cover: groupCover, // Gửi ảnh bìa nếu có (cần xử lý upload ảnh nếu tích hợp thực sự)
        },
        user.token
      );

      const newRoom = createRoomResponse.data;
      console.log("New room created:", newRoom);
      setChatList((prevChatList) => [...prevChatList, newRoom]);
      setIsCreateGroupModalVisible(false);
      setGroupName("");
      setSelectedMembers([]);
      setMemberSearchTerm("");
      setGroupCover(null);
      // Điều hướng theo format: /app/new_chat/{user.id}/staff/{member.id}/chat/
      const firstMemberId = selectedMembers[0]; // Lấy ID của thành viên đầu tiên trong danh sách đã chọn
      nav(`/app/new_chat/${user.id}/staff/${firstMemberId}/chat/`);
    } catch (error) {
      console.error("Error creating group chat:", error);
      Modal.error({
        title: "Lỗi",
        content: "Không thể tạo group chat. Vui lòng thử lại.",
      });
    }
  };

  return (
    <div className="left-side bg-white w-1/5 flex flex-col border-r-1 border-gray-400 rounded-r-xl">
      <div className="flex items-center p-4 justify-between">
        <div className="flex items-center">
          <Avatar
            alt="User Avatar"
            className="rounded-full"
            height="40"
            src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
            width="40"
          />
          <span className="ml-2 text-xl font-bold">
            {localStorage.getItem("username")}
          </span>
        </div>
        <Button
          type="primary"
          shape="circle"
          icon={<FaPlus />}
          onClick={() => setIsCreateGroupModalVisible(true)}
        />
      </div>

      <div className="flex-1 overflow-y-auto border border-t border-gray-400 rounded-xl">
        <div className="flex p-2">
          <Input
            className="bg-gray-600 rounded"
            placeholder="Tìm kiếm cuộc trò chuyện"
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <h2 className="p-2 text-xxl font-medium text-center">
          Danh sách cuộc trò chuyện: {filteredChatList.length}
        </h2>
        <h1>
          {filteredChatList.length === 0 &&
            "Không tìm thấy cuộc trò chuyện. Hãy bắt đầu 1 cuộc trò chuyện."}
        </h1>
        <div className="p-2">
          <div className="flex items-center justify-between">
            <span className="font-bold">Ưu tiên</span>
            <span className="text-sm">Khác</span>
          </div>

          <div className="mt-2">
            {filteredChatList
              .sort(
                (a, b) => (b.last_message?.id || 0) - (a.last_message?.id || 0)
              )
              .map((chat) => (
                <Link
                  key={chat.id}
                  className="flex items-center p-2 hover:bg-gray-500 rounded cursor-pointer relative"
                  to={`/app/chat/${chat.id}`}
                >
                  <Avatar
                    size={40}
                    src={
                      "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                    }
                  />
                  <div className="ml-2 flex-1">
                    <div className="font-bold">
                      {chat.members.find((member) => member.id !== user.id)
                        ?.username || "Unknown"}
                    </div>
                    <div className="text-sm overflow-hidden text-nowrap text-ellipsis">
                      {chat.last_message?.sender === user.id && "Bạn: "}
                      {chat.last_message?.message
                        ? chat.last_message.message.length > 14
                          ? chat.last_message.message.slice(0, 15) + "..."
                          : chat.last_message.message
                        : "Chưa có tin nhắn"}
                    </div>
                  </div>
                  <div className="absolute top-0 right-0">
                    <div className="text-sm">
                      {chat.last_message?.created_at
                        ? getTimeDisplay(chat.last_message.created_at)
                        : ""}
                    </div>
                    {chat.not_read > 0 && (
                      <Badge count={chat.not_read} offset={[30, 5]} />
                    )}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Modal tạo group chat */}
      <Modal
        title="Tạo nhóm"
        open={isCreateGroupModalVisible}
        onCancel={() => {
          setIsCreateGroupModalVisible(false);
          setGroupName("");
          setSelectedMembers([]);
          setMemberSearchTerm("");
        }}
        footer={null}
        width={600}
      >
        <div className="space-y-4">
          {/* Select cover group và nhập tên nhóm */}
          <div className="flex items-center space-x-2">
            {/* Icon chọn ảnh bìa */}
            <div className="flex-shrink-0">
              {groupCoverURL ? (
                <div className="relative">
                  <Avatar
                    size={40}
                    src={groupCoverURL}
                    className="border border-gray-300"
                  />
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    onClick={() => setGroupCover(null)}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false} // Ngăn upload tự động, chỉ xử lý giao diện
                  onChange={handleCoverChange}
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
                    <FaCamera className="text-gray-500" />
                  </div>
                </Upload>
              )}
            </div>
            {/* Ô nhập tên nhóm */}
            <div className="flex-1">
              <Input
                placeholder="Nhập tên nhóm..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          </div>

          {/* Ô tìm kiếm thành viên */}
          <Input
            placeholder="Nhập tên, số điện thoại, email..."
            value={memberSearchTerm}
            onChange={(e) => setMemberSearchTerm(e.target.value)}
            allowClear
          />
          {/* Thanh hiển thị thành viên đã chọn */}
          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap items-center p-2 bg-gray-100 rounded cursor-pointer">
              <span className="text-sm text-gray-700 mr-2">
                Đã chọn: {selectedMembers.length}/100
              </span>
              {selectedMembers.map((memberId) => {
                const member = availableUsers.find((u) => u.id === memberId);
                return (
                  <div
                    key={memberId}
                    className="flex items-center bg-blue-500 text-white rounded-full px-2 py-1 m-1"
                  >
                    <span className="text-sm">
                      {member?.fullName.length > 10
                        ? member?.fullName.slice(0, 10) + "..."
                        : member?.fullName}
                    </span>
                    <button
                      className="ml-2 text-xs cursor-pointer"
                      onClick={() => handleRemoveMember(memberId)}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          {/* Tabs lọc thành viên */}
          <Tabs defaultActiveKey="1">
            <TabPane tab="Tất cả" key="1">
              <div className="max-h-60 overflow-y-auto">
                <div className="text-sm text-gray-500 mb-2">
                  Trò chuyện gần đây
                </div>
                {filteredMembers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handleMemberSelect(u.id)}
                  >
                    <Checkbox
                      checked={selectedMembers.includes(u.id)}
                      onChange={() => handleMemberSelect(u.id)}
                      onClick={() => handleMemberSelect(u.id)}
                    />
                    <Avatar
                      size={40}
                      src={
                        "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                      }
                      alt="Avatar"
                      className="ml-2"
                    />
                    <span className="ml-2">{u.fullName}</span>
                  </div>
                ))}
              </div>
            </TabPane>
            <TabPane tab="Alphabet" key="2">
              <div className="max-h-60 overflow-y-auto">
                <div className="text-sm text-gray-500 mb-2">Theo Alphabet</div>
                {sortedMembersByAlphabet.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handleMemberSelect(u.id)}
                  >
                    <Checkbox
                      checked={selectedMembers.includes(u.id)}
                      onChange={() => handleMemberSelect(u.id)}
                    />
                    <Avatar
                      size={40}
                      src={
                        "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                      }
                      className="ml-2"
                    />
                    <span className="ml-2">{u.fullName}</span>
                  </div>
                ))}
              </div>
            </TabPane>
            <TabPane tab="Bạn thân" key="3">
              <div className="text-sm text-gray-500">
                <Skeleton />;
              </div>
            </TabPane>
            <TabPane tab="Đồng nghiệp" key="4">
              <div className="text-sm text-gray-500">
                <Skeleton />;
              </div>
            </TabPane>
          </Tabs>

          {/* Nút Hủy và Tạo nhóm */}
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => {
                setIsCreateGroupModalVisible(false);
                setGroupName("");
                setSelectedMembers([]);
                setMemberSearchTerm("");
              }}
            >
              Hủy
            </Button>
            <Button type="primary" onClick={handleCreateGroup}>
              Tạo nhóm
            </Button>
          </div>
        </div>
      </Modal>

      <div className="p-2">
        <div className="flex items-center justify-between cursor-pointer text-xl">
          <FaHome onClick={() => nav("/")} />
          <FaCog onClick={() => nav("/settings")} />
          <FaUserFriends onClick={() => nav("/friends")} />
          <FaBell onClick={() => nav("/notifications")} />
          <FaEllipsisH onClick={() => nav("/more")} />
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
