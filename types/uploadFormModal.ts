import {
  Control,
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import { SongUploadForm } from "./form";

export type UploadFormModalProps = {
  fileLabel?: string;
  register: UseFormRegister<SongUploadForm>;
  control?: Control<any>;
  watch: UseFormWatch<SongUploadForm>;
  onSubmit?: () => Promise<void>;
  errors?: FieldErrors<SongUploadForm>;
  setValue: UseFormSetValue<SongUploadForm>;
}

export type UploadFormModal = UploadFormModalProps;
