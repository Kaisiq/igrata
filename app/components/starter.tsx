"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Player } from "../types/game";
import { Users } from "lucide-react";

interface GameSetupProps {
  onStartGame: (playersAsNumbers: boolean, players: Player[], playersAsNumbersLength: number) => void;
}

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersAsNumbers, setPlayersAsNumbers] = useState(false);
  const [playersAsNumbersLength, setPlayersAsNumbersLength] = useState(0);

  const addPlayer = () => {
    if (playerName.trim()) {
      setPlayers([...players, { name: playerName.trim(), id: Math.random().toString() }]);
      setPlayerName("");
    }
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6 p-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Играта v2.1</h1>
        <p className="text-muted-foreground">
          {playersAsNumbers ? "Добави брой играчи, за да започнеш" : "Добави поне 2 имена, за да започнеш"}
        </p>

        <div className="flex gap-8 justify-between items-center border rounded-lg p-3">
          <div className="flex-col w-[70%]">
            <h4>Използвай числа вместо имена</h4>
            <span className="text-sm text-muted-foreground">
              играеш без имена и показва колко човека вдясно от теб е партньора ти
            </span>
          </div>
          <Switch
            checked={playersAsNumbers}
            onCheckedChange={() => {
              setPlayersAsNumbers(!playersAsNumbers);
              if (players.length > 0) {
                setPlayersAsNumbersLength(players.length);
              }
            }}
          />
        </div>
      </div>
      {playersAsNumbers ? (
        <Input
          type="number"
          placeholder="Kолко човека ще играете"
          value={playersAsNumbersLength}
          onChange={(e) => setPlayersAsNumbersLength(Number(e.target.value))}
        />
      ) : (
        <>
          <div className="flex gap-2">
            <Input
              placeholder="Enter player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addPlayer()}
            />
            <Button onClick={addPlayer}>Add</Button>
          </div>
          {players.length > 0 && (
            <div className="space-y-2">
              {players.map((player) => (
                <div key={player.id} className="flex items-center justify-between bg-secondary p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{player.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removePlayer(player.id)}>
                    Премахни
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <Button
        className="w-full"
        size="lg"
        disabled={playersAsNumbers ? playersAsNumbersLength < 2 : players.length < 2}
        onClick={() => onStartGame(playersAsNumbers, players, playersAsNumbersLength)}
      >
        Започни да пукаш
      </Button>
    </div>
  );
}
