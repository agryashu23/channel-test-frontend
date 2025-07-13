import React,{useState,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusinessNotifications, updateBusinessNotification } from '../../redux/slices/businessSlice';
import EmptyChatIcon from "../../assets/icons/empty_chat.svg";
import { ChannelImages } from './../constants/images';
import Loading from '../../widgets/Loading';
import { useNavigate, useParams } from 'react-router-dom';


const AdminNotifications = () => {
  const dispatch = useDispatch();
  const business = useSelector((state)=>state.business);
  const notifications = business.notifications;
  const params = useParams();
  const {username} = params;
  const navigate = useNavigate();

  useEffect(()=>{
    if(business.notifications.length===0){
       dispatch(fetchBusinessNotifications())
    }
  },[]);

  const handleUpdateNotification=(businessId,notificationId,route)=>{
    dispatch(updateBusinessNotification({businessId:businessId,notificationId:notificationId }));
    navigate(`/admin/${username}${route}`);
  }


  if(business.notificationLoading){
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loading text="Loading notifications..."/>
      </div>
    )
  };

  return (
    <div className="flex flex-col pt-6  px-8 bg-theme-tertiaryBackground  w-full overflow-y-auto">
      <p className="text-theme-secondaryText text-lg font-normal">Notifications</p>
      <div className="border-t border-t-theme-chatDivider mt-4 mb-3 "></div>
      {notifications.length===0 ?<div className="flex flex-col items-center justify-center h-full">
        <img
          src={EmptyChatIcon}
          alt="event-private"
          className="h-32 w-auto mb-1"
        />
        <p className="text-theme-secondaryText font-light text-md">
            No Notifications.
        </p>
      </div>:
      notifications.map((notification,index)=>(
        <div key={notification._id} className={`flex flex-col ${notification.action?"":"bg-theme-chatDivider "}
         my-3 px-3 py-2 lg:w-3/5  xl:w-1/2 sm:w-4/5 w-full rounded-lg cursor-pointer`}
         onClick={()=>handleUpdateNotification(notification.business, notification._id, notification.buttonLink)}
         >
          <p className="text-sm text-theme-secondaryText font-normal">{notification.headerText || "Notification"} {"  "}
             <span className="text-theme-emptyEvent ml-1 font-light">
              {new Date(notification.createdAt).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
              </span></p>
          <div className="flex flex-row justify-between mt-1 md:gap-10 sm:gap-8 gap-6 items-start">
            <p className="text-sm text-theme-emptyEvent font-normal">{notification.content}</p>
            <img src={ChannelImages.ArrowForward.default} alt="arrow" className="w-5 h-5 dark:block hidden "/>
            <img src={ChannelImages.ArrowForwardLight.default} alt="arrow" className="w-5 h-5 dark:hidden block "/>
          </div>

        </div>
      ))}
    </div>
  )
}

export default AdminNotifications