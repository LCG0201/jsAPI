let menuBarDom = document.querySelectorAll(".menu");
let searchBoxDom = document.querySelector(".searchBox");
let searchBtnDom = document.querySelector(".searchBtn");
let pageButtonDom = document.querySelectorAll(".pageButton");
let news = [];
let totalPages = 0;
let page = 1;
let topic = "";
let searchText = "";
let url;

let topicSize = 10;

pageButtonDom.forEach((item) => {
  item.addEventListener("click", (event) => {
    console.log(item.innerHTML);
  });
});

searchBtnDom.addEventListener("click", () => {
  searchText = `${searchBoxDom.value}`;
  if (searchText == "" || searchText == null) {
  } else if (searchText != "") {
    page = 1;
    getSearchNews();
  }
});
searchBoxDom.addEventListener("click", () => {
  searchBoxDom.value = "";
});

menuBarDom.forEach((oneButton) => {
  oneButton.addEventListener("click", (event) => getNewsByTopic(event));
});

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "Z3WqLB-GwJfJxYBqGNi-zVrAPWnDfoJ2UFL5qR9c20E",
    });

    url.searchParams.set("page", page);

    let response = await fetch(url, { headers: header }); //ajax, axios, fetch 가있다~
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색 결과를 찾을 수 없습니다!ㅠㅠ");
      }
      news = data.articles;
      totalPages = data.total_pages;
      page = data.page;

      render();
      pageNation();
    } else {
      throw new Error(data.message);
    }

    console.log(response.status, response.error_code);
  } catch (error) {
    console.log("에러는 : ", error.message);
    errorRender(error.message);
  }
};

const getLatestNews = () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=${topicSize}`
  );

  getNews();
};

const getNewsByTopic = (event) => {
  topic = event.target.textContent.toLowerCase();
  getLatestNews();
};

function getSearchNews() {
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${searchText}&page_size=${topicSize}`
  );
  getNews();
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

const errorRender = (errorText) => {
  errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${errorText}
  </div>`;
  document.getElementById("newsBoard").innerHTML = errorHTML;
};

const pageNation = () => {
  let pageNationHTML = "";
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  let first = last - 4;

  //totalpage 가 5 미만일 경우
  if (totalPages < last) {
    last = totalPages;
  }

  pageNationHTML =
    page > 5
      ? `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1)">
    <span aria-hidden="true">&laquo;</span>
  </a>
</li>

<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous">
    <span aria-hidden="true" onclick="moveToPage(${page - 1})">&lt;</span>
  </a>
</li>`
      : "";

  for (let i = first; i <= last; i++) {
    pageNationHTML += ` <li class="page-item ${
      i == page ? "active" : ""
    }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }

  pageNationHTML +=
    page <= (Math.ceil(totalPages / 5) - 1) * 5
      ? `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
    page + 1
  })">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>

<li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${totalPages})">
    <span aria-hidden="true">&raquo;</span>
  </a>
</li>`
      : "";

  document.querySelector(".pagination").innerHTML = pageNationHTML;
};

const moveToPage = (pageNum) => {
  console.log("move");
  page = pageNum;
  console.log(page);

  getNews();
};

getLatestNews();
