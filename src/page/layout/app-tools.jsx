import { Modal } from "antd";
import React, { useState } from "react";

const App_tools = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showExitConfirm = () => {
    window.electron.send("close");
    // Modal.confirm({
    //   title: "Bạn có chắc chắn muốn thoát?",
    //   content: "Dữ liệu của bạn có thể bị mất!",
    //   okText: "Thoát",
    //   cancelText: "Hủy",
    //   maskClosable: true,
    //   onOk: () => {
    //     console.log("Đang thoát");
    //     window.electron.send("exit");
    //   },
    // });
  };
  return (
    <>
      <div className="document"></div>
      <div className="user-tools">
        <div className="search">
          <div className="searchbox">
            <div className="icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <input type="text" />
          </div>
        </div>
        {/* <label className="switch">
          <input
            type="checkbox"
            defaultChecked={true}
            onClick={() => {
              localStorage.setItem("new_version", 1);
              location.href = location.origin + "/electron/";
            }}
          />
          <span className="slider"></span>
        </label>
        <div className="lock">
          <i className="fa-solid fa-lock"></i>
        </div> */}
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
