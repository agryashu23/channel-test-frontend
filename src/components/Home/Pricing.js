import {
  React,
  useState,
  Footer,
  useEffect,
  hostUrl,
  postRequestUnAuthenticated,
  postRequestAuthenticated,
  useSelector,
} from "../../globals/imports";
import PricingCard from "./widgets.js/PricingCard";
import { ChannelImages } from "../constants/images";
import Loading from "../../widgets/Loading";
import AdminPricingCard from "../Admin/Account/widgets/AdminPricingCard";

const Pricing = () => {
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const myUser = useSelector((state) => state.auth.user);
  const myUserId = myUser?._id;
  const [activeTabPricing, setActiveTabPricing] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      if(isLoggedIn && myUserId){
        const response = await postRequestAuthenticated(`/fetch/business/plans`);
        setPlans(response.plans);
      }
      else{
        const response = await postRequestUnAuthenticated(`/get/plans`);
        setPlans(response.plans);
      }
      setLoading(false);
    };
    fetchPlans();
  }, [myUserId , isLoggedIn]);
  return (
    <div className="flex flex-col mt-20 items-center z-10 px-8 bg-[#202020] h-full ">
      <p className="text-white text-2xl font-normal">
        Choose the plan that's right for you
      </p>
      <p className="mt-2 text-white text-xs font-extralight">
        No credit card required. You can cancel at any time.
      </p>

      {/* <div className="flex space-x-6 mt-12 border-b-2 border-[#3c3c3c] ">
        <button
          onClick={() => setActiveTabPricing("monthly")}
          className={`text-sm font-light tracking-wider ${
            activeTabPricing === "monthly"
              ? "border-b-2 border-white text-white"
              : "text-white "
          } pb-2 px-3 transition-all`}
        >
          Monthly
        </button>
        <button
          onClick={() => setActiveTabPricing("annually")}
          className={`text-sm font-light tracking-wider ${
            activeTabPricing === "annually"
              ? "border-b-2 border-white text-white"
              : "text-white"
          } pb-2 px-3 transition-all`}
        >
          Annualy (~15% off)
        </button>
      </div> */}
      {loading?<div className="mt-12 flex justify-center items-center"><Loading text={"Loading..."}  /></div>:<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6  w-full max-w-7xl mt-12">
        {plans?.map((plan, index) => (
         isLoggedIn && myData._id && myData.business ? 
         <AdminPricingCard key={index} plan={plan} index={index} type={activeTabPricing}/>:<PricingCard key={index} plan={plan}  type={activeTabPricing} />
        ))}
      </div>}
      <div className="border border-theme-chatDivider rounded-lg flex sm:flex-row flex-col justify-start mt-20 w-full xl:w-4/5 p-0">
        <img
          src={ChannelImages.PricingImage.default}
          alt="pricing-card"
          className="sm:h-40 sm:w-auto w-full h-40 object-cover rounded-t-lg"
        />
        <div className="px-4 flex flex-col pt-4 w-full">
          <div className=" bg-theme-sidebarColor text-black text-xs px-3 py-0.5 rounded-full w-max">
            Add ons
          </div>
          <p className="text-lg text-white mt-1 mb-2 font-light">
            Make the most of your communities
          </p>
          <div className="flex lg:flex-row flex-col mt-2 justify-between w-full">
            <div className="flex sm:flex-row flex-col">
              <p className="font-light text-white text-sm sm:w-64 w-full">
                Along with any othe plans mentioned above, you can add these
                premium services.
              </p>
              <ul className="text-theme-secondaryText font-light text-sm space-y-2 mb-6 sm:ml-2 sm:mt-0 mt-2">
                <li className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${"text-white"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        "M5 13l4 4L19 7" // Tick
                      }
                    />
                  </svg>
                  <span className="font-light">Whatsapp Notifications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${"text-white"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        "M5 13l4 4L19 7" // Tick
                      }
                    />
                  </svg>
                  <span className="font-light">
                    Custom chat summary generation
                  </span>
                </li>
              </ul>
            </div>
            <a
              href="https://calendly.com/channels_social/talk-to-us"
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-lg border-white text-white py-2 text-center
             px-10 sm:mr-10 mb-8 font-light text-sm cursor-pointer sm:w-max"
            >
              Talk to sales
            </a>
          </div>
        </div>
      </div>
      <div className="h-12"></div>
    </div>
  );
};

export default Pricing;
