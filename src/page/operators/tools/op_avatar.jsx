import { Image } from "antd";
import React from "react";

const OP_Avatar = ({ name, avatar, app }) => {
  const bgColor = avatar
    ? "transparent"
    : app.getRandomColorFromString(name || "user");
  const firstChar = name?.split(" ").pop()?.[0] || "?";

  return (
    <div className="avatar" style={{ backgroundColor: bgColor }}>
      {avatar ? (
        <image
          src={avatar}
          alt={name}
          className="w-full h-full object-cover rounded-[8px]"
        />
      ) : (
        firstChar
      )}
    </div>
  );
};

export default OP_Avatar;
