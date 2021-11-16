import gameStarted from './index';
import gameFactory from './game';
import firebase from './firebase';
import { Timestamp } from 'firebase/firestore';

let chars = [
  {
    name: 'Waldo',
    //image: waldo,
  },
  {
    name: 'Odlaw',
    //image: odlaw,
  },
  {
    name: 'Wizard',
    // image: wizard,
  },
  {
    name: 'Wilma',
    // image: wilma,
  },
];

function createui(width, height) {
  const body = document.querySelector('body');
  const container = document.querySelector('.container');

  let imageWidth = width;
  let imageHeight = height;

  let choiceMenu = false;
  let gameFinished = false;
  let interval;
  let highScoreShowing = false;

  function clearScreen() {
    container.innerHTML = '';
  }

  function createChars(chars) {
    const charContainer = document.createElement('div');
    charContainer.classList.add('characters-container');

    const charContainerTitle = document.createElement('p');
    charContainerTitle.classList.add('characters-container-title');

    charContainerTitle.innerText = 'Find these characters:';
    charContainer.appendChild(charContainerTitle);

    chars.forEach((char) => {
      const container = document.createElement('div');
      const img = document.createElement('img');
      const name = document.createElement('p');

      container.classList.add('char-container');

      img.classList.add('char-img');
      img.src = char.image;
      img.alt = char.name;
      img.id = char.name.toLowerCase();

      name.classList.add('char-name');
      name.innerText = char.name;

      container.append(img, name);

      charContainer.appendChild(container);
    });
    return charContainer;
  }
  function createTimerAndStopButton() {
    const container = document.createElement('div');
    container.classList.add('timer-container');

    const timer = document.createElement('div');
    timer.classList.add('timer');
    timer.innerText = '01:23';

    const stopButton = document.createElement('button');
    stopButton.classList.add('stop-button');
    stopButton.innerText = 'End Game';
    container.append(timer, stopButton);
    return container;
  }

  function createNavbar(chars) {
    const navbar = document.createElement('nav');
    const title = document.createElement('h1');
    const highscore = document.createElement('button');
    title.classList.add('title');
    title.innerText = "Where's Waldo";
    highscore.classList.add('show-highscore-button');
    highscore.innerText = 'Highscores';
    title.appendChild(highscore);
    navbar.append(createChars(chars), title, createTimerAndStopButton());
    body.appendChild(navbar);
    highscore.addEventListener('click', () => {
      loadHighScores();
    });
  }

  async function createGameImage(img, gameFac, startTime) {
    const container = document.createElement('div');
    container.classList.add('game-container');
    console.log({ gameFac });
    const image = new Image();

    image.src = img;
    await image.decode();
    image.width = width;
    image.height = height;
    console.dir(image);

    console.log('inside image', imageWidth);
    console.log('inside image', image.width);
    image.classList.add('game-image');
    image.alt = 'game board image where is waldo';

    container.appendChild(image);

    //start visual timer
    console.log(startTime);
    startTime = await startTime;

    console.log(startTime);
    interval = setInterval(() => {
      timer(new Date(), startTime);
    }, 100);

    // Listen to windows size change
    window.addEventListener('resize', () => {
      imageHeight = image.height;
      imageWidth = image.width;
      console.log({ imageWidth, imageHeight });
    });

    body.appendChild(container);
    image.addEventListener('click', (e) => {
      console.log(e);
      let x = e.offsetX;
      let y = e.offsetY;
      console.log(e.offsetX, e.offsetY);
      let hitChar = gameFac.isHit(x, y, imageWidth, imageHeight);
      console.log('hitchar', hitChar);
      //gameFac.markToCheckPositions(x, y, imageWidth, imageHeight);
      createHitChoiceMenu(e.x, e.y, chars, hitChar, gameFac);
    });
    const frame = document.querySelector('.game-container');
    console.log('setcontaienr', imageHeight);
    frame.style.height = imageHeight + 'px';
  }

  function zoomInFunction() {
    const image = document.querySelector('.game-image');
    let currHeight = image.clientHeight;
    let currWidth = image.clientWidth;
    image.style.height = currHeight + 40 + 'px';
    image.style.width = currWidth + 40 + 'px';
    imageHeight = image.height;
    imageWidth = image.width;

    console.log({ imageWidth, imageHeight });
  }
  function zoomOutFunction() {
    const image = document.querySelector('.game-image');
    let currHeight = image.clientHeight;
    let currWidth = image.clientWidth;
    image.style.height = currHeight - 40 + 'px';
    image.style.width = currWidth - 40 + 'px';
    imageHeight = image.height;
    imageWidth = image.width;

    console.log({ imageWidth, imageHeight });
  }

  function createZoomButtons() {
    const container = document.createElement('div');

    container.classList.add('zoom-container');
    const zoomIn = document.createElement('button');
    zoomIn.classList.add('zoom-in-button');
    zoomIn.innerText = 'Zoom In';
    zoomIn.onclick = zoomInFunction;

    const zoomOut = document.createElement('button');
    zoomOut.classList.add('zoom-out-button');
    zoomOut.innerText = 'Zoom Out';
    zoomOut.onclick = zoomOutFunction;

    container.append(zoomIn, zoomOut);
    body.appendChild(container);
  }

  function createHitChoiceMenu(x, y, chars, hitChar, gameFac) {
    if (gameFinished) return;
    if (!choiceMenu) {
      choiceMenu = true;
      let menu = document.createElement('div');
      menu.classList.add('character-hit-menu');

      chars.forEach((char) => {
        let charName = document.createElement('p');
        charName.innerText = char.name;
        charName.addEventListener('click', async () => {
          if (hitChar == char.name.toLowerCase()) {
            console.log('correct');
            markFound(char.name.toLowerCase());
            gameFac.markFound(char.name.toLowerCase());
            if (gameFac.checkIfAllFound()) {
              stopTimer(interval);
              await firebase.stopTime();
              const time =
                Math.round((await firebase.calculateTime()) * 100) / 100;
              document.querySelector('.timer').innerText = time;
              requestUserName(time);
              gameFinished = true;
            }
            document.querySelector('.character-hit-menu').remove();
            choiceMenu = false;
          } else {
            console.log('wrong');
            document.querySelector('.character-hit-menu').remove();
            choiceMenu = false;
          }
        });
        menu.appendChild(charName);
      });
      body.appendChild(menu);
      menu.style.position = 'absolute';
      menu.style.top = y + 'px';
      menu.style.left = x + 'px';
    } else {
      document.querySelector('.character-hit-menu').remove();
      choiceMenu = false;
    }
  }
  function markFound(name) {
    const img = document.querySelector('#' + name);
    img.style.filter = 'grayscale(100%)';
    img.style.border = '5px solid red';
  }
  function setGameFinished() {
    gameFinished = true;
  }
  function requestUserName(time) {
    const container = document.createElement('div');
    const title = document.createElement('h2');
    const formGroup = document.createElement('div');
    const form = document.createElement('form');
    const label = document.createElement('label');
    const inputHighScore = document.createElement('input');
    const inputHighScoreBtn = document.createElement('button');

    formGroup.classList.add('form-group');
    container.classList.add('request-name');
    title.classList.add('highscore-title');
    form.classList.add('highscore-form');
    label.classList.add('highscore-label');
    inputHighScore.classList.add('highscore-input');
    inputHighScoreBtn.classList.add('highscore-button');

    title.innerText = 'Your time was: ' + time + ' s';
    label.for = 'highscore-input';
    label.innerText = 'Name';
    inputHighScore.id = 'highscore-input';
    inputHighScore.type = 'text';
    inputHighScore.setAttribute('required', null);
    inputHighScore.setAttribute('placeholder', 'Enter your name...');
    inputHighScoreBtn.innerText = 'Submit';

    label.appendChild(inputHighScore);
    formGroup.append(label);
    form.append(formGroup, inputHighScoreBtn);
    container.append(title, form);
    body.appendChild(container);

    inputHighScoreBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const name = e.target.form.querySelector('.highscore-input').value;
      console.log(name);
      await firebase.addUserName(name);
      container.remove();
      await loadHighScores();
    });
  }

  async function loadHighScores() {
    if (!highScoreShowing) {
      highScoreShowing = true;
      const highscores = await firebase.getHighScores();
      const container = document.createElement('div');
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const thPosition = document.createElement('th');
      const thName = document.createElement('th');
      const thScore = document.createElement('th');
      const tbody = document.createElement('tbody');
      const closeButton = document.createElement('div');

      container.classList.add('highscore-container');
      closeButton.classList.add('close-highscores');
      table.classList.add('highscores');

      closeButton.innerText = 'X';
      thPosition.innerText = 'Position';
      thName.innerText = 'Name';
      thScore.innerText = 'Score';

      thead.append(thPosition, thName, thScore);
      table.append(thead);

      highscores.forEach((user, i) => {
        const tr = document.createElement('tr');
        const position = document.createElement('td');
        position.classList.add('highscore-position');
        const name = document.createElement('td');
        name.classList.add('highscore-name');
        const score = document.createElement('td');
        score.classList.add('highscore-score');

        position.innerText = i + 1;
        name.innerText = user.name;
        score.innerText = user.score;

        tr.append(position, name, score);

        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      container.appendChild(closeButton);
      container.appendChild(table);
      body.appendChild(container);

      closeButton.addEventListener('click', () => {
        container.remove();
        highScoreShowing = false;
      });
    }
  }

  function timer(currentTime, startTime) {
    const timer = document.querySelector('.timer');
    let time = currentTime - startTime;
    timer.innerText = Math.round(time * 1) / 1000 + ' s';
    return Math.round(time) / 1000;
  }
  function stopTimer(id) {
    clearInterval(id);
  }

  return {
    clearScreen,
    createNavbar,
    createGameImage,
    createZoomButtons,
    loadHighScores,
    timer,
    stopTimer,
    highScoreShowing,
    imageHeight,
    imageWidth,
  };
}

export default createui;

// levels[0].forEach((char) => {
//   console.log(char.position.x);
//   UI.markCharacter(
//     document.querySelector('.game-image'),
//     char.position.y,
//     char.position.y
//   );
// });
