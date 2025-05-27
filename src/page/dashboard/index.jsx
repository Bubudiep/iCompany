import React from "react";

const Dashboard_index = () => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-1">
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto p-2">
          <div className="flex gap-4 fadeInTop">
            <div className="flex flex-col gap-4 w-[calc(25%-12px)]">
              <div className="flex whitebox h-[200px] w-full"></div>
              <div className="flex whitebox h-[200px] w-full"></div>
            </div>
            <div className="flex whitebox flex-1"></div>
            <div className="flex flex-col gap-4 w-[calc(25%-12px)]">
              <div className="flex whitebox h-[200px] w-full"></div>
              <div className="flex whitebox h-[200px] w-full"></div>
            </div>
          </div>
          <div className="flex gap-4 fadeInTop">
            <div className="flex whitebox h-[240px] w-full"></div>
            <div className="flex whitebox h-[240px] w-full"></div>
            <div className="flex whitebox h-[240px] w-full"></div>
            <div className="flex whitebox h-[240px] w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard_index;
