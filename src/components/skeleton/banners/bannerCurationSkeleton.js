import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BannerCurationSkeleton = () => {
    const items = ["", "", ""];

  return (
    <div className="flex flex-col  w-full space-y-4 mt-2">
    <SkeletonTheme baseColor="#545357" highlightColor="#cac4d0" enableAnimation={false}>
          {items.map((item, index) => (
            <div key={index} className="flex flex-row items-start  ">
                <div className="w-1/3">
                    <Skeleton key={index}  height={50} borderRadius={5} />
                </div>
              <div className="flex flex-col ml-3 w-3/5">
              <Skeleton height={10}  borderRadius={25}/>
              <div className="w-1/2 mt-2">
              <Skeleton height={10}  borderRadius={25}/>
              </div>
              </div>
            </div>
            
          ))}
    </SkeletonTheme>
    </div>
  )
}

export default BannerCurationSkeleton
