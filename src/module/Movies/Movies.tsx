import { Tabs } from 'antd';
import { Search } from './Search';

function Movies() {
  return (
    //Warning: [antd: Tabs] `Tabs.TabPane` is deprecated.
    <Tabs tabBarStyle={{ width: '129px', margin: '0 auto 19px auto' }} size='large' centered>
      <Tabs.TabPane tab="Search" key="item-1">
        <Search />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Rated" key="item-2">
        Content
      </Tabs.TabPane>
    </Tabs>
  )
}

export { Movies }