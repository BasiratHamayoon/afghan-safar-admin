"use client";
import { fetchServer, getCookie, setCookie } from "@/actions";
import ErrorText from "../../../components/form/ErrorText";
import React, { useActionState, useState } from "react";
import { CheckLineIcon } from "@/icons";

const page = () => {
  const [checked, setchecked] = useState(false);
  const [error, action, loading] = useActionState(
    async (prevState, formData) => {
      const detReq = await getCookie("detReq");
      if (detReq) {
        return "Already submitted!";
      }

      const parsedData = await JSON.parse(
        await fetchServer(
          "/users/req-for-account-deletion",
          "DELETE",
          {
            email: formData.get("email"),
            password: formData.get("password"),
          },
          {}
        )
      );
      await setCookie("detReq", true);

      return parsedData.message;
    }
  );

  return (
    <>
      <div className="flex flex-col h-span-screen">
        <div
          id="flow-view"
          className="flex flex-col items-center justify-center w-full h-span-screen"
        >
          <div
            className="flex flex-col justify-between w-full h-full overflow-hidden sc-713ca847-1 yyxen"
            id="widget-layout-container"
          >
            <div className="flex flex-col justify-between w-full h-full overflow-hidden fillout-live-mode">
              <div className="relative flex flex-col w-full h-full overflow-y-auto">
                <form
                  action={action}
                  className="flex flex-col items-center w-full h-full sm:pb-4"
                  id="form-step-widgets-container"
                >
                  <div className="flex justify-center w-full pb-6 sm:pb-20">
                    <div
                      id="question-container"
                      className="w-full flex flex-col sm:rounded-lg relative mt-0 py-[2px] px-2 z-10 fillout-field-container"
                      style={{
                        background: "rgb(247, 247, 246)",
                        maxWidth: 709,
                      }}
                    >
                      <div
                        className="relative flex justify-center w-full h-full"
                        id="step-transition-container"
                      >
                        <div
                          style={{
                            opacity: 1,
                            width: "100%",
                            height: "100%",
                            transition: "0.2s linear",
                          }}
                        >
                          <div
                            id="question-alignment-container"
                            className="flex flex-col w-full h-full mt-0"
                          >
                            <div className="relative flex flex-col w-full h-full sm:flex-row">
                              <div className="w-full min-w-0">
                                <div className="pl-5">
                                  <div
                                    className="pr-5 border-2 border-transparent fillout-field-paragraph"
                                    id="widget-mXZsfsbCgzngsRCLzKCnZg"
                                    style={{
                                      paddingTop: 16,
                                      paddingBottom: 16,
                                    }}
                                  >
                                    <div data-cy="text-widget">
                                      <div className="relative w-full">
                                        <div className="sc-5ef7a648-0">
                                          <div
                                            color="rgba(44, 44, 44, 1)"
                                            className="sc-2d939baa-0 hvAnXy"
                                          >
                                            <div className="relative">
                                              <div className="sc-3b761142-0 gTLxJF">
                                                <div
                                                  id="mXZsfsbCgzngsRCLzKCnZg-label"
                                                  className="ql-editor !block w-full !bg-none !shadow-none !border-none !p-0"
                                                  style={{
                                                    border: "none",
                                                    background: "transparent",
                                                  }}
                                                >
                                                  <h2 className="ql-align-center">
                                                    <span
                                                      style={{
                                                        color:
                                                          "rgb(22, 101, 52)",
                                                      }}
                                                    >
                                                      Please enter your login
                                                      details.
                                                    </span>
                                                  </h2>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="relative flex flex-col w-full h-full sm:flex-row">
                              <div className="w-full min-w-0">
                                <div className="pl-5 -mr-1">
                                  <div
                                    className="pr-5 border-2 border-transparent fillout-field-short-answer"
                                    id="widget-vxwUGejE5qcL3TsKiv7ZVi"
                                    style={{
                                      paddingTop: 16,
                                      paddingBottom: 16,
                                    }}
                                  >
                                    <div
                                      className="flex flex-col"
                                      data-cy="widget-with-label"
                                    >
                                      <div className="w-full font-medium mb-[9px]">
                                        <div className="flex items-center justify-between w-full fillout-field-label">
                                          <div className="relative w-full">
                                            <div className="sc-5ef7a648-0">
                                              <div
                                                color="rgba(44, 44, 44, 1)"
                                                className="sc-2d939baa-0 cIKPIL"
                                              >
                                                <div className="relative">
                                                  <div className="sc-3b761142-0 gTLxJF">
                                                    <div
                                                      id="vxwUGejE5qcL3TsKiv7ZVi-label"
                                                      className="ql-editor !block w-full !bg-none !shadow-none !border-none !p-0"
                                                      style={{
                                                        border: "none",
                                                        background:
                                                          "transparent",
                                                      }}
                                                    >
                                                      <p>
                                                        <span
                                                          style={{
                                                            color:
                                                              "var(--tw-prose-bold)",
                                                          }}
                                                        >
                                                          Email:
                                                        </span>
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="sc-c544b881-8 bWAcfM">
                                        <div className="relative w-full ">
                                          <input
                                            data-cy="input-component"
                                            type="email"
                                            name="email"
                                            className="block w-full text-sm h-[50px] pl-[10px] border-gray-300 rounded shadow-sm"
                                            placeholder=""
                                            aria-label="Email:"
                                            aria-required="true"
                                            defaultValue=""
                                            required
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="w-full min-w-0">
                                <div className="pl-5 !sm:pl-4">
                                  <div
                                    className="pr-5 border-2 border-transparent fillout-field-password"
                                    id="widget-bswZvNKjK5oXD62wzoRGn9"
                                    style={{
                                      paddingTop: 16,
                                      paddingBottom: 16,
                                    }}
                                  >
                                    <div
                                      className="flex flex-col"
                                      data-cy="widget-with-label"
                                    >
                                      <div className="w-full font-medium mb-[9px]">
                                        <div className="flex items-center justify-between w-full fillout-field-label">
                                          <div className="relative w-full">
                                            <div className="sc-5ef7a648-0">
                                              <div
                                                color="rgba(44, 44, 44, 1)"
                                                className="sc-2d939baa-0 cIKPIL"
                                              >
                                                <div className="relative">
                                                  <div className="sc-3b761142-0 gTLxJF">
                                                    <div
                                                      id="bswZvNKjK5oXD62wzoRGn9-label"
                                                      className="ql-editor !block w-full !bg-none !shadow-none !border-none !p-0"
                                                      style={{
                                                        border: "none",
                                                        background:
                                                          "transparent",
                                                      }}
                                                    >
                                                      <p>Password:</p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="sc-c544b881-8 bWAcfM">
                                        <div className="relative w-full ">
                                          <input
                                            data-cy="input-component"
                                            type="password"
                                            name="password"
                                            maxLength={25}
                                            minLength={5}
                                            className="block w-full text-sm border-gray-300 rounded shadow-sm h-[50px] pl-[10px]"
                                            placeholder=""
                                            autoComplete="current-password"
                                            aria-required="true"
                                            defaultValue=""
                                            required
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="relative flex flex-col w-full h-full sm:flex-row">
                              <div className="w-full min-w-0">
                                <div className="pl-5">
                                  <div
                                    className="pr-5 border-2 border-transparent fillout-field-checkbox"
                                    id="widget-nEvnbvAsGEK1CjtMoa14LL"
                                    style={{
                                      paddingTop: 16,
                                      paddingBottom: 16,
                                    }}
                                  >
                                    <div className="flex flex-col">
                                      <div className="flex">
                                        <div className="relative flex items-center w-full">
                                          <div className="flex items-center h-5 sc-6ba390ab-0 jLUxZa">
                                            <button
                                              onClick={() =>
                                                setchecked(!checked)
                                              }
                                              type="button"
                                              role="checkbox"
                                              data-cy="checkbox-component"
                                              className="rounded border-[1.5px] focus:ring-2 focus:ring-offset-2 flex justify-center items-center h-4 w-4"
                                              aria-labelledby="nEvnbvAsGEK1CjtMoa14LL-label"
                                              aria-checked="false"
                                              style={{
                                                background:
                                                  "rgb(255, 255, 255)",
                                                borderColor:
                                                  "rgba(48, 47, 47, 0.2)",
                                              }}
                                            >
                                              {checked && <CheckLineIcon />}
                                            </button>
                                          </div>
                                          <div className="w-full ml-3 text-sm">
                                            <div className="w-full font-medium">
                                              <div className="relative w-full">
                                                <div className="sc-5ef7a648-0">
                                                  <div
                                                    color="rgba(44, 44, 44, 1)"
                                                    className="sc-2d939baa-0 cIKPIL"
                                                  >
                                                    <div className="relative">
                                                      <div className="sc-3b761142-0 gTLxJF">
                                                        <div
                                                          id="nEvnbvAsGEK1CjtMoa14LL-label"
                                                          className="ql-editor !block w-full !bg-none !shadow-none !border-none !p-0"
                                                          style={{
                                                            border: "none",
                                                            background:
                                                              "transparent",
                                                          }}
                                                        >
                                                          <p>
                                                            By deleting this
                                                            account you agree to
                                                            Afghan Safar Terms
                                                            Conditions. Once the
                                                            account deletion
                                                            process is
                                                            initiated, it cannot
                                                            be reversed, and you
                                                            will no longer have
                                                            access to your
                                                            account or
                                                            associated features.
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="relative flex flex-col w-full h-full ">
                              {error && (
                                <div className="pl-[40px] small:pl-[10px]">
                                  <ErrorText text={error} />
                                </div>
                              )}

                              <div className="w-full min-w-0">
                                <div className="pl-5">
                                  <div
                                    className="pr-5 border-2 border-transparent fillout-field-button"
                                    id="widget-1K9Vy1KpvBQd58mz1J8ZDS"
                                    style={{
                                      paddingTop: 16,
                                      paddingBottom: 16,
                                    }}
                                  >
                                    <div className="flex justify-center w-full space-x-2">
                                      <div
                                        className="flex justify-center sc-c544b881-1 eHQSGe"
                                        id="div-to-center-for-centered-style"
                                      >
                                        <button
                                          data-cy="button-component"
                                          type="submit"
                                          disabled={!checked}
                                          className="items-center disabled:cursor-not-allowed leading-4 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 py-1.5 w-full sm:w-auto flex justify-center  shadow min-h-[42px] sm:min-h-[38px] border-transparent rounded-none border px-4"
                                          style={{
                                            background: checked
                                              ? "rgb(9, 66, 54)"
                                              : "rgba(9, 66, 54, 0.5)",
                                            color: "white",
                                            fontSize: "1rem",
                                            lineHeight: "1.4em",
                                            fontWeight: 500,
                                          }}
                                        >
                                          <span className="max-w-full overflow-hidden">
                                            <div className="ant-space ant-space-vertical">
                                              <div className="ant-space-item">
                                                <div>Delete my account</div>
                                              </div>
                                            </div>
                                          </span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
