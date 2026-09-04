import React, { useEffect, useRef, useState } from "react";
import Checkbox from "../form/input/Checkbox";
import VehicleTypeShower from "../ui/VehicleTypeShower";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toAfghaniDate from "@/util/toAfghaniDate";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";

const TransportationCompanyCard = ({
  company,
  setSelectedIds,
  selectedIds,
  last,
  companyCards,
  loading,
  getMoreData,
  deleteOpenModel,
}) => {
  const router = useRouter();

  const [callForData, setcallForData] = useState(false);
  const companyRef = useRef();
  const [showOptions, setshowOptions] = useState(false);

  useEffect(() => {
    if (last && !companyCards.allDone) {
      const intersecTionobserver = new IntersectionObserver((ele) => {
        ele.forEach((it) => {
          if (it.isIntersecting) {
            setcallForData(true);
          }
        });
      });
      companyCards.allDone
        ? intersecTionobserver.unobserve(companyRef.current)
        : intersecTionobserver.observe(companyRef.current);
    }
  }, []);

  useEffect(() => {
    if (callForData && !companyCards.allDone && !loading) getMoreData();
  }, [callForData]);

  const viewDetails = () => {
    router.push("/transport-companies/" + company._id);
  };

  const actionFunc = () => {
    setshowOptions(!showOptions);
    setSelectedIds([company._id]);
  };

  return (
    <tr
      ref={companyRef}
      onClick={viewDetails}
      className="border-b border-[#e5e7eb] dark:border-gray-600 hover:bg-[#f3f4f6] dark:hover:bg-gray-800 cursor-pointer"
    >
      <td
        style={{ width: "minmax(250px,300px)" }}
        className="flex items-center gap-3 py-3 pl-[6px]"
      >
        <Checkbox
          checked={selectedIds.includes(company?._id)}
          onChange={() => {
            setSelectedIds((e) => {
              const tempIds = [...e];

              if (tempIds.includes(company?._id)) {
                tempIds.splice(
                  e.findIndex((it) => it === company?._id),
                  1
                );
              } else {
                tempIds.push(company?._id);
              }
              return [...tempIds];
            });
          }}
        />
        <Image
          width={35}
          height={35}
          src={company.logo || "/images/user/user.png"}
          alt="avatar"
          className="w-[35px] h-[35px] rounded-full"
        />
        <span className="med-14 !text-gray-700 dark:!text-gray-300">
          {company?.name}
        </span>
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {company?.email}
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {company?.phone}
      </td>
      <td className="flex flex-row p-3 w-[120px]">
        {company?.users?.slice(0, 5).map((it, index) => (
          <Image
            key={index}
            src={it?.profileImg}
            alt={"Company User - " + index}
            width={35}
            height={35}
            quality={100}
            className="border-[2px] border-gray-300"
            style={{
              transform: `translateX(${-index * 20 + "px"})`,
              borderRadius: "100%",
            }}
          />
        ))}
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {company?.vehicleType && (
          <VehicleTypeShower name={company?.vehicleType} />
        )}
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {toAfghaniDate(company?.createdAt)}
      </td>

      <td
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="p-3 cursor-pointer"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setshowOptions(!showOptions);
          }}
          className="w-[28px] h-[28px] flex-center hover:bg-gray-200 rounded-[6px]"
        >
          <svg
            className="dark:fill-gray-300 dark:stroke-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="black"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="black"
          >
            <path
              stroke="inherit"
              strokeLinecap="round"
              strokeWidth="4"
              d="M6 12h0m6 0h0m6 0h0"
            ></path>
          </svg>
        </button>

        <Dropdown
          isOpen={showOptions}
          onClose={() => {
            setshowOptions(false);
          }}
          className="w-40 p-2"
        >
          <DropdownItem
            onItemClick={() => {
              actionFunc();
              viewDetails();
            }}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            View Details
          </DropdownItem>

          <DropdownItem
            onItemClick={() => {
              actionFunc();
              deleteOpenModel();
            }}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            Delete
          </DropdownItem>
        </Dropdown>
      </td>
    </tr>
  );
};

export default TransportationCompanyCard;
