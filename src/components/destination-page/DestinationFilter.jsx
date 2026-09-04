"use client";
import React from "react";
import Button from "@/components/ui/button/Button";
import { TrashBinIcon } from "@/icons";
import Select from "@/components/form/Select";
import { useTranslations } from "next-intl";

const DestinationFilter = ({ filterState, setFilterState, selectedIds, onDeleteClick }) => {
  const t = useTranslations("destinationsPage");

  const changeFunc = (value, key) => {
    setFilterState((e) => ({ ...e, [key]: value }));
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-[10px]">
        <h3 className="med-16 !text-gray-900 dark:!text-gray-200">{t("All")}</h3>
        <div className="flex flex-row items-center gap-[10px] w-full pb-[20px] flex-wrap lg:flex-nowrap">
          <input
            className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            placeholder={t("Title")}
            value={filterState.title}
            onChange={(e) => changeFunc(e.target.value, "title")}
          />
          <input
            className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            placeholder={t("Province")}
            value={filterState.province}
            onChange={(e) => changeFunc(e.target.value, "province")}
          />
          <Select
            options={[
              { label: t("All"), value: "all" },
              { label: t("Nature"), value: "Nature" },
              { label: t("Historical"), value: "Historical" },
              { label: t("Cultural"), value: "Cultural" },
              { label: t("Religious"), value: "Religious" },
              { label: t("Adventure"), value: "Adventure" },
              { label: t("Modern"), value: "Modern" },
            ]}
            placeholder={t("Category")}
            className="lg:max-w-[250px]"
            onChange={(value) => changeFunc(value, "category")}
          />
          <Select
            options={[
              { label: t("All"), value: "all" },
              { label: t("Active"), value: "true" },
              { label: t("Inactive"), value: "false" },
            ]}
            placeholder={t("Status")}
            className="lg:max-w-[200px]"
            onChange={(value) => changeFunc(value, "isActive")}
          />
          <Select
            options={[
              { label: t("All"), value: "all" },
              { label: t("Recommended"), value: "true" },
            ]}
            placeholder={t("Recommended")}
            className="lg:max-w-[200px]"
            onChange={(value) => changeFunc(value, "isRecommended")}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-end py-[20px] border-y border-[#e5e7eb] dark:border-gray-700">
        <Button
          onClick={onDeleteClick}
          startIcon={<TrashBinIcon />}
          className="bg-error-600 h-[35px] w-[90px] hover:bg-error-700"
        >
          {t("Delete")}
        </Button>
      </div>
    </div>
  );
};

export default DestinationFilter;