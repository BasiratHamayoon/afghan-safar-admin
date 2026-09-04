"use client";
import RoleShower from "@/components/ui/RoleShower";
import React, { useContext, useEffect, useState } from "react";
import { roles } from "@/consonants";
import Image from "next/image";
import VehicleTypeShower from "@/components/ui/VehicleTypeShower";
import Button from "@/components/ui/button/Button";
import { Block, Notifications, TrashBinIcon, UnBlock } from "@/icons";
import { useParams, useRouter } from "next/navigation";
import { ContextAdmin } from "@/context/MainStateAdmin";
import NotFound from "@/components/ui/NotFound";
import { useModal } from "@/hooks/useModal";
import ModelActions from "@/components/ui/modal/ModelActions";
import { useTranslations } from "next-intl";

const page = () => {
  const companyIdTrans = useTranslations("companyIdPage");
  const { isOpen, openModal, closeModal } = useModal();
  const { companyId } = useParams();
  const router = useRouter();
  const {
    companyCards,
    fetchCompanyById,
    loading,
    deleteCompanies,
    companyUser,
  } = useContext(ContextAdmin);
  const [company, setCompany] = useState(false);

  const getCompanyDetails = async () => {
    const newCompany = companyCards?.data?.find(
      (item) => item._id === companyId
    );
    if (!newCompany) {
      const res = await fetchCompanyById(companyId);
      setCompany(res?.company);
    } else {
      setCompany(newCompany);
    }
  };

  useEffect(() => {
    getCompanyDetails();
  }, []);

  const deleteCompanyFunc = async () => {
    const data = await deleteCompanies({ companyIds: [companyId] });

    if (data.success) {
      closeModal();
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      {company ? (
        <>
          <div className="flex flex-row flex-wrap items-center justify-between">
            <div className="flex flex-col mb-5">
              <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90 ">
                {companyIdTrans("TransportCompanyDetails")}
              </h3>
              <p className=" bk-16 !text-gray-800 dark:!text-gray-300 text-base font-normal leading-normal">
                {companyIdTrans("ViewAndManageTransportCompany")}
              </p>
            </div>
            <div className="flex flex-row flex-wrap gap-[10px]">
              {!companyUser && (
                <Button
                  startIcon={<TrashBinIcon />}
                  className={
                    "bg-error-600 h-[35px] w-[90px] hover:bg-error-700"
                  }
                  onClick={() => openModal()}
                >
                  {companyIdTrans("Delete")}
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 w-full">
            <div className="p-4">
              <div className="flex flex-row flex-wrap gap-[25px] items-center">
                <Image
                  src={company?.logo || "/images/user/user.png"}
                  width={200}
                  height={200}
                  alt="company"
                  className="rounded-xl"
                />
                <div className="flex flex-col gap-[0px]">
                  <h4 className="bd-20 !text-[30px] !leading-[35px]">
                    {company?.name}
                  </h4>
                  <p className="med-18">{company?.email}</p>
                </div>
              </div>
            </div>
            <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
              <div className="col-span-2 flex flex-row md:gap-[35px]  border-t border-t-[#D5D6DD] dark:border-t-gray-500 py-5">
                <p className="med-15 w-[20ch] ">
                  {companyIdTrans("TotalTransportationsCreated")}
                </p>
                <p className="bk-14 w-max">
                  {company?.totalTransportations || 0}
                </p>
              </div>
              <div className="col-span-2 flex flex-row gap-[35px] border-t border-t-[#D5D6DD] dark:border-t-gray-500 py-5">
                <p className="med-15 w-[20ch] ">{companyIdTrans("Address")}</p>
                <p className="bk-14 w-max">
                  {company?.address || companyIdTrans("NA")}
                </p>
              </div>
              <div className="col-span-2 flex flex-row gap-[35px] border-t border-t-[#D5D6DD] dark:border-t-gray-500 py-5">
                <p className="med-15 w-[20ch] ">
                  {companyIdTrans("VehicleType")}
                </p>
                {company?.vehicleType && (
                  <VehicleTypeShower name={company?.vehicleType} />
                )}
              </div>
              <div className="col-span-2 flex flex-row gap-[35px] border-t border-t-[#D5D6DD] dark:border-t-gray-500 py-5">
                <p className="med-15 w-[20ch] ">{companyIdTrans("Users")}</p>
                <p className="bk-14 w-max">{company?.users?.length || 0}</p>
              </div>
              <div className="col-span-2 flex flex-row gap-[35px] border-t border-t-[#D5D6DD] dark:border-t-gray-500 py-5">
                <p className="med-15 w-[20ch] ">
                  {companyIdTrans("CreatedAt")}
                </p>
                <p className="bk-14 w-max">
                  {new Date(company?.createdAt || "NA").toDateString()}
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="med-20 dark:!text-gray-300">
                {companyIdTrans("CompanyUsers")}
              </p>
              <div className="flex flex-col mt-[20px] rounded-xl bg-[#F9FAFA] dark:bg-gray-900">
                {company?.users?.map((it, index) => (
                  <div
                    onClick={() => router.push("/users/" + it._id)}
                    key={index}
                    className="px-4 cursor-pointer"
                  >
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
                      <div className="hidden shrink-0 md:block">
                        <button className="text-base font-medium leading-normal underline bk-16 !text-brand-400 underline-offset-2">
                          {companyIdTrans("ViewProfile")}
                        </button>
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
          loadingText={companyIdTrans("LoadingCompany")}
          loadingDesc={companyIdTrans("GettingCompanyFromServer")}
          heading={companyIdTrans("CompanyNotFound")}
          desc={companyIdTrans("CompanyNotFoundDesc")}
        />
      )}
      {!companyUser && (
        <ModelActions
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-md m-4"
          selectedIds={[1]}
          type={companyIdTrans("Delete")}
          name={companyIdTrans("Company")}
          loading={loading}
          clickFunc={deleteCompanyFunc}
          des={companyIdTrans("ThisActionCannotBeUndone")}
        />
      )}
    </div>
  );
};

export default page;
