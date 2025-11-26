import type { Round1Item, Round2Item } from '@/lib/types';

export const round1Data: Round1Item[] = [
  { id: 'r1-1', motivo: 'No conformidades en operaciones de trials', cantidad: 3 },
  { id: 'r1-2', motivo: 'NTRM piedras en caja de lámina', cantidad: 2 },
  { id: 'r1-3', motivo: 'Papel dañado dentro de caja de lámina', cantidad: 1 },
  { id: 'r1-4', motivo: 'NTRM sintético en caja de lámina', cantidad: 1 },
  { id: 'r1-5', motivo: 'NTRM paloma entera en caja de làmina', cantidad: 1 },
];

export const round2Data: Round2Item[] = [
  {
    id: 'r2-1',
    motivo: 'No conformidades en operaciones de trials',
    planDeAccion:
      'Negociación con clientes cantidad de trials y especificación\nCreación y aprobación de procedimiento\nAlineación de LUPs existentes\nCapacitaciòn del nuevo procedimiento',
  },
  {
    id: 'r2-2',
    motivo: 'NTRM piedras en caja de lámina',
    planDeAccion:
      'Se solicita a CTJ plan de acción al respecto\nSe da seguimiento a Plan de acción de CTJ',
  },
  {
    id: 'r2-3',
    motivo: 'Papel dañado dentro de caja de lámina',
    planDeAccion:
      'Capacitar a personal de logìsitica y proceso involucrado en el empaque de producto\nReforzar trazabilidad en material de empaque\nRevisar LUPs faltantes para recepciòn, manejo y control de material de empaque',
  },
  {
    id: 'r2-4',
    motivo: 'NTRM sintético en caja de lámina',
    planDeAccion: 'No puede confirmarse NTRM origen Lerma',
  },
  {
    id: 'r2-5',
    motivo: 'NTRM paloma entera en caja de lámina',
    planDeAccion: 'Pendiente confirmar acciones: cortina automática y colocación de red anti-aves',
  },
];

// Helper to shuffle arrays
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  let currentIndex = newArray.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }

  return newArray;
}
