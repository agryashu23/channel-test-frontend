import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SidebarSkeleton = () => {
  const isDarkTheme = document.documentElement.classList.contains("dark");
  const baseColor = isDarkTheme ? "#545357" : "#e0e0e0";
  const highlightColor = isDarkTheme ? "#c4c4c4" : "#f5f5f5";
  return (
    <div className="flex flex-col justify-between h-screen w-full py-3 px-4">
      <SkeletonTheme
        baseColor={baseColor}
        highlightColor={highlightColor}
        enableAnimation={false}
      >
        <div className="flex flex-col justify-start space-y-3">
          <Skeleton width={50} height={50} borderRadius={5} />
          <Skeleton height={18} borderRadius={20} />
          <Skeleton height={20} borderRadius={20} />
          <Skeleton height={12} borderRadius={20} />
          <Skeleton height={12} borderRadius={20} />
        </div>

        <div className="flex flex-col justify-start space-y-3">
          <Skeleton height={12} borderRadius={20} />
          <Skeleton height={12} borderRadius={20} />
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default SidebarSkeleton;
