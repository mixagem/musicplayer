
const clicker = document.querySelector('#music-clicker');
const seeker = document.querySelector('#music-seeker');
const progress = document.querySelector('#music-progress');
const audio = document.querySelector('#music-file');
const playPauseBtn = document.querySelector('#playpause');
const stopBtn = document.querySelector('#stop');

const larguraPlayer = 300;

clicker.addEventListener('mousemove', mouseOver);
clicker.addEventListener('click', mouseClick);
playPauseBtn.addEventListener('click', () => {playpause(); progressBarTimer();});
stopBtn.addEventListener('click', stop);

function getPosition(e) {
  let rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left;
  return x
}

function progressBar () {
    let position3 = audio.currentTime/audio.duration*larguraPlayer;
    progress.style.width = `${position3}px`;
}   

function progressBarTimer () {
    if (!audio.paused) {return timer = setInterval(progressBar,50)}
    else clearInterval(timer);
}

function mouseOver(e) {
  let mouseOverPos = getPosition(e);
  seeker.style.width = `${mouseOverPos}px`;
}

function mouseClick(e) {
  let mouseClickPos = getPosition(e);
  progress.style.width = `${mouseClickPos}px`;
  audio.currentTime = (mouseClickPos/larguraPlayer)*audio.duration;
}

function playpause () {
    if (audio.paused) { audio.play() }
    else { audio.pause(); };
}

function stop () {
    audio.pause();
    audio.currentTime = 0;
    clearInterval(timer);
    progress.style.width = `0px`;
}