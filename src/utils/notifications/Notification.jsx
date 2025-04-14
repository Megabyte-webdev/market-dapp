import React from "react";
import { toast } from "react-toastify";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { IoInformationCircle } from "react-icons/io5";

export const notify = ({ type, title, message }) => {
  let icon, textColor;

  switch (type) {
    case "success":
      icon = <MdCheckCircle className="text-[25px] text-lime-700" />;
      textColor = "text-lime-700";
      break;
    case "failure":
      icon = <MdCancel className="text-[25px] text-red-600" />;
      textColor = "text-red-600";
      break;
    case "prompt":
      icon = <IoInformationCircle className="text-[25px] text-gray-500" />;
      textColor = "text-gray-500";
      break;
    default:
      icon = <IoInformationCircle className="text-[25px] text-gray-500" />;
      textColor = "text-gray-500";
  }

  const notificationComponent = (
    <div className={`flex items-center gap-[10px] z-[999] ${textColor} text-left`}>
      {icon}
      <div className="flex flex-col">
        <strong className="text-sm capitalize">{title}</strong>
        <p className="text-[12px] text-gray-500">{message?.length > 30 ? `${message.slice(0,30)}...`:message}</p>
      </div>
    </div>
  );

  toast(notificationComponent);
};
