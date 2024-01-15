import { SpinProps } from "antd";

export type ISpinOutlinedProps = {
  children: React.ReactNode;
  isLoading: boolean;
  isErrorApi: boolean;
} & SpinProps;
