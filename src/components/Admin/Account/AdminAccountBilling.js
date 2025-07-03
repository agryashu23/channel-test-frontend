import {
  React,
  useState,
  useEffect,
  hostUrl,
  postRequestAuthenticated,
} from "../../../globals/imports";
import Loading from "../../../widgets/Loading";
import AdminPricingCard from "./widgets/AdminPricingCard";

const AdminAccountBilling = () => {
  const [activeTabPricing, setActiveTabPricing] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading,setLoading] = useState(false);

  // const paymentHistory = [
  //   {
  //     invoiceNumber: "INV-001",
  //     date: "Jan 10, 2025",
  //     amount: "₹299.00",
  //     paymentMethod: "1224****5678",
  //     status: "Paid",
  //   },
  //   {
  //     invoiceNumber: "INV-002",
  //     date: "Dec 10, 2024",
  //     amount: "₹299.00",
  //     paymentMethod: "1224****5678",
  //     status: "Paid",
  //   },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [plansRes, transactionsRes] = await Promise.all([
          postRequestAuthenticated(`/fetch/business/plans`),
          postRequestAuthenticated(`/fetch/transaction/history`),
        ]);
        setPlans(plansRes.plans);
        setTransactions(transactionsRes.transactions);
      } catch (error) {
        console.error("Error fetching plans or transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  

  return (
    <div className="flex flex-col pt-6  px-4 bg-theme-tertiaryBackground  w-full">
      <p className="text-theme-emptyEvent text-lg font-normal">
        Account
      </p>
      <p className="text-theme-secondaryText text-lg mt-1 font-normal">
        Subscription and billing
      </p>
      <div className="border-t border-t-theme-chatDivider my-4 "></div>
      <p className="mt-2 text-xs text-theme-emptyEvent font-light italic">• Remaining credit from your current plan will be auto-applied when you upgrade.</p>


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
      {loading?<div className="mt-6 flex justify-center items-center"><Loading text={"Loading..."}  />
      </div>:<div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xxl:grid-cols-4 gap-6  w-full max-w-7xl mt-4">
        {plans?.map((plan, index) => (
          <AdminPricingCard key={index} index={index} plan={plan} type={activeTabPricing} />
        ))}
      </div>}
      {!loading &&  <div className="mt-10 text-theme-secondaryText text-xl font-medium ml-1">Billing History</div>}
      {!loading && transactions.length > 0 ? <div className=" w-full mt-4 overflow-x-auto rounded-lg border border-theme-emptyEvent">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead className="bg-theme-chatDivider text-theme-secondaryText">
            <tr>
              <th className="py-2 px-4 border border-theme-emptyEvent text-left ">Razorpay _id</th>
              <th className="py-2 px-4 border border-theme-emptyEvent text-left">Date</th>
              <th className="py-2 px-4 border border-theme-emptyEvent text-left">Amount</th>
              <th className="py-2 px-4 border border-theme-emptyEvent text-left">Payment method</th>
              <th className="py-2 px-4 border border-theme-emptyEvent text-left">Plan</th>
              <th className="py-2 px-4 border border-theme-emptyEvent text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((entry, index) => (
              <tr key={index} className="text-theme-secondaryText">
                <td className="py-2 px-4 border border-theme-emptyEvent">{entry.razorpayOrderId || "N/A"}</td>
                <td className="py-2 px-4 border border-theme-emptyEvent">
                    {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>   
                <td className="py-2 px-4 border border-theme-emptyEvent">{`₹${entry.amount || 0} /-`}</td>
                <td className="py-2 px-4 border border-theme-emptyEvent">{entry.paymentMethod || "N/A"}</td>
                <td className="py-2 px-4 border border-theme-emptyEvent">{entry.planId.name || "N/A"}</td>
                <td className={`py-2 px-4 border border-theme-emptyEvent ${entry.status === "success" ? "text-green-500" 
                  : entry.status === "failed" ? "text-red-500" : "text-theme-secondaryText"}`}>{entry.status || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>:transactions.length===0 && <div className="text-theme-secondaryText text-lg font-normal ml-1">No billing history.</div>}
      <div className="mt-8"></div>
    </div>
  );
};

export default AdminAccountBilling;
