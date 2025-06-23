import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TopicHomeSkeleton = () => {
  const isDarkTheme = document.documentElement.classList.contains("dark");
  const baseColor = isDarkTheme ? "#545357" : "#e0e0e0";
  const highlightColor = isDarkTheme ? "#c4c4c4" : "#f5f5f5";
  return (
    <div className="bg-theme-secondaryBackground w-full h-full flex flex-col px-4 py-3 justify-between">
      <SkeletonTheme
        baseColor={baseColor}
        highlightColor={highlightColor}
        enableAnimation={false}
      >
        <div>
          <Skeleton height={60} borderRadius={8} />
        </div>
        <div>
          <Skeleton height={40} borderRadius={25} />
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default TopicHomeSkeleton;
