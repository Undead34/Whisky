import {
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { Firestore, getFirestore, increment } from "firebase/firestore";
import { collection, onSnapshot } from "firebase/firestore";
import { doc, writeBatch } from "firebase/firestore";
import { emptyLot } from "@/backend/utils/constants";
import { firebaseConfig } from "@/backend/config";
import { v4 as uuid } from "uuid";

// Types
import { FirebaseApp, initializeApp } from "firebase/app";
import { IUser, TLot, TUser, TUserInfo, TSnapshot } from "../types/globals";

class Database {
  // Properties
  app: FirebaseApp;
  db: Firestore;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore();
  }

  subscribe(query: string, callback: (snapshot: TSnapshot) => void) {
    return onSnapshot(collection(this.db, query), callback);
  }

  async addCaptured(userInfo: TUserInfo) {
    const docRef = doc(this.db, "users", userInfo.id);
    const userRef = await getDoc(docRef);

    if (userRef.exists()) {
      await updateDoc(docRef, userInfo);
    } else {
      const anonymous: IUser = {
        ...emptyLot,
        ...userInfo,
        name: "Anonymous",
        email: "N/A",
        sended: false,
        captured: true,
        read: false,
        attempts: 0,
        clicks: 1,
        visits: 1,
      };

      await this.addUser(anonymous);
    }
  }

  async markEmailsAsSent(success: string[], lotID: string) {
    const batch = writeBatch(this.db);

    for (let i = 0; i < success.length; i++) {
      const id = success[i];
      const userRef = doc(this.db, "users", id);
      const userData = await getDoc(userRef);
      const data = userData.data();
      const newData = { ...data, sended: true };
      batch.set(userRef, newData);
    }

    const lotRef = doc(this.db, "lots", lotID);
    const lotData = await getDoc(lotRef);
    const data = lotData.data() as TLot;

    let allSended = true;
    const nodes = data.nodes.map((node) => {
      allSended = allSended && node.sended === true;

      if (success.includes(node.id)) {
        node.sended = true;
      }

      return node;
    });

    const newData = { ...data, nodes: nodes };
    batch.set(lotRef, newData);

    await batch.commit();

    if (allSended) {
      console.log("All okay", allSended);
      await this.markAsSended(lotID);
    }
  }

  async createLot(data: TUser[], name: string) {
    const nodes: IUser[] = data.map((item) => {
      return { ...emptyLot, id: uuid(), name: item.name, email: item.email };
    });

    await this.addUsers(nodes);

    await this.addLot({
      id: uuid(),
      type: "lot",
      name: name,
      nodes,
      sended: false,
    });
  }

  async deleteLot(lotID: string) {
    const lotRef = doc(this.db, "lots", lotID);
    const logDoc = await getDoc(lotRef);

    if (logDoc.exists()) {
      const logData = logDoc.data();

      await Promise.all(
        logData.nodes.map(async (user: IUser) => {
          deleteDoc(doc(this.db, "users", user.id));
        })
      );

      await deleteDoc(lotRef);
    }
  }

  async markAsRead(userID: string) {
    const docRef = doc(this.db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, { read: true });
    }
  }

  async markAsSended(lotID: string, value = true) {
    const docRef = doc(this.db, "lots", lotID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, { sended: value });
    }
  }

  async clicksIncrement(userID: string) {
    const docRef = doc(this.db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, { clicks: increment(1) });
    }
  }

  async getLot(lotID: string): Promise<TLot> {
    return (await getDoc(doc(this.db, "lots", lotID))).data() as TLot;
  }

  private async addLot(lot: TLot) {
    await setDoc(doc(this.db, "lots", lot.id), lot);
  }

  private async addUsers(users: IUser[]) {
    const batch = writeBatch(this.db);

    users.forEach((user) => {
      const nodeRef = doc(this.db, "users", user.id);
      batch.set(nodeRef, user);
    });

    await batch.commit();
  }

  private async addUser(user: IUser) {
    await setDoc(doc(this.db, "users", user.id), user);
  }
}

export default Database;
