import { Auth } from "aws-amplify";
import { useState } from "react";

const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<any>();

  const sendEmail = async (email: string) => {
    try {
      setIsLoading(true);
      const sendEmailResponse = await Auth.forgotPassword(email);
      if (sendEmailResponse) {
        return setIsSuccess(true);
      }
    } catch (error: any) {
      return setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, isSuccess, error, sendEmail };
};

export default usePasswordReset;
