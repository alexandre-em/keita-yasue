import {
  QueryConstraint,
  collection as collectionRef,
  deleteDoc,
  doc,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';

import { app } from '@/lib/firebase';

const db = getFirestore(app);

export class EntityService<T> {
  protected collection: EntityTypes;

  constructor(collection: EntityTypes) {
    this.collection = collection;
  }

  async getAll(
    lim?: number,
    cursor?: {
      after?: string;
      before?: string;
    },
    orderByQuery?: { value: string; order: 'asc' | 'desc' },
    publish?: boolean
  ) {
    const docRef = collectionRef(db, this.collection);
    let totalDoc;

    const queryArgs: QueryConstraint[] = [];

    if (publish !== undefined) queryArgs.push(where('published', '==', publish));
    else if (orderByQuery?.value) queryArgs.push(orderBy(orderByQuery.value, orderByQuery.order));

    if (lim) {
      queryArgs.push(limit(lim));

      if (cursor?.before) {
        queryArgs.push(endBefore(await getDoc(doc(db, this.collection, cursor.before))));
      } else {
        if (cursor?.after) {
          queryArgs.push(startAfter(await getDoc(doc(db, this.collection, cursor.after))));
        }
      }
      totalDoc = (await getCountFromServer(docRef)).data().count;
    }

    const q = query(docRef, ...queryArgs);

    let result = null;
    let error = null;

    try {
      result = await getDocs(q);
    } catch (e) {
      error = e;
    }

    return { result, error, totalDoc };
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

  async createOne(data: T) {
    let result = null;
    let error = null;
    const id = crypto.randomUUID();

    try {
      result = await setDoc(doc(db, this.collection, id), data as EntityType, {
        merge: true,
      });
    } catch (e) {
      error = e;
    }

    return { id, result, error };
  }

  async updateOne(id: string, data: Partial<T>) {
    let result = null;
    let error = null;

    try {
      result = await updateDoc(doc(db, this.collection, id), data as Partial<EntityType>);
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
