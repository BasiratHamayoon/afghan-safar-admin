import React from "react";

const VehicleTypeShower = ({ name }) => {
  const svgs = {
    bus: (
      <svg
        width="20px"
        height="20px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M5 6V15.8C5 16.9201 5 17.4802 5.21799 17.908C5.40973 18.2843 5.71569 18.5903 6.09202 18.782C6.51984 19 7.07989 19 8.2 19H15.8C16.9201 19 17.4802 19 17.908 18.782C18.2843 18.5903 18.5903 18.2843 18.782 17.908C19 17.4802 19 16.9201 19 15.8V6M5 6C5 6 5 3 12 3C19 3 19 6 19 6M5 6H19M5 13H19M17 21V19M7 21V19M8 16H8.01M16 16H16.01"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </g>
      </svg>
    ),
    car: (
      <svg
        width="20px"
        height="20px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M3 8L5.72187 10.2682C5.90158 10.418 6.12811 10.5 6.36205 10.5H17.6379C17.8719 10.5 18.0984 10.418 18.2781 10.2682L21 8M6.5 14H6.51M17.5 14H17.51M8.16065 4.5H15.8394C16.5571 4.5 17.2198 4.88457 17.5758 5.50772L20.473 10.5777C20.8183 11.1821 21 11.8661 21 12.5623V18.5C21 19.0523 20.5523 19.5 20 19.5H19C18.4477 19.5 18 19.0523 18 18.5V17.5H6V18.5C6 19.0523 5.55228 19.5 5 19.5H4C3.44772 19.5 3 19.0523 3 18.5V12.5623C3 11.8661 3.18166 11.1821 3.52703 10.5777L6.42416 5.50772C6.78024 4.88457 7.44293 4.5 8.16065 4.5ZM7 14C7 14.2761 6.77614 14.5 6.5 14.5C6.22386 14.5 6 14.2761 6 14C6 13.7239 6.22386 13.5 6.5 13.5C6.77614 13.5 7 13.7239 7 14ZM18 14C18 14.2761 17.7761 14.5 17.5 14.5C17.2239 14.5 17 14.2761 17 14C17 13.7239 17.2239 13.5 17.5 13.5C17.7761 13.5 18 13.7239 18 14Z"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
        </g>
      </svg>
    ),
    plane: (
      <svg
        width="20px"
        height="20px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.5837 5.41645C18.1592 4.99196 17.6263 5.04801 17.3863 5.28808L13.5703 9.10406L7.61668 7.89819L7.46932 8.04555L12.2107 10.4636L7.75852 14.9158L4.80697 14.2876L4.57689 14.5177L7.50724 16.4929L9.48244 19.4233L9.71253 19.1932L9.08434 16.2416L13.5366 11.7894L15.9546 16.5308L16.102 16.3835L14.8961 10.4299L18.7121 6.6139C18.9522 6.37383 19.0082 5.84094 18.5837 5.41645ZM16.3256 4.22742C17.2617 3.29127 18.7508 3.46226 19.6444 4.35579C20.5379 5.24932 20.7089 6.73841 19.7727 7.67456L16.5261 10.9212L17.7319 16.8748L15.556 19.0508L13.1379 14.3094L10.7211 16.7262L11.3493 19.6778L9.256 21.771L6.42666 17.5735L2.22913 14.7442L4.32239 12.6509L7.27393 13.2791L9.69075 10.8623L4.94935 8.4442L7.12534 6.26821L13.0789 7.47408L16.3256 4.22742Z"
            fill="#000000"
          ></path>
        </g>
      </svg>
    ),
    train: (
      <svg
        width="20px"
        height="20px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M5 11H19M9 18L6 21M15 18L18 21M12 11V4M8 15H8.01M16 15H16.01M8.2 18H15.8C16.9201 18 17.4802 18 17.908 17.782C18.2843 17.5903 18.5903 17.2843 18.782 16.908C19 16.4802 19 15.9201 19 14.8V6.2C19 5.0799 19 4.51984 18.782 4.09202C18.5903 3.71569 18.2843 3.40973 17.908 3.21799C17.4802 3 16.9201 3 15.8 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.07989 5 6.2V14.8C5 15.9201 5 16.4802 5.21799 16.908C5.40973 17.2843 5.71569 17.5903 6.09202 17.782C6.51984 18 7.07989 18 8.2 18Z"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </g>
      </svg>
    ),
  };

  const clrs = {
    bus: "#32d583",
    car: "#fd853a",
    plane: "#7592ff",
    train: "#d0d5dd",
  };
  const textClrs = {
    bus: "#053321",
    car: "#511c10",
    plane: "#161950",
    train: "#1a2231",
  };
  return (
    <div
      style={{ background: clrs[name], color: textClrs[name] }}
      className={`px-[8px] flex-center max-w-max gap-[5px] rounded-[5px] bk-12 py-[2px]`}
    >
      {svgs[name]}
      <span>{name?.toUpperCase()}</span>
    </div>
  );
};

export default VehicleTypeShower;
