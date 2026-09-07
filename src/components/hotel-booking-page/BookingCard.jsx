"use client";
import React, { useEffect, useRef, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useTranslations } from "next-intl";

const BookingCard = ({
  booking,
  selectedIds,
  setSelectedIds,
  hotelBookingsData,
  getMoreData,
  last,
  loading,
  updateBookingState,
  deleteFunc,
}) => {
  const router = useRouter();
  const t = useTranslations("hotelBookingsPage");
  const gt = (key, fb) => (t.has(key) ? t(key) : fb || key);

  const [callForData, setCallForData] = useState(false);
  const cardRef = useRef();
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (last && !hotelBookingsData.allDone) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCallForData(true);
        });
      });
      if (cardRef.current) obs.observe(cardRef.current);
    }
  }, []);

  useEffect(() => {
    if (callForData && !hotelBookingsData.allDone && !loading) getMoreData();
  }, [callForData]);

  const viewDetails = () => router.push("/hotel-bookings/" + booking._id);

  const stateColors = {
    pending: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
    accepted: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    completed: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
    rejected: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  };

  const handleStateChange = async (newState) => {
    const res = await updateBookingState(booking._id, newState, `Updated by admin`);
    if (res?.success) window.location.reload();
  };

  const checkIn = new Date(booking.checkInDate).toLocaleDateString();
  const checkOut = new Date(booking.checkOutDate).toLocaleDateString();

  return (
    <tr
      ref={cardRef}
      onClick={viewDetails}
      className="border-b border-[#e5e7eb] cursor-pointer dark:border-gray-600 hover:bg-[#f3f4f6] dark:hover:bg-gray-800"
    >
      <td className="py-3 pl-[6px]">
        <div className="flex flex-row gap-3 items-center">
          <Checkbox
            checked={selectedIds.includes(booking._id)}
            onChange={() => {
              setSelectedIds((e) => {
                const temp = [...e];
                if (temp.includes(booking._id)) temp.splice(temp.indexOf(booking._id), 1);
                else temp.push(booking._id);
                return temp;
              });
            }}
          />
          <div className="flex flex-col">
            <span className="med-14 !text-gray-800 dark:!text-gray-200">
              {booking.passengerName}
            </span>
            <span className="bk-12 text-gray-500">{booking.passengerPhone}</span>
          </div>
        </div>
      </td>

      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        <div className="flex flex-col">
          <span className="med-14">{booking.hotelId?.name || "N/A"}</span>
          <span className="bk-12 text-gray-500">{booking.hotelId?.location}</span>
        </div>
      </td>

      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        <span className="px-2 py-1 text-xs rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
          {booking.roomId?.name || "Room"} ({booking.roomId?.type})
        </span>
      </td>

      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        <div className="flex flex-col text-xs">
          <span>In: {checkIn}</span>
          <span>Out: {checkOut}</span>
        </div>
      </td>

      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        <div className="flex flex-col text-xs">
          <span>{booking.totalNights} Nights</span>
          <span>{booking.roomsBooked} Room(s)</span>
          <span>{booking.passengerCount} Guests</span>
        </div>
      </td>

      <td className="p-3 bk-14 font-semibold !text-gray-800 dark:!text-gray-200">
        {booking.totalPrice} {booking.currency}
      </td>

      <td className="p-3">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${stateColors[booking.state] || ""}`}>
          {booking.state}
        </span>
      </td>

      <td onClick={(e) => e.stopPropagation()} className="p-3 cursor-pointer">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
          className="w-[28px] h-[28px] flex-center hover:bg-gray-200 rounded-[6px]"
        >
          <svg
            className="dark:fill-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="black"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="black"
          >
            <path stroke="inherit" strokeLinecap="round" strokeWidth="4" d="M6 12h0m6 0h0m6 0h0" />
          </svg>
        </button>

        <Dropdown isOpen={showOptions} onClose={() => setShowOptions(false)} className="w-44 p-2">
          <DropdownItem
            onItemClick={() => viewDetails()}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
          >
            {gt("ViewDetails", "View Details")}
          </DropdownItem>

          {booking.state === "pending" && (
            <>
              <DropdownItem
                onItemClick={() => handleStateChange("accepted")}
                className="flex w-full font-normal text-left text-green-600 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
              >
                ✓ {gt("Accept", "Accept")}
              </DropdownItem>
              <DropdownItem
                onItemClick={() => handleStateChange("rejected")}
                className="flex w-full font-normal text-left text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
              >
                ✕ {gt("Reject", "Reject")}
              </DropdownItem>
            </>
          )}

          {booking.state === "accepted" && (
            <>
              <DropdownItem
                onItemClick={() => handleStateChange("completed")}
                className="flex w-full font-normal text-left text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
              >
                ✓ {gt("MarkCompleted", "Complete")}
              </DropdownItem>
              <DropdownItem
                onItemClick={() => handleStateChange("cancelled")}
                className="flex w-full font-normal text-left text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
              >
                ✕ {gt("Cancel", "Cancel")}
              </DropdownItem>
            </>
          )}

          <DropdownItem
            onItemClick={() => {
              setSelectedIds([booking._id]);
              deleteFunc();
            }}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
          >
            {gt("Delete", "Delete")}
          </DropdownItem>
        </Dropdown>
      </td>
    </tr>
  );
};

export default BookingCard;