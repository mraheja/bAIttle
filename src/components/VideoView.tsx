import React from "react";
import { User } from "./User";

interface Video {
  id: string;
  title: string;
  creator: string;
  duration: string;
  thumbnailUrl: string;
}

const sampleVideos: Video[] = [
  {
    id: "1",
    title: "First Video",
    creator: "John Doe",
    duration: "2:00",
    thumbnailUrl: "https://img.youtube.com/vi/8ASGoKOGiMQ/sddefault.jpg",
  },
  {
    id: "2",
    title: "Second Video",
    creator: "Jane Smith",
    duration: "4:30",
    thumbnailUrl: "https://img.youtube.com/vi/8ASGoKOGiMQ/sddefault.jpg",
  },
  // Add more sample videos here
];

export const VideoView: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-3 w-full">
      <div className="w-[50%] max-w-[8000px] p-4">
        <h1 className="font-bold">Friend Feed</h1>
      </div>
      {sampleVideos.map((video) => (
        <div
          key={video.id}
          className="flex items-center space-x-3 p-4 w-[50%] max-w-[8000px] bg-red-200 mt-2 rounded-2xl"
        >
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-24 h-16 object-cover border-white border-solid border-[3px] rounded"
          />
          <div className="flex-grow">
            <h3 className="font-bold">{video.title}</h3>
            <p className="text-sm">{video.creator}</p>
            <p className="text-xs">{video.duration}</p>
          </div>
          <div className="flex -space-x-3 justify-end">

            <User name="A" />
            <User name="B" />
            <User name="C" />
            {/* Add more User components if needed */}
          </div>
        </div>
      ))}
    </div>
  );
};

