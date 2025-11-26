"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface FinalSummaryProps {
  score: number;
  total: number;
}

export default function FinalSummary({ score, total }: FinalSummaryProps) {
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
        <Button asChild className="w-full mt-4">
          <Link href="/">Volver al Inicio</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
