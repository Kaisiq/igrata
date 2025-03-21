import {
  type Dare,
  INITIAL_SKIPS,
  type GameState,
  type Player,
} from "@/types/game";
import { DARES } from "./dares";
import type { Dispatch, SetStateAction } from "react";

const basicDare = {
  text: "Всички пият шот",
  partnersCount: 0,
  isUnskippable: false,
} as Dare;

const basicPlayer = { name: "0", id: "0" } as Player;

const getRandomDare = (dares = DARES) => {
  const toReturn = dares[Math.floor(Math.random() * dares.length)];
  if (!toReturn) return basicDare;
  return toReturn;
};

const getRandomPartners = (
  count: number,
  players: Player[],
  currentPlayer: Player,
) => {
  const availablePlayers = players.filter((p) => p.id !== currentPlayer.id);

  const shuffled = [...availablePlayers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const startFirstRound = (
  gameState: GameState,
  setGameState: Dispatch<SetStateAction<GameState>>,
  setTimerActive: Dispatch<SetStateAction<boolean>>,
) => {
  const firstDare = getRandomDare();
  const firstPlayer = gameState.players?.[0] ?? basicPlayer;
  const partners =
    firstDare.partnersCount > 0
      ? getRandomPartners(
          firstDare.partnersCount || 1,
          gameState.players,
          firstPlayer,
        )
      : [];

  setGameState((prev) => ({
    ...prev,
    currentPlayerIndex: 0,
    currentDare: firstDare,
    currentPartners: partners,
    timeRemaining: firstDare.timeLimit,
    dareSkipsLeft: INITIAL_SKIPS,
    partnerSkipsLeft: INITIAL_SKIPS,
  }));

  if (firstDare.timeLimit) {
    setTimerActive(true);
  }
};

const startNewRound = (
  gameState: GameState,
  currentPlayer: Player,
  setGameState: Dispatch<SetStateAction<GameState>>,
  setTimerActive: Dispatch<SetStateAction<boolean>>,
) => {
  const newDare = getRandomDare();
  const newPlayerIndex =
    (gameState.currentPlayerIndex + 1) % gameState.players.length;
  const partners =
    newDare.partnersCount > 0
      ? getRandomPartners(
          newDare.partnersCount || 1,
          gameState.players,
          gameState.players[newPlayerIndex] ?? basicPlayer,
        )
      : [];

  setGameState((prev) => ({
    ...prev,
    currentPlayerIndex: newPlayerIndex,
    currentDare: newDare,
    currentPartners: partners,
    timeRemaining: newDare.timeLimit,
    dareSkipsLeft: INITIAL_SKIPS,
    partnerSkipsLeft: INITIAL_SKIPS,
  }));

  if (newDare.timeLimit) {
    setTimerActive(true);
  }
};

const handleSkipDare = (
  gameState: GameState,
  currentPlayer: Player,
  setGameState: Dispatch<SetStateAction<GameState>>,
  setShowDrink: Dispatch<SetStateAction<boolean>>,
) => {
  if (
    gameState.dareSkipsLeft > 0 &&
    gameState.currentDare &&
    !gameState.currentDare.isUnskippable
  ) {
    const newDare = getRandomDare(
      DARES.filter((el) => el !== gameState.currentDare),
    );
    let newPartners = [] as Player[];

    if (newDare.partnersCount === 0) {
    } else if (gameState.currentDare.partnersCount === 0) {
      newPartners =
        newDare.partnersCount > 0
          ? getRandomPartners(
              newDare.partnersCount || 1,
              gameState.players,
              currentPlayer,
            )
          : [];
    } else if (gameState.currentDare.partnersCount > newDare.partnersCount) {
      newPartners = gameState.currentPartners.slice(
        0,
        gameState.currentDare.partnersCount - newDare.partnersCount,
      );
    } else if (gameState.currentDare.partnersCount > newDare.partnersCount) {
      newPartners = gameState.currentPartners;
    } else {
      newPartners = gameState.currentPartners.concat(
        getRandomPartners(
          newDare.partnersCount - gameState.currentDare.partnersCount,
          gameState.players,
          currentPlayer,
        ),
      );
    }

    setShowDrink(true);
    setGameState((prev) => ({
      ...prev,
      currentDare: newDare,
      currentPartners: newPartners,
      timeRemaining: newDare.timeLimit,
      dareSkipsLeft: prev.dareSkipsLeft - 1,
    }));
  }
};

const handleSkipPartner = (
  gameState: GameState,
  currentPlayer: Player,
  setGameState: Dispatch<SetStateAction<GameState>>,
  setShowDrink: Dispatch<SetStateAction<boolean>>,
) => {
  if (
    gameState.partnerSkipsLeft > 0 &&
    gameState.currentDare.partnersCount > 0 &&
    !gameState.currentDare.isUnskippable
  ) {
    setShowDrink(true);
    setGameState((prev) => ({
      ...prev,
      partnerSkipsLeft: prev.partnerSkipsLeft - 1,
      currentPartners: getRandomPartners(
        prev.currentDare?.partnersCount || 1,
        gameState.players.filter((p) => !gameState.currentPartners.includes(p)),
        currentPlayer,
      ),
    }));
  }
};

export {
  getRandomDare,
  getRandomPartners,
  startNewRound,
  startFirstRound,
  handleSkipDare,
  handleSkipPartner,
};
