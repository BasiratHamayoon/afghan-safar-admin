import React, { useState } from "react";
import Calendar from "@/components/form/input/Calender";

const InputDate = ({ selectedDate, setSelectedDate, className }) => {
  const [showCaleder, setshowCalender] = useState(false);
  return (
    <div
      onClick={() => setshowCalender(!showCaleder)}
      className={
        `h-11 w-full z-[50] cursor-pointer relative appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ` +
        className
      }
    >
      <div className="absolute bg-white max-w-[900px] w-full min-h-[400px]">
        {showCaleder && <Calendar />}
      </div>
    </div>
  );
};

export default InputDate;
