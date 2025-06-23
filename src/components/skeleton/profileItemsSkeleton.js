import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ResponsiveMasonry } from "react-responsive-masonry";
import Masonry from "react-responsive-masonry";

const ProfileItemsSkeleton = () => {
  const items = [120, 320, 120, 350, 350, 120, 380, 130];
  const isDarkTheme = document.documentElement.classList.contains("dark");
  const baseColor = isDarkTheme ? "#545357" : "#e0e0e0";
  const highlightColor = isDarkTheme ? "#c4c4c4" : "#f5f5f5";

  return (
    <SkeletonTheme
      baseColor={baseColor}
      highlightColor={highlightColor}
      enableAnimation={false}
    >
      <ResponsiveMasonry columnsCountBreakPoints={{ 400: 2, 800: 3, 1060: 4 }}>
        <Masonry gutter="18px">
          {items.map((item, index) => (
            <Skeleton key={index} height={item} borderRadius={5} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </SkeletonTheme>
  );
};

export default ProfileItemsSkeleton;
