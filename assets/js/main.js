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
  const larguraPlayer = 720;                                                        // #####note to self#####: substituir por get.class - width value (depois remover o "px" )


  // função construtura - <td> título da faixa
  function pTituloFaixa() {
    const pTituloFaixa = document.createElement('td');
    // pTituloFaixa.innerText = `${megaArray[1][1]}`;
    pTituloFaixa.innerText = `Nome da faixa oh yes`;
    return pTituloFaixa
  }

  // função construtura - <td> duração da faixa
  function pDuraFaixa() {
    const pDuraFaixa = document.createElement('td');
    // pDuraFaixa.innerText = `${tracklistTitulo[1]}`;
    pDuraFaixa.innerText = `01:24`;
    return pDuraFaixa
  }

  // função construtura - <tr>
  function newTableRow() {
    const newTableRow = document.createElement('tr');
    return newTableRow
  }

  // função manipuladora - adiciona os <td> de titulo e faixa ao <tr>
  function playlistEntryInfo() {
    playlistMainTable.appendChild(newTableRow());                                 // adiciona uma nova <tr>
    let linhaIndividual = playlistMainTable.lastChild;                            // seleciona a última <tr> introduzida
    linhaIndividual.appendChild(pTituloFaixa());                                  // adiciona o <td> do título da faixa ao <tr>
    linhaIndividual.appendChild(pDuraFaixa());                                    // adiciona o <td> da duração da faixa ao <tr>
    let tituloFaixa = linhaIndividual.firstChild;                                 // seleciona o <td> do título da faixa
    tituloFaixa.classList.add('titulo-faixa');                                    // adiciona a class ao <td> do título da faixa
    let duraFaixa = linhaIndividual.lastChild;                                    // seleciona o <td> da duração da faixa
    duraFaixa.classList.add('duracao-faixa');                                     // adiciona a class ao <td> da duração da faixa

  }

  function playlistLoop() {
    let i = 1;
    while (i <= trackCount) {
      playlistEntryInfo();
      i++;
    }
  };
  playlistLoop();


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
  playPauseBtn.addEventListener('click', () => { playpause(); progressBarTimer(); }); // função para o botão play/pause (play/pause + temporizador progress bar [se a música tiver parada, este fica em standby para poupar recursos])
  stopBtn.addEventListener('click', stop);                                          // função para para a faixa

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
    audioID.pause();                                                                  // mete a música em pausa
    audioID.currentTime = 0;                                                          // retorna a música para o inicio (0s)
    clearInterval(timer);                                                           // limpa o temporizador existente
    progress.style.width = `0px`;                                                   // define a largura da progress bar como 0px
  }

  function nextTrack() {
    let audioIDSrc = audioID.src;
    let audioIDIndex = audioIDSrc[audioIDSrc.length - 5];
    audioIDIndex++;
    if (audioIDIndex <= trackCount) {
      return audioID.src = `file:///D:/Documentos/Curso%20JavaScript/musicplayer/assets/mp3/batida${audioIDIndex}.mp3`
    } else return audioID.src = `file:///D:/Documentos/Curso%20JavaScript/musicplayer/assets/mp3/batida1.mp3`
  }

}

mixagemAudioPlayer();
