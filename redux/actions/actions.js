import axios from "axios";
import { API_KEY } from "@env";
import * as actionTypes from "./actionTypes";
import { cleanSearchData } from "../../utils/cleanSearchData";

const apiUrl_foodSearch = "https://api.nal.usda.gov/fdc/v1/foods/search";
const apiUrl_getFoodById = "https://api.nal.usda.gov/fdc/v1/food/";

export const fetchFoodSearchAPI = (params) => {
  let config = { params: { ...params, api_key: API_KEY } };
  return async (dispatch) => {
    dispatch(actionTypes.fetchFoodSearch());
    try {
      const response = await axios.get(apiUrl_foodSearch, config);
      const updatedData = cleanSearchData(response.data);
      dispatch(actionTypes.fetchFoodSearchSuccess(updatedData));
    } catch (error) {
      dispatch(actionTypes.fetchFoodSearchFailure(error.message));
    }
  };
};

export const clearFoodSearchResults = () => {
  return (dispatch) => {
    dispatch(actionTypes.clearFoodSearch());
  };
};

export const fetchFoodItemByIdAPI = (params, fdcId, tag) => {
  let config = { params: { ...params, api_key: API_KEY } };
  return async (dispatch) => {
    dispatch(actionTypes.fetchFoodItem());
    try {
      const response = await axios.get(`${apiUrl_getFoodById}${fdcId}`, config);
      dispatch(actionTypes.fetchFoodItemSuccess(response.data));
    } catch (error) {
      dispatch(actionTypes.fetchFoodItemFailure(response.data));
    }
  };
};

export const clearFoodItemResults = () => {
  return (dispatch) => {
    dispatch(actionTypes.clearFoodItem());
  };
};
