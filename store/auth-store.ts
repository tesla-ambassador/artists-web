import { createStore } from "zustand";
import { User } from "@/types/authDataTypes";

export type AuthState = {
  user: User;
  isLoggedIn: boolean;
  firstSignIn: boolean;
};

export type AuthActions = {
  signupUser: (newUser: User) => void;
  deleteUser: (userId: string) => void;
  loginUser: (currentUser: User) => void;
  logoutUser: (userId: string) => void;
};

export type AuthStoreState = AuthState & AuthActions;
