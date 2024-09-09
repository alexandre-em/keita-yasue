import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

import { removeSession } from '@/actions/auth';
import { auth } from '@/lib/firebase';

class GoogleAuthentication {
  async signIn() {
    const provider = new GoogleAuthProvider();

    const response = await signInWithPopup(auth, provider);

    return response;
  }

  async signOut() {
    await removeSession();

    return signOut(auth);
  }

  authStateChanged() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (currentUser) => {
        resolve(currentUser);
      });
    });
  }
}

const googleAuthInstance = new GoogleAuthentication();

export default googleAuthInstance;
