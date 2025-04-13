import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../store/slice/user/user.slice";

const User = ({ userDetails }) => {
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.userReducer);
  const { onlineUsers } = useSelector(state => state.socketReducer);
  const isUserOnline = onlineUsers?.includes(userDetails?.userId);

  const handleUserClick = () => {
    dispatch(setSelectedUser(userDetails));
  };

  return (
    <div
      onClick={handleUserClick}
      className={`flex gap-4 items-center hover:bg-gray-700/50 rounded-lg py-2 px-3 cursor-pointer ${
        userDetails?._id === selectedUser?.userId && "bg-gray-700/50"
      }`}
    >
      <div className={`avatar ${isUserOnline && 'online'}`}>
        <div className="w-12 rounded-full">
          <img src={userDetails?.avatar} />
        </div>
      </div>
      <div className="flex-1">
        <h2 className="line-clamp-1 font-medium">{userDetails?.fullName}</h2>
        <p className="text-xs text-gray-400">{userDetails?.username}</p>
      </div>
    </div>
  );
};

export default User;
