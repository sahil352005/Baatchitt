import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../components/utitlities/axiosInstance";

export const loginUserThunk = createAsyncThunk(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/login", {
        username,
        password,
      });
      toast.success("Login successful!");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.message || "Login failed";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  "user/signup",
  async ({ fullName, username, password, gender }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/register", {
        fullName,
        username,
        password,
        gender,
      });
      toast.success("Account created successfully!");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.message || "Registration failed";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      console.log("logoutUserThunk: Attempting logout.");
      sessionStorage.removeItem("token");
      localStorage.clear();
      toast.success("Logout successful!");
      console.log("logoutUserThunk: Logout successful.");
      return { success: true };
    } catch (error) {
      console.error("logoutUserThunk Error:", error);
      sessionStorage.removeItem("token");
      localStorage.clear(); 
      const errorOutput = error?.response?.data?.message || "Logout failed";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getUserProfileThunk = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    console.log("getUserProfileThunk: Attempting to fetch profile...");
    try {
      const response = await axiosInstance.get("/user/profile");
      console.log("getUserProfileThunk: API Response received:", response);

      if (response.data?.user) {
        console.log("getUserProfileThunk: Profile fetched successfully:", response.data.user);
        return response.data.user;
      } else {
         console.error("getUserProfileThunk: 'user' property not found in response:", response.data);
         throw new Error("Invalid profile data format received from server (expected 'user' property).");
      }

    } catch (error) {
      console.error("getUserProfileThunk Fetch Error:", error);
      let errorOutput = "Failed to get profile";

      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
        errorOutput = error.response.data?.message || `Server error (${error.response.status})`;
        if (error.response.status === 401) {
           console.log("getUserProfileThunk: Received 401 Unauthorized. Token might be invalid or expired.");
           errorOutput = "Authentication failed. Please log in again.";
        }
      } else if (error.request) {
        console.error("Error Request:", error.request);
        errorOutput = "Network error or server unresponsive.";
      } else {
        console.error('Error Message:', error.message);
        errorOutput = error.message;
      }

      toast.error(errorOutput); 
      return rejectWithValue(errorOutput);
    }
  }
);

export const getOtherUsersThunk = createAsyncThunk(
  "user/getOtherUsers",
  async (_, { rejectWithValue }) => {
    console.log("getOtherUsersThunk: Attempting to fetch other users...");
    try {
      const response = await axiosInstance.get("/user/users");
      console.log("getOtherUsersThunk: API Response received:", response);
      
      if (response.data?.users && Array.isArray(response.data.users)) {
        console.log("getOtherUsersThunk: Users fetched successfully:", response.data.users);
        return response.data.users;
      } else {
        console.error("getOtherUsersThunk: 'users' array not found or not an array in response:", response.data);
        throw new Error("Invalid users data format received (expected 'users' array).");
      }
    } catch (error) {
      console.error("getOtherUsersThunk Fetch Error:", error);
       let errorOutput = "Failed to get users";
       if (error.response) {
         errorOutput = error.response.data?.message || `Server error (${error.response.status})`;
       } else if (error.request) {
         errorOutput = "Network error fetching users.";
       } else {
         errorOutput = error.message;
       }
       toast.error(errorOutput);
       return rejectWithValue(errorOutput);
    }
  }
);
