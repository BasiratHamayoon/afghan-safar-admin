"use client";
import Checkbox from "@/components/form/input/Checkbox";
import InputDate from "@/components/form/input/InputDate";
import Input from "@/components/form/input/InputField";
import RadioSm from "@/components/form/input/RadioSm";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { ContextAdmin } from "@/context/MainStateAdmin";
import { InfoIcon, TrashBinIcon } from "@/icons";
import StatCard from "@/components/ui/Card/StatCard";
import { useContext, useEffect, useMemo, useState } from "react";
import BgAdCard from "@/components/Bg ads page/BgAdCard";
import NoData from "@/components/ui/NoData";
import ModelActions from "@/components/ui/modal/ModelActions";
import { useModal } from "@/hooks/useModal";
import { Ads } from "@/icons";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";

const page = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const adBGTrans = useTranslations("adBGPage");
  const { bgAdsCard, setBgAdsCard, getBgAdsData, loading, deleteBGAds } =
    useContext(ContextAdmin);
  const [filterState, setfilterState] = useState({
    used: ["all"],
    title: "",
    date: "all",
  });
  const [selectedIds, setSelectedIds] = useState([]);

  const debouncedFetch = useMemo(() => {
    return debounce((filter) => {
      getBgAdsData(filter, 0, 40);
    }, 600);
  }, []);

  useEffect(() => {
    let filter = {};

    setBgAdsCard((e) => ({
      ...e,
      start: 0,
      end: 40,
      allDone: false,
      data: [],
    }));

    if (filterState.used.includes("all")) {
      filter = { ...filterState };
    } else {
      filterState.used.forEach((it) => {
        filter[it] = filterState[it];
      });
    }

    delete filter.used;
    console.log(filter);
    debouncedFetch(filter);
  }, [filterState]);

  const deleteAdsFunc = async () => {
    const data = await deleteBGAds({ adIds: [...selectedIds] });
    setBgAdsCard((e) => {
      let temp = [...e.data];
      temp = temp.filter((ad) => !selectedIds.includes(ad?._id));
      return {
        ...e,
        data: [...temp],
        stats: {
          ...e.stats,
          totalAds: e.stats.totalAds - selectedIds.length,
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
          {adBGTrans("BackgroundAdList")}
        </h3>
      </div>

      <div className="flex flex-row items-center justify-start gap-[10px] flex-wrap lg:flex-nowrap pb-[20px]">
        <StatCard
          title={adBGTrans("TotalAds")}
          value={bgAdsCard?.stats?.totalAds || 0}
          icon={<Ads />}
          color="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title={adBGTrans("AddedToday")}
          value={bgAdsCard?.stats?.todayAdded || 0}
          icon={<InfoIcon />}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <Filter
        filterState={filterState}
        setfilterState={setfilterState}
        deletClickFunc={() => selectedIds.length > 0 && openModal()}
        seachingBy={[
          { name: adBGTrans("All"), value: "all" },
          { name: adBGTrans("Title"), value: "title" },
          { name: adBGTrans("Date"), value: "date" },
        ]}
      />
      <div className="min-h-screen">
        <div className="overflow-x-auto">
          <table className="w-[1000px] md:w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] dark:border-gray-600 text-start ">
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300 flex-row flex gap-[10px]">
                  <Checkbox
                    onChange={(cond) => {
                      if (cond) {
                        const ids = [];
                        bgAdsCard.data.forEach((it) => {
                          ids.push(it._id);
                        });
                        setSelectedIds([...ids]);
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    checked={bgAdsCard?.data?.every((it) =>
                      selectedIds.includes(it._id)
                    )}
                  />
                  {adBGTrans("Ads")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {adBGTrans("NoOfUsers")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {adBGTrans("Users")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {adBGTrans("CreatedAt")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {adBGTrans("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {bgAdsCard?.data?.map((ad, index) => (
                <BgAdCard
                  key={index}
                  ad={ad}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  bgAdsCard={bgAdsCard}
                  getMoreData={getBgAdsData}
                  last={index === bgAdsCard.data.length - 1}
                  loading={loading}
                  deleteADFunc={openModal}
                />
              ))}
            </tbody>
          </table>
          {bgAdsCard?.data.length < 1 && <NoData loading={loading} />}
        </div>
      </div>

      <ModelActions
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={adBGTrans("Delete")}
        name={adBGTrans("Ad")}
        loading={loading}
        clickFunc={deleteAdsFunc}
        des={adBGTrans("DeleteWarning")}
      />
    </div>
  );
};

export default page;

const Filter = ({
  filterState,
  setfilterState,
  seachingBy,
  deletClickFunc,
}) => {
  const FilterTrans = useTranslations("Filter");
  const changeFunc = (value, key) => {
    setfilterState((e) => ({ ...e, [key]: value }));
  };
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-[10px]">
        <h3 className="med-16 !text-gray-900 dark:!text-gray-200">
          {FilterTrans("SearchBy")}
        </h3>
        <div className="flex flex-row items-center gap-[10px] w-full pb-[20px] flex-wrap lg:flex-nowrap">
          <Input
            placeholder={FilterTrans("Title")}
            onChange={(e) => changeFunc(e.target.value, "title")}
          />
          <input
            className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 shadow-theme-xs placeholder:text-gray-400 text-sm focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
            type="date"
            id="start"
            name="trip-start"
            value={filterState?.date || new Date()}
            onChange={(e) => changeFunc(e.target.value, "date")}
            placeholder={FilterTrans("Date")}
          />
        </div>
      </div>

      <div className="flex flex-row items-center gap-[25px] flex-wrap justify-between py-[20px] pl-[5px] border-y border-[#e5e7eb] dark:border-none">
        <div className="flex flex-row md:gap-[25px] gap-[20px] flex-wrap">
          <span className="text-gray-700 bk-14 dark:text-gray-300">
            {FilterTrans("Show")}
          </span>
          {seachingBy?.map((it, index) => (
            <RadioSm
              key={index}
              label={it.name}
              value={it.value}
              checked={filterState.used.includes(it.value)}
              onChange={(value) => {
                setfilterState((e) => {
                  if (e.used.includes(value)) {
                    const tempUsed = [...e.used];
                    tempUsed.splice(tempUsed.indexOf(value), 1);
                    return { ...e, used: [...tempUsed] };
                  } else {
                    return { ...e, used: [...e.used, value] };
                  }
                });
              }}
            />
          ))}
        </div>
        <div className="flex flex-row items-center gap-[5px]">
          <Button
            onClick={deletClickFunc}
            startIcon={<TrashBinIcon />}
            className={"bg-error-600 h-[35px] w-[90px] hover:bg-error-700"}
          >
            {FilterTrans("Delete")}
          </Button>
        </div>
      </div>
    </div>
  );
};
