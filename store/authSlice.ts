import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticated: boolean;
  user?: UserAttributes;
  details?: {
    id: string; // attributes.sub
    username: string; // username
    auth: {
      token: string; // signInUserSession.accessToken.jwtToken
      expiry_at: number | null; // signInUserSession.accessToken.payload.exp
      iat: number | null; // signInUserSession.accessToken.payload.iat
    };
  };
}

interface CountryInterface {
  label: string;
  value: string;
}

export interface CustomAttributes {
  is_artist?: string;
  country?: CountryInterface;
  city?: string;
  street?: string;
  postal_code?: string;
  paypal_email?: string;
  company_name?: string;
  vat_number?: string;
  country_phone_number?: string;
  based_country?: string;
  based_region?: string;
  email_alerts?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  facebook?: string;
  role?: string;
  influencers?: string;
  genre?: string;
}

export interface UserAttributes extends CustomAttributes {
  name: string; // attributes.name
  nickname: string;
  picture: string;
  phone_number: string; // attributes.phone_number
  phone_number_verified: string;
  email: string;
  email_verified: string;
  address?: string;
  locale?: string;
  website?: string;
  timezone?: string;
  updated_at?: string;
  country_code?: { label: string; value: string };
}

const initialState: AuthState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuth(state, action: PayloadAction<AuthState>) {
      state.details = action.payload.details;
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
  },
});

export const customAttributes = [
  "is_artist",
  "country",
  "email_alerts",
  "based_region",
  "based_country",
  "instagram",
  "twitter",
  "youtube",
  "facebook",
  "role",
  "influencers",
  "genre",
  "bio",
];

export const standardAttributes = [
  "name",
  "nickname",
  "picture",
  "phone_number",
  "email",
  "address",
  "locale",
  "website",
  "timezone",
  "updated_at",
];

export const { updateAuth } = authSlice.actions;

export default authSlice.reducer;
