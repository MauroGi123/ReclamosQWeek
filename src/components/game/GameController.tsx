"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { round1Data, round2Data, shuffle } from "@/lib/data";
import GameRound from "./GameRound";
import RoundResult from "./RoundResult";
import FinalSummary from "./FinalSummary";
import { saveResult } from "@/lib/actions";
import GameRound2 from "./GameRound2";

type GameState = "round1" | "result1" | "round2" | "result2" | "final";

interface ShuffledRound1Data {
  questions: { id: string; text: string; }[];
  options: { value: string; label: string; }[];
}

interface ShuffledRound2Data {
    questions: { id: string; text: string; }[];
    answers: { id: string; text: string; }[];
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

  const [shuffledRound1Data, setShuffledRound1Data] = useState<ShuffledRound1Data | null>(null);
  const [shuffledRound2Data, setShuffledRound2Data] = useState<ShuffledRound2Data | null>(null);

  const originalRound1Questions = useMemo(() => round1Data, []);
  const originalRound2Questions = useMemo(() => round2Data, []);

  useEffect(() => {
    const questions = shuffle(originalRound1Questions);
    const options = shuffle(originalRound1Questions).map(item => ({ value: item.cantidad.toString(), label: item.cantidad.toString() }));
    const uniqueOptions = Array.from(new Map(options.map(item => [item.label, item])).values());
    setShuffledRound1Data({ questions: questions.map(q => ({ id: q.id, text: q.motivo })), options: uniqueOptions });

    const round2Questions = shuffle(originalRound2Questions);
    const round2Answers = shuffle(originalRound2Questions).map(item => ({ id: item.id, text: item.planDeAccion }));
    setShuffledRound2Data({ questions: round2Questions.map(q => ({id: q.id, text: q.motivo})), answers: round2Answers });

  }, [originalRound1Questions, originalRound2Questions]);
  
  useEffect(() => {
    if (!firstName || !lastName) {
      router.replace('/');
    }
  }, [firstName, lastName, router]);

  if (!shuffledRound1Data || !shuffledRound2Data) {
    return <div className="flex-grow flex items-center justify-center">Cargando juego...</div>;
  }

  const { questions: shuffledRound1Questions, options: shuffledRound1Options } = shuffledRound1Data;
  const { questions: shuffledRound2Questions, answers: shuffledRound2Answers } = shuffledRound2Data;
  const totalQuestions = shuffledRound1Questions.length + shuffledRound2Questions.length;


  const handleRound1Submit = (answers: Record<string, string>) => {
    setRound1Answers(answers);
    let score = 0;
    originalRound1Questions.forEach(item => {
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
    originalRound2Questions.forEach(item => {
        // The answer for a question (motivo) is the ID of the selected action plan
      if (answers[item.id] === item.id) {
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
          title="Unir el motivo con la CANTIDAD de reclamos por dicho motivo"
          questions={shuffledRound1Questions}
          options={shuffledRound1Options}
          onSubmit={handleRound1Submit}
        />
      );
    case "result1":
      return (
        <RoundResult
          title="Resultados Ronda 1"
          questions={originalRound1Questions}
          userAnswers={round1Answers}
          correctAnswers={Object.fromEntries(originalRound1Questions.map(item => [item.id, item.cantidad.toString()]))}
          score={scores.round1}
          total={shuffledRound1Questions.length}
          onNext={() => setGameState("round2")}
        />
      );
    case "round2":
        return (
            <GameRound2
              questions={shuffledRound2Questions}
              answers={shuffledRound2Answers}
              onSubmit={handleRound2Submit}
            />
        );
    case "result2":
        const correctRound2Answers = Object.fromEntries(originalRound2Questions.map(item => [item.id, item.planDeAccion]));
        
        // We need to map the answer IDs from round 2 to the actual text for the results screen
        const mappedUserAnswers: Record<string, string> = {};
        for(const questionId in round2Answers) {
            const answerId = round2Answers[questionId];
            const matchingAnswer = originalRound2Questions.find(item => item.id === answerId);
            mappedUserAnswers[questionId] = matchingAnswer ? matchingAnswer.planDeAccion : "No respondida";
        }

        const originalQuestionsForRound2Result = originalRound2Questions.sort((a,b) => {
            const aIndex = shuffledRound2Questions.findIndex(q => q.id === a.id);
            const bIndex = shuffledRound2Questions.findIndex(q => q.id === b.id);
            return aIndex - bIndex;
        });

        return (
            <RoundResult
              title="Resultados Ronda 2"
              questions={originalQuestionsForRound2Result}
              userAnswers={mappedUserAnswers}
              correctAnswers={correctRound2Answers}
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
