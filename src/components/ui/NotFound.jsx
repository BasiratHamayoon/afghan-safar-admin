import Link from "next/link";
import React from "react";

const NotFound = ({ loading, loadingText, loadingDesc, heading, desc }) => {
  return (
    <div className="w-full text-center">
      <div className="w-32 h-32 mx-auto mb-8 text-gray-300 floating">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>

      <h1 className="mb-1 text-2xl font-light text-gray-500">
        {loading ? loadingText : heading}
      </h1>
      <p className="mb-8 text-gray-400">
        {loading ? loadingDesc : desc || "The requested user doesn't exist"}
      </p>

      <div className="flex justify-center">
        <Link
          href={"/"}
          className="px-6 py-2 text-gray-500 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
