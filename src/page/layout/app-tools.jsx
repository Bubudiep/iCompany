import { Modal, Tooltip } from "antd";
import React, { useRef, useState } from "react";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { FaDotCircle, FaUser, FaUserAlt } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const App_tools = ({ user }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const searchRef = useRef();
  const showExitConfirm = () => {
    window.electron.send("close");
  };
  return (
    <>
      <div className="document"></div>
      <div className="user-tools">
        <div className="search" onClick={() => searchRef?.current?.focus()}>
          <div className="searchbox">
            <div className="icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <input type="text" ref={searchRef} />
          </div>
        </div>
        <Tooltip
          title={(user?.onlines?.length ?? 0) + " người đang online"}
          className="flex items-center flex-col relative cursor-pointer mr-2"
        >
          <FaUserAlt size={17} className="text-[#4096ff]" />
          <div
            className="text-[8px] absolute text-nowrap -right-1.5 -bottom-1.5 text-white border-1 border-[#fff]
          bg-[#005dcf] w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-lg font-bold"
          >
            {user?.onlines?.length || 0}
          </div>
        </Tooltip>
        <div
          className="item"
          onClick={() => {
            window.electron.send("minimize");
          }}
        >
          <i className="fa-solid fa-minus"></i>
        </div>
        <div
          className="item"
          onClick={() => {
            window.electron.send("maximize");
          }}
        >
          <i className="fa-solid fa-expand"></i>
        </div>
        <div className="item exit" onClick={showExitConfirm}>
          <i className="fa-solid fa-xmark"></i>
        </div>
      </div>
    </>
  );
};

export default App_tools;
