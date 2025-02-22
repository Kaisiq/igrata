import { Button } from "@/components/ui/button";
import { Skull } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const Drink = ({
  setShowDrink,
  startNewRound,
}: {
  setShowDrink: Dispatch<SetStateAction<boolean>>;
  startNewRound: () => void;
}) => (
  <div className="flex flex-col items-center justify-center h-[80vh] space-y-6 text-center">
    <Skull className="h-24 w-24 animate-bounce" />
    <h1 className="text-4xl font-bold">Drink Up! 🍻</h1>
    <Button
      size="lg"
      onClick={() => {
        setShowDrink(false);
        startNewRound();
      }}
    >
      I drank!
    </Button>
  </div>
);

export default Drink;
