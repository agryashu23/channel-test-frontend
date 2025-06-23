import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ResponsiveMasonry } from "react-responsive-masonry";
import Masonry from "react-responsive-masonry";

const SavedSkeleton = () => {
  const isDarkTheme = document.documentElement.classList.contains("dark");
  const baseColor = isDarkTheme ? "#545357" : "#e0e0e0";
  const highlightColor = isDarkTheme ? "#c4c4c4" : "#f5f5f5";
  const items = ["", "", "", "", "", "", "", "", ""];
  const items2 = [120, 320, 120, 350, 350, 120];

  return (
    <div className="w-full h-full flex flex-col sm:flex-row mt-8">
      <div className="flex  sm:flex-col ml-4 w-[90%] sm:w-3/5 md:2/5  lg:w-[30%] p-4 rounded-lg bg-profileBackground">
        <SkeletonTheme
          baseColor={baseColor}
          highlightColor={highlightColor}
          enableAnimation={false}
        >
          {items.map((item, index) => (
            <div key={index} className="flex flex-row  items-start mb-3 ">
              <div className="w-1/3">
                <Skeleton key={index} height={50} borderRadius={5} />
              </div>
              <div className="flex flex-col ml-2 w-1/3 sm:w-2/3">
                <Skeleton height={10} borderRadius={25} />
                <div className="w-1/2">
                  <Skeleton height={10} borderRadius={25} />
                </div>
              </div>
            </div>
          ))}
        </SkeletonTheme>
      </div>
      <div className="sm:w-full w-[90%] mx-4 sm:mt-0 mt-6 sm:mx-6 md:mx-12">
        <SkeletonTheme
          baseColor="#28262b"
          highlightColor="#cac4d0"
          enableAnimation={false}
        >
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 300: 1, 660: 2, 950: 3, 1100: 4 }}
          >
            <Masonry gutter="18px">
              {items2.map((item, index) => (
                <Skeleton key={index} height={item} borderRadius={5} />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </SkeletonTheme>
      </div>
    </div>
  );
};

export default SavedSkeleton;
