import {
  apiAccountCheckSession,
  deleteSessionToken,
  getSessionToken,
} from "../../dao";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    // checks if token is valid, and sets isLoggedIn accordingly
    validateLoggedIn: (state) => {
      const token = getSessionToken();
      if (!token) {
        state.isLoggedIn = false;
        return;
      }
      apiAccountCheckSession(token).then((isValidSession) => {
        state.isLoggedIn = isValidSession;
        isValidSession || deleteSessionToken();
      });
    },
  },
});

export const { validateLoggedIn } = accountSlice.actions;
export default accountSlice.reducer;
