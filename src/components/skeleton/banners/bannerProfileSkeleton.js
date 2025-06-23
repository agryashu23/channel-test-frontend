import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BannerProfileSkeleton = () => {
    const items = ["", "", "", "", ""];
  return (
    <div className="w-full flex flex-col space-y-4">
        <SkeletonTheme baseColor="#545357" highlightColor="#cac4d0" enableAnimation={false}>
        {items.map((item, index) => (
            <div key={index} className="flex flex-row items-center">
                <Skeleton height={30} width={30} borderRadius={5} />
                <div className="ml-4 w-3/4">
                 <Skeleton height={10}  borderRadius={25}/>
                </div>
            </div>
        ))}
        </SkeletonTheme>

      
    </div>
  )
}

export default BannerProfileSkeleton;
