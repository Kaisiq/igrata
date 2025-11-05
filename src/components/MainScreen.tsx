"use client";
import { useState } from "react";
import GameSetup from "@/components/GameSetup";
import GameScreen from "@/components/GameScreen";
import type { Player, Dare } from "@/types/game";

export default function MainScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [dares, setDares] = useState<Dare[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = (
    playersAsNumbers: boolean,
    players: Player[],
    playersAsNumbersLength: number,
    dares: Dare[],
  ) => {
    setDares(dares);
    if (!playersAsNumbers) {
      setPlayers(players);
      setGameStarted(true);
      return;
    }

    const playersArray = [];

    for (let i = 0; i < playersAsNumbersLength; ++i) {
      playersArray.push({
        name: (i + 1).toString(),
        id: i,
      } as Player);
    }

    setPlayers(playersArray);
    setGameStarted(true);
  };

  return (
    <main className="bg-background min-h-screen">
      {!gameStarted ? (
        <GameSetup onStartGame={handleStartGame} />
      ) : (
        <GameScreen initialPlayers={players} dares={dares} />
      )}
    </main>
  );
}
