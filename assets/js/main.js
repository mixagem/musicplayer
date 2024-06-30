/**
  * mambosinfinitos' jukebox
  * https://mambosinfinitos.pt
  */

function mixagemAudioPlayer() {

  const megaArray = [
    ['1. Wavy The Pirate - Loka', '2. Crewella - Ainda é Longe ft. Ferry e Vando Streets', '3. Shocks49 - Tardi Di Maz'], 
    ['2:43', '3:02', '3:06']
  ];
  const trackCount = megaArray[0].length;
  let larguraPlayer = 500;

  const clicker = document.querySelector('#music-clicker');
  const seeker = document.querySelector('#music-seeker');
  const progress = document.querySelector('#music-progress');
  const audioID = document.querySelector('#music-file');
  // const playPauseBtn = document.querySelector('#playpause');
  // const stopBtn = document.querySelector('#stop');
  const playlistMainTable = document.querySelector('#playlist-table');
  const albumThumbnail = document.querySelector('#albumArtwork');
  const artworkClick = document.querySelector('#artwork-mouseover')

  // função construtura - <td> título da faixa
  function pTituloFaixa(i) {
    const pTituloFaixa = document.createElement('span');
    pTituloFaixa.innerText = `${megaArray[0][i]}`;
    return pTituloFaixa
  }

  // função construtura - <td> duração da faixa
  function pDuraFaixa(i) {
    const pDuraFaixa = document.createElement('span');
    pDuraFaixa.innerText = `${megaArray[1][i]}`;
    return pDuraFaixa
  }

  // função construtura - <tr>
  function newTableRow() {
    const newTableRow = document.createElement('div');
    newTableRow.classList.add('trackRow');
    return newTableRow
  }

  function getAudioIDIndex() {
    let audioIDSrc = audioID.src;
    let audioIDIndex = audioIDSrc[audioIDSrc.length - 5];
    return audioIDIndex
  }

  function nowPlayingStyle() {
    let audioIDIndex = getAudioIDIndex();
    let audioIDPlaying = document.querySelector(`.titulo-faixa` + `.faixa${audioIDIndex}`);
    audioIDPlaying.classList.add('now-playing');
    let audioIDPlayingDura = document.querySelector(`.duracao-faixa` + `.faixa${audioIDIndex}`);
    audioIDPlayingDura.classList.add('now-playing');
  }

  function removeNowPlayingStyle() {
    audioIDIndex = getAudioIDIndex();
    for (i = 1; i <= trackCount; i++) {
      if (i !== audioIDIndex) {
        let previousAudioIDPlaying = document.querySelector(`.titulo-faixa` + `.faixa${i}`);
        previousAudioIDPlaying.classList.remove('now-playing');
        let previousAudioIDDura = document.querySelector(`.duracao-faixa` + `.faixa${i}`);
        previousAudioIDDura.classList.remove('now-playing');
      }
    }
  }

  // função manipuladora - adiciona os <td> de titulo e faixa ao <tr>
  function playlistEntryInfo() {
    let i = 1;
    while (i <= trackCount) {

      playlistMainTable.appendChild(newTableRow());                                 // adiciona uma nova <tr>
      let linhaIndividual = playlistMainTable.lastChild;                            // seleciona a última <tr> introduzida
      linhaIndividual.appendChild(pTituloFaixa(i - 1));                                  // adiciona o <td> do título da faixa ao <tr>
      linhaIndividual.appendChild(pDuraFaixa(i - 1));                                    // adiciona o <td> da duração da faixa ao <tr>
      let tituloFaixa = linhaIndividual.firstChild;                                 // seleciona o <td> do título da faixa
      tituloFaixa.classList.add('titulo-faixa', `faixa${i}`);                                    // adiciona a class ao <td> do título da faixa
      let duraFaixa = linhaIndividual.lastChild;                                    // seleciona o <td> da duração da faixa
      duraFaixa.classList.add('duracao-faixa', `faixa${i}`);                                     // adiciona a class ao <td> da duração da faixa
      i++;
    }
    larguraPlayerOffset = playlistMainTable.offsetHeight * .8;                // *.7 serve para tornar a thumb mais quadrada
    (function () {
      document.querySelector('#music-clicker').style.width = `${larguraPlayer}px`;
      document.querySelector('#music-seeker').style.width = `${larguraPlayer}px`;
      document.querySelector('#playlist-table').style.width = `${larguraPlayer - larguraPlayerOffset}px`;
    })()
  }
  playlistEntryInfo();

  function albumArtwork() {
    albumThumbnail.style.width = `${larguraPlayerOffset}px`;
  }
  albumArtwork();

  function autoplay() {
    audioID.onended = () => {
      nextTrack();
      audioID.play();
      clearInterval(timer);
      progressBarTimer();
    }
  }
  autoplay();

  clicker.addEventListener('mousemove', mouseOver);                                 // função para atualizar a posição do seeker quando mouseoever
  clicker.addEventListener('click', mouseClick);                                    // função para atualizar a posição da faixa + progresso da faixa (.png)
  // playPauseBtn.addEventListener('click', () => { playpause(); playpauseArtwork(); progressBarTimer(); removeNowPlayingStyle(); nowPlayingStyle(); changeArtwork(); }); // função para o botão play/pause (play/pause + temporizador progress bar [se a música tiver parada, este fica em standby para poupar recursos])
  // stopBtn.addEventListener('click', stop);
  artworkClick.addEventListener('click', () => { playpause(); playpauseArtwork(); progressBarTimer(); removeNowPlayingStyle(); nowPlayingStyle(); changeArtwork(); });

  function getPosition(e) {                                                         // função para obter coordenada x do ponteiro do rato
    let rect = e.target.getBoundingClientRect();                                    // getBoundClienteRect é um objeto com as "geometrias" do objeto em relação à window
    let x = e.clientX - rect.left;                                                  // clientX é a posição x do rato aquando do evento; rect.left é a posição inicial x do elemento.   
    return x                                                                        // a diferença da operação anterior, é a posição x dentro do elemento
  }

  function progressBar() {
    let position3 = audioID.currentTime / audioID.duration * larguraPlayer;              // % de faixa concluída, adaptada á largura do player
    progress.style.width = `${position3.toFixed(0)}px`;                              // atualiza a largura do progresso de acordo com a % da faixa concluída
    console.log('stick ticking bro')
  }

  function progressBarTimer() {
    if (!audioID.paused) { return timer = setInterval(progressBar, 200) }              // se a música estiver a toca, temporizador para atualizar o width da progress bar, 5x por segundo (a cada 200ms)
    else clearInterval(timer);                                                       // caso contrário, limpar o temporizador existente
  }

  function mouseOver(e) {
    let mouseOverPos = getPosition(e);
    seeker.style.width = `${mouseOverPos.toFixed(0)}px`;                             // atualiza a largura do seeker de acordo com a posição do rato
  }

  function mouseClick(e) {
    let mouseClickPos = getPosition(e);
    progress.style.width = `${mouseClickPos.toFixed(0)}px`;                          // atualiza a largura do progress de acordo com a posição do rato
    audioID.currentTime = (mouseClickPos / larguraPlayer) * audioID.duration;            // coloca o a música no momento igual ao da posição do rato (posição em % do rato no elemento =» posição em % na música)
  }

  function playpause() {
    if (audioID.paused) { audioID.play() }                                              // se tiver em pausa, mete play
    else { audioID.pause(); };                                                        // se tiver em play, mete pausa
  }

  function stop() {
    try {
      audioID.pause();                                                                  // mete a música em pausa
      audioID.currentTime = 0;                                                          // retorna a música para o inicio (0s)
      clearInterval(timer);                                                           // limpa o temporizador existente
      progress.style.width = `0px`;                                                   // define a largura da progress bar como 0px
      playpauseArtwork();
    } catch (err) { }
  }

  function nextTrack() {
    let audioIDIndex = getAudioIDIndex();
    audioIDIndex++;
    if (audioIDIndex <= trackCount) {
      audioID.src = `assets/mp3/audio${audioIDIndex}.mp3`;
      removeNowPlayingStyle();
      nowPlayingStyle();
      changeArtwork(audioIDIndex);
      return audioID
    } else {
      audioID.src = `assets/mp3/audio1.mp3`;
      removeNowPlayingStyle();
      nowPlayingStyle();
      changeArtwork(1);
      return audioID
    }
  }


  function trackSelect(e) {
    let gridTarget = e.target;
    let gridClassName = gridTarget.className;
    let gridClassNameIndex = gridClassName[gridClassName.length - 1]
    audioID.src = `assets/mp3/audio${gridClassNameIndex}.mp3`;
    removeNowPlayingStyle();
    nowPlayingStyle();
    stop();
    playpause();
    playpauseArtwork();
    progressBarTimer();
    changeArtwork(gridClassNameIndex);
  }

  const trigger1 = document.querySelector('.titulo-faixa' + '.faixa1');
  const trigger2 = document.querySelector('.titulo-faixa' + '.faixa2');
  const trigger3 = document.querySelector('.titulo-faixa' + '.faixa3');
  
  trigger1.addEventListener('click', (e) => {
    console.log(e.target);
    let moka = e.target;
    console.log(moka.classList)
    let moka2 = moka.classList;
    if (moka2.length <= 2) {
      trackSelect(e);
    } else return
  });

  trigger2.addEventListener('click', (e) => {
    console.log(e.target);
    let moka = e.target;
    console.log(moka.classList)
    let moka2 = moka.classList;
    if (moka2.length <= 2) {
      trackSelect(e);
    } else return
  });

  trigger3.addEventListener('click', (e) => {
    console.log(e.target);
    let moka = e.target;
    console.log(moka.classList)
    let moka2 = moka.classList;
    if (moka2.length <= 2) {
      trackSelect(e);
    } else return
  });


  function playpauseArtwork() {
    if (!audioID.paused) {
      artworkClick.innerHTML = '<i class="lni lni-pause"></i>';
    }                                              // se tiver em pausa, mete play
    else {
      artworkClick.innerHTML = '<i class="lni lni-play"></i>';
    };                                                        // se tiver em play, mete pausa
  }

  function changeArtwork(i) {
    if (i === undefined) { 
      let indexForThumb = getAudioIDIndex();
      albumThumbnail.style.backgroundImage = `url('assets/img/thumb${indexForThumb}.jpg')`;
    }
    else {
      albumThumbnail.style.backgroundImage = `url('assets/img/thumb${i}.jpg')`;
    }
  }

}

mixagemAudioPlayer();
