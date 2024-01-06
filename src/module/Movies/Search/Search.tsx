import { Input } from 'antd';
import { Card } from '../Card';

function Search() {
  return (
    <>
      <Input size="large" placeholder="Type to search..." />
      <Card />
    </>
  )
}

export { Search }