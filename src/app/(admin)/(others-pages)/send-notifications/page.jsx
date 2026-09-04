"use client";
import React, { Suspense } from "react";
import NotificationSender from "@/components/notifications-page/NotificationSender";
import { useTranslations } from "next-intl";
const page = () => {
  const notificationSender = useTranslations("notificationSender");
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90 ">
          {notificationSender("SendNotifications")}
        </h3>
        <Suspense
          fallback={
            <div className="flex flex-col pt-[35px] w-full pb-[20px]">
              {notificationSender("Loading")}...
            </div>
          }
        >
          <div className="flex flex-col pt-[35px] w-full pb-[20px]">
            <NotificationSender />
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default page;
