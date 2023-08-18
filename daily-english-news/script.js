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
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apikey}`);
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
  // const newsData = await getNews('us');
  const newsData = {
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
        title: 'NPR investigation reveals significant failures at immigrant detention facilities - WUSF Public Media',
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
        urlToImage: 'https://static.politico.com/14/f6/7830df9243efb1bbe0c7893a7108/kyrsten-sinema-54345.jpg',
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
        title: "China's economic woes mount as trust firm misses payments, home prices fall - Reuters",
        description:
          "Missed payments on investment products by a leading Chinese trust firm and a fall in home prices have added to worries that China's deepening property sector crisis is stifling what little momentum the economy has left.",
        url: 'https://www.reuters.com/world/china/chinas-new-home-prices-fall-first-time-this-year-2023-08-16/',
        urlToImage:
          'https://www.reuters.com/resizer/YT4FBQ-iL8VAA8ddgz2O9VOBZsk=/1200x628/smart/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/MT7K47ZGTJKPXM4NPWFQKXKF24.jpg',
        publishedAt: '2023-08-16T08:28:00Z',
        content:
          "BEIJING/HONG KONG, Aug 16 (Reuters) - Missed payments on investment products by a leading Chinese trust firm and a fall in home prices have added to worries that China's deepening property sector cri… [+5861 chars]",
      },
      {
        source: {
          id: 'bloomberg',
          name: 'Bloomberg',
        },
        author: null,
        title: 'China Asks Some Funds to Avoid Net Equity Sales as Markets Sink - Bloomberg',
        description:
          'Chinese authorities asked some investment funds this week to avoid being net sellers of equities, as a rout in the nation’s financial markets deepened, people familiar with the matter said.',
        url: 'https://www.bloomberg.com/news/articles/2023-08-16/china-asks-some-funds-to-avoid-net-equity-sales-as-markets-sink',
        urlToImage: 'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iaWQ4cTtedAc/v0/1200x769.jpg',
        publishedAt: '2023-08-16T07:55:03Z',
        content:
          'Chinese authorities asked some investment funds this week to avoid being net sellers of equities, as a rout in the nations financial markets deepened, people familiar with the matter said.\r\nStock exc… [+357 chars]',
      },
      {
        source: {
          id: 'cnn',
          name: 'CNN',
        },
        author: 'Nicquel Terry Ellis',
        title:
          'Arkansas education officials say AP African American Studies program won’t count toward graduation - CNN',
        description:
          'Students in Arkansas public high schools enrolled in the controversial Advanced Placement African American Studies course will not be able to receive credit toward graduation, state education officials told districts last week.',
        url: 'https://www.cnn.com/2023/08/15/us/arkansas-ap-black-history-reaj/index.html',
        urlToImage:
          'https://media.cnn.com/api/v1/images/stellar/prod/230815100640-01-arkansas-ap-black-history-reaj.jpg?c=16x9&q=w_800,c_fill',
        publishedAt: '2023-08-16T07:47:00Z',
        content:
          'Students in Arkansas public high schools enrolled in the controversial Advanced Placement African American Studies course will not be able to receive credit toward graduation, state education officia… [+4893 chars]',
      },
      {
        source: {
          id: null,
          name: 'CNBC',
        },
        author: 'Hannah Ward-Glenton',
        title: 'European markets higher as investors assess UK inflation data - CNBC',
        description: 'European markets were higher Wednesday as investors digest key U.K. inflation data.',
        url: 'https://www.cnbc.com/2023/08/16/european-markets-open-to-close-earnings-data-and-news.html',
        urlToImage:
          'https://image.cnbcfm.com/api/v1/image/107287234-1692163488156-gettyimages-1146938550-UK_LSE.jpeg?v=1692163876&w=1920&h=1080',
        publishedAt: '2023-08-16T07:44:00Z',
        content:
          "Despite last week's selloff, the strong rally this year means U.S. markets are now trading at only a small discount compared with the start of the year, says top Morningstar strategist Dave Sekera.\r\n… [+442 chars]",
      },
      {
        source: {
          id: null,
          name: 'YouTube',
        },
        author: null,
        title: 'Lauren Dickason guilty of murdering her three girls - 1News',
        description:
          'A jury reached a majority verdict after 15 hours of deliberations at the High Court in Christchurch, having heard four weeks of evidence against the 42-year-...',
        url: 'https://www.youtube.com/watch?v=NxH7C7nISQU',
        urlToImage: 'https://i.ytimg.com/vi/NxH7C7nISQU/maxresdefault.jpg',
        publishedAt: '2023-08-16T07:42:50Z',
        content: null,
      },
      {
        source: {
          id: 'cnn',
          name: 'CNN',
        },
        author: 'Nouran Salahieh',
        title:
          'Death toll from the Maui wildfires climbs to 106 as governor warns identifying all the victims will be difficult - CNN',
        description:
          'Identifying those killed in the Maui wildfires will be “very difficult” and likely take weeks, Hawaii’s governor said Tuesday as the death toll climbed to 106 and families desperately waiting to hear about lost loved ones were asked to provide DNA swabs.',
        url: 'https://www.cnn.com/2023/08/16/us/hawaii-maui-wildfires-death-toll-wednesday/index.html',
        urlToImage:
          'https://media.cnn.com/api/v1/images/stellar/prod/230816114913-rescue-team-maui-wildfire-0813.jpg?c=16x9&q=w_800,c_fill',
        publishedAt: '2023-08-16T07:26:00Z',
        content:
          'Identifying those killed in the Maui wildfires will be very difficult and likely take weeks, Hawaiis governor said Tuesday as the death toll climbed to 106 and families desperately waiting to hear ab… [+6529 chars]',
      },
      {
        source: {
          id: null,
          name: 'Intc.com',
        },
        author: null,
        title:
          'Intel Announces Termination of Tower Semiconductor Acquisition - Investor Relations :: Intel Corporation (INTC)',
        description: null,
        url: 'https://www.intc.com/news-events/press-releases/detail/1642/intel-announces-termination-of-tower-semiconductor',
        urlToImage:
          'https://d1io3yog0oux5.cloudfront.net/_b18f8a9f850e843405ac7afa8ebfbe6f/intel/db/878/6995/social_image_resized.jpg',
        publishedAt: '2023-08-16T07:03:18Z',
        content:
          'Intel continues to advance plans to create world-class system foundry as part of its IDM 2.0 strategy.\r\n SANTA CLARA, Calif.--(BUSINESS WIRE)--\r\nIntel Corporation (Nasdaq: INTC) today announced that … [+6388 chars]',
      },
      {
        source: {
          id: null,
          name: 'MLSsoccer.com',
        },
        author: 'mlssoccer',
        title: 'Lionel Messi\'s "aura" grows: Inter Miami near Leagues Cup glory | MLSSoccer.com - MLSsoccer.com',
        description:
          'CHESTER, Pa. – Scoring the Philadelphia Union’s consolation goal in their 4-1 Leagues Cup semifinal loss to Lionel Messi’s Inter Miami CF was cold comfort for Alejandro Bedoya on a painfully disappointing Tuesday evening at Subaru Park for him and his teammat…',
        url: 'https://www.mlssoccer.com/news/messi/lionel-messi-s-aura-grows-inter-miami-near-leagues-cup-glory',
        urlToImage: 'https://images.mlssoccer.com/image/private/t_q-best/prd-league/e7urut4eaobil58gblsk.png',
        publishedAt: '2023-08-16T05:29:07Z',
        content: null,
      },
      {
        source: {
          id: 'associated-press',
          name: 'Associated Press',
        },
        author: 'MICHAEL BIESECKER, BERNARD CONDON, JENNIFER McDERMOTT',
        title:
          'Videos put scrutiny on downed power lines as possible cause of deadly Maui wildfires - The Associated Press',
        description:
          'Videos showing downed power lines apparently sparking some of the early blazes in the Maui wildfires have become key evidence in the search for a cause. Hawaiian Electric Co. faces criticism for not shutting off the power amid high wind warnings. A class-acti…',
        url: 'https://apnews.com/article/hawaii-wildfires-maui-electricity-power-utilities-c46a106db3c5019ac835ddcb01fde25f',
        urlToImage:
          'https://dims.apnews.com/dims4/default/e4c0017/2147483647/strip/true/crop/3150x1772+0+164/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2Fb1%2F24%2Fffe287a49668fc10b74e555bc4a4%2F2ab0011e7c5e4627be3302c3e02669d4',
        publishedAt: '2023-08-16T05:25:00Z',
        content:
          'Awakened by howling winds that tore through his Maui neighborhood, Shane Treu went out at dawn and saw a wooden power pole suddenly snap with a flash, its sparking, popping line falling to the dry gr… [+8629 chars]',
      },
      {
        source: {
          id: 'reuters',
          name: 'Reuters',
        },
        author: 'Reuters',
        title: 'Typhoon Lan makes landfall in Japan, thousands urged to seek safety - Reuters',
        description:
          "Nearly 900 flights in Japan were cancelled and 240,000 people were ordered to move to safety as a slow-moving typhoon crossed Japan's main island of Honshu not far from the ancient capital of Kyoto, cutting off power to tens of thousands of homes.",
        url: 'https://www.reuters.com/world/asia-pacific/typhoon-lan-makes-landfall-western-japan-threatens-damage-2023-08-14/',
        urlToImage:
          'https://www.reuters.com/resizer/z3wu2jkmuypjOUkpRCr427us_XE=/1200x628/smart/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/B3GYKGFMFVMD5IVGQV3QDJ3PHU.jpg',
        publishedAt: '2023-08-16T04:52:00Z',
        content:
          "TOKYO, Aug 15 (Reuters) - Nearly 900 flights in Japan were cancelled and 240,000 people were ordered to move to safety as a slow-moving typhoon crossed Japan's main island of Honshu not far from the … [+2062 chars]",
      },
      {
        source: {
          id: null,
          name: 'nj.com',
        },
        author: 'Holiday Mathis',
        title: 'Today’s daily horoscope for Aug. 16, 2023 - NJ.com',
        description:
          'Zodiac signs and horoscopes on 8/16/2023 for Aquarius, Pisces, Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn.',
        url: 'https://www.nj.com/advice/2023/08/todays-daily-horoscope-for-aug-16-2023.html',
        urlToImage:
          'https://www.nj.com/resizer/y0GkxcEcKp6NoyUc0LAtx7APmMY=/1280x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/SAGJVB5QCZCNFBN2U2NE2O4GTE.png',
        publishedAt: '2023-08-16T04:01:00Z',
        content:
          'Auspicious Attention Grab\r\nThe new moon in theatrical Leo is like the ideal wingman, shining the light on you that lets everyone see youre someone to know and like. This lunar love is yours to aim. W… [+4355 chars]',
      },
      {
        source: {
          id: null,
          name: 'YouTube',
        },
        author: null,
        title: 'India: Chandrayaan-3 completes 33 days, race to lunar South Pole enters final leg | World DNA - WION',
        description:
          'Chandrayaan-3 is expected to land on the lunar surface around August 23 after completing a 40-day journey. On the other hand, Luna-25 is expected to land on ...',
        url: 'https://www.youtube.com/watch?v=_w7qiPyjty4',
        urlToImage: 'https://i.ytimg.com/vi/_w7qiPyjty4/maxresdefault.jpg',
        publishedAt: '2023-08-16T03:53:59Z',
        content: null,
      },
      {
        source: {
          id: 'espn',
          name: 'ESPN',
        },
        author: 'M.A. Voepel',
        title: "Liberty win Commissioner's Cup with blowout of rival Aces - ESPN - ESPN",
        description:
          "The Liberty won the 2023 Commissioner's Cup in dominant fashion, running away with a 19-point victory over the Aces in what was billed as a potential WNBA Finals preview.",
        url: 'https://www.espn.com/wnba/story/_/id/38200114/liberty-win-commissioner-cup-blowout-rival-aces',
        urlToImage: 'https://a2.espncdn.com/combiner/i?img=%2Fphoto%2F2023%2F0816%2Fr1211172_1296x729_16%2D9.jpg',
        publishedAt: '2023-08-16T03:22:00Z',
        content:
          "LAS VEGAS -- The New York Liberty are one of the WNBA's original franchises dating back to 1997 and have played for the league title four times. But they had never won a championship -- until Tuesday… [+5333 chars]",
      },
      {
        source: {
          id: null,
          name: 'YouTube',
        },
        author: null,
        title: 'Carmelo Hayes and Wes Lee sign their NXT Title Match contract: NXT highlights, Aug. 15, 2023 - WWE',
        description:
          'NXT Champion Carmelo Hayes and No. 1 Contender Wes Lee don’t hold back in their war of words before NXT Heatwave. Catch WWE action on Peacock, WWE Network, F...',
        url: 'https://www.youtube.com/watch?v=0AH8diAy588',
        urlToImage: 'https://i.ytimg.com/vi/0AH8diAy588/maxresdefault.jpg',
        publishedAt: '2023-08-16T02:49:02Z',
        content: null,
      },
      {
        source: {
          id: null,
          name: 'Entertainment Tonight',
        },
        author: 'Mona Khalifeh',
        title:
          "Ed Sheeran Addresses Taylor Swift's 'Reputation' Re-Record Amid Rumors It's Coming Soon - Entertainment Tonight",
        description:
          "Sheeran spoke about 'Reputation' rumors while speaking with Andy Cohen on his Sirius XM podcast, 'Deep & Shallow.'",
        url: 'https://www.etonline.com/ed-sheeran-addresses-taylor-swifts-reputation-re-record-amid-rumors-its-coming-soon-209814',
        urlToImage:
          'https://www.etonline.com/sites/default/files/styles/max_1280x720/public/images/2023-05/sheeranswift.jpg?h=c673cd1c&itok=2LojUgq1',
        publishedAt: '2023-08-16T02:47:13Z',
        content:
          "Keep your fingers crossed, Swifties!\r\nIn a new interview with Andy Cohen on his Deep &amp; Shallow Podcast on SiriusXM, Ed Sheeran revealed that Taylor Swift's Reputation could be next in her list of… [+3269 chars]",
      },
      {
        source: {
          id: null,
          name: 'YouTube',
        },
        author: null,
        title: 'Trump will take mugshot at Fulton County Jail | FOX 5 News - FOX 5 Atlanta',
        description:
          'In a fourth criminal indictment for the former President of the United States, FOX 5 has learned Trump and his 18 allies will be booked and take mugshots jus...',
        url: 'https://www.youtube.com/watch?v=6M-hml8wICA',
        urlToImage: 'https://i.ytimg.com/vi/6M-hml8wICA/hqdefault.jpg',
        publishedAt: '2023-08-16T02:11:41Z',
        content: null,
      },
      {
        source: {
          id: 'associated-press',
          name: 'Associated Press',
        },
        author: 'RIAZAT BUTT',
        title:
          "The Taliban believe their rule is open-ended and don't plan to lift the ban on female education - The Associated Press",
        description:
          "The chief Taliban spokesman says the Taliban view their rule of Afghanistan as open-ended, drawing legitimacy from Islamic law and facing no significant threat. He spoke in an interview with The Associated Press on the eve of Tuesday's second anniversary of t…",
        url: 'https://apnews.com/article/afghanistan-taliban-women-education-5bc5477a8e4599ac431e4d2e27ebaf85',
        urlToImage:
          'https://dims.apnews.com/dims4/default/f73706d/2147483647/strip/true/crop/6000x3375+0+312/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F2b%2F38%2F5a80405f314070db0334ebfb1356%2Fe18db028d63a4899b535537457b3781a',
        publishedAt: '2023-08-16T01:05:00Z',
        content:
          'KANDAHAR, Afghanistan (AP) The Taliban view their rule of Afghanistan as open-ended, drawing legitimacy from Islamic law and facing no significant threat, their chief spokesman said in an interview m… [+7551 chars]',
      },
    ],
  };

  articles = newsData.articles;
  renderNews(newsData.articles);
}

init();
