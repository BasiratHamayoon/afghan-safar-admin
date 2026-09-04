"use client";
import { ContextAdmin } from "@/context/MainStateAdmin";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useActionState, useContext, useEffect, useState } from "react";
import SeatSelection from "@/components/transportation-page/SeatSelection";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import BtnGender from "@/components/ui/button/BtnGender";
import toAfghaniTime from "@/util/toAfghaniTime";
import toAfghaniDate from "@/util/toAfghaniDate";

const page = () => {
  const router = useRouter();
  const params = useSearchParams();
  const createBookingTrans = useTranslations("createBooking");
  const {
    fetchTransportationById,
    transporationsCards,
    loading,
    travelAgent,
    bookTicket,
    setTicket,
  } = useContext(ContextAdmin);
  const [selectedGender, setSelectedGender] = useState("Male");
  const [bookedSeats, setBookedSeats] = useState({
    female: [],
    male: [],
    unknown: [],
  });
  const [transport, settransport] = useState(false);
  const [state, action, isPending] = useActionState(async (st, formData) => {
    const data = {
      transportationId: params.get("id"),
      selectedSeats: bookedSeats,
      supervisorInfo: {
        name: formData.get("name"),
        phoneNum: formData.get("phoneNum"),
        familyName: formData.get("familyName"),
        cnic: formData.get("cnic"),
        age: formData.get("age"),
        gender: selectedGender,
      },
    };

    if (data.supervisorInfo.age < 12 && data.supervisorInfo.age) {
      return {
        success: false,
        msg: "Age must be greater than 12 years.",
        supervisorInfo: data.supervisorInfo,
      };
    }

    if (!Object.values(bookedSeats).some((it) => it.length > 0)) {
      return {
        success: false,
        msg: "Please select atleast one seat.",
        supervisorInfo: data.supervisorInfo,
      };
    }

    const res = await bookTicket(data);
    if (res.success) {
      setTicket(null);
      router.push("/ticket-download?id=" + res.data._id);
      return {
        success: res.success,
        msg: res.message,
        supervisorInfo: data.supervisorInfo,
      };
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

  const getTransportDetails = async () => {
    const tranportId = params.get("id");
    const newTransport = transporationsCards?.data?.find(
      (item) => item._id === tranportId
    );
    if (!newTransport) {
      const res = await fetchTransportationById(tranportId);
      settransport(res?.data);
      console.log(res);
    } else {
      settransport(newTransport);
    }
  };

  useEffect(() => {
    travelAgent && getTransportDetails();
  }, [travelAgent]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {createBookingTrans("Create Booking")}
        </h3>
      </div>
      <form action={action} className="flex flex-col">
        <div className="mt-0 mb-[30px]">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div className="col-span-2 lg:col-span-1">
              <Label>{createBookingTrans("Name")}</Label>
              <Input
                defaultValue={state?.supervisorInfo?.name}
                type="text"
                required={true}
                name={"name"}
                id={"name"}
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>{createBookingTrans("Phone Number")}</Label>
              <Input
                defaultValue={state?.supervisorInfo?.phoneNum}
                type="tel"
                required={true}
                name={"phoneNum"}
                id={"phoneNum"}
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>{createBookingTrans("Family Name")}</Label>
              <Input
                defaultValue={state?.supervisorInfo?.familyName}
                type="text"
                required={true}
                name={"familyName"}
                id={"familyName"}
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>{createBookingTrans("CNIC")}</Label>
              <Input
                defaultValue={state?.supervisorInfo?.cnic}
                type="text"
                required={true}
                name={"cnic"}
                id={"cnic"}
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>{createBookingTrans("Age")}</Label>
              <Input
                defaultValue={state?.supervisorInfo?.age}
                type="number"
                required={true}
                name="age"
                id="age"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>{createBookingTrans("Gender")}</Label>
              <div className="flex flex-row gap-[10px]">
                {["Male", "Female", "Other"].map((it, index) => (
                  <BtnGender
                    key={index}
                    title={createBookingTrans(it)}
                    selected={selectedGender === it}
                    clickFunc={() => setSelectedGender(it)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32 mt-[32px]">
            <div className="flex flex-col gap-[20px] col-span-2 lg:col-span-1">
              <h3 className="text-[16px] font-semibold text-gray-800 dark:text-white/90">
                {createBookingTrans("Select Seats")}
              </h3>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                <div className="col-span-2">
                  <SeatSelection
                    seats={transport?.vehicleDetails?.seats}
                    disabled={true}
                    setBookedSeats={setBookedSeats}
                    bookedSeats={bookedSeats}
                    vehicleType={transport?.vehicleDetails?.vehicleType?.toLowerCase()}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col col-span-2 lg:col-span-1 gap-[10px] lg:gap-[25px]">
              <div>
                <h3 className="text-[16px] font-semibold text-gray-800 dark:text-white/90">
                  {createBookingTrans("TermsAndRules")}
                </h3>
                <ol className="mt-[12px] list-disc">
                  {transport?.termsAndRules?.map((it, index) => (
                    <li
                      key={"termsAndRuls " + index}
                      className="text-[18px] font-medium dark:text-white"
                    >
                      {it}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-col gap-[10px] lg:gap-[15px]">
                <span className="text-[16px] font-semibold text-gray-800 dark:text-white/90 flex flex-row gap-[10px]">
                  <span className="w-[150px] block">
                    {createBookingTrans("From")}
                  </span>
                  {": "}
                  <span className="text-[18px] font-light">
                    {transport?.from}
                  </span>
                </span>
                <span className="text-[16px] font-semibold text-gray-800 dark:text-white/90 flex flex-row gap-[10px]">
                  <span className="w-[150px] block">
                    {createBookingTrans("To")}
                  </span>
                  {": "}
                  <span className="text-[18px] font-light">
                    {transport?.to}
                  </span>
                </span>
                <span className="text-[16px] font-semibold text-gray-800 dark:text-white/90 flex flex-row gap-[10px]">
                  <span className="w-[150px] block">
                    {createBookingTrans("DepartureTime")}
                  </span>
                  {": "}
                  <span className="text-[18px] font-light">
                    {transport?.departureTime &&
                      toAfghaniTime(transport?.departureTime)}
                  </span>
                </span>
                <span className="text-[16px] font-semibold text-gray-800 dark:text-white/90 flex flex-row gap-[10px]">
                  <span className="w-[150px] block">
                    {createBookingTrans("ArrivalTime")}
                  </span>
                  {": "}
                  <span className="text-[18px] font-light">
                    {transport?.arrivalTime &&
                      toAfghaniTime(transport?.arrivalTime)}
                  </span>
                </span>
                <span className="text-[16px] font-semibold text-gray-800 dark:text-white/90 flex flex-row gap-[10px]">
                  <span className="w-[150px] block">
                    {createBookingTrans("Date")}
                  </span>
                  {": "}
                  <span className="text-[18px] font-light">
                    {transport?.date && toAfghaniDate(transport?.date)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        {state && (
          <Alert
            message={state.msg}
            title={
              state.success
                ? createBookingTrans("Success")
                : createBookingTrans("Error")
            }
            variant={state.success ? "success" : "error"}
          />
        )}
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" disabled={isPending} type="submit">
            {createBookingTrans("Create Booking")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;
