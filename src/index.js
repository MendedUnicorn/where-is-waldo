import './style.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import UI from './UI';
import waldo from './waldo.png';
import odlaw from './odlaw.png';
import wizard from './wizard.png';

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
// async function addToDb() {
//   try {
//     const docRef = await addDoc(collection(db, 'users'), {
//       first: 'Stupid',
//       last: 'Poop',
//       born: 1919,
//     });
//     console.log('Added user', docRef);
//   } catch (error) {
//     console.error('Could not post user to db - ', error);
//   }
// }

// addToDb();

//create image
export let chars = [
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
//create navbar
