"use client";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import SeatSelection from "@/components/transportation-page/SeatSelection";
import { TrashBinIcon } from "@/icons";
import React, { useActionState, useContext, useEffect, useState } from "react";
import { ContextAdmin } from "@/context/MainStateAdmin";
import { useTranslations } from "next-intl";

const page = () => {
  const addTransportationsTrans = useTranslations("addTransportationsPage");
  const {
    addTransportation,
    getCompnayDetiails,
    companyDetails,
    companyUser,
    addTransportationCompany,
  } = useContext(ContextAdmin);
  const [vehicleType, setVehicleType] = useState("car");
  const [state, action, isPending] = useActionState(async (st, formData) => {
    const data = {
      name: formData.get("company_name"),
      ticketPrice: formData.get("ticketPrice"),
      from: formData.get("from"),
      to: formData.get("to"),
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      date: formData.get("date"),
      vehicleType: formData.get("vehicle_type"),
      plateNo: formData.get("plateNo"),
      model: formData.get("model"),
      seats: seats,
      termsAndRules: rules,
    };

    if (hasDuplicateSeatIds(seats)) {
      document.querySelector("#seatSelection").scrollIntoView();
      return { success: false, msg: "Duplicate seat name founded!", ...data };
    }

    const res = await (companyUser
      ? addTransportationCompany(data)
      : addTransportation(data));

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

  const [rules, setRules] = useState([""]);
  const [seats, setSeats] = useState(state?.seats || false);
  const [dublicateSeat, setdublicateSeat] = useState();
  const [departureTime, setDepartureTime] = useState(
    state?.departureTime || false
  );
  const [arrivalTime, setArrivalTime] = useState(state?.departureTime || false);

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

  useEffect(() => {
    companyUser !== null &&
      companyUser &&
      !companyDetails &&
      getCompnayDetiails();
  }, [companyUser]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {addTransportationsTrans("AddTransportations")}
        </h3>
      </div>
      <form action={action} className="flex flex-col">
        <div className="mt-0 mb-[30px]">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div className="col-span-2 lg:col-span-1">
              <Label>{addTransportationsTrans("Name")}</Label>
              <Input
                type="text"
                defaultValue={companyUser ? companyDetails?.name : state?.name}
                required={true}
                name={"company_name"}
                id={"company_name"}
                disabled={companyUser}
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>{addTransportationsTrans("TicketPrice")}</Label>
              <Input
                type="number"
                defaultValue={state?.ticketPrice}
                required={true}
                name={"ticketPrice"}
                id={"ticketPrice"}
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>{addTransportationsTrans("From")}</Label>
              <Input
                type="text"
                defaultValue={state?.from}
                required={true}
                name={"from"}
                id={"from"}
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>{addTransportationsTrans("To")}</Label>
              <Input
                type="text"
                defaultValue={state?.to}
                required={true}
                name={"to"}
                id={"to"}
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>{addTransportationsTrans("DepartureTime")}</Label>
              <Input
                type="time"
                defaultValue={state?.departureTime}
                required={true}
                name={"departureTime"}
                id={"departureTime"}
                onChange={(e) => {
                  const timeValue = e.target.value; // "HH:MM"
                  const [hours, minutes] = timeValue.split(":").map(Number);

                  const now = new Date();
                  // Build a local datetime first
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
              <Label>{addTransportationsTrans("ArrivalTime")}</Label>
              <Input
                type="time"
                defaultValue={state?.arrivalTime}
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
            <div className="col-span-2 lg:col-span-1">
              <Label>{addTransportationsTrans("Date")}</Label>
              <Input
                type="date"
                defaultValue={state?.date}
                required={true}
                name={"date"}
                id={"date"}
              />
            </div>
          </div>
          <div className="mt-[30px] flex flex-col gap-[20px]">
            <h3 className="text-[16px] font-semibold text-gray-800 dark:text-white/90">
              {addTransportationsTrans("VehicleDetails")}
            </h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div className="col-span-2 lg:col-span-1">
                <Label>{addTransportationsTrans("VehicleType")}</Label>
                <Select
                  defaultValue={state?.vehicleType || "Bus"}
                  name="vehicle_type"
                  id="vehicle_type"
                  options={[
                    { label: addTransportationsTrans("Car"), value: "car" },
                    { label: addTransportationsTrans("Bus"), value: "bus" },
                    { label: addTransportationsTrans("Plane"), value: "plane" },
                    { label: addTransportationsTrans("Train"), value: "train" },
                  ]}
                  onChange={(e) => {
                    setVehicleType(e);
                  }}
                  className=""
                />
              </div>
              <div className="col-span-2 lg:col-span-1">
                <Label>{addTransportationsTrans("PlateNo")}</Label>
                <Input
                  type="text"
                  defaultValue={state?.plateNo}
                  required={true}
                  name={"plateNo"}
                  id={"plateNo"}
                />
              </div>
              <div className="col-span-2 lg:col-span-1">
                <Label>{addTransportationsTrans("Model")}</Label>
                <Input
                  type="text"
                  defaultValue={state?.model}
                  required={true}
                  name={"model"}
                  id={"model"}
                />
              </div>

              <div className="col-span-2">
                <SeatSelection
                  seats={seats}
                  setSeats={setSeats}
                  dublicateSeat={dublicateSeat}
                  setdublicateSeat={setdublicateSeat}
                  vehicleType={vehicleType}
                />
              </div>
            </div>
          </div>

          <div className="mt-[30px] flex flex-col gap-[20px]">
            <h3 className="text-[16px] font-semibold text-gray-800 dark:text-white/90">
              {addTransportationsTrans("TermsAndRules")}
            </h3>
            <div className="flex flex-col gap-[25px]">
              {rules.map((it, index) => (
                <div key={index} className="w-full flex-col flex gap-[10px]">
                  <p className="bk-16 ">
                    {addTransportationsTrans("Rule")} {index + 1} :
                  </p>
                  <div
                    className={`relative ${
                      index === 0 ? "" : "hover:[&>#closeBtn]:flex"
                    }`}
                  >
                    <button
                      id="closeBtn"
                      type="button"
                      onClick={() =>
                        setRules((e) => {
                          const temp = [...e];
                          temp.splice(index, 1);
                          return [...temp];
                        })
                      }
                      className="w-[25px] justify-center items-center h-[25px] absolute top-[5px] right-[5px] bg-white rounded-full z-[30] hidden"
                    >
                      <TrashBinIcon />
                    </button>
                    <TextArea
                      value={it}
                      onChange={(ele) => {
                        setRules((e) => {
                          let temp = e;
                          temp[index] = ele;
                          return [...temp];
                        });
                      }}
                      required={true}
                      minLength={25}
                      maxLength={200}
                      placeholder={addTransportationsTrans("AddRule")}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant={"outline"}
                type={"button"}
                className={`w-max mt-[10px] h-[40px] ${
                  rules.length >= 5 ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={() => rules.length < 5 && setRules((e) => [...e, ""])}
              >
                {addTransportationsTrans("AddRule")}
              </Button>
            </div>
          </div>
        </div>
        {state && (
          <Alert
            message={state.msg}
            title={
              state.success
                ? addTransportationsTrans("Success")
                : addTransportationsTrans("Error")
            }
            variant={state.success ? "success" : "error"}
          />
        )}
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" disabled={isPending} type="submit">
            {addTransportationsTrans("AddTransportation")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;
