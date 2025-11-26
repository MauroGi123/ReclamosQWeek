"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Round1Item, Round2Item } from "@/lib/types";

type Question = Round1Item | Round2Item;


interface RoundResultProps {
  title: string;
  questions: Question[];
  userAnswers: Record<string, string>;
  correctAnswers: Record<string, string>;
  score: number;
  total: number;
  onNext: () => void;
  nextButtonText?: string;
}

export default function RoundResult({
  title,
  questions,
  userAnswers,
  correctAnswers,
  score,
  total,
  onNext,
  nextButtonText = "Siguiente Ronda",
}: RoundResultProps) {
  return (
    <Card className="w-full max-w-4xl shadow-lg animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{title}</CardTitle>
        <CardDescription>
          Tu puntaje: <span className="font-bold text-primary">{score} de {total}</span> correctas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((question) => {
          const userAnswer = userAnswers[question.id];
          const correctAnswer = correctAnswers[question.id];
          const isCorrect = userAnswer === correctAnswer;
          
          return (
            <div key={question.id}>
              <div className="p-4 rounded-lg bg-card border">
                <div className="flex justify-between items-start gap-4">
                    <p className="font-semibold flex-1">{question.motivo}</p>
                    {isCorrect ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" aria-label="Correcto" />
                    ) : (
                        <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" aria-label="Incorrecto" />
                    )}
                </div>

                <Separator className="my-2" />

                <div className="text-sm space-y-1">
                    <p>
                        <span className="font-medium">Tu respuesta:</span> 
                        <span className={`whitespace-pre-wrap ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                            {" "}{userAnswer || "No respondida"}
                        </span>
                    </p>
                    {!isCorrect && (
                        <p>
                            <span className="font-medium">Respuesta correcta:</span>
                            <span className="text-green-700 dark:text-green-400 whitespace-pre-wrap"> {correctAnswer}</span>
                        </p>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button onClick={onNext} className="w-full md:w-auto ml-auto">
          {nextButtonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
