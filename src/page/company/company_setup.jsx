import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Alert_box from "../../components/alert-box";
import { Button, Input, Modal, Select } from "antd";
import { useUser } from "../../components/context/userContext";
import { FaSave } from "react-icons/fa";
import api from "../../components/api";

const Company_setup = () => {
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
            setUser((old) => ({
              ...old,
              company: {
                ...old?.company,
                Config: res,
              },
            }));
          })
          .catch((e) => api.error(e))
          .finally(() => setLoading(false));
      },
    });
  };
  useEffect(() => {
    if (user?.company?.Config) {
      setConfig(user?.company?.Config);
    }
  }, [user?.company?.Config]);
  useEffect(() => {
    console.log(config, user?.company?.Config);
  }, [config]);
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
                onClick={handleSave}
                type="primary"
                icon={<FaSave />}
                loading={loading}
              >
                Lưu thiết lập
              </Button>
            )}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop">
        <div className="whitebox h-full flex flex-col min-w-[600px] !p-0">
          <div className="font-[500] px-3 py-2 border-b-1 border-[#0003]">
            Thông tin Người lao động
          </div>
          <div className="setup_items items fadeInTop bg-[#eef3f7]">
            <div
              className={`item !gap-6 !px-6 ${
                config?.editop_active ? "enable" : ""
              }`}
            >
              <label className="checkbox_container">
                <input
                  checked={config?.editop_active || false}
                  type="checkbox"
                  onChange={() => {
                    setConfig((old) => ({
                      ...old,
                      editop_active: !config?.editop_active,
                    }));
                  }}
                />
                <div className="checkmark"></div>
              </label>
              <div className="c">
                <div className="n">Sửa thông tin NLĐ</div>
                <div className="m">
                  Tất cả mọi người đang có quyền sửa thông tin người lao động
                </div>
              </div>
            </div>
            <div
              className={`item !gap-6 !px-6 ${
                config?.editopwork_active ? "enable" : ""
              }`}
            >
              <label className="checkbox_container">
                <input
                  checked={config?.editopwork_active || false}
                  type="checkbox"
                  onChange={(e) => {
                    setConfig((old) => ({
                      ...old,
                      editopwork_active: !config?.editopwork_active,
                    }));
                  }}
                />
                <div className="checkmark"></div>
              </label>
              <div className={`flex flex-col text-[#000]`}>
                <div className="n">Cập nhập lịch sử đi làm của NLĐ</div>
                <div className="m">
                  Tất cả mọi người đang có quyền thêm/xóa lịch sử đi làm của
                  người lao động
                </div>
              </div>
            </div>
          </div>
          <div className="font-[500] px-3 py-2 border-t-1 border-b-1 border-[#0003]">
            Báo ứng
          </div>
          <div className="setup_items items fadeInTop bg-[#eef3f7]">
            <div
              className={`item !gap-6 !px-6 ${
                config?.baoung_active ? "enable" : ""
              }`}
            >
              <label className="checkbox_container">
                <input
                  checked={config?.baoung_active || false}
                  type="checkbox"
                  onChange={() => {
                    setConfig((old) => ({
                      ...old,
                      baoung_active: !config?.baoung_active,
                    }));
                  }}
                />
                <div className="checkmark"></div>
              </label>
              <div className="c">
                <div className="n">Cho phép báo ứng</div>
                <div className="m">Mọi người đang có thể báo ứng</div>
              </div>
            </div>
          </div>
          <div className="setup_items items fadeInTop bg-[#eef3f7]">
            <div
              className={`item !gap-6 !px-6 ${
                config?.baoung_active_time ? "enable" : ""
              }`}
            >
              <label className="checkbox_container">
                <input
                  checked={config?.baoung_active_time || false}
                  type="checkbox"
                  onChange={() => {
                    setConfig((old) => ({
                      ...old,
                      baoung_active_time: !config?.baoung_active_time,
                    }));
                  }}
                />
                <div className="checkmark"></div>
              </label>
              <div className="c">
                <div className="n">Báo ứng cố định</div>
                <div className="m">
                  Chỉ những ngày được chọn mới có thế báo ứng
                </div>
              </div>
              <div className="flex ml-auto gap-2">
                {config?.baoung_active_time && (
                  <>
                    <Select
                      className="w-[120px]"
                      value={config?.baoung_active_type || "week"}
                      onChange={(value) => {
                        console.log(value);
                        setConfig((old) => ({
                          ...old,
                          baoung_active_type: value,
                          baoung_active_date: [],
                        }));
                      }}
                      options={[
                        { l: "Theo tuần", v: "week" },
                        { l: "Theo tháng", v: "month" },
                      ].map((c) => ({
                        label: c.l,
                        value: c.v,
                      }))}
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
                        setConfig((old) => ({
                          ...old,
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
                            ].map((day, index) => ({
                              label: day,
                              value: index + 1,
                            }))
                          : Array.from({ length: 31 }, (_, i) => ({
                              label: `Ngày ${i + 1}`,
                              value: i + 1,
                            }))
                      }
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company_setup;
