import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import RoleShower from "../ui/RoleShower";
import toAfghaniDate from "@/util/toAfghaniDate";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import { ArrowDownIcon, ArrowRightIcon, HalfArrow } from "@/icons";
import Link from "next/link";
import { roles } from "@/consonants";

const ContactCard = ({
  contactData,
  last,
  loading,
  getMoreData,
  contactCards,
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const [callForData, setcallForData] = useState(false);
  const cardRef = useRef();
  const [showOptions, setshowOptions] = useState(false);

  useEffect(() => {
    if (last && !contactCards?.allDone) {
      const intersecTionobserver = new IntersectionObserver((ele) => {
        ele.forEach((it) => {
          if (it.isIntersecting) {
            setcallForData(true);
          }
        });
      });
      contactCards?.allDone
        ? intersecTionobserver.unobserve(cardRef.current)
        : intersecTionobserver.observe(cardRef.current);
    }
  }, []);

  useEffect(() => {
    if (callForData && !contactCards?.allDone && !loading) getMoreData();
  }, [callForData]);

  return (
    <>
      <tr
        ref={cardRef}
        onClick={openModal}
        className="border-b border-[#e5e7eb] dark:border-gray-600 hover:bg-[#f3f4f6] dark:hover:bg-gray-800 cursor-pointer"
      >
        <td className="flex items-center gap-3 py-3 pl-[6px]">
          <img
            src={contactData.user.profileImg || "/images/user/user.png"}
            alt="avatar"
            className="w-[50px] h-[50px] rounded-full dark:bg-gray-300"
          />
          <div className="flex flex-col ">
            <span className="med-14 !text-gray-700 dark:!text-gray-300">
              {contactData.user.firstName} {contactData.user.lastName}
            </span>
            <RoleShower name={roles[contactData.user.role]} />
          </div>
        </td>

        <td className="p-3 ">
          <div className="flex flex-col">
            <a
              href={"mailto:" + contactData.email}
              onClick={(e) => e.stopPropagation()}
              className="bk-14 !text-blue-500 dark:!text-blue-600 hover:underline"
            >
              {contactData.email}
            </a>
            <a
              href={"tel:" + contactData.phoneNumber}
              onClick={(e) => e.stopPropagation()}
              className="bk-14 !text-gray-500 dark:!text-gray-600 hover:underline"
            >
              {contactData.phoneNumber}
            </a>
          </div>
        </td>
        <td className="p-3">
          <p className="max-w-[40ch] w-full bk-14 !text-gray-500 dark:!text-gray-200">
            {contactData.message}
          </p>
        </td>
        <td className="p-3 bk-14 !text-gray-500 dark:!text-gray-200">
          {toAfghaniDate(contactData.createdAt)}
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
                  openModal();
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View Details
              </DropdownItem>
              <DropdownItem
                onItemClick={() => {
                  router.push("/users/" + contactData?.user?._id);
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View User
              </DropdownItem>
              <DropdownItem
                onItemClick={() => {
                  router.push(
                    "/send-notifications?to=app&email=" +
                      contactData.user?.email
                  );
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Reply
              </DropdownItem>
            </Dropdown>
          </div>
        </td>
        <td className="">
          <Modal
            isOpen={isOpen}
            onClose={closeModal}
            className="max-w-[500px] w-full h-max max-h-[80vh]"
          >
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform rounded-lg sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="med-20" id="modal-title">
                      Message Details
                    </h3>
                    <div className="mt-4 space-y-2">
                      <div>
                        <p className="med-16 mb-[5px]">From:</p>
                        <p className="bk-14 text-gray-800 !dark:text-gray-200">
                          {contactData.name || "NONE"}
                        </p>
                      </div>
                      <div>
                        <p className="med-16 mb-[5px]">Email:</p>
                        <p className="bk-14 text-gray-800 !dark:text-gray-200">
                          {contactData.email || "NONE"}
                        </p>
                      </div>
                      <div>
                        <p className="med-16 mb-[5px]">Phone:</p>
                        <p className="bk-14 text-gray-800 !dark:text-gray-200">
                          {contactData.phoneNumber || "NONE"}
                        </p>
                      </div>
                      <div>
                        <p className="med-16 mb-[5px]">Submitted On:</p>
                        <p className="bk-14 text-gray-800 !dark:text-gray-200">
                          {toAfghaniDate(contactData.createdAt)}
                        </p>
                      </div>
                      <div className="mt-3">
                        <p className="med-16 mb-[5px]">Message:</p>
                        <p className="p-3 mt-1 bk-14 text-gray-800 !dark:text-gray-200 rounded bg-gray-50 dark:bg-gray-500">
                          {contactData.message || "NONE"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Link
                  href={
                    "/send-notifications?to=app&email=" +
                    contactData.user?.email
                  }
                  type="button"
                  id="replyBtn"
                  className="inline-flex [&_svg]:translate-y-[1px] [&_svg]:rotate-[-90deg] [&_svg]:scale-[1.2] items-center gap-[4px] justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Reply
                  <ArrowDownIcon />
                </Link>
              </div>
            </div>
          </Modal>
        </td>
      </tr>
    </>
  );
};

export default ContactCard;
