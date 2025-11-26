"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Question {
  id: string;
  text: string;
}

interface Option {
  value: string;
  label: string;
}

interface GameRoundProps {
  roundNumber: number;
  title: string;
  questions: Question[];
  options: Option[];
  onSubmit: (answers: Record<string, string>) => void;
}

export default function GameRound({ roundNumber, title, questions, options, onSubmit }: GameRoundProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const handleSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <Card className="w-full max-w-4xl shadow-lg animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Ronda {roundNumber}</CardTitle>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <Label htmlFor={`select-${question.id}`} className="font-semibold text-base">
                {question.text}
              </Label>
              <Select onValueChange={(value) => handleSelect(question.id, value)}>
                <SelectTrigger id={`select-${question.id}`} className="w-full h-auto min-h-10">
                  <SelectValue placeholder="Selecciona una opción..." className="whitespace-normal" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option, index) => (
                    <SelectItem key={index} value={option.value} className="whitespace-normal">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full md:w-auto ml-auto">
            Verificar Respuestas
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
