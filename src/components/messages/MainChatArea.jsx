import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MessageInput from "./MessageInput";
import { FaPhone, FaVideo, FaSearch, FaEllipsisH } from "react-icons/fa";

const MainChatArea = () => {
  const [messages, setMessages] = useState([
    { sender: "Mr A", text: "Chào mọi người", time: "10:35 Hôm nay" },
    { sender: "Nguyễn Huy", text: "Nice to meet you today", time: "10:36" },
    { sender: "Ms B", text: "Me too", time: "11:39" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sender: "Nguyễn Huy", // Thay bằng user thực tế
      text: newMessage,
      time: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, messageData]);
    setNewMessage("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:3000/messages");
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, []);
  const handleSendMessage = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3000/messages", { text: newMessage })
      .then((response) => {
        setMessages([...messages, response.data]);
        setNewMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <img
              alt="DEV Team"
              className="rounded-full"
              height="40"
              src="https://storage.googleapis.com/a1aa/image/wOjPVEQgLVtFaveS0SUzjGnh8G_YRxK6ETzmMOSPuN4.jpg"
              width="40"
            />
            <div className="ml-2">
              <div className="font-bold">Duck Team</div>
              <div className="text-sm text-gray-500">5 thành viên</div>
            </div>
          </div>
          <div className="flex items-center space-x-4 cursor:pointer ">
            <FaPhone />
            <FaVideo />
            <FaSearch />
            <FaEllipsisH />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start mb-4 ${
                msg.sender === "Nguyễn Huy" ? "justify-end" : ""
              }`}
            >
              {msg.sender !== "Nguyễn Huy" && (
                <img
                  alt="User Avatar"
                  className="rounded-full"
                  height="40"
                  src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                  width="40"
                />
              )}
              <div className="ml-2">
                <div
                  className={`ml-2 ${
                    msg.sender === "Nguyễn Huy" ? "bg-blue-100" : "bg-white"
                  } p-2 rounded shadow`}
                >
                  {/* <div className="font-bold">{msg.sender}</div> */}
                  <div className="text-sm">{msg.text}</div>
                </div>
                <div className="text-sm text-gray-500 mt-1">{msg.time}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {/* Input area message */}
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={sendMessage}
          onKeyDown={handleKeyDown}
        />
      </div>
    </>
  );
};

export default MainChatArea;
