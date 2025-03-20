import { Button } from "@/components/ui/button";
import type { Dare } from "@/types/game";
import { Skull } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

const Drink = ({
  setShowDrink,
  dare,
  setTimerActive,
}: {
  setShowDrink: Dispatch<SetStateAction<boolean>>;
  dare: Dare;
  setTimerActive: Dispatch<SetStateAction<boolean>>;
}) => (
  <div className="flex flex-col items-center justify-center h-[80vh] space-y-6 text-center">
    <Skull className="h-24 w-24 animate-bounce" />
    <h1 className="text-4xl font-bold">Пий 🍻</h1>
    <Button
      size="lg"
      onClick={() => {
        setShowDrink(false);
        if (dare.timeLimit) {
          setTimerActive(true);
        }
      }}
    >
      Пих
    </Button>
  </div>
);

export default Drink;
