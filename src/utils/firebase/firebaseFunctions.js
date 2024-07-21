import { getStorage } from 'firebase/storage';

function getStorageUrl(path) {
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
}

export { getStorageUrl };
