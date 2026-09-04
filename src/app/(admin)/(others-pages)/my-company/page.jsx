"use client";
import React, { useEffect } from "react";
import { useContext } from "react";
import { ContextAdmin } from "@/context/MainStateAdmin";
import NotFound from "@/components/ui/NotFound";
import VehicleTypeShower from "@/components/ui/VehicleTypeShower";
import Image from "next/image";
import { useTranslations } from "next-intl";

const page = () => {
  const myCompanyTrans = useTranslations("myCompanyPage");
  const { getCompnayDetiails, companyDetails, loading } =
    useContext(ContextAdmin);

  useEffect(() => {
    !companyDetails && getCompnayDetiails();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      {companyDetails ? (
        <>
          <div className="flex flex-row flex-wrap items-center justify-between">
            <div className="flex flex-col mb-5">
              <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90 ">
                {myCompanyTrans("TransportCompanyDetails")}
              </h3>
              <p className=" bk-16 !text-gray-800 dark:!text-gray-300 text-base font-normal leading-normal">
                {myCompanyTrans("ViewCompanyDetails")}
              </p>
            </div>
          </div>

          <div className="flex flex-col flex-1 w-full">
            <div className="p-4">
              <div className="flex flex-row flex-wrap gap-[25px] items-center">
                <Image
                  src={companyDetails?.logo || "/images/user/user.png"}
                  width={200}
                  height={200}
                  alt="company"
                  className="rounded-xl"
                />
                <div className="flex flex-col gap-[0px]">
                  <h4 className="bd-20 !text-[30px] !leading-[35px]">
                    {companyDetails?.name}
                  </h4>
                  <p className="med-18">{companyDetails?.email}</p>
                </div>
              </div>
            </div>
            <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
              <div className="col-span-2 flex flex-row md:gap-[35px]  border-t border-t-[#D5D6DD] dark:border-t-gray-500 py-5">
                <p className="med-15 w-[20ch] ">
                  {myCompanyTrans("TotalTransportationsCreated")}
                </p>
                <p className="bk-14 w-max">
                  {companyDetails.totalTransportations || 0}
                </p>
              </div>
              <div className="col-span-2 flex flex-row gap-[35px] border-t border-t-[#D5D6DD] dark:border-t-gray-500 py-5">
                <p className="med-15 w-[20ch] ">{myCompanyTrans("Address")}</p>
                <p className="bk-14 w-max">
                  {companyDetails?.address || myCompanyTrans("NA")}
                </p>
              </div>
              <div className="col-span-2 flex flex-row gap-[35px] border-t border-t-[#D5D6DD] dark:border-t-gray-500 py-5">
                <p className="med-15 w-[20ch] ">
                  {myCompanyTrans("VehicleType")}
                </p>
                {companyDetails?.vehicleType && (
                  <VehicleTypeShower name={companyDetails?.vehicleType} />
                )}
              </div>
              <div className="col-span-2 flex flex-row gap-[35px] border-t border-t-[#D5D6DD] dark:border-t-gray-500 py-5">
                <p className="med-15 w-[20ch] ">{myCompanyTrans("Users")}</p>
                <p className="bk-14 w-max">
                  {companyDetails?.users?.length || 0}
                </p>
              </div>
              <div className="col-span-2 flex flex-row gap-[35px] border-t border-t-[#D5D6DD] dark:border-t-gray-500 py-5">
                <p className="med-15 w-[20ch] ">
                  {myCompanyTrans("CreatedAt")}
                </p>
                <p className="bk-14 w-max">
                  {new Date(companyDetails?.createdAt).toDateString()}
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="med-20 dark:!text-gray-300">
                {myCompanyTrans("CompanyUsers")}
              </p>
              <div className="flex flex-col mt-[20px] rounded-xl bg-[#F9FAFA] dark:bg-gray-900">
                {companyDetails?.users?.map((it, index) => (
                  <div key={index} className="px-4 cursor-pointer">
                    <div className="flex items-center gap-4 min-h-[72px] py-2 justify-between border-b border-gray-300">
                      <div className="flex items-center gap-4">
                        <Image
                          src={it.profileImg}
                          width={60}
                          height={60}
                          className="rounded-full"
                          alt="company user"
                          quality={100}
                        ></Image>
                        <div className="flex flex-col justify-center">
                          <p className="med-16">
                            {it.firstName + " " + it.lastName}
                          </p>
                          <p className="bk-16">{it.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <NotFound
          loading={loading}
          loadingText={myCompanyTrans("LoadingCompany")}
          loadingDesc={myCompanyTrans("LoadingCompanyDesc")}
          heading={myCompanyTrans("CompanyNotFound")}
          desc={myCompanyTrans("CompanyNotFoundDesc")}
        />
      )}
    </div>
  );
};

export default page;
