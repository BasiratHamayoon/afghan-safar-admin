"use client";
import SeatSelection from "@/components/transportation-page/SeatSelection";
import NotFound from "@/components/ui/NotFound";
import VehicleTypeShower from "@/components/ui/VehicleTypeShower";
import { link } from "@/consonants";
import { ContextAdmin } from "@/context/MainStateAdmin";
import toAfghaniDate from "@/util/toAfghaniDate";
import toAfghaniTime from "@/util/toAfghaniTime";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useActionState, useContext, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Alert from "@/components/ui/alert/Alert";

const page = () => {
  const transportationsTrans = useTranslations("transportationsPageID");
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const { tranportId } = useParams();
  const {
    loading,
    transporationsCards,
    fetchTransportationById,
    companyUser,
    editTransportation,
    travelAgent,
  } = useContext(ContextAdmin);
  const [transport, settransport] = useState(false);

  const getTransportDetails = async () => {
    const newTransport = transporationsCards?.data?.find(
      (item) => item._id === tranportId
    );
    if (!newTransport) {
      const res = await fetchTransportationById(tranportId);
      settransport(res?.data);
    } else {
      settransport(newTransport);
    }
  };

  useEffect(() => {
    companyUser !== null && getTransportDetails();
  }, [companyUser]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      {transport ? (
        <>
          <div className="flex flex-row flex-wrap items-center justify-between">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-col mb-5">
                <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
                  {transportationsTrans("TransportationDetails")}
                </h3>
                <p className="bk-16 !text-gray-800 dark:!text-gray-300 text-base font-normal leading-normal">
                  {transportationsTrans("TransportationDetailsSubtitle")}
                </p>
              </div>
              {!travelAgent ? (
                <Button size={"md"} onClick={openModal}>
                  {transportationsTrans("Edit")}
                </Button>
              ) : (
                <Button
                  size={"md"}
                  onClick={() => {
                    router.push("/create-booking?id=" + tranportId);
                  }}
                >
                  {transportationsTrans("Book ticket")}
                </Button>
              )}
            </div>

            <div className="flex flex-col w-full">
              <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                <InfoRow
                  label={transportationsTrans("Name")}
                  value={transport?.name}
                />
                <InfoRow
                  label={transportationsTrans("From")}
                  value={transport?.from}
                />
                <InfoRow
                  label={transportationsTrans("To")}
                  value={transport?.to}
                />
                <InfoRow
                  label={transportationsTrans("Date")}
                  value={toAfghaniDate(transport.date)}
                />
                <InfoRow
                  label={transportationsTrans("DepartureTime")}
                  value={toAfghaniTime(transport?.departureTime)}
                />
                <InfoRow
                  label={transportationsTrans("ArrivalTime")}
                  value={toAfghaniTime(transport?.arrivalTime)}
                />
                <InfoRow
                  label={transportationsTrans("TicketPrice")}
                  value={`$${transport?.ticketPrice}`}
                />
                <InfoRow
                  label={transportationsTrans("PlateNumber")}
                  value={transport?.vehicleDetails?.plateNo}
                />
                <InfoRow
                  label={transportationsTrans("VehicleModel")}
                  value={transport?.vehicleDetails?.model}
                />
                <InfoRow
                  label={transportationsTrans("VehicleType")}
                  comp={true}
                  value={
                    <VehicleTypeShower
                      name={transport?.vehicleDetails?.vehicleType}
                    />
                  }
                />
                {(transport?.companyId || transport?.driverId) && (
                  <InfoRow
                    label={
                      transport?.companyId
                        ? transportationsTrans("CompanyId")
                        : transportationsTrans("DriverId")
                    }
                    comp={true}
                    value={
                      transport?.companyId ? (
                        <Link
                          href={"/transport-companies/" + transport?.companyId}
                          className="bk-14 !text-brand-500 hover:underline flex flex-row gap-[3px] [&_svg]:translate-y-[-2px]"
                        >
                          {transport?.companyId}
                          {link}
                        </Link>
                      ) : (
                        <Link
                          href={"/users/" + transport?.driverId}
                          className="bk-14 !text-brand-500 hover:underline flex flex-row gap-[3px] [&_svg]:translate-y-[-2px]"
                        >
                          {transport?.driverId}
                          {link}
                        </Link>
                      )
                    }
                  />
                )}

                <div className="col-span-2 border-t border-t-[#D5D6DD] py-5">
                  <p className="mb-2 med-14">
                    {transportationsTrans("TermsAndRules")}
                  </p>
                  <ul className="pl-5 text-sm text-gray-700 list-disc dark:text-gray-300">
                    {transport?.termsAndRules?.map((rule, idx) => (
                      <li
                        key={idx}
                        style={{ overflowWrap: "break-word" }}
                        className="bk-14"
                      >
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
                <InfoRow
                  label={transportationsTrans("CreatedAt")}
                  value={transport?.createdAt}
                />
                <div className="col-span-2 border-t border-t-[#D5D6DD] py-5">
                  <p className="mb-2 med-14">{transportationsTrans("Seats")}</p>

                  <SeatSelection
                    seats={transport?.vehicleDetails?.seats}
                    disabled={true}
                    vehicleType={transport?.vehicleDetails?.vehicleType?.toLowerCase()}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <NotFound
          heading={transportationsTrans("TransportationNotFound")}
          desc={transportationsTrans("TransportationNotFoundDescription")}
          loading={loading}
          loadingText={transportationsTrans("LoadingTransportation")}
          loadingDesc={transportationsTrans("LoadingTransportationDescription")}
        />
      )}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[45vw] max-h-[80vh] overflow-y-scroll"
      >
        <EditForm
          transportationsTrans={transportationsTrans}
          editTransportation={editTransportation}
          transport={transport}
        />
      </Modal>
    </div>
  );
};

export default page;

const InfoRow = ({ label, value, comp, link }) => (
  <div className="col-span-2 md:gap-[35px] py-5 border-t flex flex-row border-t-[#D5D6DD] dark:border-t-gray-300">
    <p className="med-14 whitespace-nowrap w-[20ch]">{label}</p>
    {comp ? value : <p className="bk-14">{value || "N/A"}</p>}
  </div>
);

const EditForm = ({ transportationsTrans, transport, editTransportation }) => {
  const [departureTime, setDepartureTime] = useState(transport?.departureTime);
  const [arrivalTime, setArrivalTime] = useState(transport?.arrivalTime);
  const [state, action, loading] = useActionState(async (prev, formData) => {
    const data = {
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      seats: seats,
      transportationId: transport._id,
    };

    if (hasDuplicateSeatIds(seats)) {
      document.querySelector("#seatSelection").scrollIntoView();
      return { success: false, msg: "Duplicate seat name founded!", ...data };
    }

    const res = await editTransportation(data);

    if (res.success) {
      window.location.reload();
      return { success: res.success, msg: res.message };
    } else {
      let msg = res?.message || "";
      if (res?.errors) {
        res.errors.map((it) => {
          msg += `\n ${it.msg},`;
        });
      }
      return { success: res.success, msg: msg, ...data };
    }
  });
  const [seats, setSeats] = useState(transport?.vehicleDetails?.seats || []);
  const [dublicateSeat, setdublicateSeat] = useState([]);

  const hasDuplicateSeatIds = (seatLayout) => {
    const seen = new Set();
    for (const row of seatLayout) {
      for (const seat of row) {
        if (seen.has(seat.id)) {
          setdublicateSeat(seat.id);
          return true; // Duplicate found
        }
        seen.add(seat.id);
      }
    }
    return false; // No duplicates
  };

  const dateToTimeInputValue = (date) => {
    if (!date) return "";
    const d = new Date(date);
    // converting utc afghan time
    d.setHours(d.getHours() + 4);
    d.setMinutes(d.getMinutes() + 30);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <form
      action={action}
      className="grid grid-cols-1 md:grid-cols-2 pt-[50px] pb-[20px] px-[24px] gap-[24px]"
    >
      <div className="col-span-2 lg:col-span-1">
        <Label>{transportationsTrans("DepartureTime")}</Label>
        <Input
          type="time"
          defaultValue={dateToTimeInputValue(departureTime)}
          required={true}
          name={"departureTime"}
          id={"departureTime"}
          onChange={(e) => {
            const timeValue = e.target.value; // "HH:MM"
            const [hours, minutes] = timeValue.split(":").map(Number);

            const now = new Date();

            const localDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              hours,
              minutes,
              0,
              0
            );

            setDepartureTime(localDate.toISOString());
          }}
        />
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Label>{transportationsTrans("ArrivalTime")}</Label>
        <Input
          type="time"
          defaultValue={dateToTimeInputValue(arrivalTime)}
          required={true}
          name={"arrivalTime"}
          id={"arrivalTime"}
          onChange={(e) => {
            const timeValue = e.target.value; // "HH:MM"
            const [hours, minutes] = timeValue.split(":").map(Number);

            const now = new Date();

            const localDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              hours,
              minutes,
              0,
              0
            );

            setArrivalTime(localDate.toISOString());
          }}
        />
      </div>
      <div className="col-span-2">
        <SeatSelection
          seats={seats}
          setSeats={setSeats}
          dublicateSeat={dublicateSeat}
          setdublicateSeat={setdublicateSeat}
          vehicleType={transport?.vehicleDetails?.vehicleType}
          edit={true}
        />
      </div>
      {state && (
        <div className="col-span-2">
          <Alert
            message={state.msg}
            title={
              state.success
                ? transportationsTrans("Success")
                : transportationsTrans("Error")
            }
            variant={state.success ? "success" : "error"}
          />
        </div>
      )}
      <div className="flex items-center col-span-2 gap-3 px-2 lg:justify-end">
        <Button size="sm" disabled={loading} type="submit">
          {transportationsTrans("Save")}
        </Button>
      </div>
    </form>
  );
};
