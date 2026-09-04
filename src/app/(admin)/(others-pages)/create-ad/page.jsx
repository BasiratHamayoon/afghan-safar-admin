"use client";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { ContextAdmin } from "@/context/MainStateAdmin";
import React, { useActionState, useContext, useState } from "react";
import getDataBlob from "@/util/getDataBlob";
import { useTranslations } from "next-intl";
import Checkbox from "@/components/form/input/Checkbox";
const page = () => {
  const createADTrans = useTranslations("createAD");
  const [paymentScreen, setPaymentScreen] = useState(false);

  const { createAd } = useContext(ContextAdmin);
  const [adImageFile, setadImageFile] = useState(null);
  const [state, action, isPending] = useActionState(async (st, formData) => {
    const data = {
      title: formData.get("title") || undefined,
      link: formData.get("link") || undefined,
      paymentScreen: paymentScreen,
    };
    if (!adImageFile) {
      return {
        success: false,
        message: "Please provide ad image.",
      };
    }

    data.adImg = await getDataBlob(adImageFile);

    const res = await createAd(data);

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
          {createADTrans("CreateAd")}
        </h3>
      </div>

      <form action={action} className="flex flex-col">
        <div className="grid grid-cols-1 gap-4 mb-3 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <div className="col-span-2 ">
            <Label>{createADTrans("AdTitleOptional")}</Label>
            <Input
              type="text"
              defaultValue={state?.title}
              required={false}
              name={"title"}
              id={"title"}
              placeholder={createADTrans("EnterAdTitle")}
            />
          </div>
          <div className="col-span-2">
            <Label>{createADTrans("AdImage")}</Label>
            <DropzoneComponent
              setprofileImg={setadImageFile}
              dimensionRule={true}
            />
          </div>
          <div className="col-span-2">
            <Label>{createADTrans("DestinationUrlOptional")}</Label>
            <Input
              type="text"
              defaultValue={state?.link}
              required={false}
              name={"link"}
              id={"link"}
              placeholder={createADTrans("EnterDestinationUrl")}
              maxLength={500}
            />
          </div>
          <div className="flex flex-row col-span-2 gap-[24px]">
            <Label>{createADTrans("PaymentScreen")}</Label>
            <Checkbox checked={paymentScreen} onChange={setPaymentScreen} />
          </div>
        </div>

        {state && (
          <Alert
            message={state.message}
            title={
              state.success ? createADTrans("Success") : createADTrans("Error")
            }
            variant={state.success ? "success" : "error"}
          />
        )}
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" disabled={isPending} type="submit">
            {createADTrans("CreateAd")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;
