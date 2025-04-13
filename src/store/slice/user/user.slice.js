import { createSlice } from "@reduxjs/toolkit";
import {
  getOtherUsersThunk,
  getUserProfileThunk,
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
} from "./user.thunk";

const initialState = {
  isAuthenticated: false,
  userProfile: null,
  otherUsers: null,
  selectedUser: JSON.parse(localStorage.getItem("selectedUser")),
  buttonLoading: false,
  screenLoading: !!sessionStorage.getItem("token"),
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      localStorage.setItem("selectedUser",JSON.stringify(action.payload))
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // login user
    builder.addCase(loginUserThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData?.user;
      state.isAuthenticated = true;
      state.buttonLoading = false;
      state.screenLoading = false;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.buttonLoading = false;
      state.isAuthenticated = false;
      state.userProfile = null;
      state.screenLoading = false;
    });

    // register user
    builder.addCase(registerUserThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData?.user;
      state.isAuthenticated = true;
      state.buttonLoading = false;
      state.screenLoading = false;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.buttonLoading = false;
      state.isAuthenticated = false;
      state.userProfile = null;
      state.screenLoading = false;
    });

    // logout user
    builder.addCase(logoutUserThunk.pending, (state, action) => {
      state.buttonLoading = true;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state, action) => {
      state.userProfile = null;
      state.selectedUser = null;
      state.otherUsers = null;
      state.isAuthenticated = false;
      state.buttonLoading = false;
      state.screenLoading = false;
      localStorage.clear();
    });
    builder.addCase(logoutUserThunk.rejected, (state, action) => {
      state.userProfile = null;
      state.selectedUser = null;
      state.otherUsers = null;
      state.isAuthenticated = false;
      state.buttonLoading = false;
      state.screenLoading = false;
      localStorage.clear();
      sessionStorage.removeItem("token");
    });

    // get user profile
    builder.addCase(getUserProfileThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.screenLoading = false;
      state.userProfile = action.payload;
    });
    builder.addCase(getUserProfileThunk.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.userProfile = null;
      state.screenLoading = false;
    });

    // get other users
    builder.addCase(getOtherUsersThunk.pending, (state, action) => {
      state.screenLoading = true;
    });
    builder.addCase(getOtherUsersThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.otherUsers = action.payload;
    });
    builder.addCase(getOtherUsersThunk.rejected, (state, action) => {
      state.screenLoading = false;
      state.otherUsers = null;
    });
  },
});

export const { setSelectedUser } = userSlice.actions;

export default userSlice.reducer;