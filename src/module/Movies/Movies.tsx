import { Flex, Input, Tabs } from 'antd';
import { Pagination } from '../../ui';
import { useEffect, useMemo, useState } from 'react';
import { Card } from './Card';
import { MoviesService } from '../../service/api/moviesService';

type UnwrapPromise<T> = T extends Promise<infer K> ? K : T

const api = new MoviesService()
const counterCurrentPage = 5; //Кол - во элементов на одну стр.


function Movies() {
  const [currentPage, setCurrentPage] = useState(0)
  const [movies, setMovies] = useState<UnwrapPromise<ReturnType<typeof api.getPopularMovie>>['results']>([])

  useEffect(() => {
    async function getData() {
      const data = await api.getPopularMovie('ru-US', 1, {
        "Authorization": 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDEwYTMzMTg4ZWZkOTU3YWMzMzlhNTljNzY2MmJiOCIsInN1YiI6IjY1OWJmNWY1Y2E0ZjY3MDFhNDNkN2YwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.J-1PvFXJi6TEswEbh8Ra-NiwID1KZxyLNKXPMQZACEY',
        "accept": 'application/json'
      })
      console.log(data)
      setMovies(data.results)
      setCurrentPage(1)
    }
    getData()
  }, [])

  const currentPageMovies = useMemo(() => {
    const lastIndex = currentPage * counterCurrentPage; // 3 === 3 * 5 = 15
    const firstIndex = lastIndex - counterCurrentPage; // 3 === 15 - 5 = 10

    return movies.slice(firstIndex, lastIndex) // 3 === от 10 до 15 = 5 элементов
  }, [currentPage, movies])

  return (
    //Warning: [antd: Tabs] `Tabs.TabPane` is deprecated.
    <Tabs tabBarStyle={{ width: '140px', margin: '0 auto 19px auto' }} size='large' centered>
      <Tabs.TabPane tab="Search" key="item-1">
        <Input size="large" placeholder="Type to search..." />
        <Flex gap="middle" justify='center' wrap='wrap'>
          {currentPageMovies.map((movie) => <Card key={movie.id} movie={movie} />)}
        </Flex>
        <br />
        <br />
        <Flex gap="middle" justify='center'>
          <Pagination onChange={(event) => setCurrentPage(event)} type='primary' defaultPageSize={counterCurrentPage} className='movie__pagination' total={20} />
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