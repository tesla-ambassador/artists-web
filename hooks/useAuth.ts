import {
  AuthState,
  updateAuth,
  UserAttributes,
  customAttributes,
} from "@/store/authSlice";
import { Auth, Amplify } from "aws-amplify";
import { useState, useEffect } from "react";
import { useAppDispatch } from ".";
import { RegisterProps } from "@/types/form";
import { getCountryNameByPhone } from "@/utils/country";
import getUsername from "@/utils/getUsername";
import amplifyConfig from "@/config/amplifyAuth";
import axios from "axios";

Amplify.configure({
  aws_appsync_graphqlEndpoint: process.env.NEXT_PUBLIC_AWS_GQL_ENDPOINT,
  aws_appsync_region: process.env.NEXT_PUBLIC_AWS_STORAGE_REGION,
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  Auth: amplifyConfig,
  Storage: {
    AWSS3: {
      bucket: process.env.NEXT_PUBLIC_AWS_RAW_AUDIO_BUCKET, // REQUIRED -  Amazon S3 bucket name
      region: process.env.NEXT_PUBLIC_AWS_STORAGE_REGION,
    },
  },
});

const useAuth = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const getAuthenticatedUser = async () => {
    try {
      const { signInUserSession } = await Auth.currentAuthenticatedUser();
      const {
        id: cognitoId,
        username,
        attributes,
      } = await Auth.currentUserInfo();

      const {
        name,
        phone_number,
        picture,
        phone_number_verified,
        email,
        email_verified,
        address,
        locale,
        website,
        timezone,
        updated_at,
        based_country,
        based_region,
        nickname,
      } = attributes;

      const userAttributes: UserAttributes = {
        name,
        nickname,
        phone_number,
        phone_number_verified,
        email,
        email_verified,
        locale,
        address,
        picture,
        website,
        timezone,
        updated_at,
        based_country,
        based_region,
      };

      customAttributes.forEach((attr) => {
        // @ts-ignore
        // NOTE: Fix TS error
        userAttributes[attr] = attributes[`custom:${attr}`];
      });

      const authState: AuthState = {
        isAuthenticated: true,
        user: userAttributes,
        details: {
          id: cognitoId,
          username: username,
          auth: {
            token: signInUserSession.accessToken.jwtToken,
            expiry_at: signInUserSession.accessToken.payload.exp,
            iat: signInUserSession.accessToken.payload.iat,
          },
        },
      };

      dispatch(updateAuth(authState));
    } catch (error) {
      console.log("Error occurred while authenticating", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAuthenticatedUser();
  }, []);

  const signIn = async (emailID: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await Auth.signIn({
        username: emailID,
        password,
      });
      const currentUser = await Auth.currentUserInfo();

      const {
        name,
        phone_number,
        nickname,
        picture,
        phone_number_verified,
        email,
        email_verified,
        address,
        locale,
        website,
        timezone,
        updated_at,
      } = response.attributes;
      localStorage.setItem("email", email.toLowerCase().trim());
      const userAttributes: UserAttributes = {
        name,
        nickname,
        phone_number,
        phone_number_verified,
        email,
        email_verified,
        locale,
        address,
        picture,
        website,
        timezone,
        updated_at,
      };

      customAttributes.forEach((attr) => {
        // @ts-ignore
        // NOTE: Fix TS error
        userAttributes[attr] = response.attributes[`custom:${attr}`];
      });

      const authRes: AuthState = {
        isAuthenticated: true,
        user: userAttributes,
        details: {
          id: currentUser.id,
          username: currentUser.username,
          auth: {
            token: response.signInUserSession.accessToken.jwtToken,
            expiry_at: response.signInUserSession.accessToken.payload.exp,
            iat: response.signInUserSession.accessToken.payload.iat,
          },
        },
      };

      return dispatch(updateAuth(authRes));
    } catch (error: any) {
      console.log("SignIn Error", error);
      const errorMsg = error.message ?? "Unknown error occured!";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (formData: RegisterProps) => {
    setIsLoading(true);
    const userLocale =
      navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;
    try {
      const response = await Auth.signUp({
        username: formData.email.toLowerCase().trim(),
        password: formData.password,
        attributes: {
          email: formData.email,
          phone_number: formData?.phone,
          updated_at: Date.now().toString(),
          name: formData.name,
          //TODO: Generate avatar on user register on backend
          picture: "ziki-avatar",
          preferred_username: getUsername(formData.email),
          locale: userLocale,
          "custom:country": getCountryNameByPhone(formData.country_code.value),
          "custom:is_artist": "yes",
        },
      });

      await createSonoArtist({
        email: formData.email,
        phone: formData?.phone,
        name: formData.name,
        country: getCountryNameByPhone(formData.country_code.value),
      });
      localStorage.setItem("email", formData.email.toLowerCase().trim());
      return response;
    } catch (error: any) {
      // console.log("SignUp Error", error);
      const errorMsg = error.message ?? "Unknown error occured!";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, signIn, signUp };
};

interface SonaFormData {
  email: string;
  phone: string;
  name: string;
  country: string;
}

interface ApiResponse {
  status: "success" | "error";
}

const createSonoArtist = async (formData: SonaFormData): Promise<void> => {
  try {
    await axios.post<ApiResponse>(
      `${process.env.ENV_CONSOLE_ENDPOINT}/artists/api/create/`,
      {
        email: formData.email,
        phone_number: formData?.phone,
        artiste_usernames: formData.name,
        country: getCountryNameByPhone(formData.country),
      },
      {
        headers: {
          "X-Api-Key": "gXhq9xOv.Gk6yIzFtWIETj7LyXBOTtFSxV706PgNa",
          "Content-type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error creating artist:", error);
    throw error;
  }
};

export default useAuth;
