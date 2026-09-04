import React, { useState } from "react";
import { EyeCloseIcon, EyeIcon, PlusIcon } from "@/icons";
import Input from "./InputField";

const InputPassword = ({ defaultValue }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input
        required={true}
        type={showPassword ? "text" : "password"}
        placeholder="Enter password"
        name={"password"}
        id={"password"}
        defaultValue={defaultValue}
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
  );
};

export default InputPassword;
