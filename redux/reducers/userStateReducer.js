// counterReducer.js
const initialState = {
  user: null,
  isLoading: false,
  error: null,
  userDataInfo: null,
  userProfInfo: null,
};

const userStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case "Login":
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
      };
    case "userData":
      return {
        ...state,
        userDataInfo: action.payload,
        isLoading: false,
        error: null,
      };
    case "userProfileData":
      return {
        ...state,
        userProfInfo: action.payload,
        isLoading: false,
        error: null,
      };
    case "UpdateUserFlag":
      return {
        ...state,
        user: action.payload,
      };
    case "Logout":
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default userStateReducer;
