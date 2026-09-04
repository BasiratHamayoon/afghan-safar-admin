"use client";
import Filter from "@/components/ui/Filter";
import React, { useContext, useEffect, useMemo, useState } from "react";
import NoData from "@/components/ui/NoData";
import Checkbox from "@/components/form/input/Checkbox";
import TransportationCompanyCard from "@/components/company page/TransportationCompanyCard";
import StatCard from "@/components/ui/Card/StatCard";
import { ContextAdmin } from "@/context/MainStateAdmin";
import ModelActions from "@/components/ui/modal/ModelActions";
import { Bus } from "@/icons";
import { svgs } from "@/consonants";
import { useModal } from "@/hooks/useModal";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";
const page = () => {
  const companyTrans = useTranslations("transportCompaniesPage");
  const { isOpen, openModal, closeModal } = useModal();
  const {
    companyCards,
    setCompanyCards,
    loading,
    getCompanyCards,
    deleteCompanies,
  } = useContext(ContextAdmin);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterState, setfilterState] = useState({
    used: "all",
    vehicleType: "all",
    searchQuery: "",
  });

  const debouncedFetch = useMemo(() => {
    return debounce((filter) => {
      getCompanyCards(filter, 0, 40);
    }, 600);
  }, []);

  useEffect(() => {
    let filter = {};

    setCompanyCards((e) => ({
      ...e,
      start: 0,
      end: 40,
      allDone: false,
      data: [],
    }));

    if (filterState.used === "all") {
      filter = { ...filterState };
      //  must be undeifned for optional to work on backend
      filter.vehicleType =
        filter.vehicleType === "all" ? undefined : filterState.vehicleType;
      delete filter.used;
    } else {
      if (filterState.used === "vehicleType") {
        //  must be undeifned for optional to work on backend
        filter.vehicleType =
          filter.vehicleType === "all" ? undefined : filterState.vehicleType;
      }
      filter.searchQuery = filterState.searchQuery.trim();
      delete filter.used;
    }

    debouncedFetch(filter);
  }, [filterState]);

  const deleteCompanyFunc = async () => {
    const data = await deleteCompanies({ companyIds: [...selectedIds] });
    setCompanyCards((e) => {
      let temp = [...e.data];
      temp = temp.filter((company) => !selectedIds.includes(company?._id));
      return {
        ...e,
        data: [...temp],
        stats: {
          ...e.stats,
          totalCompanies: e.stats.totalCompanies - selectedIds.length,
        },
      };
    });
    if (data.success) {
      setSelectedIds([]);
      closeModal();
    }
  };

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
          <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
            {companyTrans("TransportCompanies")}
          </h3>
        </div>
        <div className="flex flex-col gap-[20px]">
          <StatCard
            title={companyTrans("TotalCompanies")}
            value={companyCards?.stats?.totalCompanies || 0}
            icon={<Bus />}
            color="bg-indigo-100 text-indigo-600"
          />

          <div className="flex flex-row items-center justify-between gap-[10px] flex-wrap lg:flex-nowrap pb-[20px]">
            <StatCard
              title={companyTrans("CarCompanies")}
              value={companyCards?.stats?.carCompanies || 0}
              icon={svgs.car}
              color="bg-blue-100 text-blue-600"
            />
            <StatCard
              title={companyTrans("BusCompanies")}
              value={companyCards?.stats?.busCompanies || 0}
              icon={svgs.bus}
              color="bg-purple-100 text-purple-600"
            />
            <StatCard
              title={companyTrans("TrainCompanies")}
              value={companyCards?.stats?.trainCompanies || 0}
              icon={svgs.train}
              color="bg-purple-300 text-purple-600"
            />
            <StatCard
              title={companyTrans("PlaneCompanies")}
              value={companyCards?.stats?.planeCompanies || 0}
              icon={svgs.plane}
              color="bg-red-100 text-red-600"
            />
          </div>
        </div>

        <Filter
          filterState={filterState}
          setfilterState={setfilterState}
          optPlaceholder={companyTrans("VehicleType")}
          deletClickFunc={() => selectedIds.length > 0 && openModal()}
          optValue={"vehicleType"}
          noStatus={true}
          noBlock={true}
          noUnblock={true}
          noNotification={true}
          options={[
            { label: companyTrans("All"), value: "all" },
            { label: companyTrans("Bus"), value: "bus" },
            { label: companyTrans("Car"), value: "car" },
            {
              label: companyTrans("Train"),
              value: "train",
            },
            { label: companyTrans("Plane"), value: "plane" },
          ]}
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
                          companyCards.data?.forEach((it) => {
                            ids.push(it._id);
                          });
                          setSelectedIds([...ids]);
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      checked={companyCards.data?.every((it) =>
                        selectedIds.includes(it._id)
                      )}
                    />
                    {companyTrans("Company")}
                  </th>
                  <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                    {companyTrans("Email")}
                  </th>
                  <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                    {companyTrans("Phone")}
                  </th>
                  <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                    {companyTrans("Users")}
                  </th>
                  <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                    {companyTrans("VehicleType")}
                  </th>
                  <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                    {companyTrans("CreatedAt")}
                  </th>
                  <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                    {companyTrans("Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {companyCards.data &&
                  companyCards.data?.map((company, index) => (
                    <TransportationCompanyCard
                      company={company}
                      key={index}
                      selectedIds={selectedIds}
                      setSelectedIds={setSelectedIds}
                      index={index}
                      companyCards={companyCards}
                      last={index === companyCards.data.length - 1}
                      loading={loading}
                      getMoreData={() => {}}
                      deleteOpenModel={openModal}
                    />
                  ))}
              </tbody>
            </table>
            {companyCards.data.length < 1 && <NoData />}
          </div>
        </div>
        <ModelActions
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-md m-4"
          selectedIds={selectedIds}
          type={"Delete"}
          name={"Company"}
          loading={loading}
          clickFunc={deleteCompanyFunc}
          des={companyTrans("DeleteCompanyDescription")}
        />
      </div>
    </div>
  );
};

export default page;
