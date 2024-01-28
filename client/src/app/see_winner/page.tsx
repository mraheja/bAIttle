"use client";

import { useRouter } from "next/navigation";

const SeeWinner = () => {
  const router = useRouter();
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex justify-center items-center">
        <img
          src="./bot.gif"
          alt="Big Picture"
          className="max-w-md max-h-full"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-start p-10">
        <h1 className="text-6xl mb-4">Bot 1 Wins!</h1>
        <p className="text-lg mb-6">
          Bot 1 has more clever lyrics and was able to create more relevant
          roasts than Bot 2.
        </p>
        <div className="flex flex-row space-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              /* logic to download data point */
            }}
          >
            Download Data Point
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("./rap_setup")}
          >
            Go again
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeeWinner;
