"use client";
import React, { useEffect, useRef, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useTranslations } from "next-intl";

const DestinationCard = ({
  destination,
  selectedIds,
  setSelectedIds,
  destinationsCardsData,
  getMoreData,
  last,
  loading,
  deleteFunc,
}) => {
  const router = useRouter();
  const t = useTranslations("destinationsPage");
  const [callForData, setCallForData] = useState(false);
  const cardRef = useRef();
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (last && !destinationsCardsData.allDone) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCallForData(true);
        });
      });
      if (cardRef.current) {
        destinationsCardsData.allDone
          ? observer.unobserve(cardRef.current)
          : observer.observe(cardRef.current);
      }
    }
  }, []);

  useEffect(() => {
    if (callForData && !destinationsCardsData.allDone && !loading) getMoreData();
  }, [callForData]);

  const viewDetails = () => {
    router.push("/destinations/" + destination._id);
  };

  const actionFunc = () => {
    setShowOptions(!showOptions);
    setSelectedIds([destination._id]);
  };

  const budget = destination.estimatedBudget || {};

  return (
    <tr
      ref={cardRef}
      onClick={viewDetails}
      className="border-b border-[#e5e7eb] cursor-pointer relative items-center dark:border-gray-600 hover:bg-[#f3f4f6] dark:hover:bg-gray-800"
    >
      <td className="py-3 pl-[6px]">
        <div className="flex flex-row gap-3">
          <Checkbox
            checked={selectedIds.includes(destination._id)}
            onChange={() => {
              setSelectedIds((e) => {
                const temp = [...e];
                if (temp.includes(destination._id)) {
                  temp.splice(temp.indexOf(destination._id), 1);
                } else {
                  temp.push(destination._id);
                }
                return temp;
              });
            }}
          />
          <div className="flex items-center gap-2">
            {destination.images?.[0] && (
              <img
                src={destination.images[0]}
                alt={destination.title}
                className="w-10 h-10 rounded-lg object-cover"
              />
            )}
            <span className="med-14 !text-gray-700 dark:!text-gray-300">
              {destination.title}
            </span>
          </div>
        </div>
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {destination.province}
      </td>
      <td className="p-3">
        <span className="px-2 py-1 text-xs rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
          {destination.category}
        </span>
      </td>
      <td className="p-3">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            destination.isActive
              ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
          }`}
        >
          {destination.isActive ? t("Active") : t("Inactive")}
        </span>
        {destination.isRecommended && (
          <span className="ml-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400">
            ★
          </span>
        )}
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {budget.min || 0} - {budget.max || 0} {budget.currency || "AFN"}
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {destination.bestTimeToVisit || "N/A"}
      </td>
      <td onClick={(e) => e.stopPropagation()} className="p-3 cursor-pointer">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
          className="w-[28px] h-[28px] flex-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-[6px]"
        >
          <svg
            className="dark:fill-gray-300 dark:stroke-gray-300"
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
            />
          </svg>
        </button>
        <Dropdown isOpen={showOptions} onClose={() => setShowOptions(false)} className="w-40 p-2">
          <DropdownItem
            onItemClick={() => {
              actionFunc();
              viewDetails();
            }}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            {t("ViewDetails")}
          </DropdownItem>
          <DropdownItem
            onItemClick={() => {
              actionFunc();
              deleteFunc();
            }}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            {t("Delete")}
          </DropdownItem>
        </Dropdown>
      </td>
    </tr>
  );
};

export default DestinationCard;