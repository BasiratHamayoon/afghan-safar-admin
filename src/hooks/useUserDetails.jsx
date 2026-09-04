import { useState, useEffect } from "react";
import { getDetailsFromAuthToken } from "../actions";

const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);

  const [error, setError] = useState(null);

  const callerFunc = async () => {
    const res = await getDetailsFromAuthToken();
    if (!res) setError("Some Error Occurred!");
    if (res) setUserDetails(res);
  };

  useEffect(() => {
    callerFunc();
  }, []);

  return [userDetails, callerFunc, error];
};

export default useUserDetails;
