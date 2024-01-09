import { Flex, Input, Tabs } from 'antd';
import { Pagination } from '../../ui';
import { useEffect, useMemo, useState } from 'react';
import { Card } from './Card';
import { MoviesService } from '../../service/api/MoviesService';
import Cookies from "js-cookie";

type UnwrapPromise<T> = T extends Promise<infer K> ? K : T

const cachePages = new Map<number, number>()
const api = new MoviesService()
const counterCurrentPage = 5; //Кол - во элементов на одну стр.

api.getCreateGuestSession({
  "Authorization": api.getKey(),
  "accept": 'application/json'
}).then((data) => {
  Cookies.set('guest_session_id', data.guest_session_id)
})


function Movies() {
  const [currentPage, setCurrentPage] = useState(0)
  const [popularMovies, setPopularMovies] = useState<UnwrapPromise<ReturnType<typeof api.getPopularMovie>>['results']>([])

  console.log(popularMovies)

  useEffect(() => {
    async function getData() {
      const data = await api.getPopularMovie('ru-US', 1, {
        "Authorization": api.getKey(),
        "accept": 'application/json'
      })

      setPopularMovies(data.results)
      setCurrentPage(1)
    }
    getData()
  }, [])

  const currentPagePopularMovies = useMemo(() => {
    const lastIndex = currentPage * counterCurrentPage; // 3 === 3 * 5 = 15
    const firstIndex = lastIndex - counterCurrentPage; // 3 === 15 - 5 = 10

    return popularMovies.slice(firstIndex, lastIndex) // 3 === от 10 до 15 = 5 элементов
  }, [currentPage, popularMovies])

  async function followPagination(event: number) {
    setCurrentPage(event)

    if (event % 4 !== 0) {
      return
    }

    const getPageServer = Math.floor(event / counterCurrentPage) + 1

    if (!cachePages.has(getPageServer)) {
      const data = await api.getPopularMovie('ru-US', getPageServer, {
        "Authorization": api.getKey(),
        "accept": 'application/json'
      })

      cachePages.set(getPageServer, getPageServer)

      setPopularMovies((prev) => {
        return [...prev, ...data.results]
      })
    }
  }

  return (
    //Warning: [antd: Tabs] `Tabs.TabPane` is deprecated.
    <Tabs tabBarStyle={{ width: '140px', margin: '0 auto 19px auto' }} size='large' centered>
      <Tabs.TabPane tab="Search" key="item-1">
        <Input size="large" placeholder="Type to search..." />
        <Flex gap="middle" justify='center' wrap='wrap'>
          {currentPagePopularMovies.map((movie) => <Card key={movie.id} movie={movie} />)}
        </Flex>
        <br />
        <br />
        <Flex gap="middle" justify='center'>
          <Pagination onChange={followPagination} type='primary' defaultPageSize={counterCurrentPage} className='movie__pagination' total={popularMovies.length} />
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