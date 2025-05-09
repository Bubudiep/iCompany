import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";

// Trả về [chuỗi hiển thị, đơn vị cập nhật (ms)]
const getTimeDiff = (createdAt) => {
  const orderDate = new Date(createdAt);
  const now = new Date();
  const diffMs = orderDate - now;
  const isFuture = diffMs > 0;
  const diffAbsMs = Math.abs(diffMs);

  const seconds = Math.floor(diffAbsMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const quarters = Math.floor(months / 3);
  const years = Math.floor(months / 12);

  const suffix = isFuture ? "nữa" : "trước";

  const minDelay = 10_000;

  if (seconds < 60)
    return [`${seconds} giây ${suffix}`, Math.max(1000, minDelay)];
  if (minutes < 60)
    return [`${minutes} phút ${suffix}`, Math.max(60_000, minDelay)];
  if (hours < 24)
    return [`${hours} giờ ${suffix}`, Math.max(3_600_000, minDelay)];
  if (days < 7)
    return [`${days} ngày ${suffix}`, Math.max(86_400_000, minDelay)];
  if (weeks < 4)
    return [`${weeks} tuần ${suffix}`, Math.max(604_800_000, minDelay)];
  if (months < 12)
    return [`${months} tháng ${suffix}`, Math.max(2_592_000_000, minDelay)];
  if (quarters < 4)
    return [`${quarters} quý ${suffix}`, Math.max(7_776_000_000, minDelay)];
  return [`${years} năm ${suffix}`, Math.max(31_536_000_000, minDelay)];
};

const TimeSinceText = ({ createdAt }) => {
  const [[text, delay], setDisplay] = useState(() => getTimeDiff(createdAt));
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay(getTimeDiff(createdAt));
    }, delay);
    return () => clearInterval(interval);
  }, [createdAt, delay]);

  return (
    <Tooltip
      title={
        <div className="!text-black">
          {new Date(createdAt).toLocaleString()}
        </div>
      }
      color="white"
    >
      <>{text}</>
    </Tooltip>
  );
};

export default TimeSinceText;
