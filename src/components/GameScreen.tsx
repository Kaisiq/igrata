"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { type GameState, type Player, INITIAL_SKIPS } from "@/types/game";
import { SkipForward, Timer, Users, Lock } from "lucide-react";
import Drink from "./drink";
import NextPlayer from "./next-player";
import { Progress } from "@/components/ui/progress";
import {
  startNewRound,
  startFirstRound,
  handleSkipDare,
  handleSkipPartner,
  basicPlayer,
  basicDare,
} from "@/lib/helpers";

interface GameScreenProps {
  initialPlayers: Player[];
}

export default function GameScreen({ initialPlayers }: GameScreenProps) {
  const [gameState, setGameState] = useState<GameState>({
    players: initialPlayers,
    currentPlayerIndex: 0,
    dareSkipsLeft: INITIAL_SKIPS,
    partnerSkipsLeft: INITIAL_SKIPS,
    currentDare: basicDare,
    currentPartners: [],
    round: 0,
    dareHistory: [],
  });
  const [showDrink, setShowDrink] = useState(false);
  const [showNextPlayer, setShowNextPlayer] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    startFirstRound(gameState, setGameState, setTimerActive);
  }, []);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex] ?? basicPlayer;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && gameState.timeRemaining && gameState.timeRemaining > 0) {
      timer = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining ? prev.timeRemaining - 1 : 0,
        }));
      }, 1000);
    } else if (gameState.timeRemaining === 0) {
      setShowNextPlayer(true);
      setTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [timerActive, gameState.timeRemaining]);

  const handleCompleteDare = () => {
    setTimerActive(false);
    setShowNextPlayer(true);
  };

  const handleNextPlayer = () => {
    startNewRound(gameState, setGameState, setTimerActive);
    setShowNextPlayer(false);
  };

  if (showDrink) {
    return (
      <Drink
        setShowDrink={setShowDrink}
        dare={gameState.currentDare}
        setTimerActive={setTimerActive}
      />
    );
  }

  if (showNextPlayer) {
    return (
      <NextPlayer handleNextPlayer={handleNextPlayer} gameState={gameState} />
    );
  }

  return (
    <div className="m-auto h-[100vh] w-[100%] space-y-10 bg-gray-100 p-6 py-20 md:w-[80%] lg:w-[60%]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ред на {currentPlayer.name}</h2>
        </div>
      </div>

      <div className="bg-card min-w-fit space-y-4 rounded-lg px-6 py-16 shadow-xl">
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-semibold">Предизвикателство:</h3>
          {
            <p className="text-muted-foreground">
              Партньор
              {gameState.currentDare.partnersCount &&
              gameState.currentDare.partnersCount > 1
                ? "и"
                : ""}
              :{" "}
              {gameState.currentPartners.length > 0
                ? gameState.currentPartners.map((p) => p.name).join(", ")
                : "няма"}
            </p>
          }
          <div className="flex flex-row gap-3">
            {gameState.currentDare?.isUnskippable && (
              <Lock className="text-destructive h-4 w-4" />
            )}
            {gameState.currentDare?.timeLimit && (
              <Timer className="text-primary h-4 w-4" />
            )}
          </div>
        </div>
        <p className="text-lg">{gameState.currentDare?.text}</p>
        {gameState.currentDare?.bonusText && (
          <p>{gameState.currentDare.bonusText}</p>
        )}

        {gameState.currentDare?.timeLimit &&
          gameState.timeRemaining !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Оставащо време:</span>
                <span>{gameState.timeRemaining}сек</span>
              </div>
              <Progress
                value={
                  (gameState.timeRemaining / gameState.currentDare.timeLimit) *
                  100
                }
              />
            </div>
          )}
      </div>

      <div className="text-md text-muted-foreground flex justify-between">
        <span>Оставащи пропускания: {gameState.dareSkipsLeft}</span>
        <span>Оставащи смени на партньора: {gameState.partnerSkipsLeft}</span>
      </div>

      <div className="flex w-full flex-row flex-wrap gap-3">
        <Button
          className="w-full py-6 text-wrap"
          variant="outline"
          onClick={() =>
            handleSkipDare(gameState, currentPlayer, setGameState, setShowDrink)
          }
          disabled={
            gameState.dareSkipsLeft === 0 ||
            gameState.currentDare?.isUnskippable
          }
        >
          <SkipForward className="mr-2 h-4 w-4" />
          Смени Предизвикателство
        </Button>
        <Button
          className="w-full py-6 text-wrap"
          variant="outline"
          onClick={() =>
            handleSkipPartner(
              gameState,
              currentPlayer,
              setGameState,
              setShowDrink,
            )
          }
          disabled={
            gameState.partnerSkipsLeft === 0 ||
            gameState.currentDare.partnersCount === 0 ||
            gameState.currentDare?.isUnskippable
          }
        >
          <Users className="mr-2 h-4 w-4" />
          Смени Партньор
        </Button>
      </div>

      <Button
        className="w-full"
        onClick={handleCompleteDare}
        disabled={
          gameState.currentDare?.timeLimit !== undefined &&
          gameState.timeRemaining !== undefined &&
          gameState.timeRemaining > 0 &&
          gameState.currentDare?.shouldLockDone
        }
      >
        Готово
      </Button>
    </div>
  );
}
