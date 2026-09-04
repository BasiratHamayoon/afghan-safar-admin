import React from "react";
import Select from "../form/Select";
import RadioSm from "../form/input/RadioSm";
import SearchBar from "@/components/ui/SearchBar";
import {
  Block,
  GrantAccess,
  Notifications,
  TrashBinIcon,
  UnBlock,
} from "@/icons";
import Button from "./button/Button";
import { useTranslations } from "next-intl";
const Filter = ({
  filterState,
  setfilterState,
  options,
  optValue,
  optPlaceholder,
  deletClickFunc,
  blockClickFunc,
  unBlockClickFunc,
  noStatus,
  noBlock,
  noUnblock,
  noNotification,
  NotificationClick,
  showGrantBgAd,
  clickFuncGrantAd,
}) => {
  const filterTrans = useTranslations("Filter");
  const changeFunc = (name) => {
    setfilterState((e) => ({ ...e, used: name }));
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center gap-[10px] w-full pb-[20px] flex-wrap lg:flex-nowrap">
        <SearchBar
          inputFunc={(val) =>
            setfilterState((e) => ({ ...e, searchQuery: val }))
          }
        />
        {options && (
          <Select
            options={options}
            placeholder={optPlaceholder}
            className="lg:max-w-[250px]"
            onChange={(value) => {
              setfilterState((e) => ({ ...e, [optValue]: value }));
            }}
          />
        )}
        {!noStatus && (
          <Select
            options={[
              { label: filterTrans("All"), value: "all" },
              { label: filterTrans("Active"), value: "active" },
              { label: filterTrans("Blocked"), value: "blocked" },
            ]}
            placeholder={filterTrans("Status")}
            className="lg:max-w-[250px]"
            onChange={(value) => {
              setfilterState((e) => ({ ...e, status: value }));
            }}
          />
        )}
      </div>
      <div className="flex flex-row flex-wrap gap-[20px] items-center justify-between py-[20px] pl-[5px] border-y border-[#e5e7eb] dark:border-none">
        <div className="flex flex-row md:gap-[25px] gap-[10px] ">
          <span className="text-gray-700 bk-14 dark:text-gray-300">Show :</span>
          <RadioSm
            label={filterTrans("All")}
            value="all"
            checked={filterState.used === "all"}
            onChange={changeFunc}
          />
          {optValue && (
            <RadioSm
              label={optPlaceholder}
              value={optValue}
              checked={filterState.used === optValue}
              onChange={changeFunc}
            />
          )}
          {!noStatus && (
            <RadioSm
              label={filterTrans("Status")}
              value="status"
              checked={filterState.used === "status"}
              onChange={changeFunc}
            />
          )}
        </div>
        <div className="flex flex-row items-center gap-[5px] flex-wrap lg:flex-nowrap">
          <Button
            onClick={deletClickFunc}
            startIcon={<TrashBinIcon />}
            className={
              "bg-error-600 h-[35px] min-w-[90px] max-w-[120px] hover:bg-error-700"
            }
          >
            {filterTrans("Delete")}
          </Button>

          {!noBlock && (
            <Button
              onClick={blockClickFunc}
              startIcon={<Block />}
              className={
                "bg-neutral-600 h-[35px] min-w-[90px] max-w-[120px] hover:bg-neutral-900"
              }
            >
              {filterTrans("Block")}
            </Button>
          )}
          {!noUnblock && (
            <Button
              onClick={unBlockClickFunc}
              startIcon={<UnBlock />}
              className={"bg-green-600 h-[35px] w-max hover:bg-green-900"}
            >
              {filterTrans("UnBlock")}
            </Button>
          )}
          {!noNotification && (
            <Button
              onClick={() => NotificationClick()}
              startIcon={<Notifications />}
              className={" h-[35px] px-[9px]"}
            >
              {filterTrans("SendNotifications")}
            </Button>
          )}
          {showGrantBgAd && (
            <Button
              onClick={() => clickFuncGrantAd()}
              startIcon={<GrantAccess />}
              className={" h-[35px] px-[9px] "}
            >
              {filterTrans("GrantBackgroundAd")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
