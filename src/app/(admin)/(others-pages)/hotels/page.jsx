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
import HotelFilter from "@/components/hotel-page/HotelFilter";
import HotelCard from "@/components/hotel-page/HotelCard";

const page = () => {
  const t = useTranslations("hotelsPage");
  const gt = (key, fb) => (t.has(key) ? t(key) : fb);
  const {
    getHotelsData, loading, hotelsCardsData,
    deleteHotels, setHotelsCardsData, approveHotel, rejectHotel,
  } = useContext(ContextAdmin);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterState, setFilterState] = useState({
    name: "", province: "", approvalStatus: "", isActive: undefined,
  });

  const debouncedFetch = useMemo(() => debounce((f) => getHotelsData(f, 0, 30), 600), []);

  useEffect(() => {
    const filter = {};
    if (filterState.name) filter.name = filterState.name;
    if (filterState.province) filter.province = filterState.province;
    if (filterState.approvalStatus && filterState.approvalStatus !== "all")
      filter.approvalStatus = filterState.approvalStatus;
    if (filterState.isActive !== undefined && filterState.isActive !== "all")
      filter.isActive = filterState.isActive === "true";

    setHotelsCardsData((e) => ({ ...e, start: 0, end: 30, allDone: true, data: [] }));
    debouncedFetch(filter);
  }, [filterState]);

  const deleteHotelFunc = async () => {
    for (const id of selectedIds) {
      await deleteHotels(id);
    }
    setHotelsCardsData((e) => ({
      ...e,
      data: e.data.filter((d) => !selectedIds.includes(d._id)),
    }));
    setSelectedIds([]);
    closeModal();
  };

  const stats = hotelsCardsData?.stats || {};

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {gt("Hotels", "Hotels")}
        </h3>
      </div>

      <div className="flex flex-col gap-[20px]">
        <StatCard title={gt("TotalHotels", "Total Hotels")} value={stats.totalHotels || 0} icon={<Location />} color="bg-indigo-100 text-indigo-600" />
        <div className="flex flex-row items-center justify-between gap-[10px] flex-wrap lg:flex-nowrap pb-[20px]">
          <StatCard title={gt("ActiveHotels", "Active")} value={stats.activeHotels || 0} icon={<Location />} color="bg-green-100 text-green-600" />
          <StatCard title={gt("PendingApproval", "Pending")} value={stats.pendingApproval || 0} icon={<Location />} color="bg-yellow-100 text-yellow-600" />
          <StatCard title={gt("ApprovedHotels", "Approved")} value={stats.approvedHotels || 0} icon={<Location />} color="bg-blue-100 text-blue-600" />
          <StatCard title={gt("RejectedHotels", "Rejected")} value={stats.rejectedHotels || 0} icon={<Location />} color="bg-red-100 text-red-600" />
        </div>
      </div>

      <HotelFilter filterState={filterState} setFilterState={setFilterState} selectedIds={selectedIds} onDeleteClick={() => selectedIds.length > 0 && openModal()} />

      <div className="min-h-screen">
        <div className="overflow-x-auto">
          <table className="w-[900px] md:w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] dark:border-gray-600 text-start">
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300 flex-row flex gap-[10px]">
                  <Checkbox
                    onChange={(c) => setSelectedIds(c ? hotelsCardsData.data.map((i) => i._id) : [])}
                    checked={hotelsCardsData.data.length > 0 && hotelsCardsData.data.every((i) => selectedIds.includes(i._id))}
                  />
                  {gt("Name", "Name")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">{gt("Province", "Province")}</th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">{gt("PropertyType", "Type")}</th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">{gt("StarRating", "Stars")}</th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">{gt("ApprovalStatus", "Approval")}</th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">{gt("Status", "Status")}</th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">{gt("Actions", "Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {hotelsCardsData.data.length > 0 &&
                hotelsCardsData.data.map((hotel, index) => (
                  <HotelCard
                    key={hotel._id}
                    hotel={hotel}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    hotelsCardsData={hotelsCardsData}
                    getMoreData={getHotelsData}
                    last={index === hotelsCardsData.data.length - 1}
                    loading={loading}
                    deleteFunc={openModal}
                    approveHotel={approveHotel}
                    rejectHotel={rejectHotel}
                  />
                ))}
            </tbody>
          </table>
          {hotelsCardsData.data.length < 1 && <NoData loading={loading} />}
        </div>
      </div>

      <ModelActions
        isOpen={isOpen} onClose={closeModal} className="max-w-md m-4"
        selectedIds={selectedIds} type={gt("Delete", "Delete")} name={gt("Hotel", "Hotel")}
        loading={loading} clickFunc={deleteHotelFunc}
        des={gt("DeleteWarning", "This action cannot be undone.")}
      />
    </div>
  );
};

export default page;