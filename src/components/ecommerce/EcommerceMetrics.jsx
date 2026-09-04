"use client";
import React, { useContext, useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { ContextAdmin } from "@/context/MainStateAdmin";
import { useTranslations } from "next-intl";

export const EcommerceMetrics = () => {
  const t = useTranslations("Dashboard");
  const {
    getDashboard,
    dashboardData,
    setdashboardData,
    companyUser,
    getDashboardTransport,
    travelAgent,
    getDashboardTravelAgent,
  } = useContext(ContextAdmin);

  useEffect(() => {
    if (travelAgent) {
      getDashboardTravelAgent().then((e) => setdashboardData(e));
    } else if (companyUser !== null) {
      companyUser
        ? getDashboardTransport().then((e) => setdashboardData(e))
        : getDashboard().then((e) => {
            setdashboardData(e);
          });
    }
  }, [companyUser, travelAgent]);

  return (
    <div
      className={`grid grid-cols-1 gap-4 md:gap-6 ${
        companyUser ? "sm:grid-cols-3" : "sm:grid-cols-2"
      }`}
    >
      {!travelAgent && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("NumberOfUsers")}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {dashboardData?.totalUsers}
              </h4>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {travelAgent
                ? t("Number of Tickets Booked")
                : t("NumberOfTransportations")}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {travelAgent
                ? dashboardData.totalBookedTickets
                : companyUser
                ? dashboardData?.totalTransportations
                : dashboardData?.totalTickets}
            </h4>
          </div>
        </div>
      </div>

      {companyUser && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("TicketsBooked")}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {dashboardData?.totalBookedTickets}
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
