import React from "react";
import LeftNav from "../../components/layout/LeftNav";
import { FaQrcode } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";

const Extends_index = () => {
  return (
    <div className="flex flex-1">
      <LeftNav>
        <div className="items px-2 py-1">
          <Link to="qrbanks" className="item">
            <div className="icon">
              <FaQrcode />
            </div>
            <div className="font-[500] name">QRBanks</div>
          </Link>
        </div>
      </LeftNav>
      <Outlet />
    </div>
  );
};

export default Extends_index;
