export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  score: number;
  total: number;
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
