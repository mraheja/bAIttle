import React from "react";
import { User } from "./User";
import { PlayPauseIcon } from "@heroicons/react/24/outline";

export const Header: React.FC = () => {
  return (
    <div className="flex justify-between w-full">
      <div className="flex space-x-2">
      <PlayPauseIcon className="w-8 h-8 fill-red-600" />
      <h1 className="font-semibold text-2xl"> WeToob </h1>
      </div>
      <div className="flex flex-row">
        <input
          type="text"
          placeholder="Search friends..."
          className="bg-slate-300 rounded-full p-1 flex items-center text-slate-600 text-xs w-40 pl-8"
        />
        <User name="Mehul" />
      </div>
    </div>
  );
};
