"use client";
import TransporationFilter from "@/components/transportation-page/TransporationFilter";
import TransportationCard from "@/components/transportation-page/TransportationCard";
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
  const transportationTrans = useTranslations("transportationsPage");
  const {
    getTransporations,
    loading,
    transporationsCards,
    deleteTransportations,
    setTransporationsCards,
    companyUser,
    getTransporationsCompanyUser,
    travelAgent,
    getTransporationsTravelAgent,
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
      if (travelAgent) {
        getTransporationsTravelAgent(filter, 0, 30);
      } else if (companyUser) {
        getTransporationsCompanyUser(filter, 0, 30);
      } else {
        getTransporations(filter, 0, 30);
      }
    }, 600);
  }, [companyUser, travelAgent]);

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
    setTransporationsCards((e) => ({
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
    const data = await deleteTransportations({
      transportationIds: [...selectedIds],
    });
    setTransporationsCards((e) => {
      let temp = [...e.data];
      temp = temp.filter(
        (transportation) => !selectedIds.includes(transportation?._id)
      );
      return {
        ...e,
        data: [...temp],
        stats: {
          ...e.stats,
          totalTransportations: e.stats.totalCompanies - selectedIds.length,
        },
      };
    });
    if (data.success) {
      setSelectedIds([]);
      closeModal();
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {transportationTrans("Transportations")}
        </h3>
      </div>
      <div className="flex flex-col gap-[20px]">
        <StatCard
          title={transportationTrans("TotalTransportations")}
          value={transporationsCards?.stats?.totalTransportations || 0}
          icon={<Location />}
          color="bg-indigo-100 text-indigo-600"
        />

        <div className="flex flex-row items-center justify-between gap-[10px] flex-wrap lg:flex-nowrap pb-[20px]">
          <StatCard
            title={transportationTrans("CarTransportations")}
            value={transporationsCards?.stats?.carTransportations || 0}
            icon={svgs.car}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title={transportationTrans("BusTransportations")}
            value={transporationsCards?.stats?.busTransportations || 0}
            icon={svgs.bus}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            title={transportationTrans("TrainTransportations")}
            value={transporationsCards?.stats?.trainTransportations || 0}
            icon={svgs.train}
            color="bg-purple-300 text-purple-600"
          />
          <StatCard
            title={transportationTrans("PlaneTransportations")}
            value={transporationsCards?.stats?.planeTransportations || 0}
            icon={svgs.plane}
            color="bg-red-100 text-red-600"
          />
        </div>
      </div>

      <TransporationFilter
        companyUser={companyUser}
        travelAgent={travelAgent}
        deletClickFunc={() => selectedIds.length > 0 && openModal()}
        filterState={filterState}
        setfilterState={setfilterState}
        seachingBy={[
          { name: transportationTrans("All"), value: "all" },
          { name: transportationTrans("Name"), value: "name" },
          { name: transportationTrans("From"), value: "from" },
          { name: transportationTrans("To"), value: "to" },
          { name: transportationTrans("VehicleType"), value: "vehicleType" },
          { name: transportationTrans("TicketPrice"), value: "ticketPrice" },
          { name: transportationTrans("Date"), value: "date" },
        ]}
      />

      <div className="min-h-screen">
        <div className="">
          <table className="w-[900px] md:w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] dark:border-gray-600 text-start ">
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300 flex-row flex gap-[10px]">
                  <Checkbox
                    onChange={(cond) => {
                      if (cond) {
                        const ids = [];
                        transporationsCards.data?.forEach((it) => {
                          ids.push(it._id);
                        });
                        setSelectedIds([...ids]);
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    checked={transporationsCards.data?.every((it) =>
                      selectedIds.includes(it._id)
                    )}
                  />
                  {transportationTrans("Name")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {transportationTrans("From")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {transportationTrans("To")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {transportationTrans("Time")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {transportationTrans("TicketPrice")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {transportationTrans("VehicleDetails")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {transportationTrans("VehicleType")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {transportationTrans("Date")}
                </th>

                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {transportationTrans("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {transporationsCards.data.length > 0 &&
                transporationsCards.data?.map((transport, index) => (
                  <TransportationCard
                    key={index}
                    transport={transport}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    transporationsCards={transporationsCards}
                    getMoreData={getTransporations}
                    last={index === transporationsCards.data.length - 1}
                    loading={loading}
                    deleteCompFunc={openModal}
                    companyUser={companyUser}
                    travelAgent={travelAgent}
                  />
                ))}
            </tbody>
          </table>
          {transporationsCards.data.length < 1 && <NoData loading={loading} />}
        </div>
      </div>
      <ModelActions
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={transportationTrans("Delete")}
        name={transportationTrans("Transportation")}
        loading={loading}
        clickFunc={deleteTrasnsportaionsFunc}
        des={transportationTrans("DeleteWarning")}
      />
    </div>
  );
};

export default page;
