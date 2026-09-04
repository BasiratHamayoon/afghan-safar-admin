"use client";
import Filter from "@/components/ui/Filter";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import { ContextAdmin } from "@/context/MainStateAdmin";
import UserCard from "../../../../components/users-page/UserCard";
import NoData from "@/components/ui/NoData";
import ModelActions from "@/components/ui/modal/ModelActions";
import StatCard from "@/components/ui/Card/StatCard";
import { useModal } from "@/hooks/useModal";
import {
  Block,
  Bus,
  Driver,
  InfoIcon,
  Loading,
  UserIcon,
  UnBlock,
} from "@/icons";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const page = () => {
  const driverPageTrans = useTranslations("driverPage");
  const router = useRouter();
  const { driversCardsData, getDriversData, loading, setDriversCardsData } =
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
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [filterState, setfilterState] = useState({
    used: "all",
    status: "all",
    searchQuery: "",
  });

  const debouncedFetch = useMemo(() => {
    return debounce((filter) => {
      getDriversData(filter, 0, 40);
    }, 600);
  }, []);

  useEffect(() => {
    let filter = {};

    setDriversCardsData((e) => ({
      ...e,
      start: 0,
      end: 40,
      allDone: false,
      data: [],
    }));

    if (filterState.used === "all") {
      filter = { ...filterState };
      filter.blocked =
        filterState.status === "all" ? "all" : filterState.status === "blocked";
      delete filter.used;
      delete filter.status;
    } else {
      if (filterState.used === "status") {
        filter.blocked =
          filterState.status === "all"
            ? "all"
            : filterState.status === "blocked";
        delete filter.status;
      }

      filter.searchQuery = filterState.searchQuery.trim();
      delete filter.used;
      delete filter.vehicleType;
    }

    debouncedFetch(filter);
  }, [filterState]);

  const closeModalFunc = () => {
    closeModal();
    closeModalBlock();
    closeModalUnBlock();
  };

  const deleteUsersFunc = async () => {
    const data = await deleteUsers({ userIds: [...selectedIds] });
    setuserCardsData((e) => {
      let temp = [...e.data];
      temp = temp.filter((user) => !selectedIds.includes(user?._id));
      return { ...e, data: [...temp] };
    });
    if (data.success) {
      setSelectedIds([]);
      setSelectedEmails([]);
      closeModal();
    }
  };

  const blockUsersFunc = async () => {
    const data = await blockUsers({ userIds: [...selectedIds], block: true });
    setuserCardsData((e) => {
      let temp = [...e.data];
      temp.map(
        (user, index) =>
          selectedIds.includes(user._id) && (temp[index].blocked = true)
      );
      return { ...e, data: [...temp] };
    });
    if (data.success) {
      setSelectedIds([]);
      setSelectedEmails([]);
      closeModalBlock();
    }
  };

  const unBlockClickFunc = async () => {
    const data = await blockUsers({ userIds: [...selectedIds], block: false });
    setuserCardsData((e) => {
      let temp = [...e.data];
      temp.map(
        (user, index) =>
          selectedIds.includes(user._id) && (temp[index].blocked = false)
      );
      return { ...e, data: [...temp] };
    });
    if (data.success) {
      setSelectedIds([]);
      setSelectedEmails([]);
      closeModalUnBlock();
    }
  };

  const NotificationClick = (defaultRoute = null) => {
    if (defaultRoute) {
      router.push(defaultRoute);
    } else {
      if (selectedEmails.length > 200) {
        router.push(
          "/send-notifications/?to=app&email=" +
            selectedEmails.slice(0, 200).toString()
        );
      } else {
        router.push(
          "/send-notifications/?to=app&email=" + selectedEmails.toString()
        );
      }
    }
  };

  const clickFuncGrantAd = (defaultRoute = null) => {
    if (defaultRoute) {
      router.push(defaultRoute);
    } else {
      if (selectedEmails.length > 25) {
        router.push(
          "/create-background-ad?emails=" +
            selectedEmails.slice(0, 25).toString()
        );
      } else {
        router.push(
          "/create-background-ad?emails=" + selectedEmails.toString()
        );
      }
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {driverPageTrans("Drivers")}
        </h3>
      </div>

      <div className="flex flex-row items-center justify-between gap-[10px] flex-wrap lg:flex-nowrap pb-[20px]">
        <StatCard
          title={driverPageTrans("TotalUsers")}
          value={driversCardsData?.stats?.totalUsers || 0}
          icon={<UserIcon />}
          color="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title={driverPageTrans("TotalDrivers")}
          value={driversCardsData?.stats?.totalDrivers || 0}
          icon={<UserIcon />}
          color="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title={driverPageTrans("BlockedDrivers")}
          value={driversCardsData?.stats?.totalBlockedUsers || 0}
          icon={<Block />}
          color="bg-red-100 text-red-600"
        />
        <StatCard
          title={driverPageTrans("ActiveDrivers")}
          value={
            driversCardsData?.stats?.totalDrivers -
              driversCardsData?.stats?.totalBlockedUsers || 0
          }
          icon={<UnBlock />}
          color="bg-green-100 text-red-600 [&_svg]:stroke-green-900"
        />
      </div>

      <Filter
        deletClickFunc={() => selectedIds.length > 0 && openModal()}
        blockClickFunc={() => selectedIds.length > 0 && openModalBlock()}
        unBlockClickFunc={() => selectedIds.length > 0 && openModalUnBlock()}
        filterState={filterState}
        setfilterState={setfilterState}
        NotificationClick={NotificationClick}
        showGrantBgAd={true}
        clickFuncGrantAd={clickFuncGrantAd}
      />
      <div className="min-h-screen">
        <div className="">
          <table className="w-[1000px] md:w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] dark:border-gray-600 text-start ">
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300 flex-row flex gap-[10px]">
                  <Checkbox
                    onChange={(cond) => {
                      if (cond) {
                        const ids = [];
                        const emails = [];
                        driversCardsData.data.forEach((it) => {
                          ids.push(it._id);
                          emails.push(it.email);
                        });
                        setSelectedIds([...ids]);
                        setSelectedEmails([...emails]);
                      } else {
                        setSelectedIds([]);
                        setSelectedEmails([]);
                      }
                    }}
                    checked={driversCardsData.data.every((it) =>
                      selectedIds.includes(it._id)
                    )}
                  />
                  {driverPageTrans("User")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {driverPageTrans("UserRole")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {driverPageTrans("Email")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {driverPageTrans("Phone")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {driverPageTrans("VehicleType")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {driverPageTrans("CreatedAt")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {driverPageTrans("Status")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {driverPageTrans("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {driversCardsData.data?.map((user, index) => (
                <UserCard
                  key={index}
                  user={user}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  driversCardsData={driversCardsData}
                  setSelectedEmails={setSelectedEmails}
                  getMoreData={getDriversData}
                  last={index === driversCardsData.data.length - 1}
                  loading={loading}
                  showType={true}
                  NotificationClick={NotificationClick}
                  blockUsersFunc={openModalBlock}
                  unBlockClickFunc={openModalUnBlock}
                  deleteUsersFunc={openModal}
                  clickFuncGrantAd={clickFuncGrantAd}
                  userCardsData={driversCardsData}
                />
              ))}
            </tbody>
          </table>
          {driversCardsData.data.length < 1 && <NoData loading={loading} />}
        </div>
      </div>
      <ModelActions
        isOpen={isOpen}
        onClose={closeModalFunc}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={"Delete"}
        loading={loading}
        clickFunc={deleteUsersFunc}
        des={driverPageTrans("des1")}
      />
      <ModelActions
        isOpen={isOpenBlock}
        onClose={closeModalFunc}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={"Block"}
        loading={loading}
        clickFunc={blockUsersFunc}
        des={driverPageTrans("des2")}
      />
      <ModelActions
        isOpen={isOpenUnBlock}
        onClose={closeModalUnBlock}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={"Un-Block"}
        loading={loading}
        clickFunc={unBlockClickFunc}
        des={driverPageTrans("des3")}
      />
    </div>
  );
};

export default page;
