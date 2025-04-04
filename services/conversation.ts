import {
  QueryConstraint,
  arrayUnion,
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
  updateDoc,
  where,
} from 'firebase/firestore';

import { app } from '@/lib/firebase';
import { fbTimeToDate } from '@/lib/utils';

import { EntityService } from './entity';

import { UserServiceIns } from '.';

const db = getFirestore(app);

export class ConversationService extends EntityService<ConversationType> {
  constructor() {
    super('conversations');
  }

  async getConversationsByUser(id?: string, options?: FirebasePaginationOptionsType) {
    let totalDoc;
    const docRef = collectionRef(db, this.collection);

    const queryArgs: QueryConstraint[] = [];

    if (id) queryArgs.push(where('members', 'array-contains', id));

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
      console.log(e);
    }

    return {
      result: result?.docs.map((res) => ({
        ...res.data(),
        id: res.id,
        createdAt: fbTimeToDate(res.data().createdAt),
        messages: res.data().messages.map((msg: MessageType) => ({
          ...msg,
          date: fbTimeToDate(msg.date as FirebaseDateType),
        })) as MessageType[],
        members: res.data().members.map((usr: string) => UserServiceIns.getById(usr)),
      })),
      query: result?.query,
      error,
      totalDoc,
    };
  }

  async addMessage(id: string, data: MessageType) {
    let result = null;
    let error = null;

    try {
      result = await updateDoc(doc(db, this.collection, id), {
        lastMessage: new Date(),
        messages: arrayUnion(data),
      });
    } catch (e) {
      error = e;
    }

    return { result, error };
  }
  async updateViewed(conversation: ConversationType, userId: string) {
    let result = null;
    let error = null;

    try {
      result = await updateDoc(doc(db, this.collection, conversation.id!), {
        messages: conversation.messages.map((msg) =>
          msg.author.id === userId
            ? msg
            : {
                ...msg,
                viewed: !!msg.viewed ? msg.viewed : new Date(),
              }
        ),
      });
    } catch (e) {
      error = e;
    }

    return { result, error };
  }
}
