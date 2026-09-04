import React from "react";

const StatCard = ({ title, value, icon, color, trend, percentage }) => {
  return (
    <div
      className={`stat-card max-w-[380px] w-full bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border dark:border-gray-600 transition duration-300 ${
        color.split(" ")[0]
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-500 truncate bk-14">{title}</p>
          <p className="mt-[2px] text-[24px] font-medium text-gray-800 dark:text-gray-200">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
      {/* <div className="flex items-center mt-4">
        <span
          className={`text-sm font-medium ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          <i className={`fas fa-arrow-${trend} mr-1`}></i>
          {percentage}
        </span>
        <span className="ml-2 text-sm text-gray-500">vs last month</span>
      </div> */}
    </div>
  );
};
export default StatCard;
