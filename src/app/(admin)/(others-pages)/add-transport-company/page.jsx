"use client";
import ErrorText from "@/components/form/ErrorText";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import Input from "@/components/form/input/InputField";
import InputPassword from "@/components/form/input/InputPassword";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Alert from "@/components/ui/alert/Alert";
import BtnGender from "@/components/ui/button/BtnGender";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import UserCard from "@/components/user-profile/UserCard";
import { ContextAdmin } from "@/context/MainStateAdmin";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";
import { useModal } from "@/hooks/useModal";
import { EyeCloseIcon, EyeIcon, PlusIcon } from "@/icons";
import React, { useActionState, useContext, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const page = () => {
  const addCompanyTrans = useTranslations("addCompnayPage");
  const { userDetails, addUserToCompany } = useContext(ContextAdmin);
  const { isOpen, openModal, closeModal } = useModal();
  const [profileImg, setprofileImg] = useState(false);
  const [selectedGender, setSelectedGender] = useState(false);
  const [userProfileImg, setuserProfileImg] = useState(false);
  const [selectedUser, setselectedUser] = useState(false);
  const [users, setusers] = useState([]);
  const [userErrors, setUserErrors] = useState(false);
  const [userState, userAction, userIspending] = useActionState(
    async (st, formData) => {
      const data = {
        email: formData.get("email"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phone: formData.get("phone"),
        bio: formData.get("bio"),
        password: formData.get("password"),
        profileImg: userProfileImg && URL.createObjectURL(userProfileImg),
        profileImgFile: userProfileImg,
        gender: selectedGender,
      };

      var repeated = false;
      const checks = ["email", "phone"];
      [...users, userDetails].forEach((it, index) => {
        console.log(it);
        repeated =
          checks.some((ele) => data[ele] === it[ele]) && selectedUser !== index;
      });

      if (repeated) {
        console.log(repeated);
        setUserErrors(true);
        return {
          success: false,
          msg: `Used this email or phone with a user of this company!`,
        };
      }

      if (selectedUser !== false) {
        setusers((e) => {
          e[selectedUser] = data;
          return e;
        });
      } else {
        setusers((e) => [...e, data]);
      }
      closeModalFunc();
    }
  );
  const [state, action, isPending] = useActionState(async (st, formData) => {
    const tempUsers = users;
    const data = {
      email: formData.get("email"),
      name: formData.get("company_name"),
      phone: formData.get("phone"),
      vehicleType: formData.get("vehicle_type"),
      address: formData.get("address"),
    };
    if (tempUsers.length < 1)
      return {
        success: false,
        msg: "Add atleast one user to the company!",
        ...data,
      };
    let promises = [];
    for (const user of tempUsers) {
      console.log(user);
      if (
        user?.profileImg &&
        user?.profileImg?.includes("res.cloudinary.com")
      ) {
        promises.push(new Promise((res, rej) => res(user.profileImg)));
      } else if (user.profileImgFile) {
        promises.push(
          new Promise((res, rej) =>
            useCloudinaryUpload(user.profileImgFile).then((response) =>
              res(response)
            )
          )
        );
      }
    }

    const imagesUrl = await Promise.all(promises);

    imagesUrl.forEach((it, index) => {
      tempUsers[index].profileImg = it;
      delete tempUsers[index].profileImgFile;
    });
    if (state?.logo) {
      data.logo = state.logo;
    } else if (profileImg) {
      data.logo = await useCloudinaryUpload(profileImg);
    }

    data.users = tempUsers;

    const res = await addUserToCompany(data);

    if (res.success) {
      setprofileImg(false);
      setusers([]);
      window.location.reload();
      return { success: res.success, msg: res.msg };
    } else {
      const msg = res?.msg || "";
      if (res?.errors) {
        errors.map((it) => {
          msg += ` ${it.msg},`;
        });
      }
      return { success: res.success, msg: msg, ...data };
    }
  });

  const closeModalFunc = () => {
    setselectedUser(false);
    setUserErrors(false);
    closeModal();
  };

  const removeUser = (index) => {
    setusers((e) => {
      const temp = [...e];
      temp.splice(index, 1);
      return [...temp];
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col mb-5 gap-[]">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90 ">
          {addCompanyTrans("AddTransportationCompany")}
        </h3>
        <p className=" bk-16 !text-gray-800 dark:!text-gray-300 text-base font-normal leading-normal">
          {addCompanyTrans("CreateTransportationCompanyDescription")}
        </p>
      </div>

      <form action={action} className="flex flex-col">
        <div className="h-full px-2 pb-3">
          <div className="mt-0">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2">
                <Label>{addCompanyTrans("CompanyImage")}</Label>
                <DropzoneComponent setprofileImg={setprofileImg} />
              </div>
            </div>
            <div>
              <h4 className="mt-6 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6 lg:mt-10">
                {addCompanyTrans("CompanyInformation")}
              </h4>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                <div className="col-span-2 lg:col-span-1">
                  <Label>{addCompanyTrans("CompanyName")}</Label>
                  <Input
                    type="text"
                    defaultValue={state?.name}
                    required={true}
                    name={"company_name"}
                    id={"company_name"}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>{addCompanyTrans("CompanyEmail")}</Label>
                  <Input
                    type="email"
                    defaultValue={state?.email}
                    required={true}
                    name={"email"}
                    id={"email"}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>{addCompanyTrans("CompanyPhone")}</Label>
                  <Input
                    type="phone"
                    defaultValue={state?.phone}
                    required={true}
                    name={"phone"}
                    id={"phone"}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>{addCompanyTrans("CompanyVehicleType")}</Label>
                  <Select
                    defaultValue={state?.vehicleType || "Bus"}
                    name="vehicle_type"
                    id="vehicle_type"
                    options={[
                      { label: addCompanyTrans("Car"), value: "car" },
                      { label: addCompanyTrans("Bus"), value: "bus" },
                      { label: addCompanyTrans("Plane"), value: "plane" },
                      { label: addCompanyTrans("Train"), value: "train" },
                    ]}
                    onChange={() => {}}
                    className=""
                  />
                </div>
                <div className="col-span-2 ">
                  <Label>{addCompanyTrans("CompanyAddress")}</Label>
                  <TextArea
                    type="text"
                    defaultValue={state?.address}
                    required={true}
                    placeholder={addCompanyTrans("EnterAddress")}
                    name="address"
                    id="address"
                    maxLength={100}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-row items-center justify-between mt-6 lg:mt-10">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6 ">
                  {addCompanyTrans("AddUsers")}
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  type={"button"}
                  onClick={() => {
                    openModal();
                  }}
                >
                  {addCompanyTrans("AddUser")}
                </Button>
              </div>
              <div className="flex flex-row flex-wrap gap-[10px]">
                {users.map((it, index) => (
                  <UserCard
                    key={index}
                    details={it}
                    index={index}
                    openDialog={() => {
                      setselectedUser(index);
                      openModal();
                    }}
                    removeUser={removeUser}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {state && (
          <Alert
            message={state.msg}
            title={
              state.success
                ? addCompanyTrans("Success")
                : addCompanyTrans("Error")
            }
            variant={state.success ? "success" : "error"}
          />
        )}
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" disabled={isPending} type="submit">
            {addCompanyTrans("AddCompany")}
          </Button>
        </div>
      </form>
      <Modal
        isOpen={isOpen}
        onClose={closeModalFunc}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {addCompanyTrans("AddUser")}
            </h4>
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400 lg:mb-5">
              {addCompanyTrans("AddUsersToCompanyDescription")}
            </p>
          </div>
          <form action={userAction} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-0">
                <h5 className="mb-2 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-3">
                  {addCompanyTrans("UserInformation")}
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label>{addCompanyTrans("ProfileImage")}</Label>
                    <DropzoneComponent
                      setprofileImg={setuserProfileImg}
                      defaultImage={users[selectedUser]?.profileImg}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>{addCompanyTrans("FirstName")}</Label>
                    <Input
                      type="text"
                      defaultValue={
                        selectedUser !== false
                          ? users[selectedUser]?.firstName
                          : ""
                      }
                      required={true}
                      name={"firstName"}
                      id={"firstName"}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>{addCompanyTrans("LastName")}</Label>
                    <Input
                      type="text"
                      defaultValue={
                        selectedUser !== false
                          ? users[selectedUser]?.lastName
                          : ""
                      }
                      required={true}
                      name={"lastName"}
                      id={"lastName"}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>{addCompanyTrans("EmailAddress")}</Label>
                    <Input
                      type="text"
                      defaultValue={
                        selectedUser !== false ? users[selectedUser]?.email : ""
                      }
                      required={true}
                      name={"email"}
                      id={"email"}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>{addCompanyTrans("Password")}</Label>
                    <InputPassword
                      defaultValue={users[selectedUser]?.password}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>{addCompanyTrans("Phone")}</Label>
                    <Input
                      type="text"
                      defaultValue={
                        selectedUser !== false ? users[selectedUser]?.phone : ""
                      }
                      required={true}
                      name={"phone"}
                      id={"phone"}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>{addCompanyTrans("Role")}</Label>
                    <div className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
                      <span className="">
                        {addCompanyTrans("TransportCompanyUser")}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 ">
                    <Label>{addCompanyTrans("Gender")}</Label>
                    <div className="flex flex-row gap-[10px]">
                      {["Male", "Female", "Other"].map((it, index) => (
                        <BtnGender
                          key={index}
                          title={addCompanyTrans(it)}
                          selected={selectedGender === it}
                          clickFunc={() => setSelectedGender(it)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Label>{addCompanyTrans("Bio")}</Label>
                    <TextArea
                      type="text"
                      defaultValue={
                        selectedUser !== false ? users[selectedUser]?.bio : ""
                      }
                      required={false}
                      name={"bio"}
                      id={"bio"}
                      maxLength={50}
                      placeholder={addCompanyTrans("EnterBio")}
                    />
                  </div>
                </div>
              </div>
            </div>
            {userState && userErrors && (
              <Alert
                message={userState.msg}
                title={
                  userState.success
                    ? addCompanyTrans("Success")
                    : addCompanyTrans("Error")
                }
                variant={userState.success ? "success" : "error"}
              />
            )}
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="md" variant="outline" onClick={closeModalFunc}>
                {addCompanyTrans("Close")}
              </Button>
              <Button size="md" type="submit" disabled={isPending}>
                {selectedUser !== false
                  ? addCompanyTrans("Save")
                  : addCompanyTrans("AddUser")}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default page;
