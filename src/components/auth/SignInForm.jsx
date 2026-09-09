"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ContextAdmin } from "@/context/MainStateAdmin";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useActionState, useContext, useState } from "react";
import ErrorText from "@/components/form/ErrorText";

export default function SignInForm() {
  const { signIn } = useContext(ContextAdmin);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [state, action, isPending] = useActionState(async (st, formData) => {
    try {
      const rawEmail = formData.get("email");
      const rawPassword = formData.get("password");

      const data = {
        email: rawEmail ? rawEmail.toString().trim().toLowerCase() : "",
        password: rawPassword ? rawPassword.toString().trim() : "",
      };

      const res = await signIn(data);

      if (res?.success) {
        // Full window navigation ensures cookies are committed before dashboard loads
        window.location.href = "/";
        return null;
      }

      return res?.msg || res?.message || "Invalid email or password.";
    } catch (err) {
      console.error("Login submission error:", err);
      return "Something went wrong. Please check your network connection.";
    }
  }, null);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to access the admin dashboard!
            </p>
          </div>

          <div>
            <form action={action}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    required={true}
                    placeholder="admin@gmail.com"
                    type="email"
                    name="email"
                    id="email"
                  />
                </div>

                <div>
                  <Label htmlFor="password">
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      required={true}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                      id="password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                </div>

                {state && <ErrorText text={state} />}

                <div>
                  <Button disabled={isPending} className="w-full" size="sm">
                    {isPending ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}