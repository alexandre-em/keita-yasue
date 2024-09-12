import {
  QueryConstraint,
  Timestamp,
  collection as collectionRef,
  doc,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';

import { app } from '@/lib/firebase';

import { EntityService } from './entity';

const db = getFirestore(app);

export class ReservationService extends EntityService<ReservationType> {
  constructor() {
    super('reservations');
  }

  async getUnAvailableHoursByDate(date: Date) {
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);

    const dateTimeStamp = Timestamp.fromDate(date);
    const nextDayTimestamp = Timestamp.fromDate(nextDay);

    const docRef = collectionRef(db, this.collection);

    const queryArgs: QueryConstraint[] = [];

    queryArgs.push(where('status', '!=', 'CANCELLED'));
    queryArgs.push(where('startDate', '>=', dateTimeStamp));
    queryArgs.push(where('startDate', '<', nextDayTimestamp));

    const q = query(docRef, ...queryArgs);

    let result = null;
    let error = null;

    try {
      result = await getDocs(q);
    } catch (e) {
      error = e;
    }

    return { result, error };
  }

  async getReservationByUser(id?: string, options?: FirebasePaginationOptionsType) {
    let totalDoc;
    const docRef = collectionRef(db, this.collection);

    const queryArgs: QueryConstraint[] = [];

    if (id) queryArgs.push(where('user.id', '==', id));

    if (options?.status) queryArgs.push(where('status', '==', options.status));
    if (options?.orderByQuery?.value) queryArgs.push(orderBy(options.orderByQuery.value, options.orderByQuery.order));

    if (options?.lim) {
      queryArgs.push(limit(options.lim));

      if (options?.cursor?.before) {
        queryArgs.push(endBefore(await getDoc(doc(db, this.collection, options.cursor.before))));
      } else {
        if (options?.cursor?.after) {
          queryArgs.push(startAfter(await getDoc(doc(db, this.collection, options.cursor.after))));
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
}
