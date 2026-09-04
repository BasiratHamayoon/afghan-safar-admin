"use client";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { ContextAdmin } from "@/context/MainStateAdmin";
import BtnGender from "@/components/ui/button/BtnGender";
import React, { useActionState, useContext, useEffect, useState } from "react";
import InputPassword from "@/components/form/input/InputPassword";
import Checkbox from "@/components/form/input/Checkbox";
import getDataBlob from "@/util/getDataBlob";
import { useTranslations } from "next-intl";

const page = () => {
  const addModeratorTrans = useTranslations("addModeratorTrans");
  const { addModerator, loading } = useContext(ContextAdmin);
  const [selectedGender, setSelectedGender] = useState("Male");
  const [selectedRights, setSelectedRights] = useState({
    All: false,
    "Add Moderators": false,
    "Edit Moderators": false,
    "Add Drivers": false,
    "Edit Drivers": false,
    "Delete Users": false,
    "Add Transportations": false,
    "Delete Transportations": false,
  });
  const [profileImgFile, setprofileImgFile] = useState(null);
  const [state, action, isPending] = useActionState(async (st, formData) => {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      gender: selectedGender.toLowerCase(),
      bio: formData.get("bio"),
      profileImg: state?.profileImg,
    };
    if (!profileImgFile) {
      return {
        success: false,
        message: "Please provide profile image for moderator",
        ...data,
      };
    }
    if (!data.profileImg) {
      data.profileImg = await getDataBlob(profileImgFile);
    }
    const res = await addModerator(data);

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
          {addModeratorTrans("AddModerators")}
        </h3>
        <p className=" bk-16 !text-gray-800 dark:!text-gray-300 text-base font-normal leading-normal">
          {addModeratorTrans("des")}
        </p>
      </div>
      <form action={action} className="flex flex-col">
        <div className="grid grid-cols-1 mb-9 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="col-span-2">
            <Label>{addModeratorTrans("ProfileImage")}</Label>
            <DropzoneComponent setprofileImg={setprofileImgFile} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-3 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <div className="col-span-2 lg:col-span-1">
            <Label>{addModeratorTrans("FirstName")}</Label>
            <Input
              type="text"
              defaultValue={state?.firstName}
              required={true}
              name={"firstName"}
              id={"firstName"}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>{addModeratorTrans("LastName")}</Label>
            <Input
              type="text"
              defaultValue={state?.lastName}
              required={true}
              name={"lastName"}
              id={"lastName"}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>{addModeratorTrans("Email")}</Label>
            <Input
              type="email"
              defaultValue={state?.email}
              required={true}
              name={"email"}
              id={"email"}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>{addModeratorTrans("Password")}</Label>
            <InputPassword defaultValue={state?.password} />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>{addModeratorTrans("Phone")}</Label>
            <Input
              type="phone"
              defaultValue={state?.phone}
              required={true}
              name={"phone"}
              id={"phone"}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>{addModeratorTrans("Gender")}</Label>
            <div className="flex flex-row gap-[10px]">
              {["Male", "Female", "Other"].map((it, index) => (
                <BtnGender
                  key={index}
                  title={addModeratorTrans(it)}
                  selected={selectedGender === it}
                  clickFunc={() => setSelectedGender(it)}
                />
              ))}
            </div>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>{addModeratorTrans("Bio")}</Label>
            <TextArea
              type="text"
              defaultValue={state?.bio}
              required={true}
              placeholder={addModeratorTrans("EnterBio")}
              name="bio"
              id="bio"
              maxLength={200}
            />
          </div>
          {/* <div className="col-span-2 lg:col-span-2 gap-[10px]">
            <Label className="med-16 ">Permissions</Label>
            <div className="flex flex-col gap-[6px] flex-wrap">
              {[
                "All",
                "Add Moderators",
                "Edit Moderators",
                "Add Drivers",
                "Edit Drivers",
                "Delete Users",
                "Add Transportations",
                "Delete Transportations",
                "Send Notifications",
                "View Payments",
              ].map((it, index) => (
                <Checkbox
                  label={it}
                  key={index}
                  checked={selectedRights[it]}
                  className=""
                  value={it}
                  onChange={() =>
                    setSelectedRights((e) => ({ ...e, [it]: !e[it] }))
                  }
                />
              ))}
            </div>
          </div> */}
        </div>

        {state && (
          <Alert
            message={state.message}
            title={state.success ? "Success" : "Error"}
            variant={state.success ? "success" : "error"}
          />
        )}
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" disabled={isPending} type="submit">
            {addModeratorTrans("AddModerator")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;
