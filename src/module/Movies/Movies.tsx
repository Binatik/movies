// import { Alert, Flex, Input, Spin, Tabs } from 'antd';
// import { Pagination } from '../../ui';
// import { useEffect, useMemo, useState } from 'react';
// import { Card } from './Card';
// import { MoviesService } from '../../service/api/MoviesService';
// import Cookies from "js-cookie";
// import { LoadingOutlined } from '@ant-design/icons';

// type UnwrapPromise<T> = T extends Promise<infer K> ? K : T

// const cachePages = new Map<number, number>()
// const api = new MoviesService()
// const counterCurrentPage = 5; //Кол - во элементов на одну стр.
// let pageServer = 1;

// const headers = {
//   "Authorization": api.getToken,
//   "accept": 'application/json'
// }

// function Movies() {
//   const [currentPage, setCurrentPage] = useState(0)
//   const [popularMovies, setPopularMovies] = useState<UnwrapPromise<ReturnType<typeof api.getPopularMovie>>['results']>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [isApiError, setIsApiError] = useState(false)
//   const [isErrorPopularMovies, setIsErrorPopularMovies] = useState(false)

//   const currentPagePopularMovies = useMemo(() => {
//     const lastIndex = currentPage * counterCurrentPage; // 3 === 3 * 5 = 15
//     const firstIndex = lastIndex - counterCurrentPage; // 3 === 15 - 5 = 10

//     return popularMovies.slice(firstIndex, lastIndex) // 3 === от 10 до 15 = 5 элементов
//   }, [currentPage, popularMovies])

//   useEffect(() => {
//     async function getSession() {
//       const isSession = Cookies.get('guest_session_id')

//       if (!isSession) {
//         await api.getCreateGuestSession(headers).then((data) => {
//           Cookies.set('guest_session_id', data.guest_session_id, { expires: 1 })
//         }).catch((error) => {
//           if (!api.isApiError(error)) {
//             throw error
//           }

//           setIsLoading(false)
//           setIsApiError(true)
//         })
//       }
//     }

//     getSession()
//   }, [])

//   useEffect(() => {
//     const isSession = Cookies.get('guest_session_id')
//     if (!isSession) return

//     async function getData() {
//       const data = await api.getPopularMovie('ru-US', 1, headers).catch((error) => {
//         if (!api.isApiError(error)) {
//           throw error
//         }

//         setIsApiError(true)
//         setIsLoading(false)
//         throw error
//       }).catch((error) => {
//         if (!api.isApiRes(error)) {
//           throw error
//         }

//         setIsApiError(false)
//         setIsErrorPopularMovies(true)
//         throw error
//       })
//       // const data = await api.getSearchMovies('по', true, 'ru-US', 1, headers)
//       setPopularMovies(data.results)
//       setCurrentPage(1)
//       setIsLoading(false)
//     }
//     getData()
//   }, [isApiError])

//   useEffect(() => {
//     const isSession = Cookies.get('guest_session_id')
//     if (!isSession) return

//     async function getData() {
//       const data = await api.getRatedMovies('ru-US', 1, 'created_at.asc')
//       console.log(data)
//     }
//     getData()
//   }, [])

//   async function followPagination(event: number) {
//     setCurrentPage(event)

//     if (event % 4 !== 0) {
//       return
//     }


//     if (!cachePages.has(pageServer)) {
//       const data = await api.getPopularMovie('ru-US', pageServer, headers)

//       cachePages.set(pageServer, pageServer)
//       pageServer += 1

//       setPopularMovies((prev) => {
//         return [...prev, ...data.results]
//       })
//     }
//   }

//   console.log(isErrorPopularMovies)
//   return (
//     //Warning: [antd: Tabs] `Tabs.TabPane` is deprecated.
//     <Tabs tabBarStyle={{ width: '140px', margin: '0 auto 19px auto' }} size='large' centered>
//       <Tabs.TabPane tab="Search" key="item-1">
//         {isApiError && (
//           <>
//             <Alert
//               message="Ошибка при загрузке фильмов"
//               description="Мы не смогли послать запрос, возможно проблемы с интернетом!"
//               type="warning"
//               showIcon
//               closable
//             />
//             <br />
//           </>
//         )}
//         <Input size="large" placeholder="Type to search..." />
//         <Flex gap="middle" justify='center' wrap='wrap'>
//           {isErrorPopularMovies ? <h1>Ошибка загрузки</h1>
//             : isLoading && <Spin indicator={<LoadingOutlined style={{ fontSize: 24, marginTop: 30 }} spin />} />
//             || currentPagePopularMovies.map((movie) => <Card key={movie.id} movie={movie} />)}
//         </Flex>
//         <br />
//         <br />
//         <Flex gap="middle" justify='center'>
//           {popularMovies.length > 1 && <Pagination onChange={followPagination} type='primary' defaultPageSize={counterCurrentPage} className='movie__pagination' total={popularMovies.length} />}
//         </Flex>
//         <br />
//         <br />
//       </Tabs.TabPane>
//       <Tabs.TabPane tab="Rated" key="item-2">
//         Content
//       </Tabs.TabPane>
//     </Tabs>
//   )
// }

