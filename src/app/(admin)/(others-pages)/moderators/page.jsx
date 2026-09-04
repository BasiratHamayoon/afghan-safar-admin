"use client";
import Filter from "@/components/ui/Filter";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import { ContextAdmin } from "@/context/MainStateAdmin";
import UserCard from "@/components/users-page/UserCard";
import NoData from "@/components/ui/NoData";
import { useModal } from "@/hooks/useModal";
import ModelActions from "@/components/ui/modal/ModelActions";
import StatCard from "@/components/ui/Card/StatCard";
import { Block, UserIcon, UnBlock } from "@/icons";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";

const page = () => {
  const moderatorTrans = useTranslations("moderatorPage");
  const router = useRouter();
  const {
    getModeratorsData,
    moderatorsCardsData,
    loading,
    deleteUsers,
    setModeratorsCardsData,
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
    status: "all",
    searchQuery: "",
  });

  const debouncedFetch = useMemo(() => {
    return debounce((filter) => {
      getModeratorsData(filter, 0, 40);
    }, 600);
  }, []);

  useEffect(() => {
    let filter = {};

    setModeratorsCardsData((e) => ({
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
    setModeratorsCardsData((e) => {
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
    setModeratorsCardsData((e) => {
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
    setModeratorsCardsData((e) => {
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
      if (selectedEmails.length < 20) {
        router.push(
          `/send-notifications/?to=web&email=${selectedEmails.toString()}`
        );
      }
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {moderatorTrans("Moderators")}
        </h3>
      </div>

      <div className="flex flex-row items-center justify-between gap-[10px] flex-wrap lg:flex-nowrap pb-[20px]">
        <StatCard
          title={moderatorTrans("TotalUsers")}
          value={moderatorsCardsData?.stats?.totalUsers || 0}
          icon={<UserIcon />}
          color="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title={moderatorTrans("TotalModerators")}
          value={moderatorsCardsData?.stats?.moderators || 0}
          icon={<UserIcon />}
          color="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title={moderatorTrans("BlockedModerators")}
          value={moderatorsCardsData?.stats?.totalBlockedUsers || 0}
          icon={<Block />}
          color="bg-red-100 text-red-600"
        />
        <StatCard
          title={moderatorTrans("ActiveModerators")}
          value={
            moderatorsCardsData?.stats?.moderators -
              moderatorsCardsData?.stats?.totalBlockedUsers || 0
          }
          icon={<UnBlock />}
          color="bg-green-100 text-red-600 [&_svg]:stroke-green-900"
        />
      </div>

      <Filter
        filterState={filterState}
        setfilterState={setfilterState}
        deletClickFunc={() => selectedIds.length > 0 && openModal()}
        blockClickFunc={() => selectedIds.length > 0 && openModalBlock()}
        unBlockClickFunc={() => selectedIds.length > 0 && openModalUnBlock()}
        NotificationClick={NotificationClick}
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
                        moderatorsCardsData.data.forEach((it) => {
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
                    checked={moderatorsCardsData.data.every((it) =>
                      selectedIds.includes(it._id)
                    )}
                  />
                  {moderatorTrans("User")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {moderatorTrans("UserRole")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {moderatorTrans("Email")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {moderatorTrans("Phone")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {moderatorTrans("CreatedAt")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {moderatorTrans("Status")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {moderatorTrans("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {moderatorsCardsData.data?.map((user, index) => (
                <UserCard
                  key={index}
                  user={user}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  setSelectedEmails={setSelectedEmails}
                  moderatorsCardsData={moderatorsCardsData}
                  getMoreData={getModeratorsData}
                  last={index === moderatorsCardsData.data.length - 1}
                  loading={loading}
                  NotificationClick={NotificationClick}
                  blockUsersFunc={openModalBlock}
                  unBlockClickFunc={openModalUnBlock}
                  deleteUsersFunc={openModal}
                  userCardsData={moderatorsCardsData}
                />
              ))}
            </tbody>
          </table>
          {moderatorsCardsData.data.length < 1 && <NoData />}
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
        des="This action cannot be undone. All data associated with these users will be permanently removed from our servers."
      />
      <ModelActions
        isOpen={isOpenBlock}
        onClose={closeModalFunc}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={"Block"}
        loading={loading}
        clickFunc={blockUsersFunc}
        des="Are you sure you want to block these users?"
      />
      <ModelActions
        isOpen={isOpenUnBlock}
        onClose={closeModalUnBlock}
        className="max-w-md m-4"
        selectedIds={selectedIds}
        type={"Un-Block"}
        loading={loading}
        clickFunc={unBlockClickFunc}
        des="Are you sure you want to unblock these users? They will regain access to their accounts and all associated features."
      />
    </div>
  );
};

export default page;
