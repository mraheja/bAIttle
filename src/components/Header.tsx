import React from "react";

export const Header: React.FC = () => {
  return (
    <div className="flex justify-between w-full">
      <h1 className="font-semibold text-2xl"> WeToob </h1>
      <div className="flex flex-row">
        <input
          type="text"
          placeholder="Search friends..."
          className="bg-slate-300 rounded-full p-1 flex items-center text-slate-600 text-xs w-40 pl-8"
        />
        <div className=" ml-3 h-8 w-8 bg-red-600 flex justify-center align-middle rounded-full items-center">
          <span className="text-white"> M </span>
        </div>
      </div>
    </div>
  );
};
