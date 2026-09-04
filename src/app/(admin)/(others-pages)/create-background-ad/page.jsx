"use client";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import TextArea from "@/components/form/input/TextArea";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { ContextAdmin } from "@/context/MainStateAdmin";
import React, { Suspense, useActionState, useContext, useState } from "react";
import getDataBlob from "@/util/getDataBlob";
import { useSearchParams } from "next/navigation";
import Checkbox from "@/components/form/input/Checkbox";
import { useTranslations } from "next-intl";
const page = () => {
  const adBGCreateTrans = useTranslations("adBGCreatePage");
  const { bgCreateAd } = useContext(ContextAdmin);
  const [adImageFile, setadImageFile] = useState(null);
  const [allUsers, setAllUsers] = useState(false);
  const [state, action, isPending] = useActionState(async (st, formData) => {
    const data = {
      title: formData.get("title") || undefined,
      emails: formData.get("emails"),
      all: allUsers,
    };
    if (!adImageFile) {
      return {
        success: false,
        message: "Please provide ad image.",
      };
    }

    data.adImg = await getDataBlob(adImageFile);

    const res = await bgCreateAd(data);

    if (res.success) {
      window.location.reload();
      return {
        success: true,
        message: "Successfully added moderator!",
      };
    } else {
      return {
        success: false,
        message: res.errors ? res.errors : res.message,
        ...data,
      };
    }
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {adBGCreateTrans("CreateAd")}
        </h3>
      </div>

      <form action={action} className="flex flex-col">
        <div className="grid grid-cols-1 gap-4 mb-3 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <div className="col-span-2 ">
            <Label>{adBGCreateTrans("AdTitleOptional")}</Label>
            <Input
              type="text"
              defaultValue={state?.title}
              required={false}
              name={"title"}
              id={"title"}
              placeholder={adBGCreateTrans("EnterAdTitle")}
            />
          </div>
          <div className="col-span-2">
            <Label>{adBGCreateTrans("AdImage")}</Label>
            <DropzoneComponent
              setprofileImg={setadImageFile}
              dimensionRule={true}
            />
          </div>
          <div className="col-span-2">
            <Checkbox
              checked={allUsers}
              label={adBGCreateTrans("AllUsers")}
              onChange={(val) => setAllUsers(val)}
            />
          </div>
          <div className="col-span-2">
            <Label>{adBGCreateTrans("UserEmails")}</Label>
            <Suspense>
              <EmailsText
                state={state}
                all={allUsers}
                text={() => adBGCreateTrans("EnterUserEmails")}
              />
            </Suspense>
            <p className="mt-1 text-sm text-success-500">
              <span className="text-red-500">*</span>{" "}
              {adBGCreateTrans("EnterEmailsHelp")}
            </p>
          </div>
        </div>

        {state && (
          <Alert
            message={state.message}
            title={
              state.success
                ? adBGCreateTrans("Success")
                : adBGCreateTrans("Error")
            }
            variant={state.success ? "success" : "error"}
          />
        )}
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" disabled={isPending} type="submit">
            {adBGCreateTrans("CreateBackgroundAd")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;

const EmailsText = ({ state, all, text }) => {
  const searchParams = useSearchParams();
  return (
    <TextArea
      type="text"
      defaultValue={searchParams.get("emails") || state?.emails}
      required={!all}
      name={"emails"}
      id={"emails"}
      placeholder={text()}
      maxLength={500}
    />
  );
};
