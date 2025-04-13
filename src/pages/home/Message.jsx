import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Message = ({ messageDetails }) => {
  const messageRef = useRef(null);
  const { userProfile, selectedUser } = useSelector(
    (state) => state.userReducer
  );
  
  const isCurrentUser = userProfile?.userId === messageDetails?.senderId;

  // Default avatar based on user type
  const defaultAvatar = "https://avatar.iran.liara.run/public/boy?username=default";

  // Get appropriate avatar with fallback
  const getAvatarSrc = () => {
    if (isCurrentUser) {
      return userProfile?.avatar || defaultAvatar;
    }
    return messageDetails?.senderAvatar || defaultAvatar;
  };

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div
      ref={messageRef}
      className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}
    >
      <div className="chat-image avatar">
        <div className="w-8 rounded-full">
          <img
            alt={`${isCurrentUser ? 'Your' : 'Sender'}'s avatar`}
            src={getAvatarSrc()}
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = defaultAvatar;
            }}
          />
        </div>
      </div>
      <div className="chat-bubble bg-gray-700/70 text-white">
        {messageDetails?.message || ""}
      </div>
      <div className="chat-footer opacity-50 text-xs">
        <time>
          {messageDetails?.createdAt 
            ? new Date(messageDetails.createdAt).toLocaleTimeString()
            : new Date().toLocaleTimeString()}
        </time>
      </div>
    </div>
  );
};

export default Message;