import { Auth } from "aws-amplify";
import { useState } from "react";

const useOTPVerification = () => {
  const initialState = {
    isLoading: false,
    isSuccess: false,
    error: undefined,
  };

  const [sendOTPStatus, setSendOTPStatus] = useState(initialState);
  const [verifyOTPStatus, setVerifyOTPStatus] = useState(initialState);

  const sendOTP = async (username: string) => {
    try {
      setSendOTPStatus((state) => ({ ...state, isLoading: true }));
      const sendOTPResponse = await Auth.resendSignUp(username);
      if (sendOTPResponse) {
        return setSendOTPStatus((state) => ({ ...state, isSuccess: true }));
      }
    } catch (error: any) {
      return setSendOTPStatus((state) => ({ ...state, error: error.message }));
    } finally {
      setSendOTPStatus((state) => ({ ...state, isLoading: false }));
    }
  };

  const verifyOTP = async (username: string, otp: string) => {
    try {
      setVerifyOTPStatus((state) => ({ ...state, isLoading: true }));
      const verifyOTPResponse = await Auth.confirmSignUp(username, otp);
      if (verifyOTPResponse === "SUCCESS") {
        return setVerifyOTPStatus((state) => ({ ...state, isSuccess: true }));
      }
    } catch (error: any) {
      return setVerifyOTPStatus((state) => ({
        ...state,
        error: error.message,
      }));
    } finally {
      setVerifyOTPStatus((state) => ({ ...state, isLoading: false }));
    }
  };

  return {
    sendOTPStatus,
    verifyOTPStatus,
    sendOTP,
    verifyOTP,
  };
};

export default useOTPVerification;
