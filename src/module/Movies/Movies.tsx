import { Flex, Tabs } from 'antd';
import { Search } from './Search';
import { Pagination } from '../../ui';

function Movies() {
  return (
    //Warning: [antd: Tabs] `Tabs.TabPane` is deprecated.
    <Tabs tabBarStyle={{ width: '140px', margin: '0 auto 19px auto' }} size='large' centered>
      <Tabs.TabPane tab="Search" key="item-1">
        <Search />
        <br />
        <br />
        <Flex gap="middle" justify='center'>
          <Pagination type='primary' className='movie__pagination' total={50} />
        </Flex>
        <br />
        <br />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Rated" key="item-2">
        Content
      </Tabs.TabPane>
    </Tabs>
  )
}

export { Movies }