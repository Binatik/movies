import mov from './mov.png'
import { Card as CardUi } from '../../../ui'
import { Progress, Rate, Tag, Typography } from 'antd';
const { Title, Text } = Typography;
import './Card.css'
import { useEffect, useRef } from 'react';


function Card() {
  const rating = 6.6;
  const ratingToPercentage = (rating: number) => Math.round((rating / 6.7) * 100);
  const progressRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    try {
      const { current } = progressRef

      if (!current) {
        return
      }

      //Получае span в ProgressBar и меняем в dom узле строку с % на строку с rating
      current.children[0].children[1].textContent = rating.toString()
    }
    catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      }
    }
  }, [])

  return (
    <CardUi className='movie__card' hoverable type='primary'>
      <img className='movie__photo' src={mov} alt='movie' />
      <div className='movie__content'>
        <div className='movie__top'>
          <div className='movie__block'>
            <Title style={{ margin: 0 }} level={3}>The way back</Title>
            <Progress style={{ marginLeft: 'auto' }} ref={progressRef} type="circle" percent={ratingToPercentage(rating)} size={45} />
          </div>
          <Text className='movie__date' type="secondary">March 5, 2020</Text>
          <div className='movie__tegs'>
            <Tag color="default">Action</Tag>
            <Tag color="default">Drama</Tag>
          </div>
        </div>
        <Text className='movie__info'>A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction attempts to regain his soul  and salvation by becoming the coach of a disparate ethnically mixed high ...</Text>
        <Rate className='movie__rate' allowHalf count={10} defaultValue={2.5} />
      </div>
    </CardUi>
  )
}

export { Card }