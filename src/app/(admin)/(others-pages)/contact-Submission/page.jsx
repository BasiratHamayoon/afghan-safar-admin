"use client";
import React, { useContext, useEffect, useState } from "react";
import NoData from "../../../../components/ui/NoData";
import { ContextAdmin } from "@/context/MainStateAdmin";
import ContactCard from "@/components/contact-page/ContactCard";
import { UserIcon } from "@/icons";
import StatCard from "@/components/ui/Card/StatCard";
import { useTranslations } from "next-intl";
const page = () => {
  const contactSubmissionTrans = useTranslations("contactSubmissionPage");
  const { loading, contactCards, getContactCards } = useContext(ContextAdmin);

  useEffect(() => {
    contactCards.data.length < 1 && !loading && getContactCards();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {contactSubmissionTrans("ContactSubmissions")}
        </h3>
      </div>
      <div className="flex flex-col w-full gap-[20px] py-[25px]">
        <StatCard
          title={contactSubmissionTrans("TotalContactSubmissions")}
          value={contactCards?.stats?.totalContacts || 0}
          icon={<UserIcon />}
          color="bg-indigo-100 text-indigo-600"
        />
      </div>
      <div className="min-h-screen">
        <div className="overflow-x-auto">
          <table className="w-[1000px] md:w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] dark:border-gray-600 text-start ">
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {contactSubmissionTrans("User")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {contactSubmissionTrans("ContactInfo")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {contactSubmissionTrans("Message")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {contactSubmissionTrans("CreatedAt")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {contactSubmissionTrans("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {contactCards?.data?.length > 0 &&
                contactCards?.data?.map((contactData, index) => (
                  <ContactCard
                    contactData={contactData}
                    key={index}
                    last={index === contactCards.data.length - 1}
                    loading={loading}
                    getMoreData={getContactCards}
                    contactCards={contactCards}
                  />
                ))}
            </tbody>
          </table>
          {contactCards?.data?.length < 1 && <NoData loading={loading} />}
        </div>
      </div>
    </div>
  );
};

export default page;
