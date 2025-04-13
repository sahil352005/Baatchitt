import { createSlice } from "@reduxjs/toolkit";
import { getMessageThunk, sendMessageThunk } from "./message.thunk";

const initialState = {
  buttonLoading: false,
  screenLoading: false,
  messages: null,
  error: null,
  lastMessageId: null,
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setNewMessage: (state, action) => {
      const oldMessages = state.messages ?? [];
      // Prevent duplicate messages
      if (!oldMessages.some(msg => msg.messageId === action.payload.messageId)) {
        state.messages = [...oldMessages, action.payload];
        state.lastMessageId = action.payload.messageId;
      }
    },
    clearMessages: (state) => {
      state.messages = null;
      state.error = null;
      state.lastMessageId = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.buttonLoading = false;
      state.screenLoading = false;
    },
  },
  extraReducers: (builder) => {
    // send message
    builder.addCase(sendMessageThunk.pending, (state) => {
      state.buttonLoading = true;
      state.error = null;
    });
    builder.addCase(sendMessageThunk.fulfilled, (state, action) => {
      const oldMessages = state.messages ?? [];
      if (action.payload?.responseData) {
        // Prevent duplicate messages
        if (!oldMessages.some(msg => msg.messageId === action.payload.responseData.messageId)) {
          state.messages = [...oldMessages, action.payload.responseData];
          state.lastMessageId = action.payload.responseData.messageId;
        }
      }
      state.buttonLoading = false;
      state.error = null;
    });
    builder.addCase(sendMessageThunk.rejected, (state, action) => {
      state.buttonLoading = false;
      state.error = action.payload || 'Failed to send message';
    });

    // get messages
    builder.addCase(getMessageThunk.pending, (state) => {
      state.screenLoading = true;
      state.buttonLoading = true;
      state.error = null;
    });
    
    builder.addCase(getMessageThunk.fulfilled, (state, action) => {
      state.messages = action.payload?.responseData?.messages || [];
      state.buttonLoading = false;
      state.screenLoading = false;
      state.error = null;
      if (state.messages.length > 0) {
        state.lastMessageId = state.messages[state.messages.length - 1].messageId;
      }
    });
    
    builder.addCase(getMessageThunk.rejected, (state, action) => {
      state.messages = [];
      state.buttonLoading = false;
      state.screenLoading = false;
      state.error = action.payload || 'Failed to fetch messages';
      state.lastMessageId = null;
    });
  },
});

export const { setNewMessage, clearMessages, setError } = messageSlice.actions;

export default messageSlice.reducer;