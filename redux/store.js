import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import userStateReducer from "./reducers/userStateReducer";
import apiRequest from "./reducers/apiReducer";
import addFoodReducer from "./reducers/addFood";

const rootReducer = combineReducers({
  user: userStateReducer,
  api: apiRequest,
  addFood: addFoodReducer,
});

const store = configureStore({ reducer: rootReducer });
export default store;
