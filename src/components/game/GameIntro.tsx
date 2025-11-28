"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad, Timer } from "lucide-react";

interface GameIntroProps {
  onStart: () => void;
  playerName: string;
}

export default function GameIntro({ onStart, playerName }: GameIntroProps) {
  return (
    <Card className="w-full max-w-lg text-center shadow-lg animate-in fade-in duration-500">
      <CardHeader>
        <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
            <Gamepad className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">¡Hola, {playerName}!</CardTitle>
        <CardDescription className="text-lg">Prepárate para el desafío.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-left px-8">
        <h3 className="font-semibold text-xl text-center">Instrucciones del Juego</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>El juego consiste en 2 rondas de asociación.</li>
            <li>
                <strong>Ronda 1:</strong> Deberás unir cada "motivo de reclamo" con la cantidad correcta de reclamos recibidos.
            </li>
            <li>
                <strong>Ronda 2:</strong> Unirás cada "motivo de reclamo" con su "plan de acción" correspondiente.
            </li>
        </ul>
        <div className="flex items-center justify-center gap-3 rounded-lg bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 p-3 border border-yellow-200/80 dark:border-yellow-900/50">
            <Timer className="h-6 w-6 flex-shrink-0" />
            <p className="font-medium text-sm">Tu tiempo de juego será cronometrado. ¡Intenta ser rápido y preciso!</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onStart} className="w-full" size="lg">
          ¡Comenzar a Jugar!
        </Button>
      </CardFooter>
    </Card>
  );
}
