"use client";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { ContextAdmin } from "@/context/MainStateAdmin";
import React, { useActionState, useContext, useEffect, useState } from "react";
import InputPassword from "@/components/form/input/InputPassword";
import getDataBlob from "@/util/getDataBlob";
import BtnGender from "@/components/ui/button/BtnGender";
import { useTranslations } from "next-intl";
const page = () => {
  const addTravelAgentPageTrans = useTranslations("addTravelAgentPage");
  const { addTravelAgent, loading } = useContext(ContextAdmin);
  const [selectedGender, setSelectedGender] = useState("Male");
  const [profileImgFile, setprofileImgFile] = useState(null);
  const [state, action, isPending] = useActionState(async (st, formData) => {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      firstName: formData.get("first_name"),
      lastName: formData.get("last_name"),
      phone: formData.get("phone"),
      gender: selectedGender.toLowerCase(),
      bio: formData.get("bio"),
      profileImg: state?.profileImg,
    };
    if (!profileImgFile) {
      return {
        success: false,
        message: "Please provide profile image for moderator",
      };
    }
    if (!data.profileImg) {
      data.profileImg = await getDataBlob(profileImgFile);
    }

    const res = await addTravelAgent(data);

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
      <div className="flex flex-col mb-5 gap-[]">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90 ">
          {addTravelAgentPageTrans("AddTravelAgent")}
        </h3>
        <p className=" bk-16 !text-gray-800 dark:!text-gray-300 text-base font-normal leading-normal">
          {addTravelAgentPageTrans("des")}
        </p>
      </div>
      <form action={action} className="flex flex-col">
        <div className="grid grid-cols-1 mb-9 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="col-span-2">
            <Label>{addTravelAgentPageTrans("ProfileImage")}</Label>
            <DropzoneComponent setprofileImg={setprofileImgFile} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-3 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <div className="col-span-2 lg:col-span-1">
            <Label>{addTravelAgentPageTrans("FirstName")}</Label>
            <Input
              type="text"
              defaultValue={state?.firstName}
              required={true}
              name={"first_name"}
              id={"first_name"}
              placeholder={addTravelAgentPageTrans("EnterFirstName")}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>{addTravelAgentPageTrans("LastName")}</Label>
            <Input
              type="text"
              defaultValue={state?.lastName}
              required={true}
              name={"last_name"}
              id={"last_name"}
              placeholder={addTravelAgentPageTrans("EnterLastName")}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>{addTravelAgentPageTrans("Email")}</Label>
            <Input
              type="email"
              defaultValue={state?.email}
              required={true}
              name={"email"}
              id={"email"}
              placeholder={addTravelAgentPageTrans("EnterEmail")}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>{addTravelAgentPageTrans("Password")}</Label>
            <InputPassword
              defaultValue={state?.password}
              placeholder={addTravelAgentPageTrans("EnterPassword")}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>{addTravelAgentPageTrans("Phone")}</Label>
            <Input
              type="tel"
              placeholder={addTravelAgentPageTrans("EnterPhone")}
              defaultValue={state?.phone}
              required={true}
              name={"phone"}
              id={"phone"}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>{addTravelAgentPageTrans("Gender")}</Label>
            <div className="flex flex-row gap-[10px]">
              {["Male", "Female", "Other"].map((it, index) => (
                <BtnGender
                  key={index}
                  title={addTravelAgentPageTrans(it)}
                  selected={selectedGender === it}
                  clickFunc={() => setSelectedGender(it)}
                />
              ))}
            </div>
          </div>

          <div className="col-span-2 lg:col-span-2">
            <Label>{addTravelAgentPageTrans("Bio")}</Label>
            <TextArea
              type="text"
              defaultValue={state?.bio}
              required={true}
              placeholder={addTravelAgentPageTrans("EnterBio")}
              name="bio"
              id="bio"
              maxLength={20}
            />
          </div>
        </div>

        {state && (
          <Alert
            message={state.message}
            title={
              state.success
                ? addTravelAgentPageTrans("Success")
                : addTravelAgentPageTrans("Error")
            }
            variant={state.success ? "success" : "error"}
          />
        )}
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" disabled={isPending} type="submit">
            {addTravelAgentPageTrans("AddTravelAgent")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;
