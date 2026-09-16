"use client";
import React, { useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useTranslations } from "next-intl";

const BannerCard = ({ banner, selectedIds, setSelectedIds, deleteFunc, gt: gtProp }) => {
  const router = useRouter();
  const t = useTranslations("bannersPage");
  const gt = gtProp || ((key, fb) => (t.has(key) ? t(key) : fb || key));
  const [showOptions, setShowOptions] = useState(false);

  const viewDetails = () => router.push("/banners/" + banner._id);

  return (
    <tr
      onClick={viewDetails}
      className="border-b border-[#e5e7eb] cursor-pointer dark:border-gray-600 hover:bg-[#f3f4f6] dark:hover:bg-gray-800"
    >
      <td className="py-3 pl-[6px]">
        <div className="flex flex-row gap-3 items-center">
          <Checkbox
            checked={selectedIds.includes(banner._id)}
            onChange={() => {
              setSelectedIds((e) => {
                const temp = [...e];
                if (temp.includes(banner._id)) temp.splice(temp.indexOf(banner._id), 1);
                else temp.push(banner._id);
                return temp;
              });
            }}
          />
          {banner.image ? (
            <img src={banner.image} alt={banner.name} className="w-14 h-10 rounded-lg object-cover" />
          ) : (
            <div className="w-14 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500">
              N/A
            </div>
          )}
        </div>
      </td>

      <td className="p-3 med-14 !text-gray-800 dark:!text-gray-200">
        {banner.name}
      </td>

      <td className="p-3 bk-14 !text-gray-600 dark:!text-gray-400 max-w-xs">
        <span className="line-clamp-1">{banner.description}</span>
      </td>

      <td className="p-3">
        <span className="px-2 py-1 text-xs rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
          #{banner.order || 0}
        </span>
      </td>

      <td className="p-3">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            banner.isActive
              ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
          }`}
        >
          {banner.isActive ? gt("Active", "Active") : gt("Inactive", "Inactive")}
        </span>
      </td>

      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {new Date(banner.createdAt).toLocaleDateString()}
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

        <Dropdown isOpen={showOptions} onClose={() => setShowOptions(false)} className="w-40 p-2">
          <DropdownItem
            onItemClick={viewDetails}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
          >
            {gt("ViewBanner", "View Banner")}
          </DropdownItem>
          <DropdownItem
            onItemClick={() => {
              setSelectedIds([banner._id]);
              deleteFunc();
            }}
            className="flex w-full font-normal text-left text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
          >
            {gt("Delete", "Delete")}
          </DropdownItem>
        </Dropdown>
      </td>
    </tr>
  );
};

export default BannerCard;