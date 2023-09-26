import { TYPES } from "../constants";

const initialState = {
  foodItems: null,
};

const addFoodReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.ADD_FOOD_ITEMS:
      return {
        ...state,
        foodItems: action.payload,
      };
    case TYPES.REMOVE_FOOD_ITEMS:
      return {
        ...state,
        foodItems: action.payload,
      };
    case TYPES.CLEAR_FOOD_CART:
      return {
        ...state,
        foodItems: null,
      };
    default:
      return state;
  }
};

export default addFoodReducer;
