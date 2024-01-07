import { CardProps } from 'antd/lib/card';
import { CardType } from 'antd/lib/card/Card';

export type ICustumCardType = 'primary'

export type ICardProps = {
  children: React.ReactNode
  type?: CardType | ICustumCardType
} & Omit<CardProps, 'type'>