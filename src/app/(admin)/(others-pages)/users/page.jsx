"use client";
import Filter from "@/components/ui/Filter";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import { ContextAdmin } from "@/context/MainStateAdmin";
import UserCard from "@/components/users-page/UserCard";
import StatCard from "@/components/ui/Card/StatCard";
import ModelActions from "@/components/ui/modal/ModelActions";
import { useModal } from "@/hooks/useModal";
import { Block, Bus, Driver, InfoIcon, UserIcon, UnBlock } from "@/icons";
import NoData from "@/components/ui/NoData";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";
const page = () => {
  const role = useTranslations("role");
  const UserRoles = useTranslations("UserRoles");
  const filter = useTranslations("Filter");
  const TopBars = useTranslations("TopBars");
  const desc = useTranslations("Desc");
  const statsTrans = useTranslations("stats");
  const sideBarTrans = useTranslations("AppSideBar");

  const router = useRouter();
  const {
    userCardsData,
    getUsersData,
    loading,
    deleteUsers,
    setuserCardsData,
    blockUsers,
  } = useContext(ContextAdmin);
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
    role: "all",
    status: "all",
    searchQuery: "",
  });

  const debouncedFetch = useMemo(() => {
    return debounce((filter) => {
      getUsersData(filter, 0, 40);
    }, 600);
  }, []);

  useEffect(() => {
    let filter = {};

    setuserCardsData((e) => ({
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
      if (filterState.used === "role") filter.role = filterState.role;
      filter.searchQuery = filterState.searchQuery.trim();
      delete filter.used;
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
      closeModalUnBlock();
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

  const NotificationClick = (defaultRoute = null) => {
    if (defaultRoute) {
      router.push(defaultRoute);
    } else {
      let route = "/send-notifications/?to=app&email=";
      if (["passenger", "driver"].includes(filterState.role)) {
        route = "/send-notifications/?to=app&email=";
      } else {
        route = "/send-notifications/?to=web&email=";
      }
      if (selectedEmails.length > 25) {
        router.push(route + selectedEmails.slice(0, 25).toString());
      } else {
        router.push(route + selectedEmails.toString());
      }
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {sideBarTrans("Users")}
        </h3>
      </div>
      <div className="flex flex-col w-full gap-[20px]">
        <div className="flex flex-row items-center justify-between gap-[10px] flex-wrap lg:flex-nowrap">
          <StatCard
            title={statsTrans("TotalUsers")}
            value={userCardsData?.stats?.totalUsers || 0}
            icon={<UserIcon />}
            color="bg-indigo-100 text-indigo-600"
          />
          <StatCard
            title={UserRoles("Drivers")}
            value={userCardsData?.stats?.totalDrivers || 0}
            icon={<Driver />}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title={UserRoles("Passengers")}
            value={userCardsData?.stats?.totalPassengers || 0}
            icon={<InfoIcon />}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            title={UserRoles("TransportCompanyUsers")}
            value={userCardsData?.stats?.totalCompanyUsers || 0}
            icon={<Bus />}
            color="bg-yellow-100 text-yellow-600"
          />
        </div>
        <div className="flex flex-row gap-[10px] mb-[20px] flex-wrap lg:flex-nowrap">
          <StatCard
            title={statsTrans("BlockedUsers")}
            value={userCardsData?.stats?.totalBlockedUsers || 0}
            icon={<Block />}
            color="bg-red-100 text-red-600"
          />
          <StatCard
            title={statsTrans("ActiveUsers")}
            value={
              userCardsData?.stats?.totalUsers -
                userCardsData?.stats?.totalBlockedUsers || 0
            }
            icon={<UnBlock />}
            color="bg-green-100 text-red-600 [&_svg]:stroke-green-900"
          />
        </div>
      </div>
      <Filter
        deletClickFunc={() => selectedIds.length > 0 && openModal()}
        blockClickFunc={() => selectedIds.length > 0 && openModalBlock()}
        unBlockClickFunc={() => selectedIds.length > 0 && openModalUnBlock()}
        clickFuncGrantAd={() => selectedIds.length > 0 && clickFuncGrantAd()}
        showGrantBgAd={["passenger", "driver"].includes(filterState.role)}
        filterState={filterState}
        setfilterState={setfilterState}
        options={[
          { label: role("All"), value: "all" },
          { label: role("Administrator"), value: "admin" },
          { label: role("Moderator"), value: "moderator" },
          {
            label: role("Transport company user"),
            value: "transport_company_user",
          },
          { label: role("Driver"), value: "driver" },
          { label: role("Passenger"), value: "passenger" },
        ]}
        optPlaceholder={filter("Role")}
        optValue={"role"}
        noNotification={
          filterState.role === "all" || filterState.role === "admin"
        }
        NotificationClick={NotificationClick}
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
                        const emails = [];
                        userCardsData.data.forEach((it) => {
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
                    checked={userCardsData.data.every((it) =>
                      selectedIds.includes(it._id)
                    )}
                  />
                  {TopBars("User")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {TopBars("UserRole")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {TopBars("Email")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {TopBars("Phone")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {TopBars("CreatedAt")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {TopBars("Status")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {TopBars("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {userCardsData.data.length > 0 &&
                userCardsData.data?.map((user, index) => (
                  <UserCard
                    key={index}
                    user={user}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    userCardsData={userCardsData}
                    getMoreData={getUsersData}
                    last={index === userCardsData.data.length - 1}
                    loading={loading}
                    setSelectedEmails={setSelectedEmails}
                    blockUsersFunc={openModalBlock}
                    unBlockClickFunc={openModalUnBlock}
                    clickFuncGrantAd={clickFuncGrantAd}
                    NotificationClick={NotificationClick}
                    deleteUsersFunc={openModal}
                  />
                ))}
            </tbody>
          </table>
          {userCardsData.data.length < 1 && <NoData loading={loading} />}
        </div>
      </div>
      <ModelActions
        isOpen={isOpen}
        onClose={closeModalFunc}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={TopBars("Delete")}
        loading={loading}
        clickFunc={deleteUsersFunc}
        des={desc("DeleteUsersWarning")}
      />

      <ModelActions
        isOpen={isOpenBlock}
        onClose={closeModalFunc}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={TopBars("Block")}
        loading={loading}
        clickFunc={blockUsersFunc}
        des={desc("BlockUsersConfirmation")}
      />

      <ModelActions
        isOpen={isOpenUnBlock}
        onClose={closeModalUnBlock}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={TopBars("UnBlock")}
        loading={loading}
        clickFunc={unBlockClickFunc}
        des={desc("UnblockUsersConfirmation")}
      />
    </div>
  );
};

export default page;
