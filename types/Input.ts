import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Control, RegisterOptions } from "react-hook-form";

export interface FileUploaderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // eslint-disable-next-line no-unused-vars
  onFileDrop: (file: File) => void;
  label?: string;
  active?: boolean;
  error?: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorText?: string;
  label?: string;
  labelAlt?: string;
  adaption?: "outline" | "default" | "underline";
  themeColor?: "primary" | "secondary" | "white";
  labelClassName?: string;
  control?: Control;
  name: string;
  rules?: RegisterOptions;
  tooltip?: string;
  adornment?: ReactNode,
  adornmentPosition?: "left" | "right";
  adornmentClassName?: string;
}

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  errorText?: string;
  className?: string;
  label?: string;
  labelAlt?: string;
  adaption?: "outline" | "default" | "underline";
  themeColor?: "primary" | "secondary" | "white";
  labelClassName?: string;
  control?: Control;
  name: string;
  rules?: RegisterOptions;
  tooltip?: string;
}
