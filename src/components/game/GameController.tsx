"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { round1Data, round2Data, shuffle } from "@/lib/data";
import GameRound from "./GameRound";
import RoundResult from "./RoundResult";
import FinalSummary from "./FinalSummary";
import { saveResult } from "@/lib/actions";

type GameState = "round1" | "result1" | "round2" | "result2" | "final";

export function GameController() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  
  const [gameState, setGameState] = useState<GameState>("round1");
  const [round1Answers, setRound1Answers] = useState<Record<string, string>>({});
  const [round2Answers, setRound2Answers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState({ round1: 0, round2: 0 });

  // Shuffle options once on component mount
  const {shuffledRound1Options, shuffledRound1Questions} = useMemo(() => {
    const questions = shuffle(round1Data);
    const options = shuffle(round1Data).map(item => ({ value: item.cantidad.toString(), label: item.cantidad.toString() }));
    // De-duplicate options
    const uniqueOptions = Array.from(new Map(options.map(item => [item.label, item])).values());
    return { shuffledRound1Options: uniqueOptions, shuffledRound1Questions: questions };
  }, []);

  const {shuffledRound2Options, shuffledRound2Questions} = useMemo(() => {
    const questions = shuffle(round2Data);
    const options = shuffle(round2Data).map(item => ({ value: item.planDeAccion, label: item.planDeAccion }));
    return { shuffledRound2Options: options, shuffledRound2Questions: questions };
  }, []);
  
  const totalQuestions = shuffledRound1Questions.length + shuffledRound2Questions.length;

  useEffect(() => {
    if (!firstName || !lastName) {
      router.replace('/');
    }
  }, [firstName, lastName, router]);

  const handleRound1Submit = (answers: Record<string, string>) => {
    setRound1Answers(answers);
    let score = 0;
    shuffledRound1Questions.forEach(item => {
      if (answers[item.id] === item.cantidad.toString()) {
        score++;
      }
    });
    setScores(s => ({ ...s, round1: score }));
    setGameState("result1");
  };

  const handleRound2Submit = (answers: Record<string, string>) => {
    setRound2Answers(answers);
    let score = 0;
    shuffledRound2Questions.forEach(item => {
      if (answers[item.id] === item.planDeAccion) {
        score++;
      }
    });
    setScores(s => ({ ...s, round2: score }));
    setGameState("result2");
  };

  const handleFinishGame = async () => {
    const finalScore = scores.round1 + scores.round2;
    await saveResult(firstName, lastName, finalScore, totalQuestions);
    setGameState("final");
  };

  if (!firstName || !lastName) {
    return <div>Redirigiendo...</div>;
  }

  switch (gameState) {
    case "round1":
      return (
        <GameRound
          roundNumber={1}
          title="Unir el motivo con la CANTIDAD de reclamos"
          questions={shuffledRound1Questions.map(q => ({ id: q.id, text: q.motivo }))}
          options={shuffledRound1Options}
          onSubmit={handleRound1Submit}
        />
      );
    case "result1":
      return (
        <RoundResult
          title="Resultados Ronda 1"
          questions={shuffledRound1Questions}
          userAnswers={round1Answers}
          correctAnswers={Object.fromEntries(round1Data.map(item => [item.id, item.cantidad.toString()]))}
          score={scores.round1}
          total={shuffledRound1Questions.length}
          onNext={() => setGameState("round2")}
        />
      );
    case "round2":
        return (
            <GameRound
              roundNumber={2}
              title="Unir el motivo con su PLAN DE ACCIÓN"
              questions={shuffledRound2Questions.map(q => ({ id: q.id, text: q.motivo }))}
              options={shuffledRound2Options}
              onSubmit={handleRound2Submit}
            />
        );
    case "result2":
        return (
            <RoundResult
              title="Resultados Ronda 2"
              questions={shuffledRound2Questions}
              userAnswers={round2Answers}
              correctAnswers={Object.fromEntries(round2Data.map(item => [item.id, item.planDeAccion]))}
              score={scores.round2}
              total={shuffledRound2Questions.length}
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
