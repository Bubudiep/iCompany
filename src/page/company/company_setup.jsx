import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button, Modal, Select } from "antd";
import { FaSave } from "react-icons/fa";
import { useUser } from "../../components/context/userContext";
import api from "../../components/api";

// Component con để tái sử dụng checkbox item
const CheckboxItem = ({ label, description, value, onChange }) => (
  <div className={`item !gap-6 !px-6 ${value ? "enable" : ""}`}>
    <label className="checkbox_container">
      <input type="checkbox" checked={value} onChange={onChange} />
      <div className="checkmark"></div>
    </label>
    <div className="c">
      <div className="n">{label}</div>
      <div className="m">{description}</div>
    </div>
  </div>
);
const CompanySetup = () => {
  const { user, setUser } = useUser();
  const { menu } = useOutletContext();
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(false);
  const handleSave = () => {
    Modal.confirm({
      title: "Xác nhận!",
      content: "Việc lưu cài đặt có thể ảnh hưởng đến những chức năng khác!",
      onOk: () => {
        setLoading(true);
        api
          .post(`com/${user?.company?.id}/config/`, config, user?.token)
          .then((res) => {
            setUser((prev) => ({
              ...prev,
              company: { ...prev.company, Config: res },
            }));
          })
          .catch(api.error)
          .finally(() => setLoading(false));
      },
    });
  };
  useEffect(() => {
    if (user?.company?.Config) setConfig(user.company.Config);
  }, [user?.company?.Config]);
  const handleToggle = (key) => {
    if (user?.info?.isSuperAdmin)
      setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{menu.icon}</div>
          {menu.label}
        </div>
        <div className="ml-auto">
          {JSON.stringify(config) !== JSON.stringify(user?.company?.Config) &&
            user?.info?.isSuperAdmin && (
              <Button
                type="primary"
                icon={<FaSave />}
                loading={loading}
                onClick={handleSave}
              >
                Lưu thiết lập
              </Button>
            )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop">
        <div className="whitebox h-full flex flex-col min-w-[600px] !p-0">
          {/* --- Nhóm 1: Thông tin NLĐ --- */}
          <div className="font-[500] px-3 py-2 border-b-1 border-[#0003]">
            Thông tin Người lao động
          </div>
          <div className="setup_items items fadeInTop bg-[#eef3f7]">
            <CheckboxItem
              label="Sửa thông tin NLĐ"
              description="Tất cả mọi người đang có quyền sửa thông tin người lao động"
              value={config?.editop_active}
              onChange={() => handleToggle("editop_active")}
            />
            <CheckboxItem
              label="Cập nhập lịch sử đi làm của NLĐ"
              description="Tất cả mọi người đang có quyền thêm/xóa lịch sử đi làm của người lao động"
              value={config?.editopwork_active}
              onChange={() => handleToggle("editopwork_active")}
            />
          </div>

          {/* --- Nhóm 2: Báo ứng --- */}
          <div className="font-[500] px-3 py-2 border-t-1 border-b-1 border-[#0003]">
            Báo ứng
          </div>
          <div className="setup_items items fadeInTop bg-[#eef3f7]">
            <CheckboxItem
              label="Cho phép báo ứng"
              description="Mọi người đang có thể báo ứng"
              value={config?.baoung_active}
              onChange={() => handleToggle("baoung_active")}
            />
            <div
              className={`item !gap-6 !px-6 ${
                config?.baoung_active_time ? "enable" : ""
              }`}
            >
              <label className="checkbox_container">
                <input
                  type="checkbox"
                  checked={config?.baoung_active_time || false}
                  onChange={() => handleToggle("baoung_active_time")}
                />
                <div className="checkmark"></div>
              </label>
              <div className="c">
                <div className="n">Báo ứng cố định</div>
                <div className="m">
                  Chỉ những ngày được chọn mới có thể báo ứng
                </div>
              </div>

              {/* --- Select khi bật báo ứng cố định --- */}
              {config?.baoung_active_time && (
                <div className="flex ml-auto gap-2">
                  <Select
                    className="w-[120px]"
                    value={config?.baoung_active_type || "week"}
                    onChange={(value) =>
                      setConfig((prev) => ({
                        ...prev,
                        baoung_active_type: value,
                        baoung_active_date: [],
                      }))
                    }
                    options={[
                      { label: "Theo tuần", value: "week" },
                      { label: "Theo tháng", value: "month" },
                    ]}
                  />
                  <Select
                    mode="multiple"
                    allowClear
                    className="w-[160px] custom-select"
                    maxTagCount={0}
                    optionFilterProp="label"
                    maxTagPlaceholder={(omitted) =>
                      `Đã chọn ${omitted.length} ${
                        config?.baoung_active_type === "week" ? "thứ" : "ngày"
                      }`
                    }
                    placeholder={
                      config?.baoung_active_type === "week"
                        ? "Chọn thứ"
                        : "Chọn ngày"
                    }
                    value={config?.baoung_active_date || []}
                    onChange={(value) =>
                      setConfig((prev) => ({
                        ...prev,
                        baoung_active_date: value,
                      }))
                    }
                    options={
                      config?.baoung_active_type === "week"
                        ? [
                            "Thứ 2",
                            "Thứ 3",
                            "Thứ 4",
                            "Thứ 5",
                            "Thứ 6",
                            "Thứ 7",
                            "Chủ nhật",
                          ].map((day, i) => ({ label: day, value: i + 1 }))
                        : Array.from({ length: 31 }, (_, i) => ({
                            label: `Ngày ${i + 1}`,
                            value: i + 1,
                          }))
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;
