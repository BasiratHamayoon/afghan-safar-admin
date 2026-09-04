"use client";
import { ContextAdmin } from "@/context/MainStateAdmin";
import dynamic from "next/dynamic";
import { useContext } from "react";
import { useTranslations } from "next-intl";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const TypesOfUsersGraph = () => {
  const t = useTranslations("Dashboard");
  const rolesTrans = useTranslations("UserRoles");
  const { dashboardData, companyUser } = useContext(ContextAdmin);

  var options = {
    series: [
      dashboardData?.totalPassengers || 0,
      dashboardData?.totalDrivers || 0,
      dashboardData?.totalModerators || 0,
      dashboardData?.totalCompanyUsers || 0,
    ],
    chart: {
      type: "pie",
    },
    colors: ["#32d583", "#0086c9", "#fd853a", "#d0d5dd"],
    labels: [
      rolesTrans("Passengers"),
      rolesTrans("Drivers"),
      rolesTrans("Moderators"),
      rolesTrans("TransportCompanyUsers"),
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    !companyUser && (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("TypeOfUsers")}
          </h3>
        </div>

        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
            <ReactApexChart
              options={options}
              type="donut"
              height={250}
              series={[
                dashboardData?.totalPassengers || 0,
                dashboardData?.totalDrivers || 0,
                dashboardData?.totalModerators || 0,
                dashboardData?.totalCompanyUsers || 0,
              ]}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default TypesOfUsersGraph;
