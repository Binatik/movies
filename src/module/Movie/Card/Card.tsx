import { Card as CardUi } from "../../../ui";
import { Progress, Rate, Tag, Typography } from "antd";
const { Title, Text } = Typography;
import { useEffect, useRef } from "react";
import { ICardMovieProps } from "./Card.types";
import { MoviesService } from "../../../api/MoviesService";
import "./Card.css";
import { formatIsoDate } from "../../../helpers/formatIsoDate";
import { getNumberToPercentage } from "../../../helpers/getNumberToPercentage";
import { shortenDescription } from "../../../helpers/shortenDescription";

const api = new MoviesService();
const prePatch = "https://image.tmdb.org/t/p/w500";

function Card({ movie }: ICardMovieProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const { current } = progressRef;

      if (!current) {
        return;
      }

      const average = movie.vote_average.toFixed(1);

      //Получае span в ProgressBar и меняем в dom узле строку с % на строку с rating
      const circle = current.children[0].children[1];
      circle.textContent = average;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }, [movie.vote_average]);

  function addRate(rate: number) {
    const headers = {
      accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
    };

    if (rate === 0) {
      api.deleteRating(movie.id, headers);
      return;
    }

    api.postAddRating(movie.id, JSON.stringify({ value: rate }), headers);
  }

  function getCurrentRating() {
    return movie.rating ? movie.rating : 0;
  }

  function getCurrentColor() {
    const average = movie.vote_average;

    if (average < 3) {
      return "#E90000";
    }

    if (average > 2 && average < 4) {
      return "#E97E00";
    }

    if (average > 4 && average < 7) {
      return "#E9D100";
    }

    if (average > 7) {
      return "#66E900";
    }
  }

  return (
    <CardUi className="movie__card" hoverable type="primary">
      <img className="movie__photo" src={`${prePatch}${movie.poster_path}`} alt="movie" />
      <div className="movie__content">
        <div className="movie__top">
          <div className="movie__block">
            <Title style={{ margin: 0 }} level={3}>
              {movie.title}
            </Title>
            <Progress
              style={{ marginLeft: "auto" }}
              ref={progressRef}
              type="circle"
              strokeColor={getCurrentColor()}
              percent={getNumberToPercentage(movie.vote_average)}
              size={45}
            />
          </div>
          <Text className="movie__date" type="secondary">
            {formatIsoDate(new Date(movie.release_date), "ru-RU")}
          </Text>
          <div className="movie__tegs">
            <Tag color="default">Action</Tag>
            <Tag color="default">Drama</Tag>
          </div>
        </div>
        <Text className="movie__info">{shortenDescription(movie.overview, 250)}</Text>
        <Rate onChange={addRate} className="movie__rate" allowHalf count={10} defaultValue={getCurrentRating()} />
      </div>
    </CardUi>
  );
}

export { Card };
