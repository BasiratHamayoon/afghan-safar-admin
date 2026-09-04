"use client";
import React from "react";
import { useTranslations } from "next-intl";

const NoData = () => {
  const NoDataTrans = useTranslations("NoData");
  return (
    <div className="w-full pt-8 text-center bg-transparent">
      <div className="w-48 h-48 mx-auto mb-6 floating">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="#F8FAFC"
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />

          <rect
            x="60"
            y="60"
            width="80"
            height="100"
            rx="2"
            fill="white"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />

          <line
            x1="70"
            y1="80"
            x2="130"
            y2="80"
            stroke="#E2E8F0"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="70"
            y1="95"
            x2="130"
            y2="95"
            stroke="#E2E8F0"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="70"
            y1="110"
            x2="100"
            y2="110"
            stroke="#E2E8F0"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <circle
            cx="140"
            cy="140"
            r="25"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            fill="none"
          />
          <line
            x1="155"
            y1="155"
            x2="170"
            y2="170"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h2 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        {NoDataTrans("NoDataAvailable")}
      </h2>
      <p className="mb-6 text-gray-500">{NoDataTrans("NoDataDescription")}</p>
    </div>
  );
};

export default NoData;
