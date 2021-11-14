import level1 from './gameLevels/level1.jpeg';
import waldo from './waldo.png';
import odlaw from './odlaw.png';
import wizard from './wizard.png';
import game from './game';

const UI = (function createui() {
  const body = document.querySelector('body');
  const container = document.querySelector('.container');

  let imageWidth;
  let imageHeight;

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
    title.classList.add('title');
    title.innerText = "Where's Waldo";
    navbar.append(createChars(chars), title, createTimerAndStopButton());
    body.appendChild(navbar);
  }

  async function createGameImage(img) {
    const container = document.createElement('div');
    container.classList.add('game-container');

    const image = new Image();
    image.classList.add('game-image');
    image.alt = 'game board image where is waldo';
    image.style.width = '100%';
    image.src = img;

    console.log(image.height);
    container.appendChild(image);
    imageHeight = image.height;
    imageWidth = image.width;
    console.log('make image', imageWidth);
    levels[0].forEach((char) => {
      UI.markCharacter(
        char.position.x,
        char.position.y,
        imageWidth,
        imageHeight
      );
    });

    image.addEventListener('click', (e) =>
      game.clickImage(e, imageWidth, imageHeight)
    );
    body.appendChild(container);
  }

  function zoomInFunction() {
    const image = document.querySelector('.game-image');
    let currHeight = image.clientHeight;
    let currWidth = image.clientWidth;
    image.style.height = currHeight + 40 + 'px';
    image.style.width = currWidth + 40 + 'px';
    imageHeight = image.height;
    imageWidth = image.width;
    document.querySelectorAll('.marker').forEach((el) => el.remove());

    levels[0].forEach((char) => {
      UI.markCharacter(
        char.position.x,
        char.position.y,
        imageWidth,
        imageHeight
      );
    });
  }
  function zoomOutFunction() {
    const image = document.querySelector('.game-image');
    let currHeight = image.clientHeight;
    let currWidth = image.clientWidth;
    image.style.height = currHeight - 40 + 'px';
    image.style.width = currWidth - 40 + 'px';
    imageHeight = image.height;
    imageWidth = image.width;
    document.querySelectorAll('.marker').forEach((el) => el.remove());

    levels[0].forEach((char) => {
      UI.markCharacter(
        char.position.x,
        char.position.y,
        imageWidth,
        imageHeight
      );
    });
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

  function markArea() {}

  function markCharacter(x, y, w, h) {
    const image = document.querySelector('.game-image');
    const container = document.querySelector('.game-container');

    const square = document.createElement('div');
    square.classList.add('marker');
    let styles = {
      border: '5px solid green',
      position: 'absolute',
      left: x * w + 'px',
      // left: '440px',
      top: y * h + 'px',
      height: (h / 1000) * 50 + 'px',
      width: (w / 1000) * 25 + 'px',
    };
    Object.assign(square.style, styles);

    //container.append(square);
  }

  function setCharacterPosition() {}

  return {
    clearScreen,
    createNavbar,
    createGameImage,
    createZoomButtons,
    markCharacter,
    imageHeight,
    imageWidth,
  };
})();

export default UI;

let chars = [
  {
    name: 'Waldo',
    image: waldo,
  },
  {
    name: 'Odlaw',
    image: odlaw,
  },
  {
    name: 'Wizard',
    image: wizard,
  },
];
let levels = [
  [
    { name: 'Waldo', position: { x: 0.4177, y: 0.74199 } },

    { name: 'Odlaw', position: { x: 0.5277, y: 0.84199 } },
  ],
  [
    { name: 'Waldo', position: { x: 0.4277, y: 0.74199 } },

    { name: 'Odlaw', position: { x: 0.5277, y: 0.84199 } },
  ],
];
window.addEventListener('resize', (e) => {
  const image = document.querySelector('.game-image');
  let imageWidth = image.width;
  let imageHeight = image.height;
  document.querySelectorAll('.marker').forEach((div) => div.remove());
  console.log('width', imageWidth, 'height', imageHeight);
  levels[0].forEach((char) => {
    UI.markCharacter(char.position.x, char.position.y, imageWidth, imageHeight);
  });
});
UI.clearScreen();
UI.createNavbar(chars);
UI.createGameImage(level1);
UI.createZoomButtons();

// levels[0].forEach((char) => {
//   console.log(char.position.x);
//   UI.markCharacter(
//     document.querySelector('.game-image'),
//     char.position.y,
//     char.position.y
//   );
// });
