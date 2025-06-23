import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TopicChatSkeleton = () => {
  const isDarkTheme = document.documentElement.classList.contains("dark");
  const baseColor = isDarkTheme ? "#545357" : "#e0e0e0";
  const highlightColor = isDarkTheme ? "#c4c4c4" : "#f5f5f5";
  return (
    <div className="bg-theme-secondaryBackground w-full h-full flex flex-col justify-start px-2 overflow-y-auto custom-scrollbar">
      <SkeletonTheme
        baseColor={baseColor}
        highlightColor={highlightColor}
        enableAnimation={false}
      >
        <div className="flex flex-row justify-start w-full">
          <Skeleton width={50} height={50} borderRadius={50} />
          <div className="flex flex-col ml-2 w-4/5">
            <div className="w-1/5">
              <Skeleton height={10} borderRadius={20} />
            </div>
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
          </div>
        </div>
        <div className="flex flex-row justify-start w-full mt-5">
          <Skeleton width={50} height={50} borderRadius={50} />
          <div className="flex flex-col ml-2 w-4/5">
            <div className="w-1/5">
              <Skeleton height={10} borderRadius={20} />
            </div>
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
          </div>
        </div>
        <div className="flex flex-row justify-start w-full mt-5">
          <Skeleton width={50} height={50} borderRadius={50} />
          <div className="flex flex-col ml-2 w-4/5">
            <div className="w-1/5">
              <Skeleton height={10} borderRadius={20} />
            </div>
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
          </div>
        </div>
        <div className="flex flex-row justify-start w-full mt-5">
          <Skeleton width={50} height={50} borderRadius={50} />
          <div className="flex flex-col ml-2 w-4/5">
            <div className="w-1/5">
              <Skeleton height={10} borderRadius={20} />
            </div>
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default TopicChatSkeleton;
