import { Flex, Input } from 'antd';
import { Card } from '../Card';

function Search() {
  return (
    <>
      <Input size="large" placeholder="Type to search..." />
      <Flex gap="middle" justify='center' wrap='wrap'>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </Flex>
    </>
  )
}

export { Search }