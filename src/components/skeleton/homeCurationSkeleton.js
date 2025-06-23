import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HomeCurationSkeleton = () => {
  const items = ["", "", "", "", "", "", "", "", "", ""];
  const isDarkTheme = document.documentElement.classList.contains("dark");
  const baseColor = isDarkTheme ? "#545357" : "#e0e0e0";
  const highlightColor = isDarkTheme ? "#c4c4c4" : "#f5f5f5";

  return (
    <div className="flex flex-row mt-8 overflow-x-auto no-scrollbar rounded-lg p-3  bg-profileBackground">
      <SkeletonTheme
        baseColor={baseColor}
        highlightColor={highlightColor}
        enableAnimation={false}
      >
        {items.map((item, index) => (
          <div key={index} className="flex flex-row items-start mr-6 ">
            <Skeleton height={90} width={130} borderRadius={5} />
          </div>
        ))}
      </SkeletonTheme>
    </div>
  );
};

export default HomeCurationSkeleton;
