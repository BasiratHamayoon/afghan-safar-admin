import React from "react";
import { Modal } from "./index";
import Button from "../button/Button";

const ModelActions = ({
  isOpen,
  onClose,
  className,
  selectedIds,
  type,
  des,
  loading,
  clickFunc,
  name,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      <div
        id="modalContainer"
        className="w-full p-6 bg-white shadow-2xl dark:bg-gray-800 rounded-xl modal-enter"
      >
        <div className="flex flex-col items-center mb-5">
          <div className="mb-4 text-red-500 warning-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="font-bold bd-20 ">Confirm {type}</h3>
          <p className="mt-2 text-center text-gray-500">
            You're about to {type.toLowerCase()} {selectedIds?.length} selected{" "}
            {name || "users"}
          </p>
        </div>

        <div className="p-4 mb-6 border border-red-100 rounded-lg dark:border-gray-800 bg-red-50 dark:bg-gray-950">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-700">{des}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant={"outline"} onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </Button>
          <Button
            className={`flex items-center min-w-max gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all hover:shadow-sm ${
              loading ? "!bg-gray-300" : ""
            }`}
            onClick={clickFunc}
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {type} {name || "Users"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModelActions;
