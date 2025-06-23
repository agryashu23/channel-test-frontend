import {
  fetchAdminRequests,
  updateAdminRequests,
} from "./../../../redux/slices/adminSlice";
import {
  React,
  useState,
  useEffect,
  useDispatch,
  useSelector,
} from "../../../globals/imports";

const BusinessRequest = () => {
  const admin = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [editedRequests, setEditedRequests] = useState([]);

  useEffect(() => {
    dispatch(fetchAdminRequests());
  }, []);

  useEffect(() => {
    setEditedRequests(
      admin.requests.map((r) => ({
        id: r._id,
        domain: r.domain,
        userId: r.user_id?._id || "",
        autoLogin: r.autoLogin || false,
      }))
    );
  }, [admin.requests]);

  const toggleCheckbox = (id, field) => {
    setEditedRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, [field]: !req[field] } : req
      )
    );
  };

  const handleSave = () => {
    dispatch(updateAdminRequests(editedRequests))
      .unwrap()
      .then(() => alert("Requests updated successfully"))
      .catch((err) => alert("Failed to save changes: " + err.message));
  };

  return (
    <div className="flex flex-col px-6  space-y-6">
      <p className="text-theme-primaryBackground font-medium text-3xl mb-4">
        Business Requests
      </p>

      <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-theme-primaryBackground  border-b pb-2 ">
        <div>Domain</div>
        <div>Username</div>
        <div>Payment Subscription</div>
        <div>Auto Login</div>
      </div>

      {/* Requests */}
      {editedRequests.map((request) => (
        <div
          key={request.id}
          className="grid grid-cols-4 gap-4 items-center py-2 border-b border-t-theme-chatDivider"
        >
          <div className=" text-theme-secondaryBackground">
            {request.domain}
          </div>
          <div className=" text-theme-emptyEvent font-normal text-sm">
            {request.username}
          </div>
          {/* <div>
            <input
              type="checkbox"
              checked={request.payment_subscription}
              onChange={() =>
                toggleCheckbox(request.id, "payment_subscription")
              }
              className="h-4 w-4"
            />
          </div> */}
          <div className="flex flex-col">
            <input
              type="checkbox"
              checked={request.autoLogin}
              onChange={() => toggleCheckbox(request.id, "autoLogin")}
              className="h-4 w-4"
            />
            <p className="text-theme-sidebarColor text-xs mt-0.5 font-normal">
              {request.auto_login_request ? "requested" : ""}
            </p>
          </div>
        </div>
      ))}

      {editedRequests.length > 0 && (
        <button
          onClick={handleSave}
          className="w-max mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-theme-secondaryText rounded-md text-sm font-normal"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default BusinessRequest;
