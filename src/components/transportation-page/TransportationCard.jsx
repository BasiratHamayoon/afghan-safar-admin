"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import toAfghaniTime from "@/util/toAfghaniTime";
import { HalfArrow } from "@/icons";
import { useRouter } from "next/navigation";
import VehicleTypeShower from "../ui/VehicleTypeShower";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
const TransportationCard = ({
  transport,
  selectedIds,
  setSelectedIds,
  transporationsCards,
  getMoreData,
  last,
  loading,
  deleteCompFunc,
  companyUser,
  travelAgent,
}) => {
  const router = useRouter();
  const [callForData, setcallForData] = useState(false);
  const cardRef = useRef();
  const [showOptions, setshowOptions] = useState(false);
  const [calculateData, setCalculateData] = useState({
    empty: 0,
    reserved: 0,
    unavailable: 0,
  });

  useEffect(() => {
    if (last && !transporationsCards.allDone) {
      const intersecTionobserver = new IntersectionObserver((ele) => {
        ele.forEach((it) => {
          if (it.isIntersecting) {
            setcallForData(true);
          }
        });
      });
      transporationsCards.allDone
        ? intersecTionobserver.unobserve(cardRef.current)
        : intersecTionobserver.observe(cardRef.current);
    }
  }, []);

  useEffect(() => {
    if (callForData && !transporationsCards.allDone && !loading) getMoreData();
  }, [callForData]);

  useEffect(() => {
    const data = {
      empty: 0,
      reserved: 0,
      unavailable: 0,
    };

    transport?.vehicleDetails?.seats?.map((it) =>
      it.map((rowItem) => {
        if (rowItem.state === "Empty") {
          data.empty++;
        } else if (rowItem.state.includes("Reserved")) {
          data.reserved++;
        } else if (rowItem.state === "Unvailable") {
          data.unavailable++;
        }
      })
    );

    setCalculateData({ ...data });
  }, [transport]);

  const viewDetails = () => {
    router.push("/transportations/" + transport._id);
  };

  const actionFunc = () => {
    setshowOptions(!showOptions);
    setSelectedIds([transport._id]);
  };

  return (
    <tr
      ref={cardRef}
      onClick={viewDetails}
      className="border-b border-[#e5e7eb] cursor-pointer relative items-center dark:border-gray-600 hover:bg-[#f3f4f6] dark:hover:bg-gray-800"
    >
      <td className="py-3 pl-[6px]">
        <div className="flex flex-row gap-3 ">
          <Checkbox
            checked={selectedIds.includes(transport._id)}
            onChange={() => {
              setSelectedIds((e) => {
                const tempIds = [...e];

                if (tempIds.includes(transport._id)) {
                  tempIds.splice(
                    e.findIndex((it) => it === transport._id),
                    1
                  );
                } else {
                  tempIds.push(transport._id);
                }
                return [...tempIds];
              });
            }}
          />

          <span className="med-14 !text-gray-700 dark:!text-gray-300">
            {transport.name}
          </span>
        </div>
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {transport.from}
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {transport.to}
      </td>
      <td className="p-2 bk-12 !text-gray-700 dark:!text-gray-300">
        <div className="flex flex-col gap-[5px]">
          <span className="flex-center flex-row bg-brand-500 max-w-[140px] w-full rounded-[12px] text-white py-[2px] [&_svg]:fill-white">
            Departure{" "}
            <span className="translate-y-[-1px]">
              <HalfArrow />
            </span>{" "}
            {toAfghaniTime(transport.departureTime)}
          </span>
          <span className="flex-center flex-row bg-orange-500 max-w-[140px] w-full rounded-[12px] text-white py-[2px] [&_svg]:fill-white">
            Arrival{" "}
            <span className="translate-y-[2px] rotate-[180deg]">
              <HalfArrow />
            </span>{" "}
            {toAfghaniTime(transport.arrivalTime)}
          </span>
        </div>
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {transport.ticketPrice}
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300 ">
        <div className="flex flex-col">
          <span>Seat left : {calculateData.empty}</span>
          <span>Reserved Seats :{calculateData.reserved}</span>
          <span>Unavailable Seats : {calculateData.unavailable}</span>
        </div>
      </td>
      <td className="p-3">
        <VehicleTypeShower name={transport.vehicleDetails?.vehicleType} />
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {new Date(transport?.date).toDateString().slice(4)}
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
          className="w-[28px] h-[28px] flex-center hover:bg-gray-200 rounded-[6px]"
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
              viewDetails();
            }}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            View Details
          </DropdownItem>
          {travelAgent && (
            <DropdownItem
              onItemClick={() => {
                actionFunc();
                router.push("/create-booking?id=" + transport._id);
              }}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Book
            </DropdownItem>
          )}
          {!companyUser && !travelAgent && (
            <DropdownItem
              onItemClick={() => {
                actionFunc();
                deleteCompFunc();
              }}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          )}
        </Dropdown>
      </td>
    </tr>
  );
};

export default TransportationCard;
