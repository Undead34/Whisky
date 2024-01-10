import {
  deleteDoc,
  getDoc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { doc, writeBatch, collection } from "firebase/firestore";
import { unstable_noStore as noStore } from "next/cache";
import { emptyVictim } from "./constants";
import { v4 as uuid } from "uuid";
import { db } from "./firebase";
import { ILot, ITargets, IVictims } from "../definitions";

// Ad  Victims to victims collection and check if the victim is already in the targets collection to update it.
export async function dbAddVictims(victimInfo: Partial<IVictims>) {
  const ID = victimInfo.id!
  const docRef = doc(db, "victims", ID);
  const victimRef = await getDoc(docRef);

  if (victimRef.exists()) {
    await updateDoc(docRef, victimInfo);
  } else {
    const targetRef = await getDoc(doc(db, "targets", ID));

    if (targetRef.exists()) {
      await setDoc(doc(db, "victims", ID), {
        ...emptyVictim,
        ...victimInfo,
        captured: true,
      });
    } else {
      const anonymous: IVictims = {
        ...emptyVictim,
        ...victimInfo,
        sended: false,
        captured: true,
        readed: false,
        clicks: 1,
        visits: 1,
      };

      await setDoc(doc(db, "victims", anonymous.id), anonymous);
    }
  }
}

export async function dbIncremetnClicks(userID: string) {
  const docRef = doc(db, "victims", userID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, { clicks: increment(1) });
  }
}

export async function dbIncremetnVisits(userID: string) {
  const docRef = doc(db, "victims", userID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, { visits: increment(1) });
  }
}

// Create a lot in lots collection and add victims list in targets collection
export async function dbCreateLot(
  data: { name: string; email: string }[],
  name: string
) {
  const users: { id: string, name: string; email: string }[] = data.map((item) => {
    return { id: uuid(), name: item.name, email: item.email, sended: false };
  });

  const batch = writeBatch(db);

  users.forEach((user) => {
    const nodeRef = doc(db, "targets", user.id!);
    batch.set(nodeRef, user);
    batch.set(doc(db, "victims", user.id!), { ...emptyVictim, id: user.id });
  });

  await batch.commit();

  const lot = {
    id: uuid(),
    type: "lot",
    name: name,
    nodes: users.map((node) => node.id),
    sended: false,
  };

  await setDoc(doc(db, "lots", lot.id), lot);
}

// Delete a lot from lots collection and delete all victims from targets and victims collection
export async function dbDeleteLot(lotID: string) {
  const lotRef = doc(db, "lots", lotID);
  const logDoc = await getDoc(lotRef);

  if (logDoc.exists()) {
    const logData = logDoc.data();

    for (let i = 0; i < logData.nodes.length; i++) {
      const id = logData.nodes[i];
      await deleteDoc(doc(db, "targets", id));
      await deleteDoc(doc(db, "victims", id));
    }

    await deleteDoc(lotRef);
  }
}

// Get all victims from victims collection
export async function dbGetVictims(): Promise<IVictims[]> {
  noStore();

  try {
    const users = await getDocs(collection(db, "victims"));

    const data = users.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any;

    return data;
  } catch (error) {
    return [];
  }
}

// Get all targets from targets collection
export async function dbGetTargets(): Promise<ITargets[]> {
  noStore();

  try {
    const users = await getDocs(collection(db, "targets"));

    const data = users.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ITargets[];

    return data;
  } catch (error) {
    return [];
  }
}

// Get all lots from lots collection
export async function dbGetLots(): Promise<ILot[]> {
  // Cuando no hay datos. Vuelve a hacer un fetch...
  // Cada que compila/guardo vuelve a hacer un fetch.
  // Cada x tiempo hace un fetch?
  noStore();
  console.log("No Store cache... getting lots 🥴");

  try {
    const lots = await getDocs(collection(db, "lots"));

    const data = lots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any;

    return data;
  } catch (error) {
    return [];
  }
}

