import fs from 'fs/promises';
import path from 'path';
import type { Participant } from './types';

const dbPath = path.join(process.cwd(), 'participants.json');

async function readDb(): Promise<Participant[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array and create it
      await writeDb([]);
      return [];
    }
    console.error("Error reading database:", error);
    throw new Error("Could not read from database.");
  }
}

async function writeDb(data: Participant[]): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to database:", error);
    throw new Error("Could not write to database.");
  }
}

export async function getParticipants(): Promise<Participant[]> {
  return await readDb();
}

export async function findParticipant(firstName: string, lastName: string): Promise<Participant | undefined> {
  const participants = await readDb();
  return participants.find(
    (p) => p.firstName.toLowerCase() === firstName.toLowerCase() && p.lastName.toLowerCase() === lastName.toLowerCase()
  );
}

export async function addParticipant(participant: Omit<Participant, 'id' | 'createdAt'>): Promise<Participant> {
  const participants = await readDb();
  const newParticipant: Participant = {
    ...participant,
    id: new Date().getTime().toString() + Math.random().toString(36).substring(2), // Simple unique ID
    createdAt: new Date().toISOString(),
  };
  participants.push(newParticipant);
  await writeDb(participants);
  return newParticipant;
}

export async function deleteParticipant(id: string): Promise<void> {
  let participants = await readDb();
  participants = participants.filter((p) => p.id !== id);
  await writeDb(participants);
}
