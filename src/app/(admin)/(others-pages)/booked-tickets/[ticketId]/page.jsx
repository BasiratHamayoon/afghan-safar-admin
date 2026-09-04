"use client";
import RoleShower from "@/components/ui/RoleShower";
import VehicleTypeShower from "@/components/ui/VehicleTypeShower";
import { link, roles } from "@/consonants";
import { ContextAdmin } from "@/context/MainStateAdmin";
import toAfghaniDate from "@/util/toAfghaniDate";
import toAfghaniTime from "@/util/toAfghaniTime";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import NotFound from "@/components/ui/NotFound";
import { useTranslations } from "next-intl";

const page = () => {
  const bookedTicketsTrans = useTranslations("bookedTicketsIDPage");
  const { ticketId } = useParams();
  const { bookedTickets, companyUser, getSpecificTicketDetails, loading } =
    useContext(ContextAdmin);
  const [selectedTicket, setSelectedTicket] = useState(false);

  const getselectedTicketDetails = async () => {
    const newTicket = bookedTickets?.data?.find(
      (item) => item._id === ticketId
    );
    if (!newTicket) {
      const res = await getSpecificTicketDetails(ticketId);
      res.success && setSelectedTicket(res?.data);
    } else {
      setSelectedTicket(newTicket);
    }
  };

  useEffect(() => {
    if (companyUser !== null) {
      getselectedTicketDetails();
    }
  }, [companyUser]);

  if (!selectedTicket) {
    return (
      <NotFound
        heading={bookedTicketsTrans("TicketNotFound")}
        desc={bookedTicketsTrans("TicketNotFoundDescription")}
        loading={loading}
        loadingText={bookedTicketsTrans("LoadingTicket")}
        loadingDesc={bookedTicketsTrans("LoadingTicketDescription")}
      />
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90 ">
            {bookedTicketsTrans("BookedBy")}
          </h3>

          <div className="flex flex-row justify-between items-center w-full gap-4 mt-[25px]">
            <div className="flex gap-[16px] flex-col md:flex-row">
              <Image
                src={
                  selectedTicket?.user?.profileImg || "/images/user/user.png"
                }
                alt="user profile"
                width={128}
                height={128}
                quality={100}
                className="w-32 rounded-full min-h-32 "
              ></Image>
              <div className="flex flex-col justify-center">
                <p className="bd-20 !text-[30px] !leading-[40px]">
                  {selectedTicket?.user?.firstName +
                    " " +
                    (selectedTicket?.user?.lastName || "")}
                </p>
                <a
                  href={`mailto:${selectedTicket?.user?.email || "/"}`}
                  className="med-16 !text-brand-500 dark:!text-brand-400 mb-[5px]"
                >
                  {selectedTicket?.user?.email || bookedTicketsTrans("NoEmail")}
                </a>
                <div className="flex gap-[15px]">
                  <p className="bk-18 !text-gray-800 dark:!text-gray-300">
                    {bookedTicketsTrans("Role")}
                  </p>
                  <RoleShower
                    name={roles[selectedTicket?.user?.role || "passenger"]}
                  />
                </div>
              </div>
            </div>
            <div>
              {!companyUser ? (
                <Link
                  href={`/users/${selectedTicket?.user?._id}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                >
                  {bookedTicketsTrans("ViewDetails")}
                </Link>
              ) : (
                <Link
                  href={`/send-notifications?to=app&email=${selectedTicket?.user?.email}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                >
                  {bookedTicketsTrans("SendNotification")}
                </Link>
              )}
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90 mt-[25px]">
            {bookedTicketsTrans("SupervisorInfo")}
          </h2>
          <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
            <InfoRow
              label={bookedTicketsTrans("Name")}
              value={selectedTicket?.supervisorInfo?.name || "NA"}
            />
            <InfoRow
              label={bookedTicketsTrans("FamilyName")}
              value={selectedTicket?.supervisorInfo?.familyName || "NA"}
            />
            <InfoRow
              label={bookedTicketsTrans("PhoneNumber")}
              value={selectedTicket?.supervisorInfo?.phoneNum || "NA"}
            />
            <InfoRow
              label={bookedTicketsTrans("CNIC")}
              value={selectedTicket?.supervisorInfo?.cnic || "NA"}
            />
            <InfoRow
              label={bookedTicketsTrans("DateOfBirth")}
              value={
                selectedTicket?.supervisorInfo?.dob &&
                toAfghaniDate(selectedTicket?.supervisorInfo.dob)
              }
            />
            <InfoRow
              label={bookedTicketsTrans("Age")}
              value={selectedTicket?.supervisorInfo?.age || "UNKNOWN"}
            />
            <InfoRow
              label={bookedTicketsTrans("Gender")}
              value={selectedTicket?.supervisorInfo?.gender}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-row items-center justify-between ">
            <h2 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90 mt-[25px]">
              {bookedTicketsTrans("TransportationDetails")}
            </h2>
            {!companyUser && (
              <Link
                href={`/transportations/${selectedTicket?.transportation?._id}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
              >
                {bookedTicketsTrans("ViewTransportation")}
              </Link>
            )}
          </div>
          <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
            <InfoRow
              label={bookedTicketsTrans("Name")}
              value={selectedTicket?.transportation?.name || "NA"}
            />
            <InfoRow
              label={bookedTicketsTrans("From")}
              value={selectedTicket?.transportation?.from || "NA"}
            />
            <InfoRow
              label={bookedTicketsTrans("To")}
              value={selectedTicket?.transportation?.to || "NA"}
            />
            <InfoRow
              label={bookedTicketsTrans("Date")}
              value={
                selectedTicket?.transportation?.date &&
                toAfghaniDate(selectedTicket?.transportation.date)
              }
            />
            <InfoRow
              label={bookedTicketsTrans("DepartureTime")}
              value={
                selectedTicket?.transportation?.departureTime &&
                toAfghaniTime(selectedTicket?.transportation?.departureTime)
              }
            />
            <InfoRow
              label={bookedTicketsTrans("ArrivalTime")}
              value={
                selectedTicket?.transportation?.arrivalTime &&
                toAfghaniTime(selectedTicket?.transportation?.arrivalTime)
              }
            />
            <InfoRow
              label={bookedTicketsTrans("TicketPrice")}
              value={`$${selectedTicket?.transportation?.ticketPrice}` || "NA"}
            />
            <InfoRow
              label={bookedTicketsTrans("PlateNumber")}
              value={
                selectedTicket?.transportation?.vehicleDetails?.plateNo || "NA"
              }
            />
            <InfoRow
              label={bookedTicketsTrans("VehicleModel")}
              value={
                selectedTicket?.transportation?.vehicleDetails?.model || "NA"
              }
            />
            <InfoRow
              label={bookedTicketsTrans("VehicleType")}
              comp={true}
              value={
                <VehicleTypeShower
                  name={
                    selectedTicket?.transportation?.vehicleDetails
                      ?.vehicleType || "Bus"
                  }
                />
              }
            />
            {(selectedTicket.transportation?.companyId ||
              selectedTicket.transportation?.driverId) && (
              <InfoRow
                label={
                  selectedTicket.transportation?.companyId
                    ? bookedTicketsTrans("CompanyId")
                    : bookedTicketsTrans("DriverId")
                }
                comp={true}
                value={
                  selectedTicket.transportation?.companyId ? (
                    <Link
                      href={
                        "/transport-companies/" +
                        selectedTicket.transportation?.companyId
                      }
                      className="bk-14 !text-brand-500 hover:underline flex flex-row gap-[3px] [&_svg]:translate-y-[-2px]"
                    >
                      {selectedTicket.transportation?.companyId}
                      {link}
                    </Link>
                  ) : (
                    <Link
                      href={"/users/" + selectedTicket.transportation?.driverId}
                      className="bk-14 !text-brand-500 hover:underline flex flex-row gap-[3px] [&_svg]:translate-y-[-2px]"
                    >
                      {selectedTicket.transportation?.driverId}
                      {link}
                    </Link>
                  )
                }
              />
            )}
            <div className="col-span-2 border-t border-t-[#D5D6DD] py-5">
              <p className="mb-2 med-14">
                {bookedTicketsTrans("TermsAndRules")}
              </p>
              <ul className="pl-5 text-sm text-gray-700 list-disc dark:text-gray-300">
                {selectedTicket?.transportation?.termsAndRules?.map(
                  (rule, idx) => (
                    <li
                      key={idx}
                      style={{ overflowWrap: "break-word" }}
                      className="bk-14"
                    >
                      {rule}
                    </li>
                  )
                )}
              </ul>
            </div>
            <InfoRow
              label={bookedTicketsTrans("CreatedAt")}
              value={selectedTicket?.transportation?.createdAt || "NA"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;

const InfoRow = ({ label, value, comp }) => (
  <div className="col-span-2 md:gap-[35px] py-5 border-t flex flex-row border-t-[#D5D6DD] dark:border-t-gray-300">
    <p className="med-14 whitespace-nowrap w-[20ch]">{label}</p>
    {comp ? value : <p className="bk-14">{value || "N/A"}</p>}
  </div>
);
