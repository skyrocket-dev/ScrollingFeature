const height = window.innerHeight;
const width = window.innerWidth;
const videos = document.querySelectorAll("[data-videoid]");
const scrollSect = document.querySelector('[scrolling-element="container"]')
let ytVideos = [];
let lastKnownScrollPosition = 0;
let ticking = false;
let currentVideo = 0;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const autoIndex = Number(urlParams.get('vid'));

function initializeYTVideos() {
  function onYouTubeIframeAPIReady() {
    videos.forEach(video => {
      const player = new YT.Player(video.id, {
        height: '100%',
        videoId: video.dataset.videoid,
      });
      ytVideos.push(player);
    });

    if(autoIndex && autoIndex > 0  && typeof autoIndex === "number"){
      if (width <= 767) {
        let scrollAmmount = (autoIndex * height) + 1
        for(let i = 0; i < autoIndex; i++ ){
        	scrollSect.scrollBy(0, height);
        }
      }
    }
  }

  if (typeof YT !== 'undefined' && YT.loaded === 1) {
    onYouTubeIframeAPIReady();
  } else {
    setTimeout(initializeYTVideos, 250);
  }
}

const TriggerPlayPause = (scrollPos) => {
  const newVideoIndex = Math.floor(scrollPos / height);

  if (currentVideo !== newVideoIndex) {
  	if(currentVideo) ytVideos[currentVideo].stopVideo();
    if(typeof ytVideos[newVideoIndex].playVideo === 'function') ytVideos[newVideoIndex].playVideo();
    currentVideo = newVideoIndex;
  }
}


const InitializeScrollListener = () => {
  if (width <= 767) {
    let scrollAutoTrigger = scrollSect.getAttribute("scrolling-auto") 

    if(scrollAutoTrigger) {
      scrollSect.addEventListener("scroll", (e) => {
        lastKnownScrollPosition = scrollSect.scrollTop;
        if (!ticking) {
          window.requestAnimationFrame(() => {
            TriggerPlayPause(lastKnownScrollPosition);
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  }
  else {
    if(autoIndex && typeof autoIndex === "number"){
      $('.scrollin-section__wrapper').slickGoTo(autoIndex);
    }
  }
}


const loadYouTubeAPI = () =>  {
  const tag = document.createElement('script');
  const firstScriptTag = document.getElementsByTagName('script')[0];

  tag.src = "https://www.youtube.com/iframe_api";
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  tag.onload = initializeYTVideos;
}
document.addEventListener('DOMContentLoaded', () => {
  loadYouTubeAPI();
  InitializeScrollListener();
})
