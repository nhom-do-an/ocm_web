"use client";

import { ToastContainer, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cn } from "@/utils";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName={(context) =>
        cn(
          "relative flex items-center gap-3 rounded-lg p-4 mb-3 w-full max-w-sm shadow-lg transition-all duration-300 text-sm font-medium",
          "bg-white border-l-4 hover:shadow-xl",
          {
            "border-green-500 text-green-800": context?.type === "success",
            "border-red-500 text-red-800": context?.type === "error",
            "border-blue-500 text-blue-800": context?.type === "info",
            "border-yellow-500 text-yellow-800": context?.type === "warning",
            "border-slate-400 text-slate-700": !context?.type,
          }
        )
      }
      progressClassName="!bg-current h-[3px] rounded-b-lg"
    />
  );
}
