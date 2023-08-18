let articles;
const knownWords = [
  'be',
  'is',
  'am',
  'are',
  'been',
  'was',
  'were',
  'I',
  'you',
  'my',
  'your',
  'yours',
  'their',
  'theirs',
  'she',
  'her',
  'he',
  'his',
  'him',
  'a',
  'an',
  'the',
  'it',
  'its',
  'this',
  'that',
  'those',
  'who',
  'what',
  'which',
  'with',
  'within',
  'without',
  'because',
  'but',
  'or',
  'and',
  'to',
  'in',
  'into',
  'as',
  'on',
  'onto',
  'at',
  'in',
  'into',
  'for',
  'of',
  'by',
  'from',
  'no',
  'not',
  'have',
  ,
  'has',
];

const radioButtons = document.querySelectorAll('input[name="country"]');
radioButtons.forEach((element) => {
  element.addEventListener('change', async (e) => {
    const newsData = await getNews(e.target.value);
    articles = newsData.articles;
    renderNews(newsData.articles);
    console.log(e.target.value);
  });
});

async function getNews(country) {
  try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${API_KEY_입력}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

const wordModal = new bootstrap.Modal(document.querySelector('#word-modal'));

function renderNews(articles) {
  const newsContainerDiv = document.querySelector('#news-container');
  newsContainerDiv.innerHTML = '';
  articles.forEach((article) => {
    const { title, content, url, urlToImage } = article;

    let words = [];
    // extract words from article
    words.push(...article.title.split(/\s|&nbsp;/));
    if (content) {
      words.push(...article.content.split(/\s|&nbsp;/));
    }

    // filter words
    words = [...new Set(words)] // set으로 변경 후 중복제거
      .map((word) => word.toLowerCase())
      .filter(
        (word) =>
          word.length !== 0 &&
          !knownWords.includes(word.toLowerCase()) && // knownWords 제거
          /^[a-zA-Z\s]*$/.test(word) && // 특수문자 포함된 요소 제거
          !/^[A-Z]+$/.test(word) // 대문자로만 이루어진 요소 제거
      );
    // console.log(words);

    const colDiv = document.createElement('div');
    colDiv.className = 'col';
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    const img = document.createElement('img');
    img.src = urlToImage || './images/no-img.png';
    img.className = 'card-img-top';
    img.style.objectFit = 'cover';
    img.style.height = '200px';
    titleDiv.appendChild(img);

    const h5 = document.createElement('h5');
    h5.className = 'card-title overlay p-2';
    const a = document.createElement('a');
    a.classList = 'fs-4 link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover';
    a.href = url;
    a.target = '_blank';
    a.innerHTML = title;
    h5.appendChild(a);
    titleDiv.appendChild(h5);
    cardDiv.appendChild(titleDiv);

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.className = 'card-body';
    const cardText = document.createElement('p');
    cardText.className = 'card-text';

    words.forEach((word) => {
      const link = document.createElement('a');
      link.innerHTML = word;
      link.href = `https://en.dict.naver.com/#/search?query=${word}`;
      link.target = '_blank';
      link.className = 'btn btn-outline-primary m-1';
      link.onclick = (e) => {
        e.preventDefault();
        setModal(word);
        wordModal.show();
        console.log(word);
      };
      cardText.appendChild(link);
    });
    cardBodyDiv.appendChild(cardText);
    cardDiv.appendChild(cardBodyDiv);
    colDiv.appendChild(cardDiv);
    newsContainerDiv.appendChild(colDiv);
  });
}

function setModal(word) {
  document.querySelector('.modal-title').innerHTML = word;
  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = '';

  // naver dict iframe
  const iframe = document.createElement('iframe');
  iframe.src = `https://en.dict.naver.com/#/search?query=${word}`;
  iframe.width = '100%';
  iframe.height = '640px';
  modalBody.appendChild(iframe);

  const setKnownWordsBtn = document.querySelector('#set-known-words-btn');
  setKnownWordsBtn.onclick = () => addToKnownWords(word);
}

function addToKnownWords(word) {
  knownWords.push(word.toLowerCase());
  renderNews(articles);
  wordModal.hide();
}

async function init() {
  const newsData = await getNews('us');
  articles = newsData.articles;
  renderNews(newsData.articles);
}

init();
