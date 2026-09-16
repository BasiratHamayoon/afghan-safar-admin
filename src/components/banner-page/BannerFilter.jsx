"use client";
import React from "react";
import Button from "@/components/ui/button/Button";
import { TrashBinIcon } from "@/icons";
import Select from "@/components/form/Select";
import { useTranslations } from "next-intl";

const BannerFilter = ({ filterState, setFilterState, selectedIds, onDeleteClick }) => {
  const t = useTranslations("bannersPage");
  const gt = (key, fb) => (t.has(key) ? t(key) : fb || key);
  const change = (value, key) => setFilterState((e) => ({ ...e, [key]: value }));

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center gap-[10px] w-full pb-[20px] flex-wrap lg:flex-nowrap">
        <input
          className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
          placeholder={gt("BannerName", "Banner Name")}
          value={filterState.name}
          onChange={(e) => change(e.target.value, "name")}
        />
        <Select
          options={[
            { label: gt("All", "All"), value: "all" },
            { label: gt("Active", "Active"), value: "true" },
            { label: gt("Inactive", "Inactive"), value: "false" },
          ]}
          placeholder={gt("Status", "Status")}
          className="lg:max-w-[200px]"
          onChange={(v) => change(v, "status")}
        />
      </div>
      <div className="flex flex-row items-center justify-end py-[20px] border-y border-[#e5e7eb] dark:border-gray-700">
        <Button
          onClick={onDeleteClick}
          startIcon={<TrashBinIcon />}
          className="bg-error-600 h-[35px] w-[90px] hover:bg-error-700"
        >
          {gt("Delete", "Delete")}
        </Button>
      </div>
    </div>
  );
};

export default BannerFilter;