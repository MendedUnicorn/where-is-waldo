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
  Timestamp,
} from 'firebase/firestore';
import createui from './UI';
import gameFactory from './game';

const firebase = (function firebase() {
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
  async function getCharPositions(level) {
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

  let currentPlayerId = '';
  let userTime = 0;

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
      return new Date(Timestamp.now().seconds * 1000);
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

  async function getHighScores() {
    try {
      const colRef = collection(db, 'user');
      const q = query(colRef);
      const docSnapshot = await getDocs(q);
      const data = docSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      console.log(data);
      const highscores = data
        .filter((u) => {
          if (!u.name) {
            return false;
          } else {
            return true;
          }
        })
        .map((user) => {
          return {
            name: user.name,
            score:
              Math.round((user.stopTimestamp - user.startTimestamp) * 100) /
              100,
          };
        })
        .sort((a, b) => {
          return a.score - b.score;
        });
      console.log('highscores ', highscores);
      return highscores;
    } catch (error) {
      console.log('Could not retrieve library from database: ', error);
    }
  }

  return {
    getCharPositions,
    startTime,
    stopTime,
    calculateTime,
    addUserName,
    getHighScores,
  };
})();

export default firebase;
