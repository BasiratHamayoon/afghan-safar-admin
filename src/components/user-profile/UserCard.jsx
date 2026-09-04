"use client";
import { CloseLineIcon } from "@/icons";
import Image from "next/image";

const UserCard = ({ details, openDialog, removeUser, index }) => {
  const DetailShower = ({ text, svg }) => {
    return (
      <div className="flex items-center text-gray-800">
        {svg}
        <p className="px-1 text-sm dark:text-white/80">{text}</p>
      </div>
    );
  };

  return (
    <>
      <div
        onClick={openDialog}
        className="max-w-[300px] w-full bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl hover:scale-[1.02] rounded-lg overflow-hidden cs-transition relative cursor-pointer"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeUser(index);
          }}
          className="absolute top-[5px] right-[5px] border w-[25px] h-[25px] z-[20] rounded-full bg-white flex-center"
        >
          {<CloseLineIcon />}
        </button>
        <Image
          className="w-full h-[100px] object-cover object-center"
          src={
            details?.profileImg ||
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
          }
          alt="avatar"
          width={200}
          height={100}
        />
        <div className="p-4 flex flex-col gap-[4px]">
          <h1 className="text-[16px] font-semibold text-gray-800 dark:text-white/80">
            {details?.firstName} {details?.lastName}
          </h1>
          <DetailShower
            text={details?.email}
            svg={
              <svg className="w-5 h-5 fill-brand-500" viewBox="0 0 512 512">
                <path d="M437.332 80H74.668C51.199 80 32 99.198 32 122.667v266.666C32 412.802 51.199 432 74.668 432h362.664C460.801 432 480 412.802 480 389.333V122.667C480 99.198 460.801 80 437.332 80zM432 170.667L256 288 80 170.667V128l176 117.333L432 128v42.667z" />
              </svg>
            }
          />
          <DetailShower
            text={details?.phone}
            svg={
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 24 22"
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
                    d="M16.5562 12.9062L16.1007 13.359C16.1007 13.359 15.0181 14.4355 12.0631 11.4972C9.10812 8.55901 10.1907 7.48257 10.1907 7.48257L10.4775 7.19738C11.1841 6.49484 11.2507 5.36691 10.6342 4.54348L9.37326 2.85908C8.61028 1.83992 7.13596 1.70529 6.26145 2.57483L4.69185 4.13552C4.25823 4.56668 3.96765 5.12559 4.00289 5.74561C4.09304 7.33182 4.81071 10.7447 8.81536 14.7266C13.0621 18.9492 17.0468 19.117 18.6763 18.9651C19.1917 18.9171 19.6399 18.6546 20.0011 18.2954L21.4217 16.883C22.3806 15.9295 22.1102 14.2949 20.8833 13.628L18.9728 12.5894C18.1672 12.1515 17.1858 12.2801 16.5562 12.9062Z"
                    fill="#465fff"
                  ></path>
                </g>
              </svg>
            }
          />
        </div>
      </div>
    </>
  );
};

export default UserCard;
