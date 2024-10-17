// Import necessary dependencies
import React, { useEffect } from "react";
import Routes from "./routes/Routes";
import { useDispatch } from "react-redux";
import { setCredentials } from "./features/auth/authSlice";

const App = () => {
  // Get the dispatch function from Redux
  const dispatch = useDispatch();

  useEffect(() => {
    // This effect runs once when the component mounts
    // It checks for saved authentication state in localStorage
    const savedAuthState = localStorage.getItem("authState");
    if (savedAuthState) {
      // If auth state exists, parse it from JSON
      const { user, session } = JSON.parse(savedAuthState);
      if (user && session) {
        // If both user and session data are present, update the Redux store
        dispatch(setCredentials({ user, session }));
      }
    }
  }, [dispatch]); // This effect depends on dispatch, but it won't change

  return <Routes />;
};

export default App;
