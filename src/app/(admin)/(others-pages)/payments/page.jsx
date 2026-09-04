"use client";
import React, { useEffect, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import Image from "next/image";
import PaymentFilter from "@/components/payment-page/PaymentFilter";

const user = {
  _id: "649b7f88b8c08f6bbf8f2c11",
  email: "jese@example.com",
  password: "hashed_password_1",
  phone: "+92-300-1234567",
  profileImg: "/images/user/user-01.jpg",
  firstName: "Jese",
  lastName: "Leos",
  bio: "Administrator with extensive transport management experience.",
  role: "admin",
  blocked: false,
  createdAt: new Date(),
};

const payments = [
  {
    _id: "660b7f88b8c08f6bbf8f2c01",
    invoice: "INV-1001",
    user: user,
    amount: "5000",
    transactionId: "TXN-ABC123456",
    status: "paid",
    createdAt: new Date("2024-03-01T10:15:30Z"),
  },
  {
    _id: "660b7f88b8c08f6bbf8f2c02",
    invoice: "INV-1002",
    user: user,
    amount: "3200",
    transactionId: "TXN-DEF987654",
    status: "unpaid",
    createdAt: new Date("2024-03-02T12:30:45Z"),
  },
  {
    _id: "660b7f88b8c08f6bbf8f2c03",
    invoice: "INV-1003",
    user: user,
    amount: "7800",
    transactionId: "TXN-GHI456789",
    status: "failed",
    createdAt: new Date("2024-03-03T14:45:20Z"),
  },
  {
    _id: "660b7f88b8c08f6bbf8f2c04",
    invoice: "INV-1004",
    user: user,
    amount: "2500",
    transactionId: "TXN-JKL741258",
    status: "paid",
    createdAt: new Date("2024-03-04T16:00:10Z"),
  },
  {
    _id: "660b7f88b8c08f6bbf8f2c05",
    invoice: "INV-1005",
    user: user,
    amount: "6200",
    transactionId: "TXN-MNO852369",
    status: "unpaid",
    createdAt: new Date("2024-03-05T18:20:05Z"),
  },
  {
    _id: "660b7f88b8c08f6bbf8f2c06",
    invoice: "INV-1006",
    user: user,
    amount: "4700",
    transactionId: "TXN-PQR159753",
    status: "paid",
    createdAt: new Date("2024-03-06T20:35:40Z"),
  },
  {
    _id: "660b7f88b8c08f6bbf8f2c07",
    invoice: "INV-1007",
    user: user,
    amount: "8900",
    transactionId: "TXN-STU753951",
    status: "failed",
    createdAt: new Date("2024-03-07T22:50:25Z"),
  },
  {
    _id: "660b7f88b8c08f6bbf8f2c08",
    invoice: "INV-1008",
    user: user,
    amount: "1500",
    transactionId: "TXN-VWX357159",
    status: "unpaid",
    createdAt: new Date("2024-03-08T01:10:15Z"),
  },
  {
    _id: "660b7f88b8c08f6bbf8f2c09",
    invoice: "INV-1009",
    user: user,
    amount: "3800",
    transactionId: "TXN-YZA951753",
    status: "paid",
    createdAt: new Date("2024-03-09T03:25:50Z"),
  },
  {
    _id: "660b7f88b8c08f6bbf8f2c10",
    invoice: "INV-1010",
    user: user,
    amount: "5300",
    transactionId: "TXN-BCD123789",
    status: "paid",
    createdAt: new Date("2024-03-10T05:40:30Z"),
  },
];

const page = () => {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterState, setfilterState] = useState({
    used: ["all"],
    date: new Date().toISOString().slice(0, 10),
    invoice: "",
    email: "",
    transaction: "",
    status: "",
    min: "",
    max: "",
  });
  const [filteredPayments, setFilteredPayments] = useState([...payments]);

  // useEffect(() => {
  //   if (filterState.used === "all") {
  //     setFilteredPayments((e) => {
  //       return [
  //         ...payments.filter(
  //           (it) =>
  //             (filterState.vehicleType !== "all"
  //               ? it.vehicleType === filterState.vehicleType
  //               : true) &&
  //             (filterState.status === "blocked" ? it.blocked : !it.blocked)
  //         ),
  //       ];
  //     });
  //   } else if (filterState.used === "vehicleType") {
  //     setFilteredPayments((e) => {
  //       return [
  //         ...payments.filter((it) =>
  //           filterState.vehicleType !== "all"
  //             ? it.vehicleType === filterState.vehicleType
  //             : true
  //         ),
  //       ];
  //     });
  //   } else if (filterState.used === "status") {
  //     setFilteredPayments((e) => {
  //       return [
  //         ...payments.filter((it) =>
  //           filterState.status === "all"
  //             ? true
  //             : filterState.status === "blocked"
  //             ? it.blocked
  //             : !it.blocked
  //         ),
  //       ];
  //     });
  //   }
  // }, [filterState]);

  useEffect(() => {
    console.log(filterState);
  }, [filterState]);

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
          <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
            Payments
          </h3>
        </div>
        <PaymentFilter
          filterState={filterState}
          setfilterState={setfilterState}
          seachingBy={[
            { name: "All", value: "all" },
            { name: "Email", value: "email" },
            { name: "Invoice No.", value: "invoice" },
            { name: "Transaction Id", value: "transaction" },
            { name: "Status", value: "status" },
            { name: "Amount", value: "amount" },
            { name: "Date", value: "date" },
          ]}
        />

        <div className="min-h-screen">
          <div className="overflow-x-auto">
            <table className="w-[900px] md:w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e5e7eb] dark:border-gray-600 text-start ">
                  <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300 flex-row flex gap-[10px]">
                    <Checkbox
                      onChange={(cond) => {
                        if (cond) {
                          const ids = [];
                          payments.forEach((it) => {
                            ids.push(it._id);
                          });
                          setSelectedIds([...ids]);
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      checked={payments.every((it) =>
                        selectedIds.includes(it._id)
                      )}
                    />
                    Invoice
                  </th>
                  <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                    User
                  </th>
                  <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                    Amount
                  </th>
                  <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                    Date
                  </th>
                  <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                    Transaction
                  </th>
                  <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                    Status
                  </th>

                  <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments?.map((transport, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#e5e7eb] relative items-center dark:border-gray-600 hover:bg-[#f3f4f6] dark:hover:bg-gray-800"
                  >
                    <td className="py-3 pl-[6px]">
                      <div className="flex flex-row gap-3 ">
                        <Checkbox
                          checked={selectedIds.includes(transport._id)}
                          onChange={() => {
                            setSelectedIds((e) => {
                              const tempIds = [...e];

                              if (tempIds.includes(transport._id)) {
                                tempIds.splice(
                                  e.findIndex((it) => it === transport._id),
                                  1
                                );
                              } else {
                                tempIds.push(transport._id);
                              }
                              return [...tempIds];
                            });
                          }}
                        />

                        <span className="med-14 !text-gray-700 dark:!text-gray-300">
                          {transport.invoice}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-row items-center gap-[15px] max-w-max w-full">
                        <Image
                          width={40}
                          height={40}
                          src={transport.user?.profileImg}
                          alt="avatar"
                          className="w-[40px] h-[40px] rounded-full dark:bg-gray-300"
                        />
                        <div className="flex flex-col">
                          <span className="med-14 !text-gray-700 dark:!text-gray-300">
                            {transport.user?.firstName}{" "}
                            {transport.user?.lastName}
                          </span>
                          <span className="bk-14 !text-gray-700 dark:!text-gray-300">
                            {transport.user?.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
                      {transport.amount}
                    </td>
                    <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
                      {transport.createdAt.toDateString().slice(4)}
                    </td>
                    <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
                      {transport.transactionId}
                    </td>
                    <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
                      <span
                        className={`px-2 py-1 rounded bk-14 ${
                          transport.status === "paid"
                            ? "!text-green-400"
                            : "!text-red-400"
                        }`}
                      >
                        {transport.status?.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3 cursor-pointer">
                      <button className="w-[28px] h-[28px] flex-center hover:bg-gray-200 rounded-[6px]">
                        <svg
                          className="dark:fill-gray-300 dark:stroke-gray-300"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="black"
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          stroke="black"
                        >
                          <path
                            stroke="inherit"
                            strokeLinecap="round"
                            strokeWidth="4"
                            d="M6 12h0m6 0h0m6 0h0"
                          ></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
