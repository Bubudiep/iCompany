import React, { useState } from "react";
import { FaCaretRight, FaChevronLeft } from "react-icons/fa";
import clsx from "clsx";

const LeftNav = ({ children, className }) => {
  const [miniSize, setMiniSize] = useState(false);

  return (
    <div className={clsx("left-menu", miniSize ? "mini" : "normal", className)}>
      {children}

      <div className="show-btn" onClick={() => setMiniSize(!miniSize)}>
        {/* Icon đổi chiều khi thu gọn */}
        {miniSize ? <FaCaretRight /> : <FaChevronLeft />}
      </div>
    </div>
  );
};

export default LeftNav;
