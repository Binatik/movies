import classNames from "classnames";
import { ICard } from "./Card.types";
import { Card as CardAntd } from "antd";
import './Card.css'

function Card({ children, type, className, ...props }: ICard) {
  const style = {
    display: `${type === 'primary' && 'flex'}`,
  }

  return (
    <CardAntd {...props} bodyStyle={style}
      className={classNames(className, {
        ['card--primary']: type === 'primary'
      })}>
      {children}
    </CardAntd>
  )
}

export { Card }