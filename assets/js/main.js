/**
  * mambosinfinitos' jukebox
  * https://mambosinfinitos.pt
  */

function mixagemAudioPlayer() {

  // Medidas necessárias para construção da grelha
  const trackCount = 3;
  const larguraPlayer = 495;
  const larguraArtwork = 96;

  const audioID = document.querySelector('#music-file');
  const progress = document.querySelector('#music-progress');


  // função construtura - <div> faixa
  function newTableRow() {
    const newTableRow = document.createElement('div');
    newTableRow.classList.add('trackRow');
    return newTableRow
  }

  // função construtura - <span>  faixa
  function pFaixa() {
    const pTituloFaixa = document.createElement('span');
    return pTituloFaixa
  }


  // função para obter o index da faixa a tocar
  function getAudioIDIndex() {
    let audioIDSrc = audioID.src;                                  // índice:               54321
    let audioIDIndex = audioIDSrc[audioIDSrc.length - 5];         //nome do ficheiro  "audio1.mp3"
    return audioIDIndex
  }

  // função para aplicar os estilos .now-playing
  function nowPlayingStyle() {
    let audioIDIndex = getAudioIDIndex();
    let audioIDPlaying = document.querySelector(`.titulo-faixa` + `.faixa${audioIDIndex}`);
    audioIDPlaying.classList.add('now-playing');
    let audioIDPlayingDura = document.querySelector(`.duracao-faixa` + `.faixa${audioIDIndex}`);
    audioIDPlayingDura.classList.add('now-playing');
  }

  // função para remover os estilos .now-playing
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

  // função para obter a posição do cursor, dentro do div
  function getPosition(e) {                                                         // função para obter coordenada x do ponteiro do rato
    let rect = e.target.getBoundingClientRect();                                    // getBoundClienteRect é um objeto com as "geometrias" do elemento em relação à window
    let x = e.clientX - rect.left;                                                  // clientX é a posição x do rato aquando do evento; rect.left é a posição inicial x do elemento.   
    return x                                                                        // a diferença da operação anterior, é a posição x dentro do elemento
  }

  // função para atualizar largura da progressbar
  function progressBar() {
    let position3 = audioID.currentTime / audioID.duration * larguraPlayer;              // % de faixa concluída, adaptada á largura do player
    progress.style.width = `${position3.toFixed(0)}px`;                              // atualiza a largura do progresso de acordo com a % da faixa concluída
    // console.log('Now playing: ' + document.querySelector(`.now-playing`).innerText);
  }

  // timer para ir atualizando a progressbar
  function progressBarTimer() {
    if (!audioID.paused) { return timer = setInterval(progressBar, 200) }              // se a música estiver a toca, temporizador para atualizar o width da progress bar, 5x por segundo (a cada 200ms)
    else clearInterval(timer);                                                       // caso contrário, limpar o temporizador existente
  }

  // função par atualizar o seeker com mouseover
  function mouseOver(e) {
    const seeker = document.querySelector('#music-seeker');
    let mouseOverPos = getPosition(e);
    seeker.style.width = `${mouseOverPos.toFixed(0)}px`;                             // atualiza a largura do seeker de acordo com a posição do rato
  }

  // função para atualizar o progresso ao clicar
  function mouseClick(e) {
    let mouseClickPos = getPosition(e);
    progress.style.width = `${mouseClickPos.toFixed(0)}px`;                          // atualiza a largura do progress de acordo com a posição do rato
    audioID.currentTime = (mouseClickPos / larguraPlayer) * audioID.duration;            // coloca o a música no momento igual ao da posição do rato (posição em % do rato no elemento =» posição em % na música)
  }

  // play/pause
  function playpause() {
    if (audioID.paused) { audioID.play(); }                                              // se tiver em pausa, mete play
    else { audioID.pause();                                                                // se tiver em play, mete pausa
      // console.log('playback paused')
    };                            
  }

  // stop
  function stop() {
    try {
      audioID.pause();                                                                  // mete a música em pausa
      audioID.currentTime = 0;                                                          // retorna a música para o inicio (0s)
      clearInterval(timer);                                                           // limpa o temporizador existente
      progress.style.width = `0px`;                                                   // define a largura da progress bar como 0px
      playpauseArtwork();
    } catch (err) { }
  }

  // função construtora - adiciona os <spans> de titulo e faixa ao <div> da faixa. Adiciona o <div> da faixa, ao <div> da playlist.
  function playlistEntryInfo() {
    let i = 1;
    const playlistMainTable = document.querySelector('#playlist-table');
    while (i <= trackCount) {

      playlistMainTable.appendChild(newTableRow());                                 // adiciona uma nova <div>
      let linhaIndividual = playlistMainTable.lastChild;                            // seleciona a última <div> introduzida
      linhaIndividual.appendChild(pFaixa());                             // adiciona o <span> do título da faixa ao <div> da faixa
      linhaIndividual.appendChild(pFaixa());                               // adiciona o <span> da duração da faixa ao <div> da faixa
      let tituloFaixa = linhaIndividual.firstChild;                                 // seleciona o <span> do título da faixa
      tituloFaixa.classList.add('titulo-faixa', `faixa${i}`);                       // adiciona a class ao <span> do título da faixa
      let duraFaixa = linhaIndividual.lastChild;                                    // seleciona o <span> da duração da faixa
      duraFaixa.classList.add('duracao-faixa', `faixa${i}`);                        // adiciona a class ao <span> da duração da faixa
      i++;                                                                          // loop
    }

    locales();                                                                      // executa a função do json para buscar a tracklist, depois de composta a playlist

    // função para definir as diferentes larguras do player 
    (function () {
      document.querySelector('#music-clicker').style.width = `${larguraPlayer}px`;
      document.querySelector('#music-seeker').style.width = `${larguraPlayer}px`;
      document.querySelector('#playlist-table').style.width = `${larguraPlayer - larguraArtwork}px`;
    })()
  }

  // Função para começar a faixa seguinte tocar automaticamente
  function autoplay() {
    audioID.onended = () => {
      nextTrack();
      audioID.play();
      clearInterval(timer);
      progressBarTimer();
    }
  }

  // função para alterar o src do audio a tocar
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

  // função para atualizar tudo, de acordo com a faixa que foi selecionada 
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

  // função para atualizar o icon play/pause do album
  function playpauseArtwork() {
    if (!audioID.paused) {
      artworkClick.innerHTML = '<i class="lni lni-pause"></i>';
    }                                              // se tiver em pausa, mete play
    else {
      artworkClick.innerHTML = '<i class="lni lni-play"></i>';
    };                                                        // se tiver em play, mete pausa
  }

  // função para alterar o album de acordo com a faixa a tocar
  function changeArtwork(i) {
    if (i === undefined) {
      let indexForThumb = getAudioIDIndex();
      albumThumbnail.style.backgroundImage = `url('assets/img/thumb${indexForThumb}.jpg')`;
    }
    else {
      albumThumbnail.style.backgroundImage = `url('assets/img/thumb${i}.jpg')`;
    }
  }

  // função para obter tracklist.json
  function locales() {

    fetch('assets/js/tracklist.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        appendData(data);
      })
      .catch(function (err) {
        // console.log('error: ' + err);
      }); 

    function appendData(data) {
      for (let i = 1; i <= data.length; i++) {
        document.querySelector(`.titulo-faixa` + `.faixa${i}`).innerText = data[i - 1].trackName;
        document.querySelector(`.duracao-faixa` + `.faixa${i}`).innerText = data[i - 1].trackLenght;
      }
    }
  }

  playlistEntryInfo();  // desenha a grelha
  autoplay();           // autoplay next track 

  // Gerador de eventlistener para cada caixa
  (function () {
    let eventArray = [];
    for (i = 1; i <= trackCount; i++) {
      eventArray[i] = document.querySelector('.titulo-faixa' + `.faixa${i}`);
      eventArray[i].addEventListener('click', (e) => {
        let eTarget = e.target;
        let classList = eTarget.classList;
        if (classList.length <= 2) {       // se o span tiver 2 ou menos classes (ou seja, não tem o now-playing)
          trackSelect(e);
        } else return
      });
    }
  })();

  const clicker = document.querySelector('#music-clicker');
  const artworkClick = document.querySelector('#artwork-mouseover')
  const albumThumbnail = document.querySelector('#albumArtwork');

  clicker.addEventListener('mousemove', mouseOver);                                 // função para atualizar a posição do seeker quando mouseoever
  clicker.addEventListener('click', mouseClick);                                    // função para atualizar a posição da faixa + progresso da faixa (.png)
  artworkClick.addEventListener('click', () => {                                    // função para atualizar tudo ao clicar no album:
    playpause();                                                                    // play/pause 
    playpauseArtwork();                                                             // Atualiza o icon do play/pause
    progressBarTimer();                                                             // re/começa o timer                                                    
    nowPlayingStyle();                                                              // adiciona o .now-playing caso começemos a playlist através do album
    changeArtwork();                                                                // altera o album thumb caso começemos a playlist através do album
  });

  function albumArtwork() {
    albumThumbnail.style.width = `${larguraArtwork}px`;
  }
  albumArtwork();

}

mixagemAudioPlayer();