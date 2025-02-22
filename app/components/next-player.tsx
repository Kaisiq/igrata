import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { GameState } from "../types/game";

const NextPlayer = ({ gameState, handleNextPlayer }: { gameState: GameState; handleNextPlayer: () => void }) => (
  <div className="flex flex-col items-center justify-center h-[80vh] space-y-6 text-center">
    <Users className="h-24 w-24" />
    <h1 className="text-4xl font-bold">Pass the device!</h1>
    <p className="text-xl">
      It's {gameState.players[(gameState.currentPlayerIndex + 1) % gameState.players.length].name}'s turn
    </p>
    <Button size="lg" onClick={handleNextPlayer}>
      Ready!
    </Button>
  </div>
);

export default NextPlayer;
