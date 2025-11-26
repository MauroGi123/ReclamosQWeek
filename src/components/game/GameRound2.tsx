"use client";
import { useState, useRef, useEffect } from "react";
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

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement>>({});

  const getItemCenter = (id: string): Point | null => {
    const elem = itemRefs.current[id];
    const container = containerRef.current;
    if (!elem || !container) return null;

    const elemRect = elem.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return {
      x: elemRect.left - containerRect.left + elemRect.width / 2,
      y: elemRect.top - containerRect.top + elemRect.height / 2,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (selectedQuestion) {
        const startPoint = getItemCenter(selectedQuestion);
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
  }, [selectedQuestion]);

  const handleQuestionClick = (questionId: string) => {
    // If clicking the same question, deselect it.
    if(selectedQuestion === questionId) {
        setSelectedQuestion(null);
        setLinePreview(null);
        return;
    }

    // If there's an existing connection from this question, remove it before starting a new one.
    const existingConnectionIndex = connections.findIndex(c => c.from === questionId);
    if (existingConnectionIndex > -1) {
        const newConnections = [...connections];
        newConnections.splice(existingConnectionIndex, 1);
        setConnections(newConnections);
    }

    setSelectedQuestion(questionId);
  };

  const handleAnswerClick = (answerId: string) => {
    if (selectedQuestion) {
       // Prevent connecting an answer to multiple questions
      const isAnswerAlreadyConnected = connections.some(c => c.to === answerId);
      if(isAnswerAlreadyConnected) return;

      setConnections(prev => [...prev, { from: selectedQuestion, to: answerId }]);
      setSelectedQuestion(null);
      setLinePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result: Record<string, string> = {};
    connections.forEach(conn => {
        // The question ID is the 'motivo', the answer ID is the 'planDeAccion'
        // For scoring, we need to associate the question's ID with the answer's ID.
        // The GameController expects the answer to be the ID that corresponds to the correct question.
        const answerItem = answers.find(a => a.id === conn.to);
        if (answerItem) {
             result[conn.from] = answerItem.id;
        }
    });
    onSubmit(result);
  };

  const getLineCoordinates = (connection: Connection) => {
    const fromPoint = getItemCenter(connection.from);
    const toPoint = getItemCenter(connection.to);
    if (!fromPoint || !toPoint) return null;
    return { x1: fromPoint.x, y1: fromPoint.y, x2: toPoint.x, y2: toPoint.y };
  };

  return (
    <Card className="w-full max-w-6xl shadow-lg animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Ronda 2</CardTitle>
        <CardDescription>Unir el motivo con su PLAN DE ACCIÓN correspondiente. Haz clic en un motivo y luego en un plan de acción para unirlos.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent ref={containerRef} className="relative">
          <div className="grid grid-cols-2 gap-x-16 gap-y-4">
            {/* Questions Column */}
            <div className="space-y-4">
              {questions.map(q => (
                <div
                  key={q.id}
                  ref={el => { if (el) itemRefs.current[q.id] = el }}
                  onClick={() => handleQuestionClick(q.id)}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-all duration-200 text-sm h-full flex items-center justify-center text-center",
                    selectedQuestion === q.id 
                        ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary ring-offset-2"
                        : connections.some(c => c.from === q.id) 
                            ? "bg-accent/30 border-accent text-accent-foreground"
                            : "bg-card hover:bg-muted"
                  )}
                >
                  {q.text}
                </div>
              ))}
            </div>

            {/* Answers Column */}
            <div className="space-y-4">
              {answers.map(a => (
                <div
                  key={a.id}
                  ref={el => { if (el) itemRefs.current[a.id] = el }}
                  onClick={() => handleAnswerClick(a.id)}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-colors duration-200 text-sm h-full flex items-center",
                    connections.some(c => c.to === a.id)
                      ? "bg-accent/30 border-accent text-accent-foreground"
                      : "bg-card hover:bg-muted"
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
            {linePreview && (
                <line {...linePreview.start} x2={linePreview.end.x} y2={linePreview.end.y} strokeWidth="2" strokeDasharray="5,5" className="stroke-primary/70" />
            )}
          </svg>

        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full md:w-auto ml-auto" disabled={connections.length < questions.length}>
            Verificar Respuestas
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
