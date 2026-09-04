import React, { useEffect, useRef, useState } from "react";
import Checkbox from "../form/input/Checkbox";
import Link from "next/link";
import { CopyIcon } from "@/icons";
import Image from "next/image";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";

const AdCard = ({
  ad,
  selectedIds,
  setSelectedIds,
  adsCard,
  getMoreData,
  last,
  loading,
  blockADFunc,
  unBlockClickFunc,
  deleteADFunc,
}) => {
  const [callForData, setcallForData] = useState(false);
  const cardRef = useRef();
  const [showOptions, setshowOptions] = useState(false);
  useEffect(() => {
    if (last && !adsCard?.allDone) {
      const intersecTionobserver = new IntersectionObserver((ele) => {
        ele.forEach((it) => {
          if (it.isIntersecting) {
            setcallForData(true);
          }
        });
      });
      adsCard?.allDone
        ? intersecTionobserver.unobserve(cardRef.current)
        : intersecTionobserver.observe(cardRef.current);
    }
  }, []);

  useEffect(() => {
    if (callForData && !adsCard?.allDone && !loading) getMoreData();
  }, [callForData]);

  const actionFunc = () => {
    setshowOptions(!showOptions);
    setSelectedIds([ad._id]);
  };

  return (
    <tr
      ref={cardRef}
      className="border-b border-[#e5e7eb] dark:border-gray-600 hover:bg-[#f3f4f6] dark:hover:bg-gray-800 cursor-pointer"
    >
      <td className="flex items-center gap-3 py-3 pl-[6px]">
        <Checkbox
          checked={selectedIds.includes(ad._id)}
          onChange={() => {
            setSelectedIds((e) => {
              const tempIds = [...e];

              if (tempIds.includes(ad._id)) {
                tempIds.splice(
                  e.findIndex((it) => it === ad._id),
                  1
                );
              } else {
                tempIds.push(ad._id);
              }
              return [...tempIds];
            });
          }}
        />
        <Image
          src={ad.adImg || "/images/user/user.png"}
          alt="avatar"
          className="w-[150px] h-[90px] rounded-[10px] dark:bg-gray-300"
          width={500}
          height={500}
          quality={100}
        />
        <span className="med-14 !text-gray-700 dark:!text-gray-300">
          {ad?.title || "No title"}
        </span>
      </td>

      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {ad?.date && new Date(ad?.date).toDateString()}
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        <span
          className={`px-2 py-1 rounded bk-14 capitalize ${
            ad.status === "active" ? "!text-green-400" : "!text-red-400"
          }`}
        >
          {ad.status}
        </span>
      </td>

      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300 flex-row flex items-center gap-[10px]">
        {ad.link ? (
          <Link
            href={ad.link}
            className="text-blue-500 underline"
            target="_blank"
          >
            {ad?.link?.slice(0, 50) || "No Link"}
          </Link>
        ) : (
          <span className="text-blue-500 underline">No Link</span>
        )}
        <button
          className="hover:bg-gray-200 rounded-[5px] w-[26px] h-[26px] flex-center active:bg-gray-50"
          onClick={(e) => {
            e.stopPropagation();
            ad.link && window.navigator.clipboard.writeText(ad.link);
          }}
        >
          <CopyIcon />
        </button>
      </td>

      <td
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="p-3 cursor-pointer"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setshowOptions(!showOptions);
          }}
          className="w-[28px] h-[28px] flex-center hover:bg-gray-200 rounded-[6px] active:bg-gray-50"
        >
          <svg
            className="dark:fill-gray-300 dark:stroke-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="black"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="black"
          >
            <path
              stroke="inherit"
              strokeLinecap="round"
              strokeWidth="4"
              d="M6 12h0m6 0h0m6 0h0"
            ></path>
          </svg>
        </button>
        <Dropdown
          isOpen={showOptions}
          onClose={() => {
            setshowOptions(!showOptions);
          }}
          className="w-40 p-2"
        >
          <DropdownItem
            onItemClick={() => {
              actionFunc();
              blockADFunc();
            }}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            Disable
          </DropdownItem>
          <DropdownItem
            onItemClick={() => {
              actionFunc();
              unBlockClickFunc();
            }}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            Activate
          </DropdownItem>
          <DropdownItem
            onItemClick={() => {
              actionFunc();
              deleteADFunc();
            }}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            Delete
          </DropdownItem>
        </Dropdown>
      </td>
    </tr>
  );
};

export default AdCard;
