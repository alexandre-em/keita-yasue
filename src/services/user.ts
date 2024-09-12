import {
  collection as collectionRef,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { app } from '@/lib/firebase';

const db = getFirestore(app);

export class UserService {
  protected collection: EntityTypes;

  constructor() {
    this.collection = 'users';
  }

  async getById(id: string) {
    const docRef = doc(db, this.collection, id);

    let result = null;
    let error = null;

    try {
      result = await getDoc(docRef);
    } catch (e) {
      error = e;
    }

    return { result, error };
  }

  async getByField(key: string, value: string) {
    const docRef = collectionRef(db, this.collection);

    const q = query(docRef, where(key, '==', value));

    let result = null;
    let error = null;

    try {
      result = await getDocs(q);
    } catch (e) {
      error = e;
    }

    return { result, error };
  }

  async createOne(userId: string, data: UserType) {
    let result = null;
    let error = null;

    try {
      result = await setDoc(doc(db, this.collection, userId), data, {
        merge: false,
      });
    } catch (e) {
      error = e;
    }

    return { id: userId, result, error };
  }

  async updateOne(id: string, data: Partial<UserType>) {
    let result = null;
    let error = null;

    try {
      result = await updateDoc(doc(db, this.collection, id), data);
    } catch (e) {
      error = e;
    }

    return { result, error };
  }

  async deleteOne(id: string) {
    const db = getFirestore(app);
    let result = false;
    let error = null;

    try {
      await deleteDoc(doc(db, this.collection, id));

      result = true;
    } catch (e) {
      error = e;
    }

    return { result, error };
  }
}
