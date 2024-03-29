import { Card as CardUi } from "../../../ui";
import { Progress, Rate, Skeleton, Tag, Typography } from "antd";
const { Title, Text } = Typography;
import { useContext, useEffect, useRef } from "react";
import { ICardMovieProps } from "./Card.types";
import { MoviesService } from "../../../api/MoviesService";
import { formatIsoDate } from "../../../helpers/formatIsoDate";
import { getNumberToPercentage } from "../../../helpers/getNumberToPercentage";
import { shortenDescription } from "../../../helpers/shortenDescription";
import { MovieContext } from "../store/context/MovieContextProvider";
import { IGenre, IMovie } from "../../../api/api.types";
import "./Card.css";
import { getCurrentColor } from "../../../helpers/getCurrentColor";

const api = new MoviesService();
const prePatch = "https://image.tmdb.org/t/p/w500";

function useContextType() {
  const contextType = useContext(MovieContext);

  if (!contextType) {
    throw new Error("Провайдер не был добавлен в дерево React");
  }

  return contextType;
}

function Card({ movie }: ICardMovieProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  const { genres } = useContextType();

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
        throw error;
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

  function getNamesMatchingIDs(genreIds: IMovie["genre_ids"], genres: IGenre["genres"]) {
    if (!genreIds) {
      return;
    }

    const result = genres.filter((item) => genreIds.includes(item.id));

    return result.map((item) => (
      <li key={item.id}>
        <Tag color="default">{item.name}</Tag>
      </li>
    ));
  }

  function renderImage() {
    if (!movie.poster_path) {
      return (
        <div className="movie__photo-skeleton">
          <Skeleton.Image />
        </div>
      );
    }

    return <img className="movie__photo" src={`${prePatch}${movie.poster_path}`} alt={`Photo ${movie.title}`} />;
  }

  return (
    <CardUi className="movie__card" hoverable type="primary">
      {renderImage()}
      <div className="movie__content">
        <div className="movie__top">
          <div className="movie__block">
            <Title style={{ margin: 0, fontSize: 20 }} level={2}>
              {movie.title}
            </Title>
            <Progress
              style={{ marginLeft: "auto" }}
              ref={progressRef}
              type="circle"
              strokeColor={getCurrentColor(movie.vote_average)}
              percent={getNumberToPercentage(movie.vote_average)}
              size={40}
            />
          </div>
          <Text className="movie__date" type="secondary">
            {(movie.release_date && formatIsoDate(new Date(movie.release_date), "ru-RU")) || "Неизвестно"}
          </Text>
          <ul className="movie__tegs">{getNamesMatchingIDs(movie.genre_ids, genres)}</ul>
        </div>
        <Typography.Paragraph className="movie__info">{shortenDescription(movie.overview, 180)}</Typography.Paragraph>
        <Rate onChange={addRate} className="movie__rate" allowHalf count={10} defaultValue={getCurrentRating()} />
      </div>
    </CardUi>
  );
}

export { Card };
