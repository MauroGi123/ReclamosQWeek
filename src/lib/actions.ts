'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { findParticipant, addParticipant, getParticipants, deleteParticipant as deleteDbParticipant } from './db';
import type { Participant } from './types';

type FormState = {
  error?: string;
  success?: boolean;
  redirectUrl?: string;
} | null;

export async function checkAndRegister(prevState: FormState, formData: FormData): Promise<FormState> {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  if (!firstName || !lastName) {
    return { error: 'Nombre y apellido son requeridos.' };
  }

  const existingParticipant = await findParticipant(firstName, lastName);

  if (existingParticipant) {
    return { error: 'Ya has participado en el juego.' };
  }

  // User is new, redirect to the game
  const params = new URLSearchParams({ firstName, lastName });
  return { success: true, redirectUrl: `/play?${params.toString()}` };
}

export async function saveResult(
  firstName: string,
  lastName: string,
  score: number,
  total: number
) {
  try {
    const existingParticipant = await findParticipant(firstName, lastName);
    if (existingParticipant) {
        // This case should ideally not be hit if checkAndRegister works, but as a safeguard:
        console.warn(`Participant ${firstName} ${lastName} already exists. Not saving new score.`);
        return { success: false, message: 'Resultados ya guardados.' };
    }
    await addParticipant({ firstName, lastName, score, total });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: 'No se pudo guardar el resultado.' };
  }
}

export async function getAdminResults(): Promise<Participant[]> {
    return await getParticipants();
}

export async function deleteResult(id: string) {
    try {
        await deleteDbParticipant(id);
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'No se pudo eliminar la participación.' };
    }
}

export async function downloadResults() {
    const participants = await getParticipants();
    const headers = ['Nombre', 'Apellido', 'Calificación', 'Fecha y Hora'];
    const rows = participants.map(p => 
        [
            p.firstName,
            p.lastName,
            `${((p.score / p.total) * 100).toFixed(0)}% (${p.score}/${p.total})`,
            new Date(p.createdAt).toLocaleString('es-ES')
        ].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    
    return new Response(csvContent, {
        status: 200,
        headers: {
            'Content-Disposition': `attachment; filename="qweek-results.csv"`,
            'Content-Type': 'text/csv',
        },
    });
}
