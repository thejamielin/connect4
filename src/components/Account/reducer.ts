import { getSessionToken } from "../../dao";
import { User } from "../../types";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUserData: (state: any, { payload }: { payload: false | User }) => {
      const token = getSessionToken();
      if (!token) {
        state.userData = false;
        return;
      }
      state.userData = payload;
    },
  },
});

export const { setUserData } = accountSlice.actions;
export default accountSlice.reducer;
