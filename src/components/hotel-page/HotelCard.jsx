"use client";
import React, { useEffect, useRef, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useTranslations } from "next-intl";

const HotelCard = ({
  hotel, selectedIds, setSelectedIds, hotelsCardsData,
  getMoreData, last, loading, deleteFunc, approveHotel, rejectHotel,
}) => {
  const router = useRouter();
  const t = useTranslations("hotelsPage");
  const gt = (key, fb) => (t.has(key) ? t(key) : fb);
  const [callForData, setCallForData] = useState(false);
  const cardRef = useRef();
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (last && !hotelsCardsData.allDone) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setCallForData(true); });
      });
      if (cardRef.current) obs.observe(cardRef.current);
    }
  }, []);

  useEffect(() => {
    if (callForData && !hotelsCardsData.allDone && !loading) getMoreData();
  }, [callForData]);

  const viewDetails = () => router.push("/hotels/" + hotel._id);

  const approvalColors = {
    pending: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
    approved: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    rejected: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  };

  return (
    <tr
      ref={cardRef}
      onClick={viewDetails}
      className="border-b border-[#e5e7eb] cursor-pointer dark:border-gray-600 hover:bg-[#f3f4f6] dark:hover:bg-gray-800"
    >
      <td className="py-3 pl-[6px]">
        <div className="flex flex-row gap-3 items-center">
          <Checkbox
            checked={selectedIds.includes(hotel._id)}
            onChange={() => {
              setSelectedIds((e) => {
                const temp = [...e];
                if (temp.includes(hotel._id)) temp.splice(temp.indexOf(hotel._id), 1);
                else temp.push(hotel._id);
                return temp;
              });
            }}
          />
          {hotel.images?.[0] && (
            <img src={hotel.images[0]} alt={hotel.name} className="w-10 h-10 rounded-lg object-cover" />
          )}
          <span className="med-14 !text-gray-700 dark:!text-gray-300">{hotel.name}</span>
        </div>
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">{hotel.province}</td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">{hotel.propertyType}</td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">{"⭐".repeat(hotel.starRating || 0)}</td>
      <td className="p-3">
        <span className={`px-2 py-1 text-xs rounded-full ${approvalColors[hotel.approvalStatus] || ""}`}>
          {hotel.approvalStatus}
        </span>
      </td>
      <td className="p-3">
        <span className={`px-2 py-1 text-xs rounded-full ${hotel.isActive ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"}`}>
          {hotel.isActive ? gt("Active", "Active") : gt("Inactive", "Inactive")}
        </span>
      </td>
      <td onClick={(e) => e.stopPropagation()} className="p-3 cursor-pointer">
        <button onClick={(e) => { e.stopPropagation(); setShowOptions(!showOptions); }} className="w-[28px] h-[28px] flex-center hover:bg-gray-200 rounded-[6px]">
          <svg className="dark:fill-gray-300" xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" width="20" height="20" stroke="black">
            <path stroke="inherit" strokeLinecap="round" strokeWidth="4" d="M6 12h0m6 0h0m6 0h0" />
          </svg>
        </button>
        <Dropdown isOpen={showOptions} onClose={() => setShowOptions(false)} className="w-40 p-2">
          <DropdownItem onItemClick={() => viewDetails()} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5">
            {gt("ViewDetails", "View Details")}
          </DropdownItem>
          {hotel.approvalStatus === "pending" && (
            <>
              <DropdownItem onItemClick={async () => { await approveHotel(hotel._id); window.location.reload(); }} className="flex w-full font-normal text-left text-green-600 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                {gt("Approve", "Approve")}
              </DropdownItem>
              <DropdownItem onItemClick={async () => { await rejectHotel(hotel._id); window.location.reload(); }} className="flex w-full font-normal text-left text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                {gt("Reject", "Reject")}
              </DropdownItem>
            </>
          )}
          <DropdownItem onItemClick={() => { setSelectedIds([hotel._id]); deleteFunc(); }} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5">
            {gt("Delete", "Delete")}
          </DropdownItem>
        </Dropdown>
      </td>
    </tr>
  );
};

export default HotelCard;