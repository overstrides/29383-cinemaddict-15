export const createMenuTemplate = (filmsCards) => {
  const filmsInWatchlist = filmsCards.slice().filter((filmCard) => filmCard.userDetails.isInWatchlist);
  const filmsGenreHistory = [];
  filmsCards.forEach((filmCard) => {
    filmCard.genres.forEach((genre) => {
      if (genre === 'History') {
        filmsGenreHistory.push(filmCard);
      }
    });
  });
  const filmsInFavorite = filmsCards.slice().filter((filmCard) => filmCard.userDetails.isInFavorite);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filmsInWatchlist.length}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filmsGenreHistory.length}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filmsInFavorite.length}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
