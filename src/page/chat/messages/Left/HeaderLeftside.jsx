import React from "react";
import { Avatar, Button } from "antd";
import { FaPlus } from "react-icons/fa";

const HeaderLeftSide = ({ username, onCreateGroup }) => {
  return (
    <div className="flex items-center p-4 justify-between bg-white border-b border-gray-200">
      <div className="flex items-center">
        <Avatar
          alt="User Avatar"
          className="rounded-full"
          size={40}
          src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
        />
        <span className="ml-2 text-xl font-bold">{username}</span>
      </div>
      <Button
        type="primary"
        shape="circle"
        icon={<FaPlus />}
        onClick={onCreateGroup}
        className="hover:scale-110 transition-transform duration-200"
      />
    </div>
  );
};

export default HeaderLeftSide;
