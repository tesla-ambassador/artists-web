import { UserAttributes } from "@store/authSlice";
import {
  Control,
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";

export interface ProfileFormProps {
  register: UseFormRegister<UserAttributes>;
  control?: Control<any>;
  watch?: UseFormWatch<UserAttributes>;
  onSubmit?: () => Promise<void>;
  errors?: FieldErrors<UserAttributes>;
}
