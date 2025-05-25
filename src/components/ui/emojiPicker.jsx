import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";

const EmojiShow = ({
  children,
  callback,
  refocus,
  openEmoji,
  setOpenEmoji,
}) => {
  const [visible, setVisible] = useState(false);
  const pickerRef = useRef(null);
  const handleEmojiClick = (e) => {
    callback(e);
  };
  useEffect(() => {
    setVisible(openEmoji);
  }, [openEmoji]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef?.current && !pickerRef?.current?.contains(event.target)) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="relative z-100" ref={pickerRef}>
      <div
        onClick={() => {
          setVisible(!visible);
          setOpenEmoji(!visible);
          refocus();
        }}
      >
        {children}
      </div>
      <div style={{ display: visible ? "block" : "none" }}>
        <div className="absolute bottom-full m-1 pb-1 emoji no-drag">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            searchDisabled={true}
            skinTonesDisabled={true}
            categories={[
              {
                category: "suggested",
                name: "Vừa sử dụng",
              },
              {
                category: "smileys_people",
                name: "Cảm xúc",
              },
              {
                category: "animals_nature",
                name: "Động vật & thực vật",
              },
              {
                category: "food_drink",
                name: "Đồ ăn & nước uống",
              },
              {
                category: "activities",
                name: "Hoạt động",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default EmojiShow;
