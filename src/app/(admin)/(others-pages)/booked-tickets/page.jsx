"use client";
import TransporationFilter from "@/components/transportation-page/TransporationFilter";
import BookedTicketCard from "@/components/Booked-tickets page/BookedTicketCard";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import { ContextAdmin } from "@/context/MainStateAdmin";
import NoData from "@/components/ui/NoData";
import { svgs } from "@/consonants";
import StatCard from "@/components/ui/Card/StatCard";
import { Location } from "@/icons";
import { useModal } from "@/hooks/useModal";
import ModelActions from "@/components/ui/modal/ModelActions";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";

const page = () => {
  const bookedTicketsTrans = useTranslations("bookedTicketsPage");
  const {
    loading,
    getBookedTickets,
    bookedTickets,
    setBookedTickets,
    companyUser,
    getBookedTicketsOfCompany,
    deleteBookings,
  } = useContext(ContextAdmin);

  const { isOpen, openModal, closeModal } = useModal();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterState, setfilterState] = useState({
    used: ["all"],
    vehicleType: "all",
    date: "",
    name: "",
    from: "",
    to: "",
    ticketPriceMin: "",
    ticketPriceMax: "",
  });

  const debouncedFetch = useMemo(() => {
    return debounce((filter) => {
      if (companyUser) {
        getBookedTicketsOfCompany(filter, 0, 30);
      } else {
        getBookedTickets(filter, 0, 30);
      }
    }, 600);
  }, [companyUser]);

  useEffect(() => {
    let filter = {};
    if (filterState.used.includes("all")) {
      filter = { ...filterState };
    } else {
      filterState.used.forEach((it) => {
        if (filterState[it]) {
          filter[it] = filterState[it];
        }
      });
    }
    delete filter.used;
    if (filter.vehicleType === "all") delete filter.vehicleType;
    if (!filter.name) delete filter.name;
    if (!filter.from) delete filter.from;
    if (!filter.to) delete filter.to;
    if (!filter.date) delete filter.date;
    if (!filter.ticketPriceMin) delete filter.ticketPriceMin;
    if (!filter.ticketPriceMax) delete filter.ticketPriceMax;
    setBookedTickets((e) => ({
      ...e,
      start: 0,
      end: 30,
      allDone: true,
      data: [],
    }));

    if (companyUser !== null) {
      debouncedFetch(filter);
    }
  }, [filterState, companyUser]);

  const deleteTrasnsportaionsFunc = async () => {
    const data = await deleteBookings({
      bookingsIds: [...selectedIds],
    });

    if (data.success) {
      setBookedTickets((e) => {
        let temp = [...e.data];
        temp = temp.filter((booking) => !selectedIds.includes(booking?._id));
        return {
          ...e,
          data: [...temp],
          stats: {
            ...e.stats,
            totalBooked: e.stats.totalBooked - selectedIds.length,
          },
        };
      });
      setSelectedIds([]);
      closeModal();
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {bookedTicketsTrans("BookedTickets")}
        </h3>
      </div>
      <div className="flex flex-row items-center justify-between gap-[10px] flex-wrap lg:flex-nowrap pb-[20px]">
        <StatCard
          title={bookedTicketsTrans("TotalBookedTickets")}
          value={bookedTickets?.stats?.totalBooked || 0}
          icon={<Location />}
          color="bg-indigo-100 text-indigo-600"
        />

        <StatCard
          title={bookedTicketsTrans("ActiveBookings")}
          value={bookedTickets?.stats?.active || 0}
          icon={svgs.car}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title={bookedTicketsTrans("CanceledBookings")}
          value={
            bookedTickets?.stats?.totalBooked - bookedTickets?.stats?.active ||
            0
          }
          icon={svgs.bus}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <TransporationFilter
        companyUser={companyUser}
        deletClickFunc={() => selectedIds.length > 0 && openModal()}
        filterState={filterState}
        setfilterState={setfilterState}
        seachingBy={[
          { name: bookedTicketsTrans("All"), value: "all" },
          { name: bookedTicketsTrans("Name"), value: "name" },
          { name: bookedTicketsTrans("From"), value: "from" },
          { name: bookedTicketsTrans("To"), value: "to" },
          { name: bookedTicketsTrans("VehicleType"), value: "vehicleType" },
          { name: bookedTicketsTrans("TicketPrice"), value: "ticketPrice" },
          { name: bookedTicketsTrans("Date"), value: "date" },
        ]}
        hideTicketPrice={true}
      />

      <div className="min-h-screen">
        <div className="overflow-x-auto">
          <table className="w-[900px] md:w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] dark:border-gray-600 text-start ">
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300 flex-row flex gap-[10px]">
                  <Checkbox
                    onChange={(cond) => {
                      if (cond) {
                        const ids = [];
                        bookedTickets.data?.forEach((it) => {
                          ids.push(it._id);
                        });
                        setSelectedIds([...ids]);
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    checked={bookedTickets.data?.every((it) =>
                      selectedIds.includes(it._id)
                    )}
                  />
                  {bookedTicketsTrans("User")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {bookedTicketsTrans("Name")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {bookedTicketsTrans("Location")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {bookedTicketsTrans("Timings")}
                </th>

                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {bookedTicketsTrans("Date")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {bookedTicketsTrans("SelectedSeats")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {bookedTicketsTrans("VehicleType")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {bookedTicketsTrans("State")}
                </th>

                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {bookedTicketsTrans("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {bookedTickets.data.length > 0 &&
                bookedTickets.data?.map((ticket, index) => (
                  <BookedTicketCard
                    key={index}
                    ticket={ticket}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    bookedTickets={bookedTickets}
                    getMoreData={getBookedTickets}
                    last={index === bookedTickets.data.length - 1}
                    loading={loading}
                    deleteTickFunc={openModal}
                    companyUser={companyUser}
                  />
                ))}
            </tbody>
          </table>
          {bookedTickets.data.length < 1 && <NoData loading={loading} />}
        </div>
      </div>
      <ModelActions
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={bookedTicketsTrans("Delete")}
        name={bookedTicketsTrans("Transportation")}
        loading={loading}
        clickFunc={deleteTrasnsportaionsFunc}
        des={bookedTicketsTrans("DeleteConfirmationDescription")}
      />
    </div>
  );
};

export default page;
