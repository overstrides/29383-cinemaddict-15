import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MINUTES_IN_HOUR, UserRating, UserRatingType } from '../const.js';

const getUserRating = (filmsCards) => {
  let userTitle = '';
  let userFilmsWatched = 0;

  filmsCards.forEach((filmCard) => {
    if (filmCard.isWatched) {
      userFilmsWatched += 1;
    }
  });

  if (userFilmsWatched > UserRating.NOVICE && userFilmsWatched <= UserRating.FAN) {
    userTitle = UserRatingType.NOVICE;
  } else if (userFilmsWatched > UserRating.FAN && userFilmsWatched <= UserRating.MOVIE_BUFF) {
    userTitle = UserRatingType.FAN;
  } else if (userFilmsWatched > UserRating.MOVIE_BUFF) {
    userTitle = UserRatingType.MOVIE_BUFF;
  } else {
    userTitle = '';
  }

  return userTitle;
};

const humanizeDate = (date, format) => dayjs(date).format(format);

const humanizeCommentDate = (date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};

const getFilmDuration = (minutes) => {
  const durationInHours = Math.trunc(minutes / MINUTES_IN_HOUR) > 0 ? `${Math.trunc(minutes / MINUTES_IN_HOUR)}h` : '';
  const durationInMinutes = minutes && minutes % MINUTES_IN_HOUR !== 0 ? `${minutes % MINUTES_IN_HOUR}m` : '';
  const durationSeparator = durationInHours && durationInMinutes ? ' ' : '';
  const filmDuration = durationInHours || durationInMinutes ? durationInHours + durationSeparator + durationInMinutes : '';
  return filmDuration;
};

const truncateDescription = (description, length) => {
  const truncatedDescription = description.length > length ? `${description.slice(0, length - 1)}…` : description;
  return truncatedDescription;
};

const checkIfActive = (element, activeClass) => element ? activeClass : '';

const getFilmDetailsData = (filmCard, comments) => {
  const { commentsId } = filmCard;

  const filmComments = [];

  commentsId.forEach((commentId) => {
    comments.forEach((comment) => {
      if (comment.id === commentId) {
        filmComments.push(comment);
      }
    });
  });

  return [filmCard, filmComments];
};

const sortByDate = (filmA, filmB) => dayjs(filmB.release.date) - dayjs(filmA.release.date);

const sortByRating = (filmA, filmB) => filmB.totalRating - filmA.totalRating;

export { getUserRating, humanizeDate, humanizeCommentDate, getFilmDuration, truncateDescription, checkIfActive, getFilmDetailsData, sortByDate, sortByRating };
