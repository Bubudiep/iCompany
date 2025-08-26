import React, { useEffect, useState } from "react";
import Staff_view from "../../../../components/by_id/staff_view";
import Vendor_view from "../../../../components/by_id/vendor_view";
import { useUser } from "../../../../components/context/userContext";
import { Button, Empty, Modal, Tooltip } from "antd";
import Customer_view from "../../../../components/by_id/customer_view";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { FaSortDown } from "react-icons/fa";

const Modal_chitiet_dilam = ({
  visible,
  setVisible,
  selectedDate,
  filteredData,
}) => {
  const { user, setUser } = useUser();
  const [showDetail, setShowDetail] = useState(false);
  useEffect(() => {
    setShowDetail(false);
  }, [visible]);
  return (
    <Modal
      open={visible}
      onCancel={() => setVisible(false)}
      title={`Người lao động đi làm ${selectedDate} (${filteredData.length} người)`}
      footer={null}
      width={1100}
      className="popupcontent !top-10"
    >
      {filteredData.length === 0 ? (
        <Empty description="Không có dữ liệu" />
      ) : (
        <div className="max-h-[600px] min-h-[300px] overflow-auto text-sm">
          <div className="flex px-2 gap-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.entries(
                filteredData.reduce((acc, cur) => {
                  const key = cur.customer || "unknown";
                  acc[key] = (acc[key] || 0) + 1;
                  return acc;
                }, {})
              ).map(([customerId, count]) => (
                <div
                  key={customerId}
                  className="flex flex-col bg-white shadow border border-[#e0e0e0] rounded-xl w-[200px]"
                >
                  <div className="flex justify-between p-2 border-b border-[#e0e0e0]">
                    <div className="font-medium text-sm text-gray-800 flex items-center gap-1">
                      {customerId !== "unknown" ? (
                        <Customer_view
                          id={customerId}
                          className="font-[400] text-[12px] !text-[#000]"
                        />
                      ) : (
                        <span className="italic text-[12px] text-gray-400 font-[400]">
                          Vendor khác
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] flex gap-1.5">
                      <b className="font-[500] text-[10px] bg-[#999] min-w-4 rounded-2xl h-4 flex text-[#fff] items-center justify-center">
                        {count}
                      </b>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 py-1">
                    <table>
                      <tbody>
                        {Object.entries(
                          filteredData
                            ?.filter((t) => t?.customer == customerId)
                            .reduce((acc, cur) => {
                              const key =
                                cur.nguoituyen || "vendor_" + cur.vendor;
                              if (!acc[key]) {
                                acc[key] = {
                                  oldCount: 0,
                                  newCount: 0,
                                  total: 0,
                                };
                              }
                              if (cur.isnew) {
                                acc[key].newCount += 1;
                              } else {
                                acc[key].oldCount += 1;
                              }
                              acc[key].total += 1;
                              return acc;
                            }, {})
                        )
                          .map(([staffId, counts]) => ({
                            staffId,
                            ...counts,
                          }))
                          .sort((a, b) => {
                            const aIsVendor = a.staffId.startsWith("vendor_");
                            const bIsVendor = b.staffId.startsWith("vendor_");

                            if (aIsVendor && !bIsVendor) return 1; // a xuống cuối
                            if (!aIsVendor && bIsVendor) return -1; // b xuống cuối

                            // còn lại thì sắp xếp theo total
                            return b.total - a.total;
                          })
                          .map(({ staffId, newCount, oldCount }) => (
                            <tr key={staffId} className="justify-between gap-4">
                              <td className="font-medium text-sm text-gray-800 items-center gap-1 pl-2">
                                {!staffId.startsWith("vendor_") ? (
                                  <Staff_view
                                    id={staffId}
                                    className="font-[400] text-[12px]"
                                  />
                                ) : (
                                  <span className="flex gap-1 text-[12px] font-[400] mb-0.5">
                                    <div className="bg-[#0077ff] text-[8px] text-[white] px-1 flex items-center rounded-[4px]">
                                      vendor
                                    </div>
                                    <Vendor_view
                                      id={parseInt(staffId.split("_")[1])}
                                    />
                                  </span>
                                )}
                              </td>
                              <td className="text-[12px] w-6 text-center gap-1.5 text-[#006eff]">
                                <Tooltip title="Đi làm mới">
                                  <b className="font-[500] cursor-pointer">
                                    {newCount || "-"}
                                  </b>
                                </Tooltip>
                              </td>
                              <td className="text-[12px] w-6 text-center gap-1.5 text-[#041d3d]">
                                <Tooltip title="Chuyển công ty">
                                  <b className="font-[500] cursor-pointer">
                                    {oldCount || "-"}
                                  </b>
                                </Tooltip>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center mt-5">
            <FaSortDown />
            <Button
              className="text-[12px] bg-[#afafaf] px-2 py-1 text-[#fff] rounded-xl"
              onClick={() => setShowDetail((o) => !o)}
            >
              Hiển thị chi tiết
            </Button>
          </div>
          {showDetail && (
            <table className="w-full mt-5">
              <tbody>
                <tr className="sticky top-0 bg-[#fff] z-10 shadow">
                  <td className="text-[12px] font-[500] text-[#999] pb-2"></td>
                  <td className="text-[12px] font-[500] text-[#999] pb-2">
                    Công ty
                  </td>
                  <td className="text-[12px] font-[500] text-[#999] pb-2">
                    Mã NV
                  </td>
                  <td className="text-[12px] font-[500] text-[#999] pb-2">
                    Họ và tên
                  </td>
                  <td className="text-[12px] font-[500] text-[#999] pb-2">
                    Nhà chính
                  </td>
                  <td className="text-[12px] font-[500] text-[#999] pb-2">
                    Vendor
                  </td>
                  <td className="text-[12px] font-[500] text-[#999] pb-2">
                    Người tuyển
                  </td>
                  <td className="text-[12px] font-[500] text-[#999] pb-2">
                    Người báo cáo
                  </td>
                  <td className="text-[12px] font-[500] text-[#999] pb-2">
                    Ngày vào làm
                  </td>
                </tr>
                {filteredData.map((item, idx) => {
                  const op = user?.company?.Operator?.find(
                    (o) => o?.id === item.operator
                  );
                  return (
                    <tr
                      key={idx}
                      className="border-b-[#c2c2c2] border-b text-[#555] text-[13px]"
                    >
                      <td className="py-2 text-[10px] text-nowrap">
                        {item?.isnew ? "Đi làm mới" : "Chuyển công ty"}
                      </td>
                      <td className="py-2">
                        <Customer_view id={item?.customer} />
                      </td>
                      <td className="py-2">{item?.ma_nhanvien || "--"}</td>
                      <td className="py-2">
                        <Link
                          to={`/app/operators/all/${op?.id}`}
                          className="flex flex-col"
                        >
                          <div className="flex text-[#000]">
                            {op?.ho_ten || "--"}
                          </div>
                          <div className="flex text-[#999] leading-3 text-[10px]">
                            {op?.ma_nhanvien || "--"}
                          </div>
                        </Link>
                      </td>
                      <td>
                        {op?.nhachinh ? (
                          <div className="relative flex items-center gap-1">
                            <div className="text-[9px] px-1 bg-[#008cff] text-[#fff] rounded-[4px]">
                              vendor
                            </div>
                            <Vendor_view id={op?.nhachinh} />
                          </div>
                        ) : (
                          "--"
                        )}
                      </td>
                      <td>
                        {op?.vendor ? (
                          <div className="relative flex items-center gap-1">
                            <div className="text-[9px] px-1 bg-[#008cff] text-[#fff] rounded-[4px]">
                              vendor
                            </div>
                            <Vendor_view id={op?.vendor} />
                          </div>
                        ) : (
                          item?.vendor && <Vendor_view id={item?.vendor} />
                        )}
                      </td>
                      <td>
                        {item?.nguoituyen ? (
                          <Staff_view id={item?.nguoituyen} />
                        ) : item?.vendor ? (
                          <div className="flex gap-1">
                            <div
                              className="flex text-[#fff] bg-[#106c97] px-1 rounded-[4px]
                                  text-[9px] items-center justify-center"
                            >
                              Vendor
                            </div>
                            <Vendor_view id={item?.vendor} />
                          </div>
                        ) : (
                          <>--</>
                        )}
                      </td>
                      <td>
                        <Staff_view id={item?.nguoibaocao} />
                      </td>
                      <td>
                        <b className="text-[#999] font-[400]">
                          {dayjs(item.start_date).format("DD/MM/YYYY")}
                        </b>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </Modal>
  );
};

export default Modal_chitiet_dilam;
