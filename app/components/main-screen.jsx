"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Starter from "./starter";
import Game from "./game";

const dares = [
  { time: 0, solo: true, unskippable: false, dare: "Do your best dance move" },
  { time: 0, solo: true, unskippable: false, dare: "Tell a joke" },
  { time: 0, solo: true, unskippable: false, dare: "Do 10 push-ups" },
  { time: 0, solo: true, unskippable: false, dare: "Sing the chorus of your favorite song" },
  { time: 0, solo: true, unskippable: false, dare: "Do an impression of a celebrity" },
  { time: 0, solo: true, unskippable: false, dare: "Tell an embarrassing story" },
  { time: 0, solo: true, unskippable: false, dare: "Do a handstand (or try to)" },
  { time: 0, solo: true, unskippable: false, dare: "Speak in an accent for the next round" },
  { time: 0, solo: true, unskippable: false, dare: "Show the most embarrassing photo on your phone" },
  { time: 0, solo: true, unskippable: false, dare: "Call a friend and sing them 'Happy Birthday'" },
  { time: 3, solo: false, unskippable: true, dare: "Прошепни на партньора си, че много ти се ебе" },
];

const partners = ["Player 2", "Player 3", "Player 4", "Player 5"];

export default function DrinkingGame() {
  const [currentDare, setCurrentDare] = useState({});
  const [currentPartner, setCurrentPartner] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      switchDare();
      switchPartner();
    }
  }, [gameStarted]);

  const switchDare = () => {
    const newDare = dares[Math.floor(Math.random() * dares.length)];
    setCurrentDare(newDare);
  };

  const switchPartner = () => {
    const newPartner = partners[Math.floor(Math.random() * partners.length)];
    setCurrentPartner(newPartner);
  };

  const handleComplete = () => {
    switchDare();
    switchPartner();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/50 text-white border-2 border-purple-500">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-purple-300">🍻 Drinking Game 🎉</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!gameStarted && <Starter startGame={() => setGameStarted(true)} />}
        </CardContent>
        {gameStarted && (
          <Game
            currentDare={currentDare}
            currentPartner={currentPartner}
            switchDare={switchDare}
            switchPartner={switchPartner}
            handleComplete={handleComplete}
          />
        )}
      </Card>
    </div>
  );
}
