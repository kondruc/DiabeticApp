import { TYPES } from "../constants";

const fetchFoodSearch = () => ({
  type: TYPES.FETCH_FOOD_SEARCH_REQUEST,
});

const fetchFoodSearchSuccess = (data) => ({
  type: TYPES.FETCH_FOOD_SEARCH_SUCCESS,
  payload: data,
});

const fetchFoodSearchFailure = (error) => ({
  type: TYPES.FETCH_FOOD_SEARCH_FAILURE,
  payload: error,
});

const clearFoodSearch = () => ({
  type: TYPES.CLEAR_FOOD_SEARCH,
});

const fetchFoodItem = () => ({
  type: TYPES.FETCH_FOOD_ITEM_REQUEST,
});

const fetchFoodItemSuccess = (data) => ({
  type: TYPES.FETCH_FOOD_ITEM_SUCCESS,
  payload: data,
});

const fetchFoodItemFailure = (error) => ({
  type: TYPES.FETCH_FOOD_ITEM_FAILURE,
  payload: error,
});

const clearFoodItem = () => ({
  type: TYPES.CLEAR_FOOD_ITEM,
});

const AddFoodItem = (data) => ({
  type: TYPES.ADD_FOOD_ITEMS,
  payload: data,
});

const RemoveFoodItem = (data) => ({
  type: TYPES.REMOVE_FOOD_ITEMS,
  payload: data,
});

const ClearFoodCart = () => ({
  type: TYPES.CLEAR_FOOD_CART,
});

export {
  //fetch Food search
  fetchFoodSearch,
  fetchFoodSearchSuccess,
  fetchFoodSearchFailure,
  clearFoodSearch,

  //fetch Food Item
  fetchFoodItem,
  fetchFoodItemSuccess,
  fetchFoodItemFailure,
  clearFoodItem,

  //Add Food Items
  AddFoodItem,
  RemoveFoodItem,
  ClearFoodCart,
};
