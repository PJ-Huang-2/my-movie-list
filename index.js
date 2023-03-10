const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 12;

let currentPage = 1;

const movies = [];
let filterMovies = [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
const modeChangeSwitch = document.querySelector("#change-mode");

function renderMovieList(data) {
  if (dataPanel.dataset.mode === "card-mode") {
    let rawHTML = "";
    data.forEach((item) => {
      // title, image, id
      rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${
          POSTER_URL + item.image
        }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${
            item.id
          }">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${
            item.id
          }">+</button>
        </div>
      </div>
    </div>
  </div>`;
    });
    dataPanel.innerHTML = rawHTML;
  } else if (dataPanel.dataset.mode === "list-mode") {
    let rawHTML = `<ul class="list-group col-sm-12 mb-2">`;
    data.forEach((item) => {
      // title, image, id
      rawHTML += `
      <li class="list-group-item d-flex justify-content-between">
        <h5 class="card-title">${item.title}</h5>
        <div>
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal"
            data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </li>`;
    });
    rawHTML += "</ul>";
    dataPanel.innerHTML = rawHTML;
  }
}

function renderPaginator(amount) {
  // 80 / 12 = 6 ... 8 => 7???

  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE); // ???????????????

  let rawHTML = "";

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `;

    paginator.innerHTML = rawHTML;
  }
}
// ?????????????????????
function getMoviesByPage(page) {
  // movies ? "movies" : "filterMovies"
  const data = filterMovies.length ? filterMovies : movies;

  // page 1 -> 1?????????1?????????????????? 0-11
  // page 2 ->                    12-23
  // ...                          24-36

  // ????????????index
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  // ???????????????????????????
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  // (start, end)
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-despcription");

  axios.get(INDEX_URL + id).then((response) => {
    // response.data.results
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = "Release data:" + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" class="image-fluid">`;
  });
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
    //????????????
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;
  // A = <a></a>
  const page = Number(event.target.dataset.page);

  // console.log(event.target.dataset.page);
  renderMovieList(getMoviesByPage(page));
});

// add favorite function
function addToFavorite(id) {
  // console.log(id);
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || []; // OR
  const movie = movies.find((movie) => movie.id === id);
  // ??? find ????????????????????????????????? id ??????????????????????????????????????? movie
  // console.log('QQ',movie);
  if (list.some((movie) => movie.id === id)) {
    return alert("????????????????????????????????????");
  }
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

// ?????? data-mode ???????????????????????????
function changeDisplayMode(displayMode) {
  if (dataPanel.dataset.mode === displayMode) return;
  dataPanel.dataset.mode = displayMode;
}

// ?????? displayMode ????????????
modeChangeSwitch.addEventListener("click", function onSwitchClicked(event) {
  if (event.target.matches("#card-mode-button")) {
    changeDisplayMode("card-mode");
    renderMovieList(getMoviesByPage(currentPage));
  } else if (event.target.matches("#list-mode-button")) {
    changeDisplayMode("list-mode");
    renderMovieList(getMoviesByPage(currentPage));
  }
});

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault(); // ????????????????????????????????????
  // console.log(searchInput.value);
  const keyword = searchInput.value.trim().toLowerCase();

  /*  if (keyword.length === 0) {
    // or ????????? !keyword.length
    return alert("????????????????????????");
  } */
  // map, filter, reduce
  filterMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  if (filterMovies.length === 0) {
    return alert("Cannot find movie with keyword:" + keyword);
  }

  /*  for (const movie of movies) {
    if (movie.title.toLowerCase().includes(keyword)) {
      filterMovies.push(movie); 
    }
  }
 */
  // for(let movie = 0; movie < movies.length; movie++)
  renderPaginator(filterMovies.length);
  renderMovieList(getMoviesByPage(1));
});

axios
  .get(INDEX_URL)
  .then((response) => {
    // Array(80)
    /* for (const movie of response.data.results) {
    movies.push(movie);
  } */

    movies.push(...response.data.results);
    //???????????????(spread operator)
    /* const numbers = [1, 2, 3]
  movies.push(...numbers); */
    // console.log(movies);
    renderPaginator(movies.length);
    renderMovieList(getMoviesByPage(1));
  })
  .catch((err) => console.log(err));
