import { Spin as SpinAntd } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ISpinOutlinedProps } from "./SpinOutlined.types";

function SpinOutlined({
  isErrorApi,
  isLoading,
  children,
  ...props
}: ISpinOutlinedProps) {
  return (!isErrorApi && isLoading) || (!isErrorApi && isLoading) ? (
    <SpinAntd
      {...props}
      indicator={
        <LoadingOutlined style={{ fontSize: 24, marginTop: 30 }} spin />
      }
    />
  ) : (
    children
  );
}

export { SpinOutlined };
