'use server';
import { initializeFirebase } from '@/firebase';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import type { Participant } from './types';

// Helper to get Firestore instance
function getDb() {
  return initializeFirebase().db;
}

export async function getParticipants(): Promise<Participant[]> {
  const db = getDb();
  const participantsCol = collection(db, 'participants');
  const snapshot = await getDocs(participantsCol);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Firestore Timestamps need to be converted to strings for client components
      createdAt: (data.createdAt?.toDate() ?? new Date()).toISOString(),
    } as Participant;
  });
}

export async function findParticipant(firstName: string, lastName: string): Promise<Participant | undefined> {
  const db = getDb();
  const participantsCol = collection(db, 'participants');
  const cleanFirstName = firstName.trim().toLowerCase();
  const cleanLastName = lastName.trim().toLowerCase();
  
  // Firestore doesn't support case-insensitive queries directly on the server.
  // We'll fetch all and filter, which is okay for a small number of participants.
  // For a large dataset, this should be optimized (e.g., by storing lowercase names).
  const allParticipants = await getParticipants();

  return allParticipants.find(
    (p) => p.firstName.trim().toLowerCase() === cleanFirstName && p.lastName.trim().toLowerCase() === cleanLastName
  );
}

export async function addParticipant(participant: Omit<Participant, 'id' | 'createdAt'>): Promise<Participant> {
  const db = getDb();
  const participantsCol = collection(db, 'participants');
  
  const newParticipantData = {
    ...participant,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(participantsCol, newParticipantData);
  
  return {
    ...participant,
    id: docRef.id,
    createdAt: new Date().toISOString(), // Return a client-side friendly date
  };
}

export async function deleteParticipant(id: string): Promise<void> {
    const db = getDb();
    const participantDoc = doc(db, 'participants', id);
    await deleteDoc(participantDoc);
}
