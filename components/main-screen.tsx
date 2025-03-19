"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { type GameState, type Player, INITIAL_SKIPS } from "@/types/game";
import { SkipForward, Timer, Users, Lock } from "lucide-react";
import Drink from "./drink";
import NextPlayer from "./next-player";
import { Progress } from "@/components/ui/progress";
import {
  getRandomDare,
  startNewRound,
  startFirstRound,
  handleSkipDare,
  handleSkipPartner,
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
    currentDare: getRandomDare(),
    currentPartners: [],
  });
  const [showDrink, setShowDrink] = useState(false);
  const [showNextPlayer, setShowNextPlayer] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(gameState.players[0]);

  useEffect(() => {
    startFirstRound(gameState, setGameState, setTimerActive);
  }, []);

  useEffect(() => {
    setCurrentPlayer(
      gameState.players[
        gameState.currentPlayerIndex % gameState.players.length
      ],
    );
  }, [gameState.players, gameState.currentPlayerIndex]);

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
    startNewRound(gameState, currentPlayer, setGameState, setTimerActive);
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
    <div className="space-y-10 p-6 py-20 w-[100%] lg:w-[60%] m-auto md:w-[80%]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Ред на {currentPlayer.name}</h2>
        </div>
      </div>

      <div className="bg-card py-16 px-6 min-w-fit rounded-lg shadow-lg space-y-4">
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
          {gameState.currentDare?.isUnskippable && (
            <Lock className="h-4 w-4 text-destructive" />
          )}
          {gameState.currentDare?.timeLimit && (
            <Timer className="h-4 w-4 text-primary" />
          )}
        </div>
        <p className="text-lg">{gameState.currentDare?.text}</p>

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

      <div className="flex justify-between text-md text-muted-foreground">
        <span>Оставащи пропускания: {gameState.dareSkipsLeft}</span>
        <span>Оставащи смени на партньора: {gameState.partnerSkipsLeft}</span>
      </div>

      <Button
        className="w-full"
        onClick={handleCompleteDare}
        disabled={
          gameState.currentDare?.timeLimit !== undefined &&
          gameState.timeRemaining !== undefined &&
          gameState.timeRemaining > 0
        }
      >
        Готово
      </Button>

      <div className="flex flex-row gap-3 w-full">
        <Button
          className="text-wrap py-6 w-full"
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
          className="text-wrap py-6 w-full"
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
    </div>
  );
}
