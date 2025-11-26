"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  text: string;
}

interface GameRound2Props {
  questions: Item[];
  answers: Item[];
  onSubmit: (connections: Record<string, string>) => void;
}

type Point = { x: number; y: number };
type Connection = { from: string; to: string };

export default function GameRound2({ questions, answers, onSubmit }: GameRound2Props) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [linePreview, setLinePreview] = useState<{ start: Point; end: Point } | null>(null);
  const [itemPositions, setItemPositions] = useState<Record<string, Point>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement>>({});

  const calculatePositions = useCallback(() => {
    const newPositions: Record<string, Point> = {};
    const container = containerRef.current;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();

    for (const id in itemRefs.current) {
        const elem = itemRefs.current[id];
        if (elem) {
            const elemRect = elem.getBoundingClientRect();
            newPositions[id] = {
                x: elemRect.left - containerRect.left + elemRect.width / 2,
                y: elemRect.top - containerRect.top + elemRect.height / 2,
            };
        }
    }
    setItemPositions(newPositions);
  }, []);

  useEffect(() => {
      calculatePositions();
      window.addEventListener('resize', calculatePositions);
      return () => window.removeEventListener('resize', calculatePositions);
  }, [calculatePositions]);
  
  useEffect(() => {
    // Recalculate on initial render and when questions/answers change
    const timeoutId = setTimeout(calculatePositions, 50);
    return () => clearTimeout(timeoutId);
  }, [questions, answers, calculatePositions]);


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (selectedQuestion && itemPositions[selectedQuestion]) {
        const startPoint = itemPositions[selectedQuestion];
        const container = containerRef.current;
        if (startPoint && container) {
            const containerRect = container.getBoundingClientRect();
            setLinePreview({
                start: startPoint,
                end: { x: e.clientX - containerRect.left, y: e.clientY - containerRect.top },
            });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [selectedQuestion, itemPositions]);

  const handleQuestionClick = (questionId: string) => {
    if (selectedQuestion === questionId) {
        setSelectedQuestion(null);
        setLinePreview(null);
        return;
    }
    setSelectedQuestion(questionId);
  };

  const handleAnswerClick = (answerId: string) => {
    if (selectedQuestion) {
       // A question can only be connected to one answer.
       // An answer can only be connected from one question.
       // So, remove any existing connections from the selected question OR to the selected answer.
       const newConnections = connections.filter(c => c.from !== selectedQuestion && c.to !== answerId);
       
       // Add the new connection
       newConnections.push({ from: selectedQuestion, to: answerId });
       setConnections(newConnections);

       // Reset selection
       setSelectedQuestion(null);
       setLinePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result: Record<string, string> = {};
    connections.forEach(conn => {
        const answerItem = answers.find(a => a.id === conn.to);
        if (answerItem) {
             result[conn.from] = answerItem.id;
        }
    });
    onSubmit(result);
  };

  const getLineCoordinates = (connection: Connection) => {
    const fromPoint = itemPositions[connection.from];
    const toPoint = itemPositions[connection.to];
    if (!fromPoint || !toPoint) return null;
    return { x1: fromPoint.x, y1: fromPoint.y, x2: toPoint.x, y2: toPoint.y };
  };
  
  const isQuestionConnected = (qId: string) => connections.some(c => c.from === qId);
  const isAnswerConnected = (aId: string) => connections.some(c => c.to === aId);

  return (
    <Card className="w-full max-w-6xl shadow-lg animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Ronda 2</CardTitle>
        <CardDescription>Unir el motivo con su PLAN DE ACCIÓN correspondiente. Haz clic en un motivo y luego en un plan de acción para unirlos.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent ref={containerRef} className="relative p-8">
          <div className="grid grid-cols-2 gap-x-16 gap-y-4">
            {/* Questions Column */}
            <div className="space-y-4 flex flex-col justify-around">
              {questions.map(q => (
                <div
                  key={q.id}
                  ref={el => { if (el) itemRefs.current[q.id] = el }}
                  onClick={() => handleQuestionClick(q.id)}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-all duration-200 text-sm flex items-center justify-center text-center min-h-[100px]",
                    "bg-card hover:bg-muted",
                    selectedQuestion === q.id && "ring-2 ring-primary ring-offset-2",
                    isQuestionConnected(q.id) && "bg-accent/30 border-accent"
                  )}
                >
                  {q.text}
                </div>
              ))}
            </div>

            {/* Answers Column */}
            <div className="space-y-4 flex flex-col justify-around">
              {answers.map(a => (
                <div
                  key={a.id}
                  ref={el => { if (el) itemRefs.current[a.id] = el }}
                  onClick={() => handleAnswerClick(a.id)}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-colors duration-200 text-sm flex items-center min-h-[100px]",
                    "bg-card hover:bg-muted",
                    isAnswerConnected(a.id) && "bg-accent/30 border-accent"
                  )}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {a.text}
                </div>
              ))}
            </div>
          </div>

          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {connections.map((conn, index) => {
              const coords = getLineCoordinates(conn);
              return coords ? (
                <line key={index} {...coords} strokeWidth="3" className="stroke-primary" />
              ) : null;
            })}
            {linePreview && linePreview.start && (
                <line x1={linePreview.start.x} y1={linePreview.start.y} x2={linePreview.end.x} y2={linePreview.end.y} strokeWidth="2" strokeDasharray="5,5" className="stroke-primary/70" />
            )}
          </svg>

        </CardContent>
        <CardFooter className="pt-8">
          <Button type="submit" className="w-full md:w-auto ml-auto" disabled={connections.length < questions.length}>
            Verificar Respuestas
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
