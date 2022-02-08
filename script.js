let menuBarDom = document.querySelectorAll(".menu");
let searchBoxDom = document.querySelector(".searchBox");
let searchBtnDom = document.querySelector(".searchBtn");
let news = [];
let topic = "";
let searchText = "";

searchBtnDom.addEventListener("click", () => {
  searchText = `${searchBoxDom.value}`;
  if (searchText == "" || searchText == null) {
  } else if (searchText != "") {
    getSearchNews();
  }
});
searchBoxDom.addEventListener("click", () => {
  searchBoxDom.value = "";
});

menuBarDom.forEach((oneButton) => {
  oneButton.addEventListener("click", (event) => getNewsByTopic(event));
});

const getLatestNews = async () => {
  let url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=20`
  );
  let header = new Headers({
    "x-api-key": "Z3WqLB-GwJfJxYBqGNi-zVrAPWnDfoJ2UFL5qR9c20E",
  });
  let response = await fetch(url, { headers: header }); //ajax, axios, fetch 가있다~
  let data = await response.json();
  news = data.articles;

  render();
};

const getNewsByTopic = (event) => {
  topic = event.target.textContent.toLowerCase();
  getLatestNews();
};

async function getSearchNews() {
  let url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${searchText}&page_size=20`
  );
  let header = new Headers({
    "x-api-key": "Z3WqLB-GwJfJxYBqGNi-zVrAPWnDfoJ2UFL5qR9c20E",
  });
  let response = await fetch(url, { headers: header }); //ajax, axios, fetch 가있다~
  let data = await response.json();
  news = data.articles;

  render();
}

function render() {
  let newsHTML = "";

  newsHTML = news
    .map((item, index) => {
      return `
  <div class="row news-box">
    <div class="col-lg-4">
      <img
        class="news-img-size"
        src="${
          item.media == null
            ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
            : item.media
        }"
        alt=""
      />
    </div>
    <div class="col-lg-8">
      <h2>${item.title}</h2>
      <p class="textBox">${
        item.summary == null || item.summary == ""
          ? "내용없음"
          : item.summary.length > 200
          ? item.summary.substring(0, 200) + "..."
          : item.summary
      }</p>
      <div>[출처: ${item.rights || "no source"} / Date: ${moment(
        item.published_date
      ).fromNow()}]</div>
    </div>
  </div>`;
    })
    .join("");

  document.getElementById("newsBoard").innerHTML = newsHTML;
}

getLatestNews();
