"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import { ContextAdmin } from "@/context/MainStateAdmin";
import NoData from "@/components/ui/NoData";
import StatCard from "@/components/ui/Card/StatCard";
import { Location } from "@/icons";
import { useModal } from "@/hooks/useModal";
import ModelActions from "@/components/ui/modal/ModelActions";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";
import DestinationFilter from "@/components/destination-page/DestinationFilter";
import DestinationCard from "@/components/destination-page/DestinationCard";

const page = () => {
  const t = useTranslations("destinationsPage");
  const {
    getDestinationsData,
    loading,
    destinationsCardsData,
    deleteDestinations,
    setDestinationsCardsData,
  } = useContext(ContextAdmin);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeCategoryTab, setActiveCategoryTab] = useState("All");
  const [filterState, setFilterState] = useState({
    title: "",
    province: "",
    category: "",
    isActive: undefined,
    isRecommended: undefined,
  });

  const debouncedFetch = useMemo(() => {
    return debounce((filter) => {
      getDestinationsData(filter, 0, 30);
    }, 600);
  }, []);

  useEffect(() => {
    const filter = {};
    if (filterState.title) filter.title = filterState.title;
    if (filterState.province) filter.province = filterState.province;
    if (filterState.category && filterState.category !== "all")
      filter.category = filterState.category;
    if (filterState.isActive !== undefined && filterState.isActive !== "all")
      filter.isActive =
        filterState.isActive === "true" || filterState.isActive === true;
    if (
      filterState.isRecommended !== undefined &&
      filterState.isRecommended !== "all"
    )
      filter.isRecommended =
        filterState.isRecommended === "true" ||
        filterState.isRecommended === true;

    setDestinationsCardsData((e) => ({
      ...e,
      start: 0,
      end: 30,
      allDone: true,
      data: [],
    }));

    debouncedFetch(filter);
  }, [filterState]);

  const deleteDestinationsFunc = async () => {
    const data = await deleteDestinations({ ids: [...selectedIds] });
    if (data?.success) {
      setDestinationsCardsData((e) => ({
        ...e,
        data: e.data.filter((d) => !selectedIds.includes(d._id)),
        stats: {
          ...e.stats,
          totalDestinations:
            (e.stats?.totalDestinations || 0) - selectedIds.length,
        },
      }));
      setSelectedIds([]);
      closeModal();
    }
  };

  const stats = destinationsCardsData?.stats || {};

  const categoryTabs = [
    { key: "All", label: t("All"), value: stats.totalDestinations || 0 },
    { key: "Nature", label: t("Nature"), value: stats.nature || 0 },
    { key: "Historical", label: t("Historical"), value: stats.historical || 0 },
    { key: "Cultural", label: t("Cultural"), value: stats.cultural || 0 },
    { key: "Religious", label: t("Religious"), value: stats.religious || 0 },
    { key: "Adventure", label: t("Adventure"), value: stats.adventure || 0 },
    { key: "Modern", label: t("Modern"), value: stats.modern || 0 },
  ];

  const handleCategoryTab = (categoryKey) => {
    setActiveCategoryTab(categoryKey);
    setFilterState((prev) => ({
      ...prev,
      category: categoryKey === "All" ? "" : categoryKey,
    }));
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {t("Destinations")}
        </h3>
      </div>

      {/* Top stats row */}
      <div className="flex flex-col gap-[20px]">
        <StatCard
          title={t("TotalDestinations")}
          value={stats.totalDestinations || 0}
          icon={<Location />}
          color="bg-indigo-100 text-indigo-600"
        />

        <div className="flex flex-row items-center justify-between gap-[10px] flex-wrap lg:flex-nowrap pb-[20px]">
          <StatCard
            title={t("ActiveDestinations")}
            value={stats.activeDestinations || 0}
            icon={<Location />}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title={t("InactiveDestinations")}
            value={stats.inactiveDestinations || 0}
            icon={<Location />}
            color="bg-red-100 text-red-600"
          />
          <StatCard
            title={t("RecommendedDestinations")}
            value={stats.recommendedDestinations || 0}
            icon={<Location />}
            color="bg-yellow-100 text-yellow-600"
          />
        </div>
      </div>

      {/* Category Tabs (buttons instead of stat cards) */}
      <div className="flex flex-wrap gap-2 pb-5 border-b border-gray-200 dark:border-gray-700 mb-4">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleCategoryTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategoryTab === tab.key
                ? "bg-brand-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeCategoryTab === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300"
              }`}
            >
              {tab.value}
            </span>
          </button>
        ))}
      </div>

      <DestinationFilter
        filterState={filterState}
        setFilterState={setFilterState}
        selectedIds={selectedIds}
        onDeleteClick={() => selectedIds.length > 0 && openModal()}
      />

      <div className="min-h-screen">
        <div className="overflow-x-auto">
          <table className="w-[900px] md:w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] dark:border-gray-600 text-start">
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300 flex-row flex gap-[10px]">
                  <Checkbox
                    onChange={(cond) => {
                      if (cond) {
                        setSelectedIds(
                          destinationsCardsData.data.map((it) => it._id)
                        );
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    checked={
                      destinationsCardsData.data.length > 0 &&
                      destinationsCardsData.data.every((it) =>
                        selectedIds.includes(it._id)
                      )
                    }
                  />
                  {t("Title")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {t("Province")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {t("Category")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {t("Status")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {t("Budget")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {t("BestTime")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {t("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {destinationsCardsData.data.length > 0 &&
                destinationsCardsData.data.map((destination, index) => (
                  <DestinationCard
                    key={destination._id}
                    destination={destination}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    destinationsCardsData={destinationsCardsData}
                    getMoreData={getDestinationsData}
                    last={index === destinationsCardsData.data.length - 1}
                    loading={loading}
                    deleteFunc={openModal}
                  />
                ))}
            </tbody>
          </table>
          {destinationsCardsData.data.length < 1 && <NoData loading={loading} />}
        </div>
      </div>

      <ModelActions
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={t("Delete")}
        name={t("Destination")}
        loading={loading}
        clickFunc={deleteDestinationsFunc}
        des={t("DeleteWarning")}
      />
    </div>
  );
};

export default page;