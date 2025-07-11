import { Spin, Tooltip } from "antd";
import { FaInfoCircle } from "react-icons/fa";

const Db_baokhac_card = ({ rawData, loading }) => {
  const baoung =
    rawData?.filter(
      (i) => !["Báo ứng", "Báo giữ lương"].includes(i?.requesttype)
    ) || [];
  const statusConfigs = [
    {
      label: "Hoàn thành",
      condition: (item) =>
        item.status === "approved" && item.payment_status === "done",
      bg: "#dbffcb",
      textColor: "#3d963d",
    },
    {
      label: "Chờ duyệt",
      condition: (item) => item.status === "pending",
      bg: "#ffe9d7",
      textColor: "#c77e4d",
    },
  ];
  return (
    <div className="flex whitebox flex-col h-[124px] w-full !min-w-[300px]">
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex flex-col fadeIn flex-1">
          <div className="text-[15px] text-[#666] font-[500] flex justify-between">
            Báo chi tiêu
            <Tooltip
              color="white"
              title={
                <div className="text-[#636363] max-w-[200px] p-1">
                  Dữ liệu lấy từ danh sách báo chi tiêu của công ty từ trước đến
                  nay.
                </div>
              }
            >
              <div className="ml-auto text-[#c4c4c4] transition-all duration-300 hover:text-[#666] cursor-pointer">
                <FaInfoCircle />
              </div>
            </Tooltip>
          </div>
          <div className="flex mt-auto gap-1">
            <div className="flex w-[50%] flex-col bg-[#e2f2ff] text-[#008cff] rounded-[4px] px-1">
              <div className="flex px-1 py-1 font-[500]">Tất cả</div>
              <div className="flex flex-1 items-center justify-center text-[35px] font-[500] mb-2">
                {baoung?.length || 0}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1 mt-auto">
              {statusConfigs.map(
                ({ label, condition, bg, textColor }, index) => {
                  const filtered = baoung.filter(condition);
                  const totalAmount = filtered.reduce(
                    (sum, item) => sum + parseInt(item.amount || 0),
                    0
                  );
                  return (
                    <div
                      key={index}
                      className="flex flex-col rounded-[4px] p-1 px-2 text-[13px] font-[500] leading-4.5"
                      style={{ backgroundColor: bg, color: textColor }}
                    >
                      <div className="flex justify-between">
                        <div className="name">{label}</div>
                        <div className="value">{filtered.length}</div>
                      </div>
                      <div className="flex">
                        {totalAmount.toLocaleString()} vnđ
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Db_baokhac_card;
