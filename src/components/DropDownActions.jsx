import React from "react";

const DropDownActions = ({ buttons }) => {
  const btns = [];
  return (
    <div className="absolute top-[25px] border border-gray-400 left-[50%] translate-x-[-50%] w-[60px] rounded-[10px] flex flex-col bg-gray-200 z-[20]">
      <ul className="w-full">
        <li>
          <button className="w-full h-[50px] med-12">Block</button>
        </li>
        <li>
          <button className="w-full h-[50px] med-12">Un-Block</button>
        </li>
        <li>
          <button className="w-full h-[50px] med-12">Delete</button>
        </li>
        <li>
          <button className="w-full h-[50px] med-12">Send Notifications</button>
        </li>
      </ul>
    </div>
  );
};

export default DropDownActions;
