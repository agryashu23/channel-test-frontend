import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CurationItemsSkeleton = () => {
  const items = ["", "", "", "", "", "", ""];
  const isDarkTheme = document.documentElement.classList.contains("dark");
  const baseColor = isDarkTheme ? "#545357" : "#e0e0e0";
  const highlightColor = isDarkTheme ? "#c4c4c4" : "#f5f5f5";

  return (
    <div className="flex flex-col ml-4 w-5/6">
      <SkeletonTheme
        baseColor={baseColor}
        highlightColor={highlightColor}
        enableAnimation={false}
      >
        {items.map((item, index) => (
          <div key={index} className="flex flex-row items-start mb-3 ">
            <div className="w-1/3">
              <Skeleton key={index} height={50} borderRadius={5} />
            </div>
            <div className="flex flex-col ml-2 w-2/3">
              <Skeleton height={10} borderRadius={25} />
              <div className="w-1/2">
                <Skeleton height={10} borderRadius={25} />
              </div>
            </div>
          </div>
        ))}
      </SkeletonTheme>
    </div>
  );
};

export default CurationItemsSkeleton;
