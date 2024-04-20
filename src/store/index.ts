import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../components/Account/reducer";
import { User } from "../types";
export interface Connect4State {
  accountReducer: {
    userData: User | false;
  };
}
const store = configureStore({
  reducer: {
    accountReducer,
  },
});

export default store;
