/**
  * Mixagem audio player
  * version 2.0 - 12.12.2021 
  * https://mambosinfinitos.pt
  */

function mixagemAudioPlayer() {

  const clicker = document.querySelector('#music-clicker');
  const seeker = document.querySelector('#music-seeker');
  const progress = document.querySelector('#music-progress');
  const audioID = document.querySelector('#music-file');
  const playPauseBtn = document.querySelector('#playpause');
  const stopBtn = document.querySelector('#stop');
  const playlistMainTable = document.querySelector('#playlist-table');

  const trackCount = 2;
  const larguraPlayer = 300;                                                        // #####note to self#####: substituir por get.class - width value (depois remover o "px" )


  // função construtura - <td> título da faixa
  function pTituloFaixa() {
    const pTituloFaixa = document.createElement('span');
    // pTituloFaixa.innerText = `${megaArray[1][1]}`;
    pTituloFaixa.innerText = `Nome da faixa oh yes`;
    return pTituloFaixa
  }

  // função construtura - <td> duração da faixa
  function pDuraFaixa() {
    const pDuraFaixa = document.createElement('span');
    // pDuraFaixa.innerText = `${tracklistTitulo[1]}`;
    pDuraFaixa.innerText = `01:24`;
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
      linhaIndividual.appendChild(pTituloFaixa());                                  // adiciona o <td> do título da faixa ao <tr>
      linhaIndividual.appendChild(pDuraFaixa());                                    // adiciona o <td> da duração da faixa ao <tr>
      let tituloFaixa = linhaIndividual.firstChild;                                 // seleciona o <td> do título da faixa
      tituloFaixa.classList.add('titulo-faixa', `faixa${i}`);                                    // adiciona a class ao <td> do título da faixa
      let duraFaixa = linhaIndividual.lastChild;                                    // seleciona o <td> da duração da faixa
      duraFaixa.classList.add('duracao-faixa', `faixa${i}`);                                     // adiciona a class ao <td> da duração da faixa
      i++;
    }
  }
  playlistEntryInfo();

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
  playPauseBtn.addEventListener('click', () => { playpause(); progressBarTimer(); removeNowPlayingStyle(); nowPlayingStyle(); }); // função para o botão play/pause (play/pause + temporizador progress bar [se a música tiver parada, este fica em standby para poupar recursos])
  stopBtn.addEventListener('click', stop);


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
      locales();
      audioID.pause();                                                                  // mete a música em pausa
      audioID.currentTime = 0;                                                          // retorna a música para o inicio (0s)
      clearInterval(timer);                                                           // limpa o temporizador existente
      progress.style.width = `0px`;                                                   // define a largura da progress bar como 0px
    } catch (err) { }
  }

  function nextTrack() {
    let audioIDIndex = getAudioIDIndex();
    audioIDIndex++;
    if (audioIDIndex <= trackCount) {
      audioID.src = `file:///D:/Documentos/Curso%20JavaScript/musicplayer/assets/mp3/batida${audioIDIndex}.mp3`;
      removeNowPlayingStyle();
      nowPlayingStyle();
      return audioID
    } else {
      audioID.src = `file:///D:/Documentos/Curso%20JavaScript/musicplayer/assets/mp3/batida1.mp3`;
      removeNowPlayingStyle();
      nowPlayingStyle();
      return audioID
    }
  }


  function trackSelect(e) {
    let gridTarget = e.target;
    console.log(gridTarget);
    let gridClassName = gridTarget.className;
    console.log(gridClassName);
    let gridClassNameIndex = gridClassName[gridClassName.length - 1]
    console.log(gridClassNameIndex);
    let gridTrackIndex = gridClassNameIndex;
    audioID.src = `file:///D:/Documentos/Curso%20JavaScript/musicplayer/assets/mp3/batida${gridTrackIndex}.mp3`;
    removeNowPlayingStyle();
    nowPlayingStyle();
    stop();
    playpause();
    progressBarTimer();
  }

  const gay1 = document.querySelector('.titulo-faixa' + '.faixa1');
  const gay2 = document.querySelector('.titulo-faixa' + '.faixa2');

  gay1.addEventListener('click', (e) => {
    console.log(e.target);
    let moka = e.target;
    console.log(moka.classList)
    let moka2 = moka.classList;
    if (moka2.length <= 2) {
      trackSelect(e);
    } else return
  });

  gay2.addEventListener('click', (e) => {
    console.log(e.target);
    let moka = e.target;
    console.log(moka.classList)
    let moka2 = moka.classList;
    if (moka2.length <= 2) {
      trackSelect(e);
    } else return
  });

  function locales() {

    fetch('assets/js/tracklist.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        appendData(data);
      })
      .catch(function (err) {
        console.log('error: ' + err);
      });

    function appendData(data) {
      for (let i = 1; i <= data.length; i++) {
        let track = document.querySelector(`.titulo-faixa`+`.faixa${i}`).innerText = data[i-1].trackName;
        console.log(track);
        let duration = document.querySelector(`.duracao-faixa`+`.faixa${i}`).innerText = data[i-1].trackLenght;
        console.log(duration);
      }
    }
    

  } 

  

}
mixagemAudioPlayer();
