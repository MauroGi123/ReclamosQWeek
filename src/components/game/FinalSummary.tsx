"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PartyPopper, TimerIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

interface FinalSummaryProps {
  score: number;
  total: number;
  time: number;
}

function formatTime(seconds: number) {
  if (typeof seconds !== 'number' || seconds < 0) return 'N/A';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function FinalSummary({ score, total, time }: FinalSummaryProps) {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <Card className="w-full max-w-md text-center shadow-lg animate-in fade-in duration-500">
      <CardHeader>
        <div className="mx-auto bg-accent/20 rounded-full p-4 w-fit">
            <PartyPopper className="h-12 w-12 text-accent" />
        </div>
        <CardTitle className="text-3xl font-bold mt-4">¡Juego Completado!</CardTitle>
        <CardDescription>Gracias por participar en la QWeek.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xl">Tu desempeño final fue:</p>
        <div className="space-y-2">
            <p className="text-5xl font-bold text-primary">{percentage.toFixed(0)}%</p>
            <p className="text-muted-foreground">({score} de {total} correctas)</p>
            <Progress value={progress} className="w-full" />
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-center gap-2 text-lg font-medium text-muted-foreground">
            <TimerIcon className="h-5 w-5" />
            <span>Tiempo Final:</span>
            <span className="font-bold text-foreground">{formatTime(time)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full mt-2">
          <Link href="/">Volver al Inicio</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
