"use client";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Shuffle, Users, ThumbsUp } from "lucide-react";
import Timer from "./timer";

const Game = ({ currentDare, currentPartner, switchDare, switchPartner, handleComplete }) => (
  <>
    <div className="text-center space-y-2">
      <h2 className="text-xl font-semibold text-purple-300">Current Dare:</h2>
      <p className="text-2xl font-bold">{currentDare.dare}</p>
    </div>

    {!!currentDare.time && <Timer timeLimit={currentDare.time} />}

    {!currentDare.solo && (
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-purple-300">Current Partner:</h2>
        <p className="text-2xl font-bold">{currentPartner}</p>
      </div>
    )}

    <CardFooter className="flex flex-col gap-4">
      {!currentDare.unskippable && (
        <div className="flex gap-4 w-full">
          <Button onClick={switchDare} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Switch Dare <Shuffle className="ml-2" />
          </Button>
          <Button onClick={switchPartner} className="flex-1 bg-green-600 hover:bg-green-700">
            Switch Partner <Users className="ml-2" />
          </Button>
        </div>
      )}
      <div className="flex gap-4 w-full">
        <Button onClick={() => handleComplete()} className="flex-1 bg-yellow-600 hover:bg-yellow-700">
          Complete <ThumbsUp className="ml-2" />
        </Button>
      </div>
    </CardFooter>
  </>
);

export default Game;
