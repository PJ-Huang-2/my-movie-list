const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const movies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

function renderMovieList(data) {
  let rawHTML = "";

  // processing
  data.forEach((item) => {
    // title, image
    // console.log(item);
    rawHTML += `
    <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top"
                alt="Movie Poster"
              />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-toggle="modal"
                  data-target="#movie-modal" data-id="${item.id}"
                >
                  More
                </button>
                <button class="btn btn-danger btn-remove-favorite" data-id="${
                  item.id
                }">X</button>
              </div>
            </div>
          </div>
        </div>
    `;
  });

  dataPanel.innerHTML = rawHTML;
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
    }" class="image-fuid">`;
  });
}

// remove
function removeFavorite(id) {
  if (!movies || !movie.length) return;
  //防止 movies 是空陣列的狀況

  //透過 id 找到要刪除電影的 index
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) return;
  // return console.log("QQ", movieIndex);

  //刪除該筆電影
  movies.splice(movieIndex, 1);

  //存回 local storage
  localStorage.setItem("favoriteMovies", JSON.stringify(movies));
  //更新頁面
  renderMovieList(movies);
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
    renderMovieList(movies);
    //新增以下
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFavorite(Number(event.target.dataset.id));
  }
});

renderMovieList(movies);
