"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import type { Player } from "@/types/game";
import { Users } from "lucide-react";
import { toast } from "sonner";

interface GameSetupProps {
  onStartGame: (
    playersAsNumbers: boolean,
    players: Player[],
    playersAsNumbersLength: number,
  ) => void;
}

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersAsNumbers, setPlayersAsNumbers] = useState(false);
  const [playersAsNumbersLength, setPlayersAsNumbersLength] = useState(0);

  const addPlayer = () => {
    const newPlayer = playerName.trim();
    if (players.map((el) => el.name).includes(newPlayer)) {
      toast.error(`${newPlayer} вече е в листа с играчи`);
      return;
    }
    if (playerName.trim()) {
      setPlayers([
        ...players,
        { name: playerName.trim(), id: Number(players.length) },
      ]);
      setPlayerName("");
    }
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  return (
    <div className="m-auto space-y-6 px-6 py-24 sm:w-[90%] md:w-[80%] md:px-24 lg:w-[60%]">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Играта v2.1</h1>
        <p className="text-muted-foreground">
          {playersAsNumbers
            ? "Добави брой играчи, за да започнеш"
            : "Добави поне 2 имена, за да започнеш"}
        </p>

        <div className="mx-auto flex items-center justify-between gap-8 rounded-lg border p-3 md:w-[70%]">
          <div className="flex-col text-start md:w-[70%]">
            <h4>Използвай числа вместо имена</h4>
            <span className="text-muted-foreground text-sm text-wrap">
              Играеш без имена и показва колко човека вдясно от теб е партньора
              ти
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
              placeholder="Име на играча"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addPlayer()}
            />
            <Button onClick={addPlayer}>Добави</Button>
          </div>
          {players.length > 0 && (
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-secondary flex items-center justify-between rounded-lg p-3"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{player.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePlayer(player.id)}
                  >
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
        disabled={
          playersAsNumbers ? playersAsNumbersLength < 2 : players.length < 2
        }
        onClick={() =>
          onStartGame(playersAsNumbers, players, playersAsNumbersLength)
        }
      >
        Айде мятай ги
      </Button>
    </div>
  );
}
