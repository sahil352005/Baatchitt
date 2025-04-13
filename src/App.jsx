import { useEffect } from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileThunk } from "./store/slice/user/user.thunk";
import { Outlet } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  // const { isAuthenticated } = useSelector((state) => state.userReducer); // Not strictly needed here

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      console.log("App.jsx: Token found, dispatching getUserProfileThunk.");
      // Dispatch profile fetch on initial load if token exists
      dispatch(getUserProfileThunk());
    } else {
      console.log("App.jsx: No token found, skipping initial profile fetch.");
    }
  }, [dispatch]); // dispatch is stable, effect runs once on mount

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Outlet />
    </>
  );
}

export default App;
