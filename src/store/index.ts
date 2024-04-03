import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../components/Account/reducer";
export interface Connect4State {
  accountReducer: {
    isLoggedIn: boolean | undefined;
  };
}
const store = configureStore({
  reducer: {
    accountReducer,
  },
});

export default store;
