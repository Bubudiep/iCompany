import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Alert_box from "../../components/alert-box";
import { Button, Input, Select } from "antd";
import { useUser } from "../../components/context/userContext";

const Company_setup = () => {
  const { user, setUser } = useUser();
  const { menu } = useOutletContext();
  const [config, setConfig] = useState({
    approve_admin: [],
    staff_can_approve: [],
    staff_can_payout: [],
    admin_can_approve: false,
    admin_can_payout: false,
  });
  useEffect(() => {
    if (user?.company?.Config) {
      setConfig((old) => ({ ...old, ...user?.company?.Config }));
    }
  }, [user]);
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{menu.icon}</div>
          {menu.label}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop">
        <Alert_box text="Chỉ boss và admin mới được thêm mới tài khoản" />
        <div className="whitebox h-full flex flex-col min-w-[600px]">
          <div className="setup_items items fadeInTop">
            <div className="item !flex-row !py-3 justify-between items-center">
              <div className={`flex flex-col text-[#000]`}>
                <div className="name">Sửa thông tin NLĐ</div>
                <div className="value">
                  Nhân viên có quyền sửa thông tin người lao động
                </div>
              </div>
              <div className="view">
                <Input type="checkbox" checked />
              </div>
            </div>
            <div className="item !flex-row !py-3 justify-between items-center">
              <div className="flex flex-col text-[#000]">
                <div className="name">Danh sách admin phê duyệt</div>
                <div className="value">
                  Quyền: chấp nhận/hủy phê duyệt, giải ngân/ thu hồi tiền báo
                  ứng
                </div>
              </div>
              <div className="view">
                <Button type="primary">
                  Xem ({config?.approve_admin?.length || 0})
                </Button>
              </div>
            </div>
            <div className="item !flex-row !py-3 justify-between items-center">
              <div className="flex flex-col text-[#000]">
                <div className="name">Danh sách những người được phê duyệt</div>
                <div className="value">Quyền: chấp nhận/hủy phê duyệt</div>
              </div>
              <div className="view">
                <Button type="primary">
                  Xem ({config?.staff_can_approve?.length || 0})
                </Button>
              </div>
            </div>
            <div className="item !flex-row !py-3 justify-between items-center">
              <div className="flex flex-col text-[#000]">
                <div className="name">Danh sách những người được giải ngân</div>
                <div className="value">
                  Quyền: chấp giải ngân/ thu hồi tiền báo ứng
                </div>
              </div>
              <div className="view">
                <Button type="primary">
                  Xem ({config?.staff_can_payout?.length || 0})
                </Button>
              </div>
            </div>
            <div className="item !flex-row !py-3 justify-between items-center">
              <div
                className={`flex flex-col ${
                  config?.admin_can_approve ? "text-[#000]" : ""
                }`}
              >
                <div className="name">Admin có quyền phê duyệt</div>
                <div className="value">
                  Tất cả nhân viên là admin đều có quyền chấp nhận/hủy phê duyệt
                </div>
              </div>
              <div className="view">
                <Input type="checkbox" checked={config?.admin_can_approve} />
              </div>
            </div>
            <div className="item !flex-row !py-3 justify-between items-center">
              <div
                className={`flex flex-col ${
                  config?.admin_can_payout ? "text-[#000]" : ""
                }`}
              >
                <div className="name">Admin có quyền giải ngân</div>
                <div className="value">
                  Tất cả nhân viên là admin đều có quyền giải ngân/ thu hồi tiền
                  báo ứng
                </div>
              </div>
              <div className="view">
                <Input type="checkbox" checked={config?.admin_can_payout} />
              </div>
            </div>
            <div className="item !flex-row !py-3 justify-between items-center">
              <div className={`flex flex-col text-[#000]`}>
                <div className="name">
                  Admin cập nhập lịch sử đi làm của NLĐ
                </div>
                <div className="value">
                  Admin có quyền thêm/xóa lịch sử đi làm của người lao động
                </div>
              </div>
              <div className="view">
                <Input type="checkbox" checked />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company_setup;
