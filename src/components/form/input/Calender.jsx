"use client";
import React, { useEffect } from "react";
import "react-datetime/css/react-datetime.css";
import { ChevronLeftIcon } from "@/icons";

export default function BasicDateCalendar({ setselectedDate }) {
  useEffect(() => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    const day = document.querySelector(".calendar-dates");
    const currdate = document.querySelector(".calendar-current-date");
    const prenexIcons = document.querySelectorAll(".calendar-navigation span");
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const eventLisnerAdder = () => {
      const lis = document.querySelectorAll(".calendar-dates li");
      const Cdate = document.querySelector(".calendar-current-date").innerText;
      lis.forEach((it) => {
        it.addEventListener("click", (e) => {
          if (!it.className.includes("inactive")) {
            const SDate =
              Cdate.slice(0, Cdate.indexOf(",")) +
              " " +
              e.target.innerText.toString() +
              "," +
              " " +
              Cdate.slice(Cdate.indexOf(",") + 1);
            setselectedDate(SDate);
            const PreviousSelected = document.querySelector(".selectedLI");
            if (PreviousSelected != null) {
              PreviousSelected.classList.remove("selectedLI");
              PreviousSelected.style.color = "black";
            }
            it.classList.add("selectedLI");
            it.style.color = "white";
          }
        });
      });
    };
    const manipulate = () => {
      let dayone = new Date(year, month, 1).getDay();
      let lastdate = new Date(year, month + 1, 0).getDate();
      let dayend = new Date(year, month, lastdate).getDay();
      let monthlastdate = new Date(year, month, 0).getDate();
      let lit = "";
      for (let i = dayone; i > 0; i--) {
        lit += `<li  style="color : gray ; font-weight : 400" class="inactive">${
          monthlastdate - i + 1
        }</li>`;
      }
      for (let i = 1; i <= lastdate; i++) {
        let isToday =
          i === date.getDate() &&
          month === new Date().getMonth() &&
          year === new Date().getFullYear()
            ? true
            : false;
        lit += `<li style="color : black; ${
          isToday && "color: #2DB473"
        } " >${i}</li>`;
      }
      currdate.innerText = `${months[month]},${year}`;
      day.innerHTML = lit;
    };

    manipulate();
    eventLisnerAdder();
    prenexIcons.forEach((icon) => {
      icon.addEventListener("click", () => {
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;
        if (month < 0 || month > 11) {
          date = new Date(year, month, new Date().getDate());

          year = date.getFullYear();

          month = date.getMonth();
        } else {
          date = new Date();
        }
        manipulate();
        eventLisnerAdder();
      });
    });
  }, []);

  return (
    <>
      <div className="max-w-[21rem] larger:max-w-[16rem] med:max-w-[15rem] small:max-w-full w-full flex justify-start items-center">
        <div className="w-full max-w-[18.5rem] larger:max-w-[16rem] med:max-w-[15rem] small:max-w-full h-[10rem] small:h-auto relative flex justify-start flex-col items-center ">
          <header className="relative flex items-center justify-between w-full calendar-navigation">
            <span
              id="calendar-prev"
              className="flex items-center justify-center rounded-full cursor-pointer w-7 h-7"
            >
              <ChevronLeftIcon />
            </span>
            <p className="calendar-current-date font-pm font-med text-[0.95rem] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  "></p>
            <span
              id="calendar-next"
              className="flex justify-center items-center w-7 h-7 rounded-full  scale-[-1] cursor-pointer"
            >
              <ChevronLeftIcon />
            </span>
          </header>

          <div className="flex flex-col items-center justify-center w-full calendar-body">
            <ul className="flex w-full justify-between items-center font-pm [&>li]:text-[0.9rem] [&>li]:text-gray-500 text-center gap-0 [&>li]:w-5 px-1 mt-4 ">
              <li>S</li>
              <li>M</li>
              <li>T</li>
              <li>W</li>
              <li>T</li>
              <li>F</li>
              <li>S</li>
            </ul>
            <ul
              className="calendar-dates flex justify-start items-center flex-wrap 
            [&>li]:text-[0.9rem] [&>li]:font-med text-center gap-[1.53rem] med:gap-[0.95rem] mt-3 gap-y-[0.9rem] larger:gap-y-[0.3rem] med:gap-y-[0.7rem] [&>li]:w-5 px-1 
            hover:[&>li]:!text-white  small:gap-x-0 small:w-full
            "
            ></ul>
          </div>
        </div>
      </div>
    </>
  );
}
