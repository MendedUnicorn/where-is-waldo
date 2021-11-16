import './style.css';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import createui from './UI';
import gameFactory from './game';
import level1 from './gameLevels/level1.jpeg';
import waldo from './waldo.png';
import odlaw from './odlaw.png';
import wizard from './wizard.png';
import wilma from './wilma.png';

const firebaseConfig = {
  apiKey: 'AIzaSyAHbcH5t2psaH_nAKiZAFhepgo5wZhCVjw',
  authDomain: 'where-s-waldo-e4304.firebaseapp.com',
  projectId: 'where-s-waldo-e4304',
  storageBucket: 'where-s-waldo-e4304.appspot.com',
  messagingSenderId: '474701291950',
  appId: '1:474701291950:web:91e2ecf33a5112933da83f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//test connection
async function addToDb(charP, level) {
  try {
    charP.forEach(async (c) => {
      const docRef = await addDoc(collection(db, level), c);
      console.log('Added user', docRef);
    });
  } catch (error) {
    console.error('Could not post user to db - ', error);
  }
}

//create image

//create navbar

async function getCharPositions(db, level) {
  try {
    const colRef = collection(db, level);
    //create a reference to the library collection
    const q = query(colRef); //create a query with the library reference
    const docSnapshot = await getDocs(q);
    const charPositions = docSnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    return charPositions;
  } catch (error) {
    console.log('Could not retrieve library from database: ', error);
  }
}

console.log(getCharPositions(db, 'level1'));

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

async function startGame() {
  let currentPlayerId = '';
  let characterPositions = await getCharPositions(db, 'level1');
  let userTime;
  let game = gameFactory(characterPositions);
  let UI = createui(1000, 618);
  UI.clearScreen();
  UI.createNavbar(chars);
  await UI.createGameImage(level1, game, stopTime, calculateTime);
  UI.createZoomButtons();
  startTime();

  async function startTime() {
    console.log('Starting Timer...');
    try {
      const docRef = await addDoc(collection(db, 'user'), {
        name: '',
        startTimestamp: serverTimestamp(),
        stopTimestamp: 0,
      });
      currentPlayerId = docRef.id;
      console.log('Added user', docRef);
    } catch (error) {
      console.error('Could not post user to db - ', error);
    }
    console.log(currentPlayerId);
  }
  async function stopTime() {
    console.log('Stopping timer....');
    try {
      const docRef = doc(db, 'user', currentPlayerId);
      const q = query(docRef);
      const docSnap = await getDoc(q);
      let user = docSnap.data();
      user.stopTimestamp = serverTimestamp();
      await updateDoc(docRef, { ...user });
      console.log(user);
    } catch (error) {
      console.error('Could not post user to db - ', error);
    }
    console.log(currentPlayerId);
  }
  async function calculateTime() {
    const docRef = doc(db, 'user', currentPlayerId);
    const q = query(docRef);
    const docSnap = await getDoc(q);
    let user = docSnap.data();
    console.log(
      'Calc time: ',
      user,
      'stop ',
      user.stopTimestamp,
      ' start ',
      user.startTimestamp
    );
    userTime = user.stopTimestamp - user.startTimestamp;
    return userTime;
  }

  async function addUserName(name) {
    try {
      const docRef = doc(db, 'user', currentPlayerId);
      const q = query(docRef);
      const docSnap = await getDoc(q);
      let user = docSnap.data();
      user.name = name;
      await updateDoc(docRef, { ...user });
      console.log(user);
    } catch (error) {
      console.error('Could not post user to db - ', error);
    }
  }

  return {
    stopTime,
    addUserName,
    userId: currentPlayerId,
  };
}

export default gameStarted = startGame();
