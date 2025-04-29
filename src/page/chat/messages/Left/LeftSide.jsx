import React, { useEffect, useState } from "react";
import { Badge, Button, Input, Modal, Popover, message } from "antd";
import { useNavigate } from "react-router-dom";
import app from "../../../../components/app";
import api from "../../../../components/api";
import ChatItem from "./ChatItem";
import CreateGroupModal from "../Functions/handleModal/CreateGroupModal";
import HeaderLeftSide from "./HeaderLeftside"; // Import component mới
import { FaChevronDown } from "react-icons/fa";
import { MdMoreHoriz } from "react-icons/md";
import DropdownFilter from "./DropdownFilter";

const LeftSide = ({ chatList, setChatList, user }) => {
  const nav = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  // const [filteredChatList, setFilteredChatList] = useState(chatList);
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] =
    useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [host, setHost] = useState(user.id);
  const [admins, setAdmins] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([user.id]);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [groupCover, setGroupCover] = useState(null);
  const [groupCoverURL, setGroupCoverURL] = useState(null);

  // "chat_not_read": 0,
  // "alert_not_read": 0,
  // "update_not_read": 0,
  // "approve_not_read": 0,
  // "member_updated_not_check": 0,

  useEffect(() => {
    if (user?.onlines) {
      const filteredUsers = user.onlines
        .filter((u) => u.id !== user.id)
        .map((u) => ({
          id: u.id,
          avatar: u.avatar,
          fullName: u.info?.fullName || "Unknown",
          // fullName:
          //   u.first_name && u.last_name
          //     ? `${u.first_name} ${u.last_name}`
          //     : u.username || "Unknown",
          // username: u.info?.username || "Unknown",
        }));
      setAvailableUsers(filteredUsers);
    }
  }, [user]);
  console.log("User new", user);

  // useEffect(() => {
  //   if (!searchTerm) {
  //     setFilteredChatList(chatList);
  //   } else {
  //     const filtered = chatList.filter((chat) => {
  //       if (chat.is_group) {
  //         return chat.name?.toLowerCase().includes(searchTerm.toLowerCase());
  //       } else {
  //         const otherMember = chat.members.find(
  //           (member) => member.id !== user.id
  //         );
  //         const username = otherMember?.username || "";
  //         return username.toLowerCase().includes(searchTerm.toLowerCase());
  //       }
  //     });
  //     setFilteredChatList(filtered);
  //   }
  // }, [searchTerm, chatList, user]);
  const filteredChatList = React.useMemo(() => {
    if (!searchTerm) {
      return chatList;
    }
    return chatList.filter((chat) => {
      if (chat.is_group) {
        return chat.name?.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        const otherMember = chat.members.find(
          (member) => member.id !== user.id
        );
        const username = otherMember?.username || "";
        return username.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
  }, [searchTerm, chatList, user]);

  // Bỏ setFilteredChatList và useEffect tương ứng

  useEffect(() => {
    if (window.socket) {
      window.socket.on("message", (data) => {
        if (data.type === "message") {
          const newMessage = data.data;
          const roomId = newMessage.room;

          setChatList((prevChatList) => {
            return prevChatList.map((chat) => {
              if (chat.id === roomId) {
                return {
                  ...chat,
                  last_message: {
                    id: newMessage.id,
                    message: newMessage.message,
                    sender: newMessage.sender,
                    created_at: newMessage.created_at,
                  },
                  not_read: (chat.not_read || 0) + 1,
                };
              }
              return chat;
            });
          });
        }
      });

      return () => {
        window.socket.off("message");
      };
    }
  }, [setChatList]);

  const getTimeDisplay = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);

    if (diffInSeconds < 10) return "vừa xong";
    if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;

    return app.timeSince(timestamp);
  };

  const handleCreateGroup = async () => {
    if (!groupName) {
      Modal.error({
        title: "Lỗi",
        content: "Vui lòng nhập tên group!",
      });
      return;
    }
    if (selectedMembers.length < 2) {
      Modal.error({
        title: "Lỗi",
        content: "Vui lòng chọn ít nhất một thành viên khác ngoài bạn!",
      });
      return;
    }

    try {
      const groupData = {
        name: groupName,
        host: host,
        admins: admins,
        members: selectedMembers,
        is_group: true,
        avatar: groupCover || null,
      };

      const createRoomResponse = await api.post(
        "/chatbox/create_room/",
        groupData,
        user.token
      );
      const newRoom = createRoomResponse;

      if (!newRoom || !newRoom.id) {
        throw new Error("Không thể lấy ID của room mới từ API response");
      }

      setChatList((prevChatList) => [newRoom, ...prevChatList]);

      setIsCreateGroupModalVisible(false);
      setGroupName("");
      setHost(user.id);
      setAdmins([]);
      setSelectedMembers([user.id]);
      setMemberSearchTerm("");
      setGroupCover(null);
      setGroupCoverURL(null);

      message.success("Tạo group chat thành công!");
      nav(`/app/chat/${newRoom.id}`);
    } catch (error) {
      console.error("Error creating group chat:", error);
      Modal.error({
        title: "Lỗi",
        content: "Không thể tạo group chat. Vui lòng thử lại.",
      });
    }
  };

  const handleCreateGroupModalCancel = () => {
    setIsCreateGroupModalVisible(false);
    setGroupName("");
    setHost(user.id);
    setAdmins([]);
    setSelectedMembers([user.id]);
    setMemberSearchTerm("");
    setGroupCover(null);
    setGroupCoverURL(null);
  };

  const totalUnreadMessages = chatList.reduce((total, chat) => {
    return total + (chat.not_read || 0);
  }, 0);
  const [activeTab, setActiveTab] = useState("Ưu tiên");
  // Nội dung của Popover
  const popoverContent = (
    <div className="flex flex-col">
      <Button
        type="text"
        className="text-left hover:bg-gray-100"
        onClick={() => console.log("Đánh dấu đã đọc!")}
      >
        Đánh dấu đã đọc
      </Button>
      <Button
        type="text"
        className="text-left hover:bg-gray-100"
        onClick={() => console.log("Đánh dấu đã đọc!")}
      >
        Đánh dấu
      </Button>
    </div>
  );

  return (
    <div className="left-side bg-white w-1/5 flex flex-col min-w-[300px] overflow-hidden">
      {/* Header */}
      <HeaderLeftSide
        username={localStorage.getItem("username")}
        onCreateGroup={() => setIsCreateGroupModalVisible(true)}
      />

      {/* Nội dung còn lại */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex p-2 items-center">
          <Input
            className="bg-gray-600 rounded"
            placeholder="Tìm kiếm cuộc trò chuyện"
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* show total unread */}

        {/* Button */}
        <div className="flex p-3 items-center justify-between">
          {/* <div className="flex gap-6"> */}
          <span
            className={`cursor-pointer pb-2 border-b-2 transition-all ${
              activeTab === "Ưu tiên"
                ? "text-blue-500 font-bold border-blue-500"
                : "text-gray-600 border-transparent hover:text-blue-500 hover:border-blue-300"
            }`}
            onClick={() => setActiveTab("Ưu tiên")}
          >
            Ưu tiên
            {totalUnreadMessages > 0 && (
              <Badge
                count={totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
                offset={[10, 0]}
                style={{ backgroundColor: "#ff4d4f" }}
              />
            )}
          </span>

          <span
            className={`cursor-pointer pb-2 border-b-2 transition-all ${
              activeTab === "Khác"
                ? "text-blue-500 font-bold border-blue-500"
                : "text-gray-600 border-transparent hover:text-blue-500 hover:border-blue-300"
            }`}
            onClick={() => setActiveTab("Khác")}
          >
            Khác
          </span>
          {/* </div> */}

          {/* <div className="flex gap-3 items-center text-sm text-gray-700">
            <DropdownFilter />
            <Popover
              content={popoverContent}
              trigger="click"
              placement="bottomLeft"
            >
              <MdMoreHoriz
                size={24}
                className="cursor-pointer hover:text-gray-100 hover:bg-blue-500 rounded-full"
              />
            </Popover>
          </div> */}
        </div>

        {/* Not found chat list */}
        <h1 className="pt-2 text-center">
          {filteredChatList.length === 0 &&
            "Không tìm thấy kết quả. Vui lòng tìm kiếm khác.."}
        </h1>
        {/* Chat list */}
        <div className="h-full overflow-auto">
          <div className="p-2 mt-2">
            {filteredChatList
              .sort(
                (a, b) => (b.last_message?.id || 0) - (a.last_message?.id || 0)
              )
              .map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  user={user}
                  getTimeDisplay={getTimeDisplay}
                />
              ))}
          </div>
        </div>
      </div>

      <CreateGroupModal
        visible={isCreateGroupModalVisible}
        onCancel={handleCreateGroupModalCancel}
        availableUsers={availableUsers}
        groupName={groupName}
        setGroupName={setGroupName}
        host={host}
        setHost={setHost}
        admins={admins}
        setAdmins={setAdmins}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        memberSearchTerm={memberSearchTerm}
        setMemberSearchTerm={setMemberSearchTerm}
        groupCover={groupCover}
        setGroupCover={setGroupCover}
        groupCoverURL={groupCoverURL}
        setGroupCoverURL={setGroupCoverURL}
        handleCreateGroup={handleCreateGroup}
        user={user}
      />
    </div>
  );
};

export default LeftSide;