export async function getEmailsByLotID(lotID: string) {
  noStore();

  const lotRef = doc(db, "lots", lotID);
  const lotData = await getDoc(lotRef);
  const data = lotData.data() as ILot;

  const id: string[] = data.nodes;

  const users = await Promise.all(
    id.map(async (id) => {
      const userRef = doc(db, "targets", id);
      const userData = await getDoc(userRef);
      const data = userData.data() as ITargets;
      return { email: data.email.trim(), id: data.id.trim() };
    })
  );

  return users as { email: string; id: string; }[];
}

export async function markAsSended(userID: string) {
  const docRef = doc(db, "targets", userID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, { sended: true });
  }
}

export async function markAsReaded(userID: string) {
  const docRef = doc(db, "victims", userID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, { readed: true });
  }
}

export async function markLotAsSended(success: string[], lotID: string) {
  const batch = writeBatch(db);

  for (let i = 0; i < success.length; i++) {
    const id = success[i];
    const userRef = doc(db, "targets", id);
    const userData = await getDoc(userRef);
    const data = userData.data();
    const newData = { ...data, sended: true };
    batch.set(userRef, newData);
  }

  const lotRef = doc(db, "lots", lotID);
  const lotData = await getDoc(lotRef);
  const data = lotData.data() as ILot;

  const newData: ILot = { ...data, sended: true };
  batch.set(lotRef, newData);

  await batch.commit();
}

// export async function markEmailsAsSent(success: string[], lotID: string) {
//   const batch = writeBatch(db);

//   for (let i = 0; i < success.length; i++) {
//     const id = success[i];
//     const userRef = doc(db, "users", id);
//     const userData = await getDoc(userRef);
//     const data = userData.data();
//     const newData = { ...data, sended: true };
//     batch.set(userRef, newData);
//   }

//   const lotRef = doc(db, "lots", lotID);
//   const lotData = await getDoc(lotRef);
//   const data = lotData.data() as TLot;

//   let allSended = true;
//   // @ts-ignore
//   const nodes = data.nodes.map((node) => {
//     allSended = allSended && node.sended === true;

//     if (success.includes(node.id)) {
//       node.sended = true;
//     }

//     return node;
//   });

//   const newData = { ...data, nodes: nodes };
//   batch.set(lotRef, newData);

//   await batch.commit();

//   if (allSended) {
//     console.log("All okay", allSended);
//     await markAsSended(lotID);
//   }
// }


// export async function clicksIncrement(userID: string) {
//   const docRef = doc(db, "users", userID);
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     await updateDoc(docRef, { clicks: increment(1) });
//   }
// }

// export async function getLot(lotID: string): Promise<TLot> {
//   return (await getDoc(doc(db, "lots", lotID))).data() as TLot;
// }

//  async function addLot(lot: TLot) {
//   await setDoc(doc(db, "lots", lot.id), lot);
// }

// async function addUsers(users: IUser[]) {
//   const batch = writeBatch(db);

//   users.forEach((user) => {
//     const nodeRef = doc(db, "users", user.id);
//     batch.set(nodeRef, user);
//   });

//   await batch.commit();
// }

//  async function addUser(user: IUser) {
//   await setDoc(doc(db, "users", user.id), user);
// }

// lots
// victims
// targets

// export async function getStats() {
//   try {
//     const users = await getDocs(collection(db, "users"))

//     const data: IUser[] = users.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     })) as any;

//     const stats = data.reduce<IStats>((acc, user) => {
//       acc.total++;
//       if (user.sended) acc.emailed++;
//       if (user.captured) {
//         acc.captured++;
//         acc.users.push(user);
//       }
//       if (user.read) acc.read++;
//       acc.clicks += user.clicks;

//       return acc;
//     }, {
//       total: 0,
//       emailed: 0,
//       captured: 0,
//       read: 0,
//       clicks: 0,
//       users: [],
//     });

//     return stats;
//   } catch (error) {
//     return {
//       total: 0,
//       emailed: 0,
//       captured: 0,
//       read: 0,
//       clicks: 0,
//       users: [],
//     }
//   }
// }
// export async function getUsers() {
//   try {
//     const users = await getDocs(collection(db, "users"))

