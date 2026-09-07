"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import { ContextAdmin } from "@/context/MainStateAdmin";
import NoData from "@/components/ui/NoData";
import StatCard from "@/components/ui/Card/StatCard";
import { BookedTickets } from "@/icons";
import { useModal } from "@/hooks/useModal";
import ModelActions from "@/components/ui/modal/ModelActions";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";
import BookingFilter from "@/components/hotel-booking-page/BookingFilter";
import BookingCard from "@/components/hotel-booking-page/BookingCard";

const page = () => {
  const t = useTranslations("hotelBookingsPage");
  const gt = (key, fb) => (t.has(key) ? t(key) : fb || key);

  const {
    getHotelBookingsData,
    loading,
    hotelBookingsData,
    updateBookingState,
    deleteHotelBooking,
    setHotelBookingsData,
  } = useContext(ContextAdmin);

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [filterState, setFilterState] = useState({
    passengerName: "",
    passengerPhone: "",
    state: "",
  });

  const debouncedFetch = useMemo(
    () =>
      debounce((f) => {
        getHotelBookingsData(f, 0, 30);
      }, 600),
    []
  );

  useEffect(() => {
    const filter = {};
    if (filterState.passengerName) filter.passengerName = filterState.passengerName;
    if (filterState.passengerPhone) filter.passengerPhone = filterState.passengerPhone;
    if (filterState.state && filterState.state !== "all") filter.state = filterState.state;

    setHotelBookingsData((e) => ({
      ...e,
      start: 0,
      end: 30,
      allDone: true,
      data: [],
    }));

    debouncedFetch(filter);
  }, [filterState]);

  const handleTabChange = (stateKey) => {
    setActiveTab(stateKey);
    setFilterState((prev) => ({
      ...prev,
      state: stateKey === "all" ? "" : stateKey,
    }));
  };

  const deleteSelectedFunc = async () => {
    for (const id of selectedIds) {
      await deleteHotelBooking(id);
    }
    setHotelBookingsData((e) => ({
      ...e,
      data: e.data.filter((d) => !selectedIds.includes(d._id)),
      stats: {
        ...e.stats,
        totalBookings: (e.stats?.totalBookings || 0) - selectedIds.length,
      },
    }));
    setSelectedIds([]);
    closeModal();
  };

  const stats = hotelBookingsData?.stats || {};

  const stateTabs = [
    { key: "all", label: gt("All", "All"), count: stats.totalBookings || 0 },
    { key: "pending", label: gt("Pending", "Pending"), count: stats.pending || 0 },
    { key: "accepted", label: gt("Accepted", "Accepted"), count: stats.accepted || 0 },
    { key: "completed", label: gt("Completed", "Completed"), count: stats.completed || 0 },
    { key: "cancelled", label: gt("Cancelled", "Cancelled"), count: stats.cancelled || 0 },
    { key: "rejected", label: gt("Rejected", "Rejected"), count: stats.rejected || 0 },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {gt("HotelBookings", "Hotel Bookings")}
        </h3>
      </div>

      {/* KPI Stats */}
      <div className="flex flex-col gap-[20px]">
        <StatCard
          title={gt("TotalBookings", "Total Bookings")}
          value={stats.totalBookings || 0}
          icon={<BookedTickets />}
          color="bg-indigo-100 text-indigo-600"
        />

        <div className="flex flex-row items-center justify-between gap-[10px] flex-wrap lg:flex-nowrap pb-[20px]">
          <StatCard
            title={gt("Pending", "Pending")}
            value={stats.pending || 0}
            icon={<BookedTickets />}
            color="bg-yellow-100 text-yellow-600"
          />
          <StatCard
            title={gt("Accepted", "Accepted")}
            value={stats.accepted || 0}
            icon={<BookedTickets />}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title={gt("Completed", "Completed")}
            value={stats.completed || 0}
            icon={<BookedTickets />}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title={gt("TotalRevenue", "Total Revenue")}
            value={`$${stats.totalRevenue || 0}`}
            icon={<BookedTickets />}
            color="bg-purple-100 text-purple-600"
          />
        </div>
      </div>

      {/* State Filter Buttons */}
      <div className="flex flex-wrap gap-2 pb-5 border-b border-gray-200 dark:border-gray-700 mb-4">
        {stateTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-brand-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Actions Bar */}
      <BookingFilter
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
                    onChange={(cond) =>
                      setSelectedIds(cond ? hotelBookingsData.data.map((i) => i._id) : [])
                    }
                    checked={
                      hotelBookingsData.data.length > 0 &&
                      hotelBookingsData.data.every((i) => selectedIds.includes(i._id))
                    }
                  />
                  {gt("GuestName", "Guest Name")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("Hotel", "Hotel")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("RoomType", "Room")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("Dates", "Dates")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("NightsAndRooms", "Stay Details")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("TotalPrice", "Total Price")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("Status", "Status")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("Actions", "Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {hotelBookingsData.data.length > 0 &&
                hotelBookingsData.data.map((booking, index) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    hotelBookingsData={hotelBookingsData}
                    getMoreData={getHotelBookingsData}
                    last={index === hotelBookingsData.data.length - 1}
                    loading={loading}
                    updateBookingState={updateBookingState}
                    deleteFunc={openModal}
                  />
                ))}
            </tbody>
          </table>
          {hotelBookingsData.data.length < 1 && <NoData loading={loading} />}
        </div>
      </div>

      <ModelActions
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={gt("Delete", "Delete")}
        name={gt("Booking", "Booking")}
        loading={loading}
        clickFunc={deleteSelectedFunc}
        des={gt("DeleteWarning", "This action cannot be undone.")}
      />
    </div>
  );
};

export default page;