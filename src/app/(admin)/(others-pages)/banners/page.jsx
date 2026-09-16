"use client";
import React, { useContext, useEffect, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import { ContextAdmin } from "@/context/MainStateAdmin";
import NoData from "@/components/ui/NoData";
import StatCard from "@/components/ui/Card/StatCard";
import { Ads } from "@/icons";
import { useModal } from "@/hooks/useModal";
import ModelActions from "@/components/ui/modal/ModelActions";
import { useTranslations } from "next-intl";
import BannerFilter from "@/components/banner-page/BannerFilter";
import BannerCard from "@/components/banner-page/BannerCard";

const page = () => {
  const t = useTranslations("bannersPage");
  const gt = (key, fb) => (t.has(key) ? t(key) : fb || key);

  const { loading, bannersData, getBanners, deleteBanner } = useContext(ContextAdmin);
  const { isOpen, openModal, closeModal } = useModal();

  const [selectedIds, setSelectedIds] = useState([]);
  const [filterState, setFilterState] = useState({
    name: "",
    status: "",
  });

  useEffect(() => {
    getBanners();
  }, []);

  const filteredBanners = (bannersData?.data || []).filter((b) => {
    let match = true;
    if (filterState.name) {
      match = match && b.name.toLowerCase().includes(filterState.name.toLowerCase());
    }
    if (filterState.status && filterState.status !== "all") {
      match = match && (filterState.status === "true" ? b.isActive : !b.isActive);
    }
    return match;
  });

  const stats = {
    total: bannersData?.data?.length || 0,
    active: bannersData?.data?.filter((b) => b.isActive).length || 0,
    inactive: bannersData?.data?.filter((b) => !b.isActive).length || 0,
  };

  const deleteBannersFunc = async () => {
    for (const id of selectedIds) {
      await deleteBanner(id);
    }
    setSelectedIds([]);
    closeModal();
    getBanners();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {gt("Banners", "Banners")}
        </h3>
      </div>

      {/* KPI Stats */}
      <div className="flex flex-col gap-[20px]">
        <StatCard
          title={gt("TotalBanners", "Total Banners")}
          value={stats.total}
          icon={<Ads />}
          color="bg-indigo-100 text-indigo-600"
        />
        <div className="flex flex-row items-center justify-between gap-[10px] flex-wrap lg:flex-nowrap pb-[20px]">
          <StatCard
            title={gt("ActiveBanners", "Active")}
            value={stats.active}
            icon={<Ads />}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title={gt("InactiveBanners", "Inactive")}
            value={stats.inactive}
            icon={<Ads />}
            color="bg-red-100 text-red-600"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <BannerFilter
        filterState={filterState}
        setFilterState={setFilterState}
        selectedIds={selectedIds}
        onDeleteClick={() => selectedIds.length > 0 && openModal()}
      />

      {/* Table */}
      <div className="min-h-screen">
        <div className="overflow-x-auto">
          <table className="w-[900px] md:w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] dark:border-gray-600 text-start">
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300 flex-row flex gap-[10px]">
                  <Checkbox
                    onChange={(c) =>
                      setSelectedIds(c ? filteredBanners.map((i) => i._id) : [])
                    }
                    checked={
                      filteredBanners.length > 0 &&
                      filteredBanners.every((i) => selectedIds.includes(i._id))
                    }
                  />
                  {gt("Image", "Image")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("BannerName", "Banner Name")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("Description", "Description")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("Order", "Order")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("Status", "Status")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("CreatedAt", "Created At")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("Actions", "Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBanners.length > 0 &&
                filteredBanners.map((banner) => (
                  <BannerCard
                    key={banner._id}
                    banner={banner}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    deleteFunc={openModal}
                    gt={gt}
                  />
                ))}
            </tbody>
          </table>
          {filteredBanners.length < 1 && <NoData loading={loading} />}
        </div>
      </div>

      <ModelActions
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={gt("Delete", "Delete")}
        name={gt("Banner", "Banner")}
        loading={loading}
        clickFunc={deleteBannersFunc}
        des={gt("DeleteWarning", "This action cannot be undone.")}
      />
    </div>
  );
};

export default page;