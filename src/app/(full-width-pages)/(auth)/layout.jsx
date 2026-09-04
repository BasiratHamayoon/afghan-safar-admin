import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import MainStateAdmin from "@/context/MainStateAdmin";

export default function AuthLayout({ children }) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
          {children}
          <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
            <div className="relative flex items-center justify-center z-1">
              <GridShape />
              <div className="flex flex-col items-center max-w-xs">
                <div className="flex-col flex gap-[10px] items-center justify-center">
                  <Image
                    src={"/images/icons/logo.png"}
                    alt="logo"
                    className="w-[120px] h-[90px]"
                    width={120}
                    height={90}
                    quality={100}
                  />
                  <h1 className="y-32 !text-white">Afghan Safar</h1>
                </div>
                <p className="text-center text-gray-400 dark:text-white/60 mt-[20px]">
                  Welcome to the Afghan Safar Admin Panel Manage bookings,
                  users, and transportation services with ease.
                </p>
              </div>
            </div>
          </div>
          <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
