import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import type { GameState } from "@/types/game";
import { basicPlayer } from "@/lib/helpers";

const NextPlayer = ({
  gameState,
  handleNextPlayer,
}: {
  gameState: GameState;
  handleNextPlayer: () => void;
}) => {
  const nextPlayer =
    gameState.players[
      (gameState.currentPlayerIndex + 1) % gameState.players.length
    ] ?? basicPlayer;
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center space-y-6 text-center">
      <Users className="h-24 w-24" />
      <h1 className="text-4xl font-bold">Подай на следващия</h1>
      <p className="text-xl">Ред е на {nextPlayer.name}</p>
      <Button size="lg" onClick={handleNextPlayer}>
        Готов
      </Button>
    </div>
  );
};

export default NextPlayer;
