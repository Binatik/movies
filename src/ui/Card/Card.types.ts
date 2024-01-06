import { CardProps } from 'antd/lib/card';
import { CardType } from 'antd/lib/card/Card';

export type ICustumType = 'primary'

export type ICard = {
  children: React.ReactNode
  type?: CardType | ICustumType
} & Omit<CardProps, 'type'>