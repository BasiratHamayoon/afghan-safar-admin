"use client";
import React, {
  Fragment,
  useActionState,
  useContext,
  useEffect,
  useState,
} from "react";
import { ContextAdmin } from "@/context/MainStateAdmin";
import RadioSm from "../form/input/RadioSm";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Alert from "../ui/alert/Alert";
import Button from "../ui/button/Button";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
const NotificationSender = () => {
  const notificationSender = useTranslations("notificationSender");
  const searchParams = useSearchParams();
  const {
    sendNotification,
    sendWebNotification,
    companyUser,
    sendNotificationCompanyUser,
  } = useContext(ContextAdmin);
  const [showerror, setshowerror] = useState(false);
  const [sentTo, setSentTo] = useState({
    app: {
      "All Passengers": false,
      "All Drivers": false,
      "Specific Users": false,
    },
    web: {
      "All Moderators": false,
      "All Transportations Company Users": false,
      "Specific Moderators": false,
      "Specific Transportations Company Users": false,
    },
  });
  const [sendIn, setSendIn] = useState("app");

  const [state, action, isPending] = useActionState(
    async (prevSt, formData) => {
      if (companyUser) {
        const parseddata = await sendNotificationCompanyUser({
          title: formData.get("title"),
          message: formData.get("message"),
          specificEmails: formData.get("emails"),
        });
        return parseddata;
      } else {
        if (sendIn === "app") {
          const parseddata = await sendNotification({
            title: formData.get("title"),
            message: formData.get("message"),
            type: sentTo.app["Specific Users"] ? "specific" : "all",
            target: sentTo.app["All Passengers"]
              ? "passenger"
              : sentTo.app["All Drivers"]
              ? "driver"
              : "specificUser",
            specificEmails: formData.get("emails"),
          });

          return parseddata;
        } else {
          const parseddata = await sendWebNotification({
            title: formData.get("title"),
            message: formData.get("message"),
            type:
              sentTo.web["All Moderators"] ||
              sentTo.web["All Transportations Company Users"]
                ? "all"
                : "specific",
            target: sentTo.web["All Moderators"]
              ? "moderator"
              : sentTo.web["All Transportations Company Users"]
              ? "transport_company_user"
              : "specificUser",
            specificEmails: formData.get("emails"),
          });

          return parseddata;
        }
      }
    }
  );

  useEffect(() => {
    setSentTo({
      app: {
        "All Passengers": false,
        "All Drivers": false,
        "Specific Users": searchParams.get("to") == "app",
      },
      web: {
        "All Moderators": false,
        "All Transportations Company Users": false,
        "Specific Users": searchParams.get("to") == "web",
      },
    });

    setSendIn(searchParams.get("to") || "app");
  }, [searchParams]);

  return (
    <>
      <form
        action={action}
        className="flex lg:flex-row w-full gap-[35px] flex-col"
      >
        <div className="flex flex-col gap-[18px] max-w-[600px] w-full">
          <Input
            type="text"
            placeholder={notificationSender("Title")}
            required
            name="title"
          />
          <TextArea
            rows={10}
            cols={10}
            name="message"
            placeholder={notificationSender("WriteMessage")}
            required
          />
        </div>
        <div className="flex flex-col w-full gap-[10px]">
          <div className="flex flex-col gap-[10px]">
            <p className="med-16 !text-gray-800 dark:!text-gray-200">
              {notificationSender("Type")}
            </p>
            <div className="flex flex-row gap-[20px]">
              <RadioSm
                label={notificationSender("OnApp")}
                name="inApp"
                id="inApp"
                value={sendIn === "app"}
                checked={sendIn === "app"}
                onChange={() => setSendIn("app")}
              />
              {!companyUser && (
                <RadioSm
                  label={notificationSender("OnWeb")}
                  name="inWeb"
                  id="inWeb"
                  value={sendIn === "web"}
                  checked={sendIn === "web"}
                  onChange={() => setSendIn("web")}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="med-16 !text-gray-800 dark:!text-gray-200">
              {notificationSender("SendTo")}
            </p>
            <div className="flex flex-col flex-wrap gap-x-[20px] gap-y-[15px] mt-[15px] max-w-[650px] w-full">
              {!companyUser &&
                Object.keys(sentTo[sendIn]).map((it, index) => (
                  <Fragment key={index}>
                    <CheckBoxTitle
                      title={notificationSender(it.replace(/\s+/g, ""))}
                      checked={sentTo[sendIn][it]}
                      func={() =>
                        setSentTo((prev) => {
                          let updated = {
                            ...prev,
                          };
                          Object.keys(updated[sendIn]).forEach(
                            (key) => (updated[sendIn][key] = false)
                          );

                          updated[sendIn][it] = !prev[sendIn][it];

                          return { ...updated };
                        })
                      }
                    />
                  </Fragment>
                ))}
              {((sendIn === "app" && sentTo.app["Specific Users"]) ||
                companyUser) && (
                <>
                  <TextArea
                    defaultValue={
                      searchParams.get("to") == "app"
                        ? searchParams.get("email")
                        : ""
                    }
                    placeholder={notificationSender("UserEmail")}
                    maxLength={500}
                    minLength={20}
                    required
                    name={"emails"}
                    id="emails"
                  />
                  <span className="bk-14 !text-success-500">
                    {notificationSender("WriteUserEmailsHelp")}
                  </span>
                </>
              )}
              {sendIn === "web" && sentTo.web["Specific Users"] && (
                <>
                  <TextArea
                    defaultValue={
                      searchParams.get("to") == "web"
                        ? searchParams.get("email")
                        : ""
                    }
                    name={"emails"}
                    id="emails"
                    placeholder={notificationSender("UserEmail")}
                    maxLength={500}
                    minLength={20}
                    required
                  />
                  <span className="bk-14 !text-success-500">
                    {notificationSender("WriteUserEmailsHelp")}
                  </span>
                </>
              )}
            </div>
            <Button
              disabled={isPending}
              type={"primary"}
              size={"md"}
              className={"mt-[20px]"}
            >
              {notificationSender("SendNotification")}
            </Button>
          </div>
        </div>
      </form>
      {state && (
        <Alert
          className="mt-[10px]"
          message={state?.message || notificationSender("SomeErrorOccurred")}
          title={
            state?.success
              ? notificationSender("Success")
              : notificationSender("Error")
          }
          variant={state?.success ? "success" : "error"}
        />
      )}
    </>
  );
};

export default NotificationSender;

const CheckBoxTitle = ({ title, checked, func }) => {
  return (
    <div className="flex flex-row items-center gap-[8px] ">
      <RadioSm
        value={checked}
        onChange={func}
        label={title}
        name={title}
        checked={checked}
      />
    </div>
  );
};
