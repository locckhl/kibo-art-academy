import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  where,
  query,
  limit,
  updateDoc,
} from "firebase/firestore"
import { getAuth } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAsqAL18hjTKzpYNPW3q6lSKaejYO1TuDc",
  authDomain: "kibo-art-academy.firebaseapp.com",
  projectId: "kibo-art-academy",
  storageBucket: "kibo-art-academy.appspot.com",
  messagingSenderId: "182717419459",
  appId: "1:182717419459:web:c9090ca49ad66aa7c8b776",
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);

// Test function for reading data
export const getFirebaseItems = async (...args) => {
  let result = []
  try {
    const response = await getDocs(collection(db, ...args))
    response.forEach((doc) => {
      result.push({ ...doc.data(), id: doc.id })
    })
  } catch (err) {
    console.log(err)
  }
  return result
}

/**
 * @param {string} table table is queried
 * @param {...any} options Query condition. Ex: [field, opStr(>,==, etc ...), value]
 * @returns object
 */
export const getFirebaseItemWithCondition = async (table, ...options) => {
  let result = {}
  const q = options.map((option) => where(...option))
  try {
    const response = await getDocs(query(collection(db, table), ...q, limit(1)))
    response.forEach((doc) => {
      result = { ...doc.data(), id: doc.id }
    })
  } catch (error) {
    console.log(error)
  }
  return result
}
export const getFirebaseItemsWithCondition = async (table, ...options) => {
  let result = []
  const q = options.map((option) => where(...option))
  try {
    const response = await getDocs(query(collection(db, table), ...q, limit(1)))
    response.forEach((doc) => {
      console.log(result)
      result.push({...doc.data(), id: doc.id })
    })
  } catch (error) {
    console.log(error)
  }
  return result
}

/**
 *
 * @param  {...any} args Ex: collection1, id1, colection2, id2, ...
 * @returns object
 */
export const getFirebaseItemWithID = async (...args) => {
  let result = {}
  try {
    const response = await getDoc(doc(db, ...args))
    if (response.exists()) {
      result = { ...response.data(), id: response.id }
    }
  } catch (error) {
    console.log(error)
  }
  return result
}

export const updateItemFireBase = async (item, ...args) => {
  let isSuccess = false
  try {
    await updateDoc(doc(db, ...args), item)
    isSuccess = true
  } catch (error) {
    console.error(error)
  }
  return isSuccess
}
