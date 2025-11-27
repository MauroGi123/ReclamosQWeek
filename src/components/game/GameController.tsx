"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { round1Data, round2Data, shuffle } from "@/lib/data";
import GameRound from "./GameRound";
import RoundResult from "./RoundResult";
import FinalSummary from "./FinalSummary";
import { saveResult } from "@/lib/actions";

type GameState = "round1" | "result1" | "round2" | "result2" | "final";

interface ShuffledData {
  questions: { id: string; text: string; }[];
  options: { value: string; label: string; }[];
}

export function GameController() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  
  const [gameState, setGameState] = useState<GameState>("round1");
  const [round1Answers, setRound1Answers] = useState<Record<string, string>>({});
  const [round2Answers, setRound2Answers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState({ round1: 0, round2: 0 });

  const [shuffledRound1Data, setShuffledRound1Data] = useState<ShuffledData | null>(null);
  const [shuffledRound2Data, setShuffledRound2Data] = useState<ShuffledData | null>(null);

  const [time, setTime] = useState(0);
  const timerIsActive = useRef(false);

  const originalRound1Data = useMemo(() => round1Data, []);
  const originalRound2Data = useMemo(() => round2Data, []);

  useEffect(() => {
    if (!firstName || !lastName) {
      router.replace('/');
    } else {
      timerIsActive.current = true;
    }
  }, [firstName, lastName, router]);
  
  useEffect(() => {
    // Round 1
    const r1Questions = shuffle(originalRound1Data);
    const r1Options = shuffle(originalRound1Data).map(item => ({ value: item.cantidad.toString(), label: item.cantidad.toString() }));
    const r1UniqueOptions = Array.from(new Map(r1Options.map(item => [item.label, item])).values());
    setShuffledRound1Data({ questions: r1Questions.map(q => ({ id: q.id, text: q.motivo })), options: r1UniqueOptions });

    // Round 2
    const r2Questions = shuffle(originalRound2Data);
    const r2Options = shuffle(originalRound2Data).map(item => ({ value: item.id, label: item.planDeAccion }));
    setShuffledRound2Data({ questions: r2Questions.map(q => ({id: q.id, text: q.motivo})), options: r2Options });
  }, [originalRound1Data, originalRound2Data]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerIsActive.current) {
        interval = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerIsActive.current]);


  if (!shuffledRound1Data || !shuffledRound2Data) {
    return <div className="flex-grow flex items-center justify-center">Cargando juego...</div>;
  }

  const { questions: shuffledRound1Questions, options: shuffledRound1Options } = shuffledRound1Data;
  const { questions: shuffledRound2Questions, options: shuffledRound2Options } = shuffledRound2Data;
  const totalQuestions = originalRound1Data.length + originalRound2Data.length;


  const handleRound1Submit = (answers: Record<string, string>) => {
    timerIsActive.current = false;
    setRound1Answers(answers);
    let score = 0;
    originalRound1Data.forEach(item => {
      if (answers[item.id] === item.cantidad.toString()) {
        score++;
      }
    });
    setScores(s => ({ ...s, round1: score }));
    setGameState("result1");
  };

  const handleRound2Submit = (answers: Record<string, string>) => {
    timerIsActive.current = false;
    setRound2Answers(answers);
    let score = 0;
    originalRound2Data.forEach(item => {
        // The answer for a question (motivo) is the ID of the selected action plan
      if (answers[item.id] === item.id) {
        score++;
      }
    });
    setScores(s => ({ ...s, round2: score }));
    setGameState("result2");
  };

  const handleFinishGame = async () => {
    timerIsActive.current = false;
    const finalScore = scores.round1 + scores.round2;
    await saveResult(firstName, lastName, finalScore, totalQuestions, time);
    setGameState("final");
  };

  const startNextRound = () => {
    timerIsActive.current = true;
    setGameState("round2");
  }

  if (!firstName || !lastName) {
    return <div>Redirigiendo...</div>;
  }

  switch (gameState) {
    case "round1":
      return (
        <GameRound
          roundNumber={1}
          title="Unir el motivo con la CANTIDAD de reclamos por dicho motivo"
          questions={shuffledRound1Questions}
          options={shuffledRound1Options}
          onSubmit={handleRound1Submit}
          time={time}
        />
      );
    case "result1":
      return (
        <RoundResult
          title="Resultados Ronda 1"
          questions={originalRound1Data}
          userAnswers={round1Answers}
          correctAnswers={Object.fromEntries(originalRound1Data.map(item => [item.id, item.cantidad.toString()]))}
          score={scores.round1}
          total={originalRound1Data.length}
          onNext={startNextRound}
        />
      );
    case "round2":
        return (
            <GameRound
              roundNumber={2}
              title="Unir el motivo con su PLAN DE ACCIÓN correspondiente"
              questions={shuffledRound2Questions}
              options={shuffledRound2Options}
              onSubmit={handleRound2Submit}
              time={time}
            />
        );
    case "result2":
        const correctRound2Answers = Object.fromEntries(originalRound2Data.map(item => [item.id, item.planDeAccion]));
        
        const mappedUserAnswers: Record<string, string> = {};
        for(const questionId in round2Answers) {
            const answerId = round2Answers[questionId];
            const matchingAnswer = originalRound2Data.find(item => item.id === answerId);
            mappedUserAnswers[questionId] = matchingAnswer ? matchingAnswer.planDeAccion : "No respondida";
        }

        return (
            <RoundResult
              title="Resultados Ronda 2"
              questions={originalRound2Data}
              userAnswers={mappedUserAnswers}
              correctAnswers={correctRound2Answers}
              score={scores.round2}
              total={originalRound2Data.length}
              onNext={handleFinishGame}
              nextButtonText="Finalizar"
            />
        );
    case "final":
        return <FinalSummary score={scores.round1 + scores.round2} total={totalQuestions} />;
    default:
        return <div>Cargando juego...</div>;
  }
}
