import React from "react";
import ChannelModal from "./../components/Modals/Channel/ChannelModal";
import PrivacyPolicy from "./../components/Footer/Modals/PrivacyPolicy";
import TermsofService from "./../components/Footer/Modals/TermsofService";
import ChannelUnsplash from "./../components/Modals/Unsplash/ChannelUnsplash";
import TopicModal from "./../components/Modals/Topic/TopicModal";
import ChipsModal from "./../components/Modals/ChipsModal";
import CurationModal from "./../components/Modals/CurationModal";
import Unsplash from "./../components/Modals/CurationUnplash";
import ProfileShareModal from "./../components/Modals/share/profileShareModal";
import ChannelShareModal from "./../components/Modals/share/channelShareModal";
import CreateCategoryModal from "./../components/Modals/CreateCategoryModal";
import CommentChipModal from "./../components/Modals/comments/CommentChipModal";
import CategoryReorderModal from "./../components/Modals/category/CategoryReorderModal";
import EditChipModal from "./../components/Modals/EditChipModal";
import DeleteChipModal from "./../components/Modals/deletions/DeleteChipModal";
import DeleteCurationModal from "./../components/Modals/deletions/DeleteCurationModal";
import PushtoCategoryModal from "./../components/Modals/PushItems/pushtoCategoryModal";
import PushtoCurationModal from "./../components/Modals/PushItems/pushtoCurationModal";
import ChipShareModal from "./../components/Modals/share/ChipShareModal";
import ChannelCoverModal from "./../components/Modals/Channel/ChannelCoverModal";
import DeleteFaqModal from "./../components/Modals/deletions/DeleteFaqModal";
import DocumentModal from "./../components/Modals/widgets/DocumentModal";
import LogoutModal from "./../components/Modals/LogoutModal";
import DeleteChatModal from "./../components/Modals/deletions/chatDeleteModal";
import FeedbackModal from "./../components/Modals/FeedbackModal";
import ShareModal from "./../components/Modals/share/ShareModal";
import TopicShareModal from "./../components/Modals/share/topicShareModal";
import TopicReorderModal from "./../components/Modals/Topic/TopicReorderModal";
import EventModal from "./../components/Modals/Event/EventModal";
import RemoveMemberModal from "./../components/Modals/deletions/removeMemberModal";
import DeleteCategoryModal from "./../components/Modals/deletions/DeleteCategoryModal";
import EventUnsplashModal from "./../components/Modals/Unsplash/EventUnsplashModal";
// import EventCardModal from "./../components/Modals/Event/EventCardModal";
import DeleteEventModal from "./../components/Modals/deletions/eventDeletionModal";
import EmbedLogoutModal from "./../components/Modals/EmbedLogoutModal";
import DeleteDMModal from "./../components/Modals/deletions/dmDeleteModal";
import EventShareModal from "./../components/Modals/share/eventShareModal";
import PollModal from "./../components/Modals/Poll/PollModal";
import DeleteChannelModal from "../components/Modals/deletions/channelDeleteModal";
import DeleteTopicModal from "../components/Modals/deletions/topicDeleteModal";
import LeaveChannelModal from "../components/Modals/deletions/leaveChannelModal";
import LeaveTopicModal from "../components/Modals/deletions/leaveTopicModal";
import InviteModal from "../components/Modals/Channel/InviteModal";
import PaymentSuccessModal from "../components/Modals/payment/paymentSuccessModal";
import PaymentModal from "../components/Modals/payment/paymentModal";
import RemoveTopicMemberModal from "../components/Modals/deletions/removeTopicMemberModal";
import AdminNotificationModal from "../components/Modals/Notification/adminNotificationModal";
import DeletePollModal from "../components/Modals/deletions/pollDeleteOpen";

const Modals = () => (
  <>
    <ChannelModal />
    <PrivacyPolicy />
    <TermsofService />
    <ChannelUnsplash />
    <TopicModal />
    <ChipsModal />
    <CurationModal />
    <Unsplash />
    <ProfileShareModal />
    <ChannelShareModal />
    <CreateCategoryModal />
    <CommentChipModal />
    <CategoryReorderModal />
    <EditChipModal />
    <DeleteChipModal />
    <DeleteCurationModal />
    <PushtoCategoryModal />
    <PushtoCurationModal />
    <ChipShareModal />
    <ChannelCoverModal />
    <DeleteFaqModal />
    <DocumentModal />
    <LogoutModal />
    <DeleteChatModal />
    <FeedbackModal />
    <ShareModal />
    <TopicShareModal />
    <TopicReorderModal />
    <EventModal />
    <RemoveMemberModal />
    <RemoveTopicMemberModal />
    <DeleteCategoryModal />
    <EventUnsplashModal />
    {/* <EventCardModal /> */}
    <DeleteEventModal />
    <DeletePollModal/>
    <EmbedLogoutModal />
    <DeleteDMModal />
    <EventShareModal />
    <PollModal />
    <DeleteChannelModal />
    <DeleteTopicModal />
    <LeaveChannelModal />
    <LeaveTopicModal />
    <InviteModal />
    <PaymentSuccessModal />
    <PaymentModal />
    <AdminNotificationModal />
  </>
);

export default Modals;
