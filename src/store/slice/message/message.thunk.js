import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../components/utitlities/axiosInstance";

export const sendMessageThunk = createAsyncThunk(
  "message/send",
  async ({ receiverId, message }, { rejectWithValue, getState }) => {
    try {
      const response = await axiosInstance.post("/message/send", {
        receiverId,
        message,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to send message");
      }

      // Get sender details from state
      const { userProfile } = getState().userReducer;
      
      // Construct the complete message object
      const messageWithDetails = {
        ...response.data.data,
        senderAvatar: userProfile?.avatar,
      };

      return {
        success: true,
        responseData: messageWithDetails
      };
    } catch (error) {
      console.error("Send message error:", error);
      const errorOutput = error?.response?.data?.message || "Failed to send message";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getMessageThunk = createAsyncThunk(
  "message/get",
  async ({ receiverId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/message/${receiverId}`);
      
      // Ensure we have a valid response
      if (!response.data) {
        throw new Error("No data received from server");
      }

      // Handle both possible response formats
      const messages = response.data.data || response.data.messages || [];
      
      // Validate each message has required fields
      const validatedMessages = messages.map(msg => ({
        messageId: msg.messageId || `${msg.senderId}-${msg.createdAt}`,
        message: msg.message || "",
        senderId: msg.senderId || "",
        receiverId: msg.receiverId || "",
        createdAt: msg.createdAt || new Date().toISOString(),
        senderAvatar: msg.senderAvatar || ""
      }));

      return {
        responseData: {
          messages: validatedMessages
        }
      };
    } catch (error) {
      console.error("Get messages error:", error);
      const errorOutput = error?.response?.data?.message || "Failed to fetch messages";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);
