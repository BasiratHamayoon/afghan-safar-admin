import React, { useEffect, useRef, useState } from "react";
import Checkbox from "../form/input/Checkbox";
import Link from "next/link";
import { CopyIcon } from "@/icons";
import Image from "next/image";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const BgAdCard = ({
  ad,
  selectedIds,
  setSelectedIds,
  bgAdsCard,
  getMoreData,
  last,
  loading,
  deleteADFunc,
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [callForData, setcallForData] = useState(false);
  const cardRef = useRef();
  const [showOptions, setshowOptions] = useState(false);

  useEffect(() => {
    if (last && !bgAdsCard?.allDone) {
      const intersecTionobserver = new IntersectionObserver((ele) => {
        ele.forEach((it) => {
          if (it.isIntersecting) {
            setcallForData(true);
          }
        });
      });
      bgAdsCard?.allDone
        ? intersecTionobserver.unobserve(cardRef.current)
        : intersecTionobserver.observe(cardRef.current);
    }
  }, []);

  useEffect(() => {
    if (callForData && !bgAdsCard?.allDone && !loading) getMoreData();
  }, [callForData]);

  const actionFunc = () => {
    setshowOptions(!showOptions);
    setSelectedIds([ad._id]);
  };

  return (
    <>
      <tr
        ref={cardRef}
        className="border-b border-[#e5e7eb] dark:border-gray-600 hover:bg-[#f3f4f6] dark:hover:bg-gray-800 cursor-pointer"
      >
        <td className="flex items-center gap-3 py-3 pl-[6px]">
          <Checkbox
            checked={selectedIds.includes(ad._id)}
            onChange={() => {
              setSelectedIds((e) => {
                const tempIds = [...e];

                if (tempIds.includes(ad._id)) {
                  tempIds.splice(
                    e.findIndex((it) => it === ad._id),
                    1
                  );
                } else {
                  tempIds.push(ad._id);
                }
                return [...tempIds];
              });
            }}
          />
          <Image
            src={ad.adImg || "/images/user/user.png"}
            alt="avatar"
            className="w-[150px] h-[90px] rounded-[10px] dark:bg-gray-300"
            width={500}
            height={500}
            quality={100}
          />
          <span className="med-14 !text-gray-700 dark:!text-gray-300">
            {ad?.title || "No title"}
          </span>
        </td>

        <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
          <span className={`px-2 py-1 rounded bk-14 `}>
            {ad.all ? "All" : ad?.userIds?.length}
          </span>
        </td>

        <td className="flex flex-row p-3 w-[120px]">
          {ad.all ? (
            <span className="bk-14">All</span>
          ) : (
            <>
              {ad?.userIds?.slice(0, 5).map((it, index) => (
                <Image
                  key={index}
                  src={it?.profileImg || "/images/user/user.png"}
                  alt={"User with ad - " + index}
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
              <button
                onClick={() => openModal()}
                style={{
                  transform: `translateX(${
                    (ad?.userIds?.length > 5 ? 5 : ad?.userIds?.length) * -20 +
                    "px"
                  })`,
                  borderRadius: "100%",
                }}
                className="min-w-[35px] min-h-[35px] border-[2px] rounded-full bg-white dark:bg-gray-300 flex-center hover:bg-gray-200 hover:[&_svg]:fill-gray-800 "
              >
                <svg
                  fill="currentColor"
                  height="20px"
                  width="20px"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 59.2 59.2"
                  xmlSpace="preserve"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <path d="M51.062,21.561c-5.759-5.759-13.416-8.931-21.561-8.931S13.7,15.801,7.941,21.561L0,29.501l8.138,8.138 c5.759,5.759,13.416,8.931,21.561,8.931s15.802-3.171,21.561-8.931l7.941-7.941L51.062,21.561z M49.845,36.225 c-5.381,5.381-12.536,8.345-20.146,8.345s-14.765-2.963-20.146-8.345l-6.724-6.724l6.527-6.527 c5.381-5.381,12.536-8.345,20.146-8.345s14.765,2.963,20.146,8.345l6.724,6.724L49.845,36.225z"></path>
                      <path d="M29.572,16.57c-7.168,0-13,5.832-13,13s5.832,13,13,13s13-5.832,13-13S36.741,16.57,29.572,16.57z M29.572,24.57 c-2.757,0-5,2.243-5,5c0,0.552-0.448,1-1,1s-1-0.448-1-1c0-3.86,3.14-7,7-7c0.552,0,1,0.448,1,1S30.125,24.57,29.572,24.57z"></path>
                    </g>
                  </g>
                </svg>
              </button>
            </>
          )}
        </td>

        <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
          {ad?.createdAt && new Date(ad?.createdAt).toDateString()}
        </td>

        <td className="p-3 cursor-pointer">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setshowOptions(!showOptions);
            }}
            className="w-[28px] h-[28px] flex-center hover:bg-gray-200 rounded-[6px] active:bg-gray-50"
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
              onItemClick={openModal}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View Users
            </DropdownItem>
            <DropdownItem
              onItemClick={() => {
                actionFunc();
                deleteADFunc();
              }}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </td>
        <td>
          <Modal
            isOpen={isOpen}
            onClose={closeModal}
            className="max-w-xl max-h-[80vh]"
          >
            <div className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                Users with this Ad
              </h2>
              <ul className="space-y-4 overflow-y-auto max-h-80">
                {ad?.userIds?.length ? (
                  ad.userIds.map((user, idx) => (
                    <li
                      key={user._id || idx}
                      className="flex flex-row items-center justify-between gap-4 p-3 transition rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 hover:shadow-md"
                    >
                      <div className="flex flex-row">
                        <Image
                          src={user.profileImg || "/images/user/user.png"}
                          alt={`${user.firstName || ""} ${user.lastName || ""}`}
                          width={48}
                          height={48}
                          className="border border-gray-300 rounded-full"
                        />
                        <div className="flex flex-col justify-center ml-2 ">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {user.firstName} {user.lastName}
                          </span>
                          <Link
                            href={"mailto:" + user.email}
                            className="text-sm text-brand-600 hover:underline"
                          >
                            {user.email}
                          </Link>
                        </div>
                      </div>

                      <Link
                        href={`/users/${user._id}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Details
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 dark:text-gray-400">
                    No users found.
                  </li>
                )}
              </ul>
            </div>
          </Modal>
        </td>
      </tr>
    </>
  );
};

export default BgAdCard;
