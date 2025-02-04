import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Starter = ({ startGame }) => {
  return (
    <Button
      onClick={startGame}
      className="w-full text-xl py-8 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 animate-pulse"
    >
      Start Game <Sparkles className="ml-2" />
    </Button>
  );
};

export default Starter;
