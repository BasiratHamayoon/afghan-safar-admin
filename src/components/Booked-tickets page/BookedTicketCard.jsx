"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import toAfghaniTime from "@/util/toAfghaniTime";
import { HalfArrow } from "@/icons";
import { useRouter } from "next/navigation";
import VehicleTypeShower from "../ui/VehicleTypeShower";
import toAfghaniDate from "@/util/toAfghaniDate";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const BookedTicketCard = ({
  ticket,
  selectedIds,
  setSelectedIds,
  bookedTickets,
  getMoreData,
  last,
  loading,
  deleteTickFunc,
  companyUser,
}) => {
  const router = useRouter();
  const [callForData, setcallForData] = useState(false);
  const cardRef = useRef();
  const [showOptions, setshowOptions] = useState(false);
  useEffect(() => {
    if (last && !bookedTickets.allDone) {
      const intersecTionobserver = new IntersectionObserver((ele) => {
        ele.forEach((it) => {
          if (it.isIntersecting) {
            setcallForData(true);
          }
        });
      });
      bookedTickets.allDone
        ? intersecTionobserver.unobserve(cardRef.current)
        : intersecTionobserver.observe(cardRef.current);
    }
  }, []);

  useEffect(() => {
    if (callForData && !bookedTickets.allDone && !loading) getMoreData();
  }, [callForData]);

  const viewDetails = () => {
    router.push("/booked-tickets/" + ticket._id);
  };

  const actionFunc = () => {
    setshowOptions(!showOptions);
    setSelectedIds([ticket._id]);
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
            checked={selectedIds.includes(ticket._id)}
            onChange={() => {
              setSelectedIds((e) => {
                const tempIds = [...e];

                if (tempIds.includes(ticket._id)) {
                  tempIds.splice(
                    e.findIndex((it) => it === ticket._id),
                    1
                  );
                } else {
                  tempIds.push(ticket._id);
                }
                return [...tempIds];
              });
            }}
          />

          <img
            src={ticket.user?.profileImg || "/images/user/user.png"}
            alt="avatar"
            className="w-[35px] h-[35px] rounded-full dark:bg-gray-300"
          />
          <div className="flex flex-col">
            <span className="med-14 !text-gray-700 dark:!text-gray-300">
              {ticket.user?.firstName} {ticket.user?.lastName}
            </span>
            <span className="med-12 !text-gray-700 dark:!text-gray-300">
              {ticket?.user?.email}
            </span>
          </div>
        </div>
      </td>
      <td className="med-14 !text-gray-700 dark:!text-gray-300">
        {ticket.transportation.name}
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        From : {ticket.transportation.from}
        <br />
        To : {ticket.transportation.to}
      </td>

      <td className="p-2 bk-12 !text-gray-700 dark:!text-gray-300">
        <div className="flex flex-col gap-[5px]">
          <span className="flex-center flex-row bg-brand-500 max-w-[140px] w-full rounded-[12px] text-white py-[2px] [&_svg]:fill-white">
            Departure{" "}
            <span className="translate-y-[-1px]">
              <HalfArrow />
            </span>{" "}
            {toAfghaniTime(ticket.transportation.departureTime)}
          </span>
          <span className="flex-center flex-row bg-orange-500 max-w-[140px] w-full rounded-[12px] text-white py-[2px] [&_svg]:fill-white">
            Arrival{" "}
            <span className="translate-y-[2px] rotate-[180deg]">
              <HalfArrow />
            </span>{" "}
            {toAfghaniTime(ticket.transportation.arrivalTime)}
          </span>
        </div>
      </td>

      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {ticket.transportation.date &&
          toAfghaniDate(ticket.transportation.date)}
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300 ">
        <div className="flex flex-col">
          <span>
            Booked :{" "}
            {ticket?.selectedSeats?.unknown?.slice(0, 3).map((it) => it + ",")}
            {ticket?.selectedSeats?.unknown?.length > 3 ? "..." : ""}
          </span>
          <span>
            Male Booked :
            {ticket?.selectedSeats?.male?.slice(0, 3).map((it) => it + ",")}
            {ticket?.selectedSeats?.male?.length > 3 ? "..." : ""}
          </span>
          <span>
            Female Booked :{" "}
            {ticket?.selectedSeats?.female?.slice(0, 3).map((it) => it + ",")}
            {ticket?.selectedSeats?.female?.length > 3 ? "..." : ""}
          </span>
        </div>
      </td>
      <td className="p-3">
        <VehicleTypeShower
          name={ticket.transportation.vehicleDetails?.vehicleType}
        />
      </td>
      <td
        className={`p-3 bk-14 capitalize ${
          ticket.state.includes("canceled")
            ? "!text-red-500"
            : "!text-green-500"
        }`}
      >
        {ticket.state}
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
          {!companyUser && (
            <DropdownItem
              onItemClick={() => {
                actionFunc();
                deleteTickFunc();
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

export default BookedTicketCard;
