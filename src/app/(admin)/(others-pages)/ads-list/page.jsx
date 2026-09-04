"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import RadioSm from "@/components/form/input/RadioSm";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { ContextAdmin } from "@/context/MainStateAdmin";
import { InfoIcon, TrashBinIcon } from "@/icons";
import StatCard from "@/components/ui/Card/StatCard";
import { useContext, useEffect, useMemo, useState } from "react";
import AdCard from "@/components/ads page/AdCard";
import NoData from "@/components/ui/NoData";
import ModelActions from "@/components/ui/modal/ModelActions";
import { useModal } from "@/hooks/useModal";
import { Ads, Block, UnBlock } from "@/icons";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";
const page = () => {
  const adTrans = useTranslations("adPage");
  const { adsCard, setAdsCard, getAdsData, loading, deleteAds, blockAds } =
    useContext(ContextAdmin);
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isOpenBlock,
    openModal: openModalBlock,
    closeModal: closeModalBlock,
  } = useModal();
  const {
    isOpen: isOpenUnBlock,
    openModal: openModalUnBlock,
    closeModal: closeModalUnBlock,
  } = useModal();
  const [filterState, setfilterState] = useState({
    used: ["all"],
    title: "",
    date: "all",
    status: "all",
  });
  const [selectedIds, setSelectedIds] = useState([]);

  const debouncedFetch = useMemo(() => {
    return debounce((filter) => {
      getAdsData(filter, 0, 40);
    }, 600);
  }, []);

  useEffect(() => {
    let filter = {};
    setAdsCard((e) => ({
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
    debouncedFetch(filter);
  }, [filterState]);

  const deleteAdsFunc = async () => {
    const data = await deleteAds({ adIds: [...selectedIds] });
    setAdsCard((e) => {
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

  const blockAdsFunc = async () => {
    const data = await blockAds({
      adIds: [...selectedIds],
      status: "in-active",
    });
    setAdsCard((e) => {
      let temp = [...e.data];
      temp.map(
        (ad, index) =>
          selectedIds.includes(ad._id) && (temp[index].status = "in-active")
      );
      return { ...e, data: [...temp] };
    });
    if (data.success) {
      setSelectedIds([]);
      closeModalBlock();
    }
  };

  const unBlockAdsFunc = async () => {
    const data = await blockAds({ adIds: [...selectedIds], status: "active" });
    setAdsCard((e) => {
      let temp = [...e.data];
      temp.map(
        (ad, index) =>
          selectedIds.includes(ad._id) && (temp[index].status = "active")
      );
      return { ...e, data: [...temp] };
    });
    if (data.success) {
      setSelectedIds([]);
      closeModalUnBlock();
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {adTrans("AdList")}
        </h3>
      </div>

      <div className="flex flex-row items-center justify-between gap-[10px] flex-wrap lg:flex-nowrap pb-[20px]">
        <StatCard
          title={adTrans("TotalAds")}
          value={adsCard?.stats?.totalAds || 0}
          icon={<Ads />}
          color="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title={adTrans("AddedToday")}
          value={adsCard?.stats?.todayAdded || 0}
          icon={<InfoIcon />}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title={adTrans("ActiveAds")}
          value={adsCard?.stats?.activeAds || 0}
          icon={<Block />}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title={adTrans("InactiveAds")}
          value={adsCard?.stats?.totalAds - adsCard?.stats?.activeAds || 0}
          icon={<UnBlock />}
          color="bg-red-200 text-yellow-600"
        />
      </div>

      <Filter
        filterState={filterState}
        setfilterState={setfilterState}
        deletClickFunc={() => selectedIds.length > 0 && openModal()}
        unBlockClickFunc={() => selectedIds.length > 0 && openModalUnBlock()}
        blockClickFunc={() => selectedIds.length > 0 && openModalBlock()}
        seachingBy={[
          { name: adTrans("All"), value: "all" },
          { name: adTrans("Title"), value: "title" },
          { name: adTrans("Date"), value: "date" },
          { name: adTrans("Status"), value: "status" },
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
                        adsCard.data.forEach((it) => {
                          ids.push(it._id);
                        });
                        setSelectedIds([...ids]);
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    checked={adsCard?.data?.every((it) =>
                      selectedIds.includes(it._id)
                    )}
                  />
                  {adTrans("Ads")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {adTrans("Date")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {adTrans("Status")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {adTrans("Link")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {adTrans("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {adsCard?.data?.map((ad, index) => (
                <AdCard
                  key={index}
                  ad={ad}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  adsCard={adsCard}
                  getMoreData={getAdsData}
                  last={index === adsCard.data.length - 1}
                  loading={loading}
                  blockADFunc={openModalBlock}
                  unBlockClickFunc={openModalUnBlock}
                  deleteADFunc={openModal}
                />
              ))}
            </tbody>
          </table>
          {adsCard?.data.length < 1 && <NoData loading={loading} />}
        </div>
      </div>

      <ModelActions
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={adTrans("Delete")}
        name={adTrans("Ad")}
        loading={loading}
        clickFunc={deleteAdsFunc}
        des={adTrans("DeleteDescription")}
      />

      <ModelActions
        isOpen={isOpenBlock}
        onClose={closeModalBlock}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={adTrans("Disable")}
        name={adTrans("Ad")}
        loading={loading}
        clickFunc={blockAdsFunc}
        des={adTrans("BlockDescription")}
      />

      <ModelActions
        isOpen={isOpenUnBlock}
        onClose={closeModalUnBlock}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={adTrans("Activate")}
        name={adTrans("Ad")}
        loading={loading}
        clickFunc={unBlockAdsFunc}
        des={adTrans("UnblockDescription")}
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
  blockClickFunc,
  unBlockClickFunc,
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
            onChange={(ele) => changeFunc(ele.target.value, "title")}
          />
          <Select
            options={[
              { label: FilterTrans("All"), value: "all" },
              { label: FilterTrans("Active"), value: "active" },
              { label: FilterTrans("InActive"), value: "in-active" },
            ]}
            placeholder={FilterTrans("Status")}
            className="lg:max-w-[250px]"
            onChange={(value) => changeFunc(value, "status")}
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
            className={"bg-error-600 h-[35px] min-w-[90px] hover:bg-error-700"}
          >
            {FilterTrans("Delete")}
          </Button>
          <Button
            onClick={blockClickFunc}
            startIcon={<Block />}
            className={
              "bg-neutral-600 h-[35px] min-w-[90px] hover:bg-neutral-900"
            }
          >
            {FilterTrans("Disable")}
          </Button>
          <Button
            onClick={unBlockClickFunc}
            startIcon={<UnBlock />}
            className={"bg-green-600 h-[35px] w-max hover:bg-green-900"}
          >
            {FilterTrans("Activate")}
          </Button>
        </div>
      </div>
    </div>
  );
};
