"use client";
import React, { useEffect, useRef, useState } from "react";
import RoleShower from "@/components/ui/RoleShower";
import Checkbox from "@/components/form/input/Checkbox";
import VehicleTypeShower from "../ui/VehicleTypeShower";
import { useRouter } from "next/navigation";
import DropDownActions from "@/components/DropDownActions";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { roles } from "@/consonants";

const UserCard = ({
  user,
  last,
  userCardsData,
  getMoreData,
  selectedIds,
  setSelectedIds,
  loading,
  showType,
  setSelectedEmails,
  blockUsersFunc,
  unBlockClickFunc,
  clickFuncGrantAd,
  NotificationClick,
  deleteUsersFunc,
}) => {
  const router = useRouter();

  const [callForData, setcallForData] = useState(false);
  const cardRef = useRef();
  const [showOptions, setshowOptions] = useState(false);

  useEffect(() => {
    if (last && !userCardsData?.allDone) {
      const intersecTionobserver = new IntersectionObserver((ele) => {
        ele.forEach((it) => {
          if (it.isIntersecting) {
            setcallForData(true);
          }
        });
      });
      userCardsData?.allDone
        ? intersecTionobserver.unobserve(cardRef.current)
        : intersecTionobserver.observe(cardRef.current);
    }
  }, []);

  useEffect(() => {
    if (callForData && !userCardsData?.allDone && !loading) getMoreData();
  }, [callForData]);

  const viewDetails = () => {
    router.push("/users/" + user?._id);
  };

  const actionFunc = () => {
    setshowOptions(!showOptions);
    setSelectedIds([user._id]);
    setSelectedEmails([user.email]);
  };

  return (
    <tr
      ref={cardRef}
      onClick={viewDetails}
      className="border-b border-[#e5e7eb] dark:border-gray-600 hover:bg-[#f3f4f6] dark:hover:bg-gray-800 cursor-pointer"
    >
      <td className="flex items-center gap-3 py-3 pl-[6px]">
        <Checkbox
          checked={selectedIds.includes(user._id)}
          onChange={() => {
            setSelectedIds((e) => {
              const tempIds = [...e];

              if (tempIds.includes(user._id)) {
                tempIds.splice(
                  e.findIndex((it) => it === user._id),
                  1
                );
              } else {
                tempIds.push(user._id);
              }
              return [...tempIds];
            });

            setSelectedEmails &&
              setSelectedEmails((e) => {
                const tempEmails = [...e];

                if (tempEmails.includes(user.email)) {
                  tempEmails.splice(
                    e.findIndex((it) => it === user.email),
                    1
                  );
                } else {
                  tempEmails.push(user.email);
                }
                return [...tempEmails];
              });
          }}
        />
        <img
          src={user.profileImg || "/images/user/user.png"}
          alt="avatar"
          className="w-[35px] h-[35px] rounded-full dark:bg-gray-300"
        />
        <span className="med-14 !text-gray-700 dark:!text-gray-300">
          {user.firstName} {user.lastName}
        </span>
      </td>
      <td className="p-3">
        <RoleShower name={roles[user.role]} />
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {user.email}
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {user.phone || "No phone number"}
      </td>
      {showType && (
        <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
          <VehicleTypeShower
            name={user?.role === "driver" ? "car" : user?.vehicleType}
          />
        </td>
      )}
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        {user?.createdAt && new Date(user?.createdAt).toDateString()}
      </td>
      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        <span
          className={`px-2 py-1 rounded bk-14 ${
            !user.blocked ? "!text-green-400" : "!text-red-400"
          }`}
        >
          {user.blocked ? "Blocked" : "Active"}
        </span>
      </td>
      <td className="p-3 cursor-pointer ">
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="relative"
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
              setshowOptions(!showOptions);
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
                blockUsersFunc();
              }}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Block
            </DropdownItem>
            <DropdownItem
              onItemClick={() => {
                actionFunc();
                unBlockClickFunc();
              }}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Un-block
            </DropdownItem>
            <DropdownItem
              onItemClick={() => {
                let route;
                if (["passenger", "driver"].includes(user.role)) {
                  route = "/send-notifications/?to=app&email=";
                } else {
                  route = "/send-notifications/?to=web&email=";
                }
                route += user.email;
                actionFunc();
                NotificationClick(route);
              }}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Send Notifications
            </DropdownItem>
            {["passenger", "driver"].includes(user.role) && (
              <DropdownItem
                onItemClick={() => {
                  actionFunc();
                  clickFuncGrantAd(
                    "/create-background-ad?emails=" + user.email
                  );
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Grant Background AD
              </DropdownItem>
            )}
            <DropdownItem
              onItemClick={() => {
                actionFunc();
                deleteUsersFunc();
              }}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </td>
    </tr>
  );
};

export default UserCard;
