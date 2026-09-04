"use client";
import TransporationFilter from "@/components/transportation-page/TransporationFilter";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import { ContextAdmin } from "@/context/MainStateAdmin";
import NoData from "@/components/ui/NoData";
import { svgs } from "@/consonants";
import StatCard from "@/components/ui/Card/StatCard";
import { Location, HalfArrow } from "@/icons";
import { useModal } from "@/hooks/useModal";
import ModelActions from "@/components/ui/modal/ModelActions";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";
import toAfghaniTime from "@/util/toAfghaniTime";
import { useRouter } from "next/navigation";
import toAfghaniDate from "@/util/toAfghaniDate";
import VehicleTypeShower from "@/components/ui/VehicleTypeShower";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

const page = () => {
  const bookedTicketsTrans = useTranslations("bookedTicketsPage");
  const {
    loading,
    bookedTickets,
    setBookedTickets,
    travelAgent,
    getBookedTicketsTravelAgent,
    setTicket,
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
      getBookedTicketsTravelAgent(filter, 0, 30);
    }, 600);
  }, [travelAgent]);

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
    setBookedTickets((e) => ({
      ...e,
      start: 0,
      end: 30,
      allDone: true,
      data: [],
    }));

    if (travelAgent !== null) {
      debouncedFetch(filter);
    }
  }, [filterState, travelAgent]);

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
          value={bookedTickets?.stats?.totalBookings || 0}
          icon={<Location />}
          color="bg-indigo-100 text-indigo-600"
        />
      </div>

      <TransporationFilter
        travelAgent={travelAgent}
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
                    getMoreData={getBookedTicketsTravelAgent}
                    last={index === bookedTickets.data.length - 1}
                    loading={loading}
                    deleteTickFunc={openModal}
                    companyUser={false}
                    setTicket={setTicket}
                  />
                ))}
            </tbody>
          </table>
          {bookedTickets.data.length < 1 && <NoData loading={loading} />}
        </div>
      </div>
    </div>
  );
};

export default page;

const BookedTicketCard = ({
  ticket,
  selectedIds,
  setSelectedIds,
  bookedTickets,
  getMoreData,
  last,
  loading,
  setTicket,
}) => {
  const router = useRouter();
  const [callForData, setcallForData] = useState(false);
  const cardRef = useRef();
  const [showOptions, setshowOptions] = useState(false);
  useEffect(() => {
    if (last && !bookedTickets.allDone) {
      const intersecTionobserver = new IntersectionObserver((ele) => {
        ele.forEach((it) => {
          if (it.isIntersecting) {
            setcallForData(true);
          }
        });
      });
      bookedTickets.allDone
        ? intersecTionobserver.unobserve(cardRef.current)
        : intersecTionobserver.observe(cardRef.current);
    }
  }, []);

  useEffect(() => {
    if (callForData && !bookedTickets.allDone && !loading) getMoreData();
  }, [callForData]);

  const viewDetails = () => {
    setTicket(ticket);
    router.push("/ticket-download?id=" + ticket._id);
  };

  const actionFunc = () => {
    setshowOptions(!showOptions);
    setSelectedIds([ticket._id]);
  };

  return (
    <tr
      ref={cardRef}
      onClick={viewDetails}
      className="border-b border-[#e5e7eb] cursor-pointer relative items-center dark:border-gray-600 hover:bg-[#f3f4f6] dark:hover:bg-gray-800"
    >
      <td className="py-3 pl-[6px]">
        <div className="flex flex-row gap-3 ">
          <Checkbox
            checked={selectedIds.includes(ticket._id)}
            onChange={() => {
              setSelectedIds((e) => {
                const tempIds = [...e];

                if (tempIds.includes(ticket._id)) {
                  tempIds.splice(
                    e.findIndex((it) => it === ticket._id),
                    1
                  );
                } else {
                  tempIds.push(ticket._id);
                }
                return [...tempIds];
              });
            }}
          />

          <div className="flex flex-col">
            <span className="med-14 !text-gray-700 dark:!text-gray-300">
              {ticket.supervisorInfo?.name}
            </span>
            <span className="med-12 !text-gray-700 dark:!text-gray-300">
              {ticket?.user?.email}
            </span>
          </div>
        </div>
      </td>
      <td className="med-14 !text-gray-700 dark:!text-gray-300">
        {ticket.transportation.name}
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        From : {ticket.transportation.from}
        <br />
        To : {ticket.transportation.to}
      </td>

      <td className="p-2 bk-12 !text-gray-700 dark:!text-gray-300">
        <div className="flex flex-col gap-[5px]">
          <span className="flex-center flex-row bg-brand-500 max-w-[140px] w-full rounded-[12px] text-white py-[2px] [&_svg]:fill-white">
            Departure{" "}
            <span className="translate-y-[-1px]">
              <HalfArrow />
            </span>{" "}
            {toAfghaniTime(ticket.transportation.departureTime)}
          </span>
          <span className="flex-center flex-row bg-orange-500 max-w-[140px] w-full rounded-[12px] text-white py-[2px] [&_svg]:fill-white">
            Arrival{" "}
            <span className="translate-y-[2px] rotate-[180deg]">
              <HalfArrow />
            </span>{" "}
            {toAfghaniTime(ticket.transportation.arrivalTime)}
          </span>
        </div>
      </td>

      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {ticket.transportation.date &&
          toAfghaniDate(ticket.transportation.date)}
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300 ">
        <div className="flex flex-col">
          <span>
            Booked :{" "}
            {ticket?.selectedSeats?.unknown?.slice(0, 3).map((it) => it + ",")}
            {ticket?.selectedSeats?.unknown?.length > 3 ? "..." : ""}
          </span>
          <span>
            Male Booked :
            {ticket?.selectedSeats?.male?.slice(0, 3).map((it) => it + ",")}
            {ticket?.selectedSeats?.male?.length > 3 ? "..." : ""}
          </span>
          <span>
            Female Booked :{" "}
            {ticket?.selectedSeats?.female?.slice(0, 3).map((it) => it + ",")}
            {ticket?.selectedSeats?.female?.length > 3 ? "..." : ""}
          </span>
        </div>
      </td>
      <td className="p-3">
        <VehicleTypeShower
          name={ticket.transportation.vehicleDetails?.vehicleType}
        />
      </td>
      <td
        className={`p-3 bk-14 capitalize ${
          ticket.state.includes("canceled")
            ? "!text-red-500"
            : "!text-green-500"
        }`}
      >
        {ticket.state}
      </td>

      <td
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="p-3 cursor-pointer"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setshowOptions(!showOptions);
          }}
          className="w-[28px] h-[28px] flex-center hover:bg-gray-200 rounded-[6px]"
        >
          <svg
            className="dark:fill-gray-300 dark:stroke-gray-300"
            aria-hidden="true"
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
            ></path>
          </svg>
        </button>
        <Dropdown
          isOpen={showOptions}
          onClose={() => {
            setshowOptions(!showOptions);
          }}
          className="w-40 p-2"
        >
          <DropdownItem
            onItemClick={() => {
              actionFunc();
              viewDetails();
            }}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            View Details
          </DropdownItem>
        </Dropdown>
      </td>
    </tr>
  );
};
