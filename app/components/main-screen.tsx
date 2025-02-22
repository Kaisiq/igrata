"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GameState, Player, DARES, INITIAL_SKIPS, Dare } from "../types/game";
import { SkipForward, Timer, Users, Lock } from "lucide-react";
import Drink from "./drink";
import NextPlayer from "./next-player";
import { Progress } from "@/components/ui/progress";

interface GameScreenProps {
  initialPlayers: Player[];
  onReset: () => void;
}

export default function GameScreen({ initialPlayers, onReset }: GameScreenProps) {
  const [gameState, setGameState] = useState<GameState>({
    players: initialPlayers,
    currentPlayerIndex: 0,
    dareSkipsLeft: INITIAL_SKIPS,
    partnerSkipsLeft: INITIAL_SKIPS,
    currentDare: null,
    currentPartners: null,
  });

  const [showDrink, setShowDrink] = useState(false);
  const [showNextPlayer, setShowNextPlayer] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const getRandomDare = () => {
    return DARES[Math.floor(Math.random() * DARES.length)];
  };

  const getRandomPartners = (count: number) => {
    const availablePlayers = gameState.players.filter((p) => p.id !== currentPlayer.id);
    const partners: Player[] = [];
    const shuffled = [...availablePlayers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const startNewRound = () => {
    const newDare = getRandomDare();
    const partners = newDare.hasPartner ? getRandomPartners(newDare.partnersCount || 1) : null;

    setGameState((prev) => ({
      ...prev,
      currentDare: newDare,
      currentPartners: partners,
      timeRemaining: newDare.timeLimit,
    }));

    if (newDare.timeLimit) {
      setTimerActive(true);
    }
  };

  useEffect(() => {
    if (!gameState.currentDare) {
      startNewRound();
    }
  }, [gameState.currentPlayerIndex]);

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

  const handleSkipDare = () => {
    if (gameState.dareSkipsLeft > 0 && gameState.currentDare && !gameState.currentDare.isUnskippable) {
      setShowDrink(true);
      setGameState((prev) => ({
        ...prev,
        dareSkipsLeft: prev.dareSkipsLeft - 1,
      }));
    }
  };

  const handleSkipPartner = () => {
    if (gameState.partnerSkipsLeft > 0 && gameState.currentDare?.hasPartner && !gameState.currentDare.isUnskippable) {
      setShowDrink(true);
      setGameState((prev) => ({
        ...prev,
        partnerSkipsLeft: prev.partnerSkipsLeft - 1,
        currentPartners: getRandomPartners(prev.currentDare?.partnersCount || 1),
      }));
    }
  };

  const handleCompleteDare = () => {
    setTimerActive(false);
    setShowNextPlayer(true);
  };

  const handleNextPlayer = () => {
    setShowNextPlayer(false);
    setGameState((prev) => ({
      ...prev,
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
      currentDare: null,
      currentPartners: null,
      timeRemaining: undefined,
    }));
  };

  if (showDrink) {
    return <Drink startNewRound={startNewRound} setShowDrink={setShowDrink} />;
  }

  if (showNextPlayer) {
    return <NextPlayer handleNextPlayer={handleNextPlayer} gameState={gameState} />;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{currentPlayer.name}'s Turn</h2>
          {gameState.currentDare?.hasPartner && (
            <p className="text-muted-foreground">
              Partner{gameState.currentDare.partnersCount && gameState.currentDare.partnersCount > 1 ? "s" : ""}:{" "}
              {gameState.currentPartners?.map((p) => p.name).join(", ")}
            </p>
          )}
        </div>
        <Button variant="ghost" onClick={onReset}>
          Reset Game
        </Button>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">Your Dare:</h3>
          {gameState.currentDare?.isUnskippable && <Lock className="h-4 w-4 text-destructive" />}
          {gameState.currentDare?.timeLimit && <Timer className="h-4 w-4 text-primary" />}
        </div>
        <p className="text-lg">{gameState.currentDare?.text}</p>

        {gameState.currentDare?.timeLimit && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Time Remaining:</span>
              <span>{gameState.timeRemaining}s</span>
            </div>
            <Progress value={(gameState.timeRemaining! / gameState.currentDare.timeLimit) * 100} />
          </div>
        )}
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Dare skips left: {gameState.dareSkipsLeft}</span>
        <span>Partner skips left: {gameState.partnerSkipsLeft}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          onClick={handleSkipDare}
          disabled={gameState.dareSkipsLeft === 0 || gameState.currentDare?.isUnskippable}
        >
          <SkipForward className="mr-2 h-4 w-4" />
          Skip Dare
        </Button>
        <Button
          variant="outline"
          onClick={handleSkipPartner}
          disabled={
            gameState.partnerSkipsLeft === 0 ||
            !gameState.currentDare?.hasPartner ||
            gameState.currentDare?.isUnskippable
          }
        >
          <Users className="mr-2 h-4 w-4" />
          Skip Partner
        </Button>
        <Button
          onClick={handleCompleteDare}
          disabled={gameState.currentDare?.timeLimit != undefined && gameState.timeRemaining! > 0}
        >
          Complete Dare
        </Button>
      </div>
    </div>
  );
}
