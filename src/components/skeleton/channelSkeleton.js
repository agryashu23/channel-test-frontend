import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ChannelSkeleton = () => {
  const isDarkTheme = document.documentElement.classList.contains("dark");
  const baseColor = isDarkTheme ? "#545357" : "#e0e0e0";
  const highlightColor = isDarkTheme ? "#c4c4c4" : "#f5f5f5";
  return (
    <div className="bg-theme-secondaryBackground w-full h-full flex flex-col px-4 py-3">
      <SkeletonTheme
        baseColor={baseColor}
        highlightColor={highlightColor}
        enableAnimation={false}
      >
        <Skeleton height={120} borderRadius={8} />
        <div className="flex flex-row justify-start mt-4 w-full">
          <Skeleton width={70} height={70} borderRadius={5} />
          <div className="flex flex-col ml-4 w-4/5">
            <div className="w-2/5">
              <Skeleton height={10} borderRadius={20} />
            </div>
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <div className="flex flex-row justify-start space-x-4 ">
              <Skeleton height={35} width={100} borderRadius={5} />
              <Skeleton height={35} width={100} borderRadius={5} />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default ChannelSkeleton;
