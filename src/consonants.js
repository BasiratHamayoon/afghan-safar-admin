const roles = {
  admin: "Administrator",
  moderator: "Moderator",
  transport_company_user: "Transport company user",
  driver: "Driver",
  passenger: "Passenger",
  travel_agent: "Travel Agent",
};

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
        ></path>
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

const link = (
  <svg
    fill="#465fff"
    width="20px"
    height="20px"
    viewBox="0 0 64 64"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    xmlSpace="preserve"
    xmlnsserif="http://www.serif.com/"
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinejoin: "round",
      strokeMiterlimit: "2",
    }}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <rect
        id="Icons"
        x="-896"
        y="0"
        width="1280"
        height="800"
        style={{ fill: "none" }}
      ></rect>
      <g id="Icons1" serifid="Icons">
        <g id="Strike"> </g> <g id="H1"> </g> <g id="H2"> </g> <g id="H3"> </g>
        <g id="list-ul"> </g> <g id="hamburger-1"> </g>
        <g id="hamburger-2"> </g> <g id="list-ol"> </g> <g id="list-task"> </g>
        <g id="trash"> </g> <g id="vertical-menu"> </g>
        <g id="horizontal-menu"> </g> <g id="sidebar-2"> </g> <g id="Pen"> </g>
        <g id="Pen1" serifid="Pen"></g>
        <g id="clock"> </g>
        <g id="external-link">
          <path d="M36.026,20.058l-21.092,0c-1.65,0 -2.989,1.339 -2.989,2.989l0,25.964c0,1.65 1.339,2.989 2.989,2.989l26.024,0c1.65,0 2.989,-1.339 2.989,-2.989l0,-20.953l3.999,0l0,21.948c0,3.308 -2.686,5.994 -5.995,5.995l-28.01,0c-3.309,0 -5.995,-2.687 -5.995,-5.995l0,-27.954c0,-3.309 2.686,-5.995 5.995,-5.995l22.085,0l0,4.001Z"></path>
          <path d="M55.925,25.32l-4.005,0l0,-10.481l-27.894,27.893l-2.832,-2.832l27.895,-27.895l-10.484,0l0,-4.005l17.318,0l0.002,0.001l0,17.319Z"></path>
        </g>
        <g id="hr"> </g> <g id="info"> </g> <g id="warning"> </g>
        <g id="plus-circle"> </g> <g id="minus-circle"> </g> <g id="vue"> </g>
        <g id="cog"> </g> <g id="logo"> </g> <g id="radio-check"> </g>
        <g id="eye-slash"> </g> <g id="eye"> </g> <g id="toggle-off"> </g>
        <g id="shredder"> </g>
        <g id="spinner--loading--dots-" serifid="spinner [loading, dots]"></g>
        <g id="react"> </g> <g id="check-selected"> </g> <g id="turn-off"> </g>
        <g id="code-block"> </g> <g id="user"> </g> <g id="coffee-bean"> </g>
        <g id="coffee-beans">
          <g id="coffee-bean1" serifid="coffee-bean"></g>
        </g>
        <g id="coffee-bean-filled"> </g>
        <g id="coffee-beans-filled">
          <g id="coffee-bean2" serifid="coffee-bean"></g>
        </g>
        <g id="clipboard"> </g> <g id="clipboard-paste"> </g>
        <g id="clipboard-copy"> </g> <g id="Layer1"> </g>
      </g>
    </g>
  </svg>
);

const handle = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.75 2.50492C13.8902 3.16319 14.8369 4.10998 15.4952 5.25013C16.1535 6.39028 16.5 7.68362 16.5 9.00016C16.5 10.3167 16.1534 11.61 15.4952 12.7502C14.8369 13.8903 13.8901 14.8371 12.7499 15.4953C11.6098 16.1536 10.3164 16.5001 8.99988 16.5001C7.68335 16.5001 6.39001 16.1535 5.24988 15.4952C4.10974 14.8369 3.16297 13.8901 2.50473 12.75C1.84649 11.6098 1.49997 10.3165 1.5 8.99992L1.50375 8.75692C1.54575 7.46166 1.92266 6.19939 2.59773 5.09316C3.2728 3.98694 4.22299 3.07451 5.35567 2.44483C6.48835 1.81515 7.76486 1.48972 9.06075 1.50025C10.3566 1.51078 11.6277 1.85692 12.75 2.50492ZM3 8.99992C3.00005 10.4613 3.53344 11.8724 4.50006 12.9684C5.46669 14.0644 6.80009 14.77 8.25 14.9527V11.1224C7.9058 11.0008 7.59636 10.7973 7.34836 10.5295C7.10036 10.2616 6.92125 9.93744 6.8265 9.58492L3.024 8.45692C3.0085 8.63692 3.0005 8.81742 3 8.99992ZM14.9752 8.45692L11.1735 9.58417C11.0789 9.93675 10.9 10.261 10.6521 10.529C10.4042 10.797 10.0949 11.0007 9.75075 11.1224V14.9534C11.2629 14.7628 12.6459 14.004 13.6188 12.8308C14.5918 11.6577 15.0819 10.1582 14.9895 8.63692L14.9752 8.45692ZM6 3.80392C4.76611 4.51638 3.82603 5.64469 3.348 6.98692L6.957 8.05642C7.13709 7.66613 7.42521 7.33559 7.78726 7.10391C8.14932 6.87223 8.57016 6.7491 9 6.7491C9.42984 6.7491 9.85068 6.87223 10.2127 7.10391C10.5748 7.33559 10.8629 7.66613 11.043 8.05642L14.652 6.98692C14.3569 6.1583 13.8831 5.40471 13.2644 4.77952C12.6456 4.15434 11.897 3.67284 11.0715 3.36914C10.2459 3.06543 9.36373 2.94696 8.48734 3.02209C7.61094 3.09722 6.76178 3.36414 6 3.80392Z"
      fill="#837878"
    />
  </svg>
);

export { roles, svgs, link, handle };
