import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import User from "./User";
import { useDispatch, useSelector } from "react-redux";
import {
  getOtherUsersThunk,
  logoutUserThunk,
} from "../../store/slice/user/user.thunk";

const UserSidebar = () => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  
  const { 
    otherUsers, 
    userProfile, 
    screenLoading,
    isAuthenticated
  } = useSelector((state) => state.userReducer);

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
  };

  useEffect(() => {
    if (!searchValue) {
      setUsers(otherUsers);
    } else {
      setUsers(
        otherUsers?.filter((user) => {
          return (
            user.username?.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.fullName
              ?.toLowerCase()
              .includes(searchValue.toLocaleLowerCase())
          );
        }) || []
      );
    }
  }, [searchValue, otherUsers]);

  useEffect(() => {
    console.log("UserSidebar: Mounting. Dispatching getOtherUsersThunk.");
    dispatch(getOtherUsersThunk());
  }, [dispatch]);

  return (
    <div className="w-80 h-screen flex flex-col border-r border-r-white/10 bg-gray-800 text-white">
      <div className="p-3 border-b border-b-white/10">
        <h1 className="text-center text-[#7480FF] text-xl font-semibold">
          GUP SHUP
        </h1>
      </div>

      <div className="p-3">
        <label className="input input-bordered flex items-center gap-2 bg-gray-700 border-gray-600 focus-within:border-primary transition-colors">
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            className="grow bg-transparent placeholder-gray-400 text-sm"
            placeholder="Search Users..."
            value={searchValue}
          />
          <IoSearch className="text-gray-400" />
        </label>
      </div>

      <div className="flex-grow h-full overflow-y-auto px-3 flex flex-col gap-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
        {users?.length > 0 ? (
          users.map((userDetails) => (
            <User key={userDetails?.userId} userDetails={userDetails} />
          ))
        ) : (
          !screenLoading && (!otherUsers || otherUsers.length === 0) && (
            <p className="text-center text-gray-400 py-4 text-sm">No users found.</p>
          )
        )}
      </div>

      <div className="flex items-center justify-between p-3 border-t border-t-white/10 mt-auto shrink-0">
        {screenLoading ? (
          <div className="flex items-center gap-3 animate-pulse" aria-label="Loading profile...">
            <div className="bg-gray-700 w-10 h-10 rounded-full"></div>
            <div>
              <div className="bg-gray-700 h-4 w-24 rounded mb-1"></div>
              <div className="bg-gray-700 h-3 w-16 rounded"></div>
            </div>
          </div>
        ) : userProfile ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="avatar flex-shrink-0">
              <div className="ring-primary ring-offset-gray-800 w-10 rounded-full ring ring-offset-2">
                <img src={userProfile?.avatar} alt={`${userProfile?.username}'s avatar`} className="object-cover"/>
              </div>
            </div>
            <div className="truncate">
              <h2 className="font-medium text-sm truncate" title={userProfile?.fullName}>{userProfile?.fullName}</h2>
              <p className="text-xs text-gray-400 truncate" title={`@${userProfile?.username}`}>@{userProfile?.username}</p>
            </div>
          </div>
        ) : isAuthenticated ? (
          <div className="flex items-center gap-3 text-red-400">
            <div className="avatar placeholder flex-shrink-0">
              <div className="bg-red-900 text-red-300 ring-error ring-offset-gray-800 w-10 rounded-full ring ring-offset-2">
                <span>!</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold">Profile Error</p>
              <p className="text-xs">Could not load.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-gray-500">
            <div className="avatar placeholder flex-shrink-0">
              <div className="bg-gray-700 text-neutral-content rounded-full w-10"></div>
            </div>
            <div className="h-4 w-20 bg-gray-700 rounded"></div>
          </div>
        )}

        <button 
          onClick={handleLogout} 
          className="btn btn-ghost btn-circle text-error hover:bg-error/20 transition-colors"
          title="Logout"
          disabled={screenLoading}
        >
          <CiLogout size={24} />
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;