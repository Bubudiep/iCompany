import React from "react";
import "../assets/css/mobile.css";

const Mobile_layout = () => {
  const sendMessageToApp = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "notification",
          data: "Hello from web!",
        })
      );
    } else {
      console.warn("Không tìm thấy ReactNativeWebView");
    }
  };
  return (
    <div className="mt-10">
      <button onClick={sendMessageToApp}>Gửi tin nhắn về app</button>
    </div>
  );
};

export default Mobile_layout;
