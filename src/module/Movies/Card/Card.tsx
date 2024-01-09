import mov from './mov.png'
import { Card as CardUi } from '../../../ui'
import { Progress, Rate, Tag, Typography } from 'antd';
const { Title, Text } = Typography;
import { useEffect, useRef } from 'react';
import { ICardMovieProps } from './Card.types';

import './Card.css'


function Card({ movie }: ICardMovieProps) {
  const ratingToPercentage = (average: number) => Math.round((average / 10) * 100);
  const progressRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    try {
      const { current } = progressRef

      if (!current) {
        return
      }

      //Получае span в ProgressBar и меняем в dom узле строку с % на строку с rating
      current.children[0].children[1].textContent = movie.vote_average.toFixed(1).toString()
    }
    catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      }
    }
  }, [movie.vote_average])

  return (
    <CardUi className='movie__card' hoverable type='primary'>
      <img className='movie__photo' src={mov} alt='movie' />
      <div className='movie__content'>
        <div className='movie__top'>
          <div className='movie__block'>
            <Title style={{ margin: 0 }} level={3}>{movie.title}</Title>
            <Progress style={{ marginLeft: 'auto' }} ref={progressRef} type="circle" percent={ratingToPercentage(movie.vote_average)} size={45} />
          </div>
          <Text className='movie__date' type="secondary">March 5, 2020</Text>
          <div className='movie__tegs'>
            <Tag color="default">Action</Tag>
            <Tag color="default">Drama</Tag>
          </div>
        </div>
        <Text className='movie__info'>{movie.overview}</Text>
        <Rate className='movie__rate' allowHalf count={10} defaultValue={2.5} />
      </div>
    </CardUi>
  )
}

export { Card }