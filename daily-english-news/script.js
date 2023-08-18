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
const testData = (newsData = {
  status: 'ok',
  totalResults: 38,
  articles: [
    {
      source: {
        id: 'usa-today',
        name: 'USA Today',
      },
      author: ', USA TODAY',
      title: "England vs Australia live updates: Score, highlights Women's World Cup - USA TODAY",
      description:
        "England leads Australia 1-0 at halftime of today's World Cup semifinal. Ella Toone scored the Lionesses' goal in the 36th-minute against the Matildas.",
      url: 'https://www.usatoday.com/story/sports/soccer/worldcup/2023/08/16/england-vs-australia-womens-world-cup-semifinal-live-updates/70600807007/',
      urlToImage:
        'https://www.gannett-cdn.com/authoring/authoring-images/2023/08/16/USAT/70601015007-gty-1618456780.JPG?auto=webp&crop=2608,1474,x0,y132&format=pjpg&width=1200',
      publishedAt: '2023-08-16T10:18:45Z',
      content:
        'England has been itching for this World Cup game for four months. That it could end Australias party just adds to the drama.\r\nThe second World Cup semifinal is billed as a blockbuster, and with good … [+8587 chars]',
    },
    {
      source: {
        id: null,
        name: 'Usf.edu',
      },
      author: 'Leila Fadel, Tom Dreisbach',
      title:
        'NPR investigation reveals significant failures at immigrant detention facilities - WUSF Public Media',
      description:
        'NPR obtained confidential files from the U.S. government which reveal "barbaric" and "negligent" treatment at ICE detention centers.',
      url: 'https://wusfnews.wusf.usf.edu/2023-08-16/npr-investigation-reveals-significant-failures-at-immigrant-detention-facilities',
      urlToImage: null,
      publishedAt: '2023-08-16T09:10:00Z',
      content:
        'NPR obtained confidential files from the U.S. government which reveal "barbaric" and "negligent" treatment at ICE detention centers.\r\nCopyright 2023 NPR',
    },
    {
      source: {
        id: 'politico',
        name: 'Politico',
      },
      author: null,
      title: 'Sinema takes on Schumer, Jeffries and the White House over the border - POLITICO',
      description:
        "Border-state Democrats are frustrated to see New York claim most of a recent migrant relief infusion. But Arizona's formerly Democratic senator is speaking out the loudest.",
      url: 'https://www.politico.com/news/2023/08/16/sinema-takes-on-schumer-jeffries-border-00111355',
      urlToImage:
        'https://static.politico.com/14/f6/7830df9243efb1bbe0c7893a7108/kyrsten-sinema-54345.jpg',
      publishedAt: '2023-08-16T09:00:00Z',
      content:
        'But only Sinema is aiming specific complaints at Senate Majority Leader Chuck Schumer, House Minority Leader Hakeem Jeffries and the Biden administration.\r\nEarlier this month in Yuma, Ariz., Sinema s… [+6380 chars]',
    },
    {
      source: {
        id: 'reuters',
        name: 'Reuters',
      },
      author: 'Reuters',
      title:
        "China's economic woes mount as trust firm misses payments, home prices fall - Reuters",
      description:
        "Missed payments on investment products by a leading Chinese trust firm and a fall in home prices have added to worries that China's deepening property sector crisis is stifling what little momentum the economy has left.",
      url: 'https://www.reuters.com/world/china/chinas-new-home-prices-fall-first-time-this-year-2023-08-16/',
      urlToImage:
        'https://www.reuters.com/resizer/YT4FBQ-iL8VAA8ddgz2O9VOBZsk=/1200x628/smart/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/MT7K47ZGTJKPXM4NPWFQKXKF24.jpg',
      publishedAt: '2023-08-16T08:28:00Z',
      content:
        "BEIJING/HONG KONG, Aug 16 (Reuters) - Missed payments on investment products by a leading Chinese trust firm and a fall in home prices have added to worries that China's deepening property sector cri… [+5861 chars]",
    },
  ],
});

async function init() {
  let newsData = await getNews('us');
  if (newsData.status === 'error') {
    newsData = { ...testData };
  }

  articles = newsData.articles;
  renderNews(newsData.articles);
}

init();
