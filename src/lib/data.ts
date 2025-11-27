import type { Round1Item, Round2Item } from '@/lib/types';

export const round1Data: Round1Item[] = [
  { id: 'r1-1', motivo: 'Mezcla de tabaco en trials', cantidad: 3 },
  { id: 'r1-2', motivo: 'NTRM piedras en caja de lámina', cantidad: 2 },
  { id: 'r1-3', motivo: 'Papel dañado en caja de lámina', cantidad: 1 },
  { id: 'r1-4', motivo: 'NTRM sintético en caja de lámina', cantidad: 1 },
  { id: 'r1-5', motivo: 'NTRM ave en caja de lámina.', cantidad: 1 },
];

export const round2Data: Round2Item[] = [
  {
    id: 'r2-1',
    motivo: 'Mezcla de tabaco en trials',
    planDeAccion:
      'Revisión y adecuación del procedimiento local y LUPs para cambio de marcas.\nCapacitación al personal respecto a la documentación revisada.\nNegociación con clientes para alineación de trials Crop 2026.',
  },
  {
    id: 'r2-2',
    motivo: 'NTRM piedras en caja de lámina',
    planDeAccion:
      'Seguimiento a CTJ sobre plan de acción para control de piedras en proceso.',
  },
  {
    id: 'r2-3',
    motivo: 'Papel dañado en caja de lámina',
    planDeAccion:
      'Revisión del procedimiento local de gestión y trazabilidad de material de empaque.\nRevisión de circuitos de gestión de cajas entre producción-logística.',
  },
  {
    id: 'r2-4',
    motivo: 'NTRM sintético en caja de lámina',
    planDeAccion: 'Se realizó trazabilidad del reclamo y no se logró confirmar que el NTRM tuviera origen en Lerma',
  },
  {
    id: 'r2-5',
    motivo: 'NTRM ave en caja de lámina.',
    planDeAccion: 'Identificación y definición de alternativas para control de plagas.',
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
