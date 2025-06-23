import { React, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useSelector, useDispatch } from "react-redux";
import ProfileItemsSkeleton from "../skeleton/profileItemsSkeleton";
import CurationMansonry from "../curations/CurationMansonry";
import NoActionChips from "./../chips/NoActionChips";
import { fetchProfileItems } from "./../../redux/slices/profileItemsSlice";
import { updateSelectedItems } from "./../../redux/slices/newsletterSlice";

const MasonryItem = ({ item, owner, selectedItems, onSelect }) => {
  const isSelected = selectedItems.some((selected) => selected.id === item._id);

  if (item.type === "curation") {
    return (
      <div className="curation-item my-masonry-grid_item relative">
        <div className="absolute top-1 -left-6">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(item)}
            className="custom-checkbox"
          />
        </div>
        <CurationMansonry curation={item} owner={owner} />
      </div>
    );
  } else if (item.type === "chip") {
    return (
      <div className="chip-item my-masonry-grid_item relative">
        <div className="absolute top-2 -left-6">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(item)}
            className="custom-checkbox"
          />
        </div>
        <NoActionChips item={item} />
      </div>
    );
  }
  return null;
};

const ItemsNewsletter = ({ userId }) => {
  const dispatch = useDispatch();
  const myData = useSelector((state) => state.myData);

  useEffect(() => {
    if (myData._id) {
      dispatch(fetchProfileItems(myData._id));
    }
  }, [dispatch, myData._id]);

  const { items, status, error } = useSelector((state) => state.newsletter);
  const selectedItems = useSelector((state) => state.newsletter.selectedItems);

  const handleToggleSelect = (item) => {
    dispatch(updateSelectedItems(item));
  };

  const breakpointColumnsObj = {
    default: 2,
    1500: 3,
    1100: 2,
    950: 2,
    700: 1,
    640: 1,
    550: 2,
    400: 1,
  };

  if (status === "loading") {
    return <ProfileItemsSkeleton />;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full pl-7">
      <ResponsiveMasonry columnsCountBreakPoints={breakpointColumnsObj}>
        <Masonry
          className="my-masonry-grid"
          gutter="56px"
          columnClassName="my-masonry-grid_column"
        >
          {items.map((item) => (
            <MasonryItem
              key={item._id}
              item={item}
              owner={false}
              selectedItems={selectedItems}
              onSelect={handleToggleSelect}
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default ItemsNewsletter;