//     const data: IUser[] = users.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     })) as any

//     return data;
//   }
//   catch (error) {
//     return []
//   }
// }

// export async function dbCreateLot(data: { name: string; email: string }[], name: string) {
//   const nodes: IUser[] = data.map((item) => {
//     return { ...emptyLot, id: randomUUID(), name: item.name, email: item.email };
//   });

//   await dbAddUsers(nodes);

//   const lot = {
//     id: randomUUID(),
//     type: "lot",
//     name: name,
//     nodes,
//     sended: false,
//   }

//   await setDoc(doc(db, "lots", lot.id), lot);

// }

// async function dbAddUsers(users: IUser[]) {
//   const batch = writeBatch(db);

//   users.forEach((user) => {
//     const nodeRef = doc(db, "users", user.id);
//     batch.set(nodeRef, user);
//   });

//   await batch.commit();
// }

// export async function dbGetLots(): Promise<ILot[]> {
//   const lots = await getDocs(collection(db, "lots"));

//   const data: ILot[] = lots.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) as any;

//   return data;
// }

// async function dbAddUser(user: IUser) {
//   await setDoc(doc(db, "users", user.id), user);
// }

//   async function deleteLot(lotID: string) {
//     const lotRef = doc(db, "lots", lotID);
//     const logDoc = await getDoc(lotRef);

//     if (logDoc.exists()) {
//       const logData = logDoc.data();

//       await Promise.all(
//         logData.nodes.map(async function (user: IUser) => {
//           deleteDoc(doc(db, "users", user.id));
//         })
//       );

//       await deleteDoc(lotRef);
//     }
//   }

//   async function markAsRead(userID: string) {
//     const docRef = doc(db, "users", userID);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       await updateDoc(docRef, { read: true });
//     }
//   }

//   async function markAsSended(lotID: string, value = true) {
//     const docRef = doc(db, "lots", lotID);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       await updateDoc(docRef, { sended: value });
//     }
//   }

//   async function clicksIncrement(userID: string) {
//     const docRef = doc(db, "users", userID);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       await updateDoc(docRef, { clicks: increment(1) });
//     }
//   }

// subscribe(query: string, callback: (snapshot: TSnapshot) => void) {
//     return onSnapshot(collection(db, query), callback);
//   }

//   async function addCaptured(userInfo: TUserInfo) {
//     const docRef = doc(db, "users", userInfo.id);
//     const userRef = await getDoc(docRef);

//     if (userRef.exists()) {
//       await updateDoc(docRef, userInfo);
//     } else {
//       const anonymous: IUser = {
//         ...emptyLot,
//         ...userInfo,
//         name: "Anonymous",
//         email: "N/A",
//         sended: false,
//         captured: true,
//         read: false,
//         attempts: 0,
//         clicks: 1,
//         visits: 1,
//       };

//       await addUser(anonymous);
//     }
//   }

//   async function markEmailsAsSent(success: string[], lotID: string) {
//     const batch = writeBatch(db);

//     for (let i = 0; i < success.length; i++) {
//       const id = success[i];
//       const userRef = doc(db, "users", id);
//       const userData = await getDoc(userRef);
//       const data = userData.data();
//       const newData = { ...data, sended: true };
//       batch.set(userRef, newData);
//     }

//     const lotRef = doc(db, "lots", lotID);
//     const lotData = await getDoc(lotRef);
//     const data = lotData.data() as TLot;

//     let allSended = true;
//     const nodes = data.nodes.map((node) => {
//       allSended = allSended && node.sended === true;

//       if (success.includes(node.id)) {
//         node.sended = true;
//       }

//       return node;
//     });

//     const newData = { ...data, nodes: nodes };
//     batch.set(lotRef, newData);

//     await batch.commit();

//     if (allSended) {
//       console.log("All okay", allSended);
//       await markAsSended(lotID);
//     }
//   }
