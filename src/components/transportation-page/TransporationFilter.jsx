import React from "react";
import RadioSm from "../form/input/RadioSm";
import Button from "../ui/button/Button";
import { TrashBinIcon } from "@/icons";
import Select from "../form/Select";
import InputDate from "../form/input/InputDate";
import { useTranslations } from "next-intl";
const TransporationFilter = ({
  filterState,
  setfilterState,
  seachingBy,
  deletClickFunc,
  companyUser,
  hideTicketPrice,
  travelAgent,
}) => {
  const transportationFilterTrans = useTranslations("Filter");
  const changeFunc = (value, key) => {
    setfilterState((e) => ({ ...e, [key]: value }));
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-[10px]">
        <h3 className="med-16 !text-gray-900 dark:!text-gray-200">
          {transportationFilterTrans("SearchBy")}
        </h3>
        <div className="flex flex-row items-center gap-[10px] w-full pb-[20px] flex-wrap lg:flex-nowrap">
          {!companyUser && (
            <InputSearch
              placeholder={transportationFilterTrans("Name")}
              value={filterState.name}
              onChange={(value) => changeFunc(value, "name")}
            />
          )}
          <InputSearch
            placeholder={transportationFilterTrans("From")}
            value={filterState.from}
            onChange={(value) => changeFunc(value, "from")}
          />
          <InputSearch
            placeholder={transportationFilterTrans("To")}
            value={filterState.to}
            onChange={(value) => changeFunc(value, "to")}
          />
          <Select
            options={[
              { label: transportationFilterTrans("All"), value: "all" },
              { label: transportationFilterTrans("Bus"), value: "bus" },
              { label: transportationFilterTrans("Car"), value: "car" },
              {
                label: transportationFilterTrans("Train"),
                value: "train",
              },
              { label: transportationFilterTrans("Plane"), value: "plane" },
            ]}
            placeholder={transportationFilterTrans("VehicleType")}
            className="lg:max-w-[250px]"
            onChange={(value) => changeFunc(value, "vehicleType")}
          />
        </div>
      </div>
      <div className="flex flex-row items-center gap-[20px] w-full pb-[20px] flex-wrap lg:flex-nowrap">
        {!hideTicketPrice && (
          <div className="flex flex-col gap-[5px]">
            <h4 className="bk-16 !text-gray-800 dark:!text-gray-200 ">
              {transportationFilterTrans("TicketPrice")}
            </h4>
            <div className="flex flex-row gap-[5px]">
              <InputSearch
                placeholder={transportationFilterTrans("Min")}
                type={"number"}
                className={"max-w-[100px]"}
                onChange={(value) => changeFunc(value, "ticketPriceMin")}
              />
              <InputSearch
                placeholder={transportationFilterTrans("Max")}
                className={"max-w-[100px]"}
                onChange={(value) => changeFunc(value, "ticketPriceMax")}
                type={"number"}
              />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-[5px] max-w-[250px] w-full z-[10]">
          <h4 className="bk-16 !text-gray-800 dark:!text-gray-200 ">
            {transportationFilterTrans("Date")}
          </h4>
          <input
            className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 shadow-theme-xs placeholder:text-gray-400 text-sm focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
            type="date"
            id="start"
            name="trip-start"
            value={filterState.date}
            onChange={(e) => changeFunc(e.target.value, "date")}
          />
        </div>
      </div>
      <div className="flex flex-row items-center gap-[25px] flex-wrap justify-between py-[20px] pl-[5px] border-y border-[#e5e7eb] dark:border-none">
        <div className="flex flex-row md:gap-[25px] gap-[20px] flex-wrap">
          <span className="text-gray-700 bk-14 dark:text-gray-300">
            {transportationFilterTrans("Show")}
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
          {!companyUser && !travelAgent && (
            <Button
              onClick={deletClickFunc}
              startIcon={<TrashBinIcon />}
              className={"bg-error-600 h-[35px] w-[90px] hover:bg-error-700"}
            >
              {transportationFilterTrans("Delete")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransporationFilter;

const InputSearch = ({
  value,
  name,
  id,
  type,
  placeholder,
  selectedValue,
  className,
  onChange,
}) => {
  return (
    <input
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5  text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900  dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800 dark:text-white/90  ${className}`}
      value={value}
      name={name}
      placeholder={placeholder}
      id={id}
      type={type || "text"}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
