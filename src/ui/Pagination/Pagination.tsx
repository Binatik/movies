import { Pagination as PaginationAntd } from "antd";
import { IPaginationProps } from "./Pagination.types";
import classNames from "classnames";
import "./Pagination.css";

function Pagination({ type, ...props }: IPaginationProps) {
  return (
    <PaginationAntd
      {...props}
      className={classNames({
        ["paginatio--primary"]: type === "primary",
      })}
    />
  );
}

export { Pagination };
