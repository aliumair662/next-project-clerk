import { signInWithCustomToken } from 'firebase/auth'
import {
    addDoc,
  auth,
  collection,
  db,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,where
} from '@/firebase'

export const signIntoFirebaseWithClerk = async (getToken) => {
  try {
    const token = await getToken({ template: 'integration_firebase' })
    await signInWithCustomToken(auth, token || '')
  } catch (error) {
    console.log(error)
  }
}

export const getEvents = async (search='') => {
  try {
    // const collRef = query(
    //     collection(db, 'events'),
    //     where('name', '>=',search),
    //     where('name','<=', search + '\uf8ff')
    // );
    const collRef = 
        collection(db, 'events')
    const querySnapshot = await getDocs(collRef);

    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return documents
  } catch (error) {
    console.log(error)
    return []
  }
}

export const deleteEvent = async (eventId) => {
  try {
    const docRef = doc(db, 'events', eventId)
    await deleteDoc(docRef)
  } catch (error) {
    console.log(error)
  }
}

export const getEvent = async (eventId) => {
  try {
    const docRef = doc(db, 'events', eventId)
    const docSnap = await getDoc(docRef)
    return docSnap.data()
  } catch (error) {
    console.log(error)
  }
}

export const saveEvent = async (payload, eventId = null) => {
  try {
    if (!eventId) {
      await addDoc(collection(db, 'events'), payload)
    } else {
      const docRef = doc(db, 'events', eventId)
      await updateDoc(docRef, payload)
    }
  } catch (error) {
    console.log(error)
  }
}
