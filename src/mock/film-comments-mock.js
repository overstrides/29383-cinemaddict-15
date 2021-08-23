import { nanoid } from 'nanoid';
import { TEXT_SOURCE, COMMENTS_EMOTIONS, COMMENTS_DATE_MAX_RANGE, COMMENTS_AUTHORS, MIN_STRINGS_COMMENT, MAX_STRINGS_COMMENT, MIN_COMMENTS_NUMBER, MAX_COMMENTS_NUMBER } from '../const.js';
import { getRandomInt, getRandomEmotion, getRandomDate, humanizeCommentDate, getRandomAuthor, getRandomText } from '../utils.js';

const generateFilmComment = () => ({
  id: nanoid(),
  emotion: getRandomEmotion(COMMENTS_EMOTIONS),
  date: humanizeCommentDate(getRandomDate(COMMENTS_DATE_MAX_RANGE)),
  author: getRandomAuthor(COMMENTS_AUTHORS),
  text: getRandomText(TEXT_SOURCE, MIN_STRINGS_COMMENT, MAX_STRINGS_COMMENT),
});

const getCommentsId = (comments) => {
  const commentsIdList = [];
  comments.forEach((item) => {
    commentsIdList.push(item.id);
  });

  return commentsIdList;
};

export const generateFilmComments = () => {
  const commentsNumber = getRandomInt(MIN_COMMENTS_NUMBER, MAX_COMMENTS_NUMBER);
  const comments = [];
  for (let i = 0; i < commentsNumber; i++) {
    const comment = generateFilmComment();
    comments.push(comment);
  }
  const commentsId = getCommentsId(comments);
  return [comments, commentsId];
};
