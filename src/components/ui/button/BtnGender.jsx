import React from "react";

const BtnGender = ({ title, selected, clickFunc }) => {
  return (
    <button
      type="button"
      onClick={clickFunc}
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition w-full h-11 border border-transparent bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300  ${
        selected
          ? "!border-brand-400 !text-brand-600 outline-hidden dark:border-brand-800 shadow-theme-xs"
          : ""
      }`}
    >
      {title}
    </button>
  );
};

export default BtnGender;
