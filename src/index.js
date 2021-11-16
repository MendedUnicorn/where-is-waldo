import './style.css';
import firebase from './firebase';
import createui from './UI';
import gameFactory from './game';
import level1 from './gameLevels/level1.jpeg';
import waldo from './waldo.png';
import odlaw from './odlaw.png';
import wizard from './wizard.png';
import wilma from './wilma.png';

createui().loadHighScores();
//create image
document.querySelector('.start-game').addEventListener('click', () => {
  startGame();
  document.querySelector('.highscore-container').remove();
  UI.highScoreShowing = false;
});
//create navbar

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
  {
    name: 'Wilma',
    image: wilma,
  },
];

async function startGame() {
  let characterPositions = await firebase.getCharPositions('level1');
  let game = gameFactory(characterPositions);
  let UI = createui(1000, 618);

  UI.clearScreen();
  UI.createNavbar(chars);

  await UI.createGameImage(level1, game, firebase.startTime()); //, stopTime, calculateTime);
  UI.createZoomButtons();
}

// let characterPositions = [
//   {
//     name: 'waldo',
//     x: 0.421,
//     y: 0.7318,
//     hitboxSizeX: 0.025,
//     hitboxSizeY: 0.0486,
//     found: false,
//   },
//   {
//     name: 'odlaw',
//     x: 0.5785,
//     y: 0.9406,
//     hitboxSizeX: 0.025,
//     hitboxSizeY: 0.016207,
//     found: false,
//   },
//   {
//     name: 'wilma',
//     x: 0.428,
//     y: 0.5853,
//     hitboxSizeX: 0.015,
//     hitboxSizeY: 0.0427,
//     found: false,
//   },
//   {
//     name: 'wizard',
//     x: 0.645,
//     y: 0.7654,
//     hitboxSizeX: 0.025,
//     hitboxSizeY: 0.018,
//     found: false,
//   },
// ];
// addToDb(characterPositions, 'level1');
