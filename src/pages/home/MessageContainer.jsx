import React, { useEffect, useRef } from "react";
import User from "./User";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { getMessageThunk } from "../../store/slice/message/message.thunk";
import SendMessage from "./SendMessage";

const MessageContainer = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.userReducer);
  const { messages } = useSelector((state) => state.messageReducer);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?.userId) {
      dispatch(getMessageThunk({ receiverId: selectedUser.userId }));
    }
  }, [selectedUser?.userId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createUniqueKey = (messageDetails) => {
    if (!messageDetails) return `empty-${Date.now()}-${Math.random()}`;
    
    return `${messageDetails.messageId}-${messageDetails.senderId}-${messageDetails.createdAt}`;
  };

  const renderMessages = () => {
    if (!Array.isArray(messages)) return null;

    return messages.map((messageDetails, index) => (
      <Message
        key={createUniqueKey(messageDetails)}
        messageDetails={messageDetails}
      />
    ));
  };

  return (
    <>
      {!selectedUser ? (
        <div className="w-full flex items-center justify-center flex-col gap-5">
          <h2 className="text-2xl font-bold text-[#7480FF]">Welcome to GUP SHUP</h2>
          <p className="text-xl">Please select a person to continue your chat!</p>
        </div>
      ) : (
        <div className="h-screen w-full flex flex-col">
          <div className="p-3 border-b border-b-white/10">
            <User userDetails={selectedUser} />
          </div>

          <div className="h-full overflow-y-auto p-3 flex flex-col gap-2">
            {messages === null ? (
              <div className="flex items-center justify-center h-full">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : messages?.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                No messages yet. Start the conversation!
              </div>
            ) : (
              renderMessages()
            )}
            <div ref={messagesEndRef} />
          </div>

          <SendMessage />
        </div>
      )}
    </>
  );
};

export default MessageContainer;