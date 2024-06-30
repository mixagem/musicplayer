 /**
   * Mixagem audio player
   * version 1.0 - 11.12.2021 
   * https://mambosinfinitos.pt
   */


function mixagemAudioPlayer() {

  const clicker = document.querySelector('#music-clicker');
  const seeker = document.querySelector('#music-seeker');
  const progress = document.querySelector('#music-progress');
  const audio = document.querySelector('#music-file');
  const playPauseBtn = document.querySelector('#playpause');
  const stopBtn = document.querySelector('#stop');

  const larguraPlayer = 720;                                                        // #####note to self#####: substituir por get.class - width value (depois remover o +"px" das funções abaixo)

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
    let position3 = audio.currentTime / audio.duration * larguraPlayer;              // % de faixa concluída, adaptada á largura do player
    progress.style.width = `${position3.toFixed(0)}px`;                              // atualiza a largura do progresso de acordo com a % da faixa concluída
  }

  function progressBarTimer() {
    if (!audio.paused) { return timer = setInterval(progressBar, 200) }              // se a música estiver a toca, temporizador para atualizar o width da progress bar, 5x por segundo (a cada 200ms)
    else clearInterval(timer);                                                       // caso contrário, limpar o temporizador existente
  }

  function mouseOver(e) {
    let mouseOverPos = getPosition(e);
    seeker.style.width = `${mouseOverPos.toFixed(0)}px`;                                        // atualiza a largura do seeker de acordo com a posição do rato
  }

  function mouseClick(e) {
    let mouseClickPos = getPosition(e);
    progress.style.width = `${mouseClickPos.toFixed(0)}px`;                                     // atualiza a largura do progress de acordo com a posição do rato
    audio.currentTime = (mouseClickPos / larguraPlayer) * audio.duration;            // coloca o a música no momento igual ao da posição do rato (posição em % do rato no elemento =» posição em % na música)
  }

  function playpause() {
    if (audio.paused) { audio.play() }                                              // se tiver em pausa, mete play
    else { audio.pause(); };                                                        // se tiver em play, mete pausa
  }

  function stop() {
    audio.pause();                                                                  // mete a música em pausa
    audio.currentTime = 0;                                                          // retorna a música para o inicio (0s)
    clearInterval(timer);                                                           // limpa o temporizador existente
    progress.style.width = `0px`;                                                   // define a largura da progress bar como 0px
  }

}

mixagemAudioPlayer();