// export { Movies }

import { Alert, Flex, Input, Tabs } from 'antd';
import { Pagination, SpinOutlined } from '../../ui';
import { useEffect, useMemo, useState } from 'react';
import { Card } from './Card';
import { MoviesService } from '../../api/MoviesService';
import Cookies from "js-cookie";
import { IMoviesFilter } from './Movies.types';
import { isSessionMovies } from '../../app/App';
import { IFetchError, IServerError } from '../../api/api.types';
import { getElementsPagination } from '../../helpers/getElementsPagination';

const api = new MoviesService()
const templateMovies: IMoviesFilter = {
  loading: true,
  data: null,
  payload: null,

  error: {
    message: 'FetchError',
    status: false,
    payload: null
  },
}

let pageServer = 1;
let currentNumberPagePagination = 1

const cachePages = new Map<number, number>()
const counterCurrentPage = 5; //Кол - во элементов на одну стр.

const rootHeaders = {
  "Authorization": api.getToken,
  "accept": 'application/json'
}

function Movies() {
  const [errorApi, setErrorApi] = useState<IMoviesFilter['error']>({
    message: 'FetchError',
    status: false,
    payload: null
  }) //Для обработки если проблемы с сетью, должен быть глобален.

  const [popularMovies, setPopularMovies] = useState(templateMovies)
  // const [searchMovies, setSearchMovies] = useState(templateMovies)

  function checkApi<T>(error: T, callback?: (error: IServerError) => void) {
    //callback во сновном для состояний компонетов, например ErrorResponse.

    const typeErrorApi = error as IFetchError;
    const typeErrorSerever = error as IServerError;

    if (api.isApiError(typeErrorApi)) {
      setErrorApi(typeErrorApi)
    }

    else if (api.isApiResponse(typeErrorSerever)) {
      if (!callback) return
      callback(typeErrorSerever)
    }
  }

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = !isSessionMovies && await api.getCreateGuestSession(rootHeaders)
        session && Cookies.set('guest_session_id', session.guest_session_id, { expires: 1 })
      }

      catch (error) {
        checkApi(error)
      }
    }

    const fetchMovies = async () => {
      try {
        const result = await api.getPopularMovie('ru-US', 1, rootHeaders)
        setPopularMovies((prev) => ({ ...prev, data: result, loading: false }))
      }

      catch (error) {
        checkApi(error, ((error) => {
          console.log(error)
          setPopularMovies((prev) => ({ ...prev, error: error }))
        }))
      }
    }
    fetchSession()
    fetchMovies()
  }, [])

  //Получаем элементы нужной стр.
  const elementsCurrentPage = useMemo(() => {
    const data = popularMovies.data
    if (!data) return

    return getElementsPagination(data.results, currentNumberPagePagination, counterCurrentPage)
  }, [popularMovies])

  async function updateMovies(page: number) {
    currentNumberPagePagination = page

    if (page % 4 !== 0) {
      return
    }

    try {
      if (!cachePages.has(pageServer)) {
        setPopularMovies((prev) => ({ ...prev, loading: true }))
        const result = await api.getPopularMovie('ru-US', pageServer, rootHeaders)

        cachePages.set(pageServer, pageServer)
        pageServer += 1

        setTimeout(() => {
          setPopularMovies((prev) => {
            return {
              ...prev, loading: false,
              data: {
                results: prev.data?.results.concat(result.results)
              }
            } as IMoviesFilter
          })
        }, 500)
      }
    }

    catch (error) {
      checkApi(error)
    }
  }

  console.log(popularMovies)

  return (
    //Warning: [antd: Tabs] `Tabs.TabPane` is deprecated.
    <Tabs tabBarStyle={{ width: '140px', margin: '0 auto 19px auto' }} size='large' centered>
      <Tabs.TabPane tab="Search" key="item-1">
        {errorApi.status && (
          <Alert
            style={{ marginBottom: 10 }}
            message={errorApi.message}
            description={`${errorApi.payload}`}
            type="warning"
            showIcon
            closable
          />
        )}
        <Input size="large" placeholder="Type to search..." />
        <Flex gap="middle" justify='center' wrap='wrap'>
          {popularMovies.error.status ? <h1>Ошибка загрузки {popularMovies.error.payload}</h1> :
            <SpinOutlined isLoading={popularMovies.loading} isErrorApi={errorApi.status}>
              {elementsCurrentPage?.map((movie) => (
                <Card key={movie.id} movie={movie} />))}
            </SpinOutlined>
          }
        </Flex>
        <br />
        <br />
        <Flex gap="middle" justify='center'>
          {elementsCurrentPage && elementsCurrentPage.length > 0 && <Pagination onChange={updateMovies} type='primary' defaultPageSize={counterCurrentPage} className='movie__pagination' total={popularMovies.data?.results.length} />}
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