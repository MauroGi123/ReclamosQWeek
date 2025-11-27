export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  score: number;
  total: number;
  time?: number; // Time in seconds
  createdAt: string;
}

export interface Round1Item {
  id: string;
  motivo: string;
  cantidad: number;
}

export interface Round2Item {
  id:string;
  motivo: string;
  planDeAccion: string;
}
