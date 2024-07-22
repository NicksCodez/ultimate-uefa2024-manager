import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firestore } from '../../firebase';

const getStorageUrl = (path) => {
  // return firebase storage url based on a path
  // automatically checks for emulator or production
  const storage = getStorage();
  const bucket = storage.app.options.storageBucket;

  // check for emulator
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    // emulator URL
    return `http://${window.location.hostname}:9199/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media`;
  }
  // production URL
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media`;
};

const saveGameState = async (gameId, gameState) => {
  const docRef = doc(firestore, 'games', gameId);

  try {
    // check if doc already exists
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // doc exists, update it
      await updateDoc(docRef, gameState);
    } else {
      // doc doesn't exist, create it
      await setDoc(docRef, gameState);
    }
  } catch (error) {
    console.error(
      'Error saving game state: ',
      error,
      { gameId },
      { gameState },
    );
    throw error; // re-throw the error for the caller to handle
  }
};

const loadGameState = async (gameId) => {
  const docRef = doc(firestore, 'games', gameId);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error loading game state: ', error, { gameId });
    throw error; // re-throw the error for the caller to handle
  }
};
export { getStorageUrl, saveGameState, loadGameState };
