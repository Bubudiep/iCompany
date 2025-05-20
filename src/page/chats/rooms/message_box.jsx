import React from "react";
import icon from "../../../assets/image/chat_icon.png";
import { TbNotification } from "react-icons/tb";
import { AiOutlineAppstoreAdd } from "react-icons/ai";

const Message_chat_box = ({ message }) => {
  return (
    <div className="chat_view fadeInTop">
      {message.length > 0 ? (
        <></>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="whitebox !p-6 gap-4 !px-12">
            <div className="flex flex-col gap-4">
              <div className="icon flex gap-4">
                <div className="icon max-w-[100px] flex items-center">
                  <img src={icon} className="w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-[32px] font-[700] text-[#00aeff]">
                    Chat
                  </div>
                  <div className="text-[14px] font-[500] flex items-center gap-1 text-[#00aeff]">
                    <TbNotification className="text-[#00aeff] text-[20px]" />
                    Không mất lịch sử trò chuyện
                  </div>
                  <div className="text-[14px] font-[500] flex items-center gap-1 text-[#00aeff]">
                    <AiOutlineAppstoreAdd className="text-[#00aeff] text-[20px]" />
                    Tiện ích thêm với phê duyệt và giao việc
                  </div>
                </div>
              </div>
              <div className="description text-[#1672af] font-[400] text-[16px]">
                " Gửi lời chào để chia sẻ những câu chuyện cùng nhau! "
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message_chat_box;
