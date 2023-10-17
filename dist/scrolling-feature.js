const height = window.innerHeight;
const width = window.innerWidth;
const videos = document.querySelectorAll("[data-videoid]");
let ytVideos = [];
let lastKnownScrollPosition = 0;
let ticking = false;
let currentVideo = 0;

function initializeYTVideos() {
  function onYouTubeIframeAPIReady() {
    videos.forEach(video => {
      const player = new YT.Player(video.id, {
        height: '100%',
        videoId: video.dataset.videoid,
      });
      ytVideos.push(player);
    });
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
    ytVideos[currentVideo].stopVideo();
    ytVideos[newVideoIndex].playVideo();
    currentVideo = newVideoIndex;
  }
}

const InitializeScrollListener = () => {
  if (width <= 767) {
    const scrollSect = document.querySelector(".scrollin-section__wrapper.w-dyn-items")

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
