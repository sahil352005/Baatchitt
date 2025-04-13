import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageThunk } from "../../store/slice/message/message.thunk";

const SendMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.userReducer);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser?.userId) return;
    
    dispatch(
      sendMessageThunk({
        receiverId: selectedUser?.userId,
        message,
      })
    );
    setMessage('');
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="w-full p-3 flex gap-2 border-t border-gray-700/30">
      <input
        type="text"
        placeholder="Type here..."
        className="input input-bordered w-full bg-gray-800/50"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        onClick={handleSendMessage}
        className="btn btn-circle btn-primary"
        disabled={!message.trim()}
      >
        <IoIosSend size={20} />
      </button>
    </div>
  );
};

export default SendMessage;
