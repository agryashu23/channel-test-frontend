import {React,useEffect} from 'react';
import Chips from './../../chips/Chips';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import { useSelector, useDispatch } from 'react-redux';
import { fetchlimitedProfileItems } from '../../../redux/slices/profileItemsSlice';
import ProfileItemsSkeleton from './../../skeleton/profileItemsSkeleton';
import CurationMansonry from './../../curations/CurationMansonry';
import ProfileChips from './../ProfileChips';


const MasonryItem = ({ item, owner }) => {
    if (item.type === 'curation') {
      return (
        <div className="curation-item my-masonry-grid_item">
          <CurationMansonry curation={item} owner={owner} />
        </div>
      );
    } else if (item.type === 'chip') {
      return (
        <div className="chip-item my-masonry-grid_item">
         {owner ? <ProfileChips item={item} />:<Chips item={item}/> } 
        </div>
      );
    }
    return null;
  };

const ChipProfileView = ({userId}) => {
  const profileData = useSelector((state) => state.profileData);

  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.profileItems);

  useEffect(() => {
    if(profileData._id){
        dispatch(fetchlimitedProfileItems(profileData._id));
    }
  }, [dispatch, profileData._id]);
    const breakpointColumnsObj = {
        default: 2,
        1500:3,
        1100: 2,
        900:2,
        700: 1,
        600: 1,
        450:1,
      };

      if (status === 'loading') {
        return <ProfileItemsSkeleton/>
      }
    
      if (status === 'failed') {
        return <div>Error: {error}</div>;
      }

    
  return (
    <div className="">
        <ResponsiveMasonry
        columnsCountBreakPoints={breakpointColumnsObj}
    >
    <Masonry
      className="my-masonry-grid"
      gutter="12px"
      columnClassName="my-masonry-grid_column"
    >
      {items.map(item => (
        <MasonryItem key={item._id} item={item} owner={false} />
      ))}
    </Masonry>
    </ResponsiveMasonry>

      
    </div>
  )
}

export default ChipProfileView
