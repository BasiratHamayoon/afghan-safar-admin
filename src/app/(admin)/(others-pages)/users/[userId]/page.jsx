"use client";
import RoleShower from "@/components/ui/RoleShower";
import React, { useContext, useEffect, useState } from "react";
import { roles } from "@/consonants";
import Image from "next/image";
import VehicleTypeShower from "@/components/ui/VehicleTypeShower";
import Button from "@/components/ui/button/Button";
import NotFound from "@/components/ui/NotFound";
import {
  Block,
  CalenderIcon,
  GrantAccess,
  Notifications,
  Seat,
  TimeIcon,
  TrashBinIcon,
  UnBlock,
} from "@/icons";
import { useParams, useRouter } from "next/navigation";
import { ContextAdmin } from "@/context/MainStateAdmin";
import toAfghaniDate from "@/util/toAfghaniDate";
import toAfghaniTime from "@/util/toAfghaniTime";
import ModelActions from "@/components/ui/modal/ModelActions";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";
import { useTranslations } from "next-intl";
const page = () => {
  const userIDTrans = useTranslations("userID");
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isOpenBlock,
    openModal: openModalBlock,
    closeModal: closeModalBlock,
  } = useModal();
  const router = useRouter();
  const {
    userCardsData,
    fetchUserById,
    loading,
    getUserBookedTickets,
    deleteUsers,
    blockUsers,
    setuserCardsData,
  } = useContext(ContextAdmin);
  const { userId } = useParams();
  const [selectedUser, setSelectedUser] = useState(false);
  const [bookedTickets, setbookedTickets] = useState(false);

  const getUserDetails = async () => {
    let user = userCardsData?.data?.find((item) => item._id === userId);
    if (!user) {
      const res = await fetchUserById(userId);
      user = res?.userDetails;
      setSelectedUser(res?.userDetails);
    } else {
      setSelectedUser(user);
    }

    if (user.role !== "travel_agent") {
      const res = await getUserBookedTickets(userId);
      res.success && setbookedTickets(res.data);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const deleteUsersFunc = async () => {
    const data = await deleteUsers({ userIds: [userId] });
    router.back();
  };

  const blockUsersFunc = async (block) => {
    await blockUsers({ userIds: [userId], block: block });

    setuserCardsData((e) => {
      let temp = [...e.data];
      temp.map(
        (user, index) => user._id === userId && (temp[index].blocked = block)
      );
      return { ...e, data: [...temp] };
    });
    setSelectedUser((e) => ({ ...e, blocked: block }));
    closeModalBlock();
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {selectedUser ? (
          <>
            <div className="flex flex-row flex-wrap items-center justify-between">
              <div className="flex flex-col mb-5">
                <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90 ">
                  {userIDTrans("UserDetails")}
                </h3>
                <p className=" bk-16 !text-gray-800 dark:!text-gray-300 text-base font-normal leading-normal">
                  {userIDTrans("UserDetailsDesc")}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-[10px]">
                <Button
                  startIcon={<TrashBinIcon />}
                  className={
                    "bg-error-600 h-[35px] w-[90px] hover:bg-error-700"
                  }
                  onClick={() => openModal()}
                >
                  {userIDTrans("Delete")}
                </Button>
                <Button
                  startIcon={selectedUser?.blocked ? <UnBlock /> : <Block />}
                  className={
                    selectedUser?.blocked
                      ? "bg-green-600 h-[35px] w-max hover:bg-green-900"
                      : "bg-neutral-600 h-[35px] w-[90px] hover:bg-neutral-900"
                  }
                  onClick={() => openModalBlock()}
                >
                  {selectedUser?.blocked
                    ? userIDTrans("Unblock")
                    : userIDTrans("Block")}
                </Button>
                <Button
                  onClick={() =>
                    router.push(
                      `/send-notifications/?to=${
                        selectedUser.role.includes("passenger") ||
                        selectedUser.role.includes("driver")
                          ? "app"
                          : "web"
                      }&email=${selectedUser.email}`
                    )
                  }
                  startIcon={<Notifications />}
                  className={" h-[35px] px-[9px]"}
                >
                  {userIDTrans("SendNotifications")}
                </Button>
                {["driver", "passenger"].includes(selectedUser.role) && (
                  <Button
                    onClick={() =>
                      router.push(
                        "/create-background-ad?emails=" + selectedUser.email
                      )
                    }
                    startIcon={<GrantAccess />}
                    className={
                      " h-[35px] px-[9px] bg-success-600 hover:bg-success-700"
                    }
                  >
                    {userIDTrans("GrantBackgroundAd")}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-col flex-1 w-full">
              <div className="flex p-4 ">
                <div className="flex flex-col w-full gap-4 ">
                  <div className="flex gap-[16px] flex-col md:flex-row">
                    <Image
                      src={selectedUser?.profileImg || "/images/user/user.png"}
                      alt={"User Profile"}
                      width={128}
                      height={128}
                      quality={100}
                      className="w-32 rounded-full min-h-32 "
                    ></Image>
                    <div className="flex flex-col justify-center">
                      <p className="bd-20 !text-[30px] !leading-[40px]">
                        {selectedUser?.firstName +
                          " " +
                          (selectedUser?.lastName || "")}
                      </p>
                      <div className="flex gap-[15px]">
                        <p className="bk-18 !text-gray-800 dark:!text-gray-300">
                          {userIDTrans("Role")} :
                        </p>
                        <RoleShower name={roles[selectedUser?.role]} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                <div className="col-span-2 md:gap-[35px] py-5 border-t flex flex-row border-t-gray-[#D5D6DD] dark:border-t-gray-300">
                  <p className="med-14 whitespace-nowrap w-[20ch]">
                    {userIDTrans("Email")}
                  </p>
                  <Link
                    href={"mailto:" + selectedUser?.email}
                    className="bk-14 !text-brand-600 hover:underline"
                  >
                    {selectedUser?.email}
                  </Link>
                </div>

                <div className="col-span-2 md:gap-[35px] py-5 border-t flex flex-row border-t-gray-[#D5D6DD] dark:border-t-gray-300">
                  <p className="med-14 whitespace-nowrap w-[20ch]">
                    {userIDTrans("Phone")}
                  </p>
                  <p className="bk-14">
                    {selectedUser?.phone || userIDTrans("Unknown")}
                  </p>
                </div>

                <div className="col-span-2 md:gap-[35px] py-5 border-t flex flex-row border-t-gray-[#D5D6DD] dark:border-t-gray-300">
                  <p className="med-14 whitespace-nowrap w-[20ch]">
                    {userIDTrans("Gender")}
                  </p>
                  <p className="bk-14">
                    {selectedUser?.gender || userIDTrans("Unknown")}
                  </p>
                </div>
                <div className="col-span-2 md:gap-[35px] py-5 border-t flex flex-row border-t-gray-[#D5D6DD] dark:border-t-gray-300">
                  <p className="med-14 whitespace-nowrap w-[20ch]">
                    {userIDTrans("FirstName")}
                  </p>

                  <p className="bk-14">
                    {selectedUser?.firstName || userIDTrans("Unknown")}
                  </p>
                </div>
                <div className="col-span-2 md:gap-[35px] py-5 border-t flex flex-row border-t-gray-[#D5D6DD] dark:border-t-gray-300">
                  <p className="med-14 whitespace-nowrap w-[20ch]">
                    {userIDTrans("LastName")}
                  </p>
                  <p className="bk-14">
                    {selectedUser?.lastName || userIDTrans("Unknown")}
                  </p>
                </div>
                <div className="col-span-2 md:gap-[35px] py-5 border-t flex flex-row border-t-gray-[#D5D6DD] dark:border-t-gray-300">
                  <p className="med-14 whitespace-nowrap w-[20ch]">
                    {userIDTrans("Bio")}
                  </p>
                  <p className="bk-14">
                    {selectedUser?.bio || userIDTrans("Unknown")}
                  </p>
                </div>
                <div className="col-span-2 md:gap-[35px] py-5 border-t flex flex-row border-t-gray-[#D5D6DD] dark:border-t-gray-300">
                  <p className="med-14 whitespace-nowrap w-[20ch]">
                    {userIDTrans("VehicleType")}
                  </p>
                  {selectedUser?.vehicleType ? (
                    <VehicleTypeShower name={selectedUser?.vehicleType} />
                  ) : (
                    <p className="bk-14">{userIDTrans("Unknown")}</p>
                  )}
                </div>
                <div className="col-span-2 md:gap-[35px] py-5 border-t flex flex-row border-t-gray-[#D5D6DD] dark:border-t-gray-300">
                  <p className="med-14 whitespace-nowrap w-[20ch]">
                    {userIDTrans("CompanyDetails")}
                  </p>
                  <p className="bk-14">
                    {selectedUser?.companyId || userIDTrans("Unknown")}
                  </p>
                </div>
                <div className="col-span-2 flex flex-row md:gap-[35px] border-t border-t-[#D5D6DD] py-5">
                  <p className="med-14 whitespace-nowrap w-[20ch]">
                    {userIDTrans("Blocked")}
                  </p>
                  <p className="bk-14">
                    {selectedUser?.blocked
                      ? userIDTrans("Yes")
                      : userIDTrans("No")}
                  </p>
                </div>
                <div className="col-span-2 flex flex-row md:gap-[35px] border-t border-t-[#D5D6DD] py-5">
                  <p className="med-14 whitespace-nowrap w-[20ch]">
                    {userIDTrans("Verification")}
                  </p>
                  <p
                    className={`bk-14 ${
                      selectedUser?.verification
                        ? "!text-success-400"
                        : "!text-error-400"
                    }`}
                  >
                    {selectedUser?.verification
                      ? userIDTrans("Verified")
                      : userIDTrans("Unverified")}
                  </p>
                </div>
              </div>
              {bookedTickets && bookedTickets.length > 0 && (
                <div className="flex flex-col">
                  <p className="med-20 dark:!text-gray-300">
                    {userIDTrans("BookedTickets")}
                  </p>
                  <div className="flex-col flex gap-[12px]">
                    {bookedTickets &&
                      bookedTickets.length > 0 &&
                      bookedTickets.map((it, ind) => (
                        <BookedTicketCard key={ind} bookedTicket={it} />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <NotFound
            heading={userIDTrans("UsersNotFound")}
            desc={userIDTrans("UserNotExistDesc")}
            loading={loading}
            loadingText={userIDTrans("LoadingUsers")}
            loadingDesc={userIDTrans("GettingUserFromServer")}
          />
        )}
      </div>

      <ModelActions
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-md m-4"
        selectedIds={[1]}
        type={userIDTrans("Delete")}
        loading={loading}
        clickFunc={deleteUsersFunc}
        des={userIDTrans("DeleteUserModalDesc")}
      />

      <ModelActions
        isOpen={isOpenBlock}
        onClose={closeModalBlock}
        className="max-w-md m-4"
        selectedIds={[1]}
        type={
          selectedUser?.blocked ? userIDTrans("UnBlock") : userIDTrans("Block")
        }
        loading={loading}
        clickFunc={() => blockUsersFunc(!selectedUser?.blocked)}
        des={
          selectedUser?.blocked
            ? userIDTrans("UnblockUserModalDesc")
            : userIDTrans("BlockUserModalDesc")
        }
      />
    </>
  );
};

export default page;

const BookedTicketCard = ({ bookedTicket }) => {
  const BookedTicketTrans = useTranslations("BookedTicketCard");
  return (
    <div className="flex flex-col mt-[20px] bg-[#F9FAFA] dark:!bg-gray-900 border border-gray-300 dark:border-gray-500 rounded-xl overflow-hidden">
      <div className="overflow-hidden shadow ticket-card">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center mb-2 space-x-2">
                <span
                  className={
                    bookedTicket?.state === "active"
                      ? `px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full capitalize`
                      : "px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium capitalize"
                  }
                >
                  {bookedTicket?.state.charAt(0).toUpperCase() +
                    bookedTicket?.state.slice(1)}
                </span>

                <span className="text-sm text-gray-500 dark:text-gray-200">
                  {BookedTicketTrans("TicketId")}: #{bookedTicket?._id}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-300">
                {bookedTicket?.transportation?.from} {BookedTicketTrans("To")}{" "}
                {bookedTicket?.transportation?.to}
              </h3>
              <p className="text-gray-600 dark:text-gray-200 ">
                {bookedTicket?.transportation?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600 dark:text-gray-300">
                {bookedTicket?.transportation?.ticketPrice}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {BookedTicketTrans("BookedOn")}:{" "}
                {toAfghaniDate(bookedTicket?.createdAt)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3 ">
            <div>
              <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-400">
                {BookedTicketTrans("JourneyDetails")}
              </h4>
              <div className="space-y-2 dark:[&>svg]:stroke-gray-300">
                <div className="flex items-center space-x-2">
                  <CalenderIcon />
                  <span className="text-gray-300 bk-14">
                    {toAfghaniDate(bookedTicket?.transportation?.date)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TimeIcon />
                  <span className="text-gray-300 bk-14">
                    {toAfghaniTime(bookedTicket?.transportation?.departureTime)}{" "}
                    -{toAfghaniTime(bookedTicket?.transportation?.arrivalTime)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Seat />
                  <span className="text-gray-300 bk-14">
                    {BookedTicketTrans("Seats")}:{" "}
                    {bookedTicket?.selectedSeats?.unknown}{" "}
                    {BookedTicketTrans("Male")}:{" "}
                    {bookedTicket?.selectedSeats?.male}{" "}
                    {BookedTicketTrans("Female")}:{" "}
                    {bookedTicket?.selectedSeats?.female}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-400">
                {BookedTicketTrans("VehicleDetails")}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <VehicleTypeShower
                    name={
                      bookedTicket?.transportation?.vehicleDetails.vehicleType
                    }
                  />
                  <span className="text-gray-300 capitalize bk-14">
                    {BookedTicketTrans("VehicleType")}:{" "}
                    {bookedTicket?.transportation?.vehicleDetails.vehicleType}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300 bk-14">
                  <span>
                    {BookedTicketTrans("Plate")}:{" "}
                    {bookedTicket?.transportation?.vehicleDetails.plateNo}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300 bk-14">
                  <span>
                    {BookedTicketTrans("Model")}:{" "}
                    {bookedTicket?.transportation?.vehicleDetails.model}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
