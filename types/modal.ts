import React from "react";

export interface ModalProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  visible: boolean;
  footer?: boolean;
  closable?: boolean;
  processing?: boolean;
  onClose?: () => void;
  maskClosable?: boolean;
  progressValue?: number;
  status?: string;
}

export type Modal = ModalProps;
