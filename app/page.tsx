"use client";

import { useState } from "react";
import GameSetup from "./components/starter";
import GameScreen from "./components/main-screen";
import { Player } from "./types/game";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = (playersAsNumbers: boolean, players: Player[], playersAsNumbersLength: number) => {
    if (!playersAsNumbers) {
      setPlayers(players);
      setGameStarted(true);
      return;
    }
    const playersArray = [];
    for (var i = 0; i < playersAsNumbersLength; ++i) {
      playersArray.push({ name: (i + 1).toString(), id: i.toString() } as Player);
    }
    setPlayers(playersArray);
    setGameStarted(true);
  };

  const handleResetGame = () => {
    setGameStarted(false);
    setPlayers([]);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-md mx-auto pt-8">
        {!gameStarted ? (
          <GameSetup onStartGame={handleStartGame} />
        ) : (
          <GameScreen initialPlayers={players} onReset={handleResetGame} />
        )}
      </div>
    </main>
  );
}
