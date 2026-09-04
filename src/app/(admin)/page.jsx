"use client";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useContext } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import TypesOfUsersGraph from "@/components/ecommerce/TypesOfUsersGraph";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { ContextAdmin } from "@/context/MainStateAdmin";

export default function Ecommerce() {
  const { companyUser, travelAgent } = useContext(ContextAdmin);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div
        className={`col-span-12 space-y-6  ${
          companyUser ? "" : "xl:col-span-7"
        } ${travelAgent ? "xl:col-span-12" : ""}`}
      >
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      {!travelAgent && (
        <div className="col-span-12 xl:col-span-5">
          <TypesOfUsersGraph />
        </div>
      )}

      {!travelAgent && (
        <div className="col-span-12">
          <StatisticsChart />
        </div>
      )}
    </div>
  );
}
