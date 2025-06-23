import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { appReducer } from "./rootReducer";
import embedAuthReducer from "../../components/EmbedChannels/embedSlices/embedAuthSlice";
import embedHomeReducer from "../../components/EmbedChannels/embedSlices/embedHomeSlice";

const embedCombinedReducer = combineReducers({
  ...appReducer, // All main reducers
  auth: embedAuthReducer, // Override with embed version
  embedHome: embedHomeReducer, // Add embed-only
});

const embedStore = configureStore({
  reducer: embedCombinedReducer,
});

export default embedStore;
