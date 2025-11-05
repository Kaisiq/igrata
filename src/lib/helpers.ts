import {
  type Dare,
  INITIAL_SKIPS,
  type GameState,
  type Player,
  type DareHistoryEntry,
} from "@/types/game";
import { DARES } from "./dares";
import type { Dispatch, SetStateAction } from "react";

const basicDare = {
  text: "Всички пият шот",
  partnersCount: 0,
  isUnskippable: false,
} as Dare;

const basicPlayer = { name: "0", id: "0" } as Player;

const getRandomDare = (
  gameState: GameState,
  dares: Dare[] = DARES,
): Dare => {
  const { dareHistory, round, currentPlayerIndex, players } = gameState;
  const currentPlayer = players[currentPlayerIndex];

  const availableDares = dares.filter((dare) => {
    const lastShownToPlayer = dareHistory.find(
      (entry) => entry.dare.text === dare.text && entry.player.id === currentPlayer.id,
    );
    if (lastShownToPlayer && round - lastShownToPlayer.round < 5) {
      return false;
    }

    const shownInCurrentRound = dareHistory.find(
      (entry) => entry.dare.text === dare.text && entry.round === round,
    );
    if (shownInCurrentRound) {
      return false;
    }

    return true;
  });

  const toReturn =
    availableDares[Math.floor(Math.random() * availableDares.length)];

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
  const firstDare = getRandomDare(gameState);
  const firstPlayer = gameState.players?.[0] ?? basicPlayer;
  const partners =
    firstDare.partnersCount > 0
      ? getRandomPartners(
          firstDare.partnersCount || 1,
          gameState.players,
          firstPlayer,
        )
      : [];

  const newDareHistoryEntry: DareHistoryEntry = {
    dare: firstDare,
    player: firstPlayer,
    round: 0,
  };

  setGameState((prev) => ({
    ...prev,
    currentPlayerIndex: 0,
    currentDare: firstDare,
    currentPartners: partners,
    timeRemaining: firstDare.timeLimit,
    dareSkipsLeft: INITIAL_SKIPS,
    partnerSkipsLeft: INITIAL_SKIPS,
    round: 0,
    dareHistory: [newDareHistoryEntry],
  }));

  if (firstDare.timeLimit) {
    setTimerActive(true);
  }
};

const startNewRound = (
  gameState: GameState,
  setGameState: Dispatch<SetStateAction<GameState>>,
  setTimerActive: Dispatch<SetStateAction<boolean>>,
) => {
  const newPlayerIndex =
    (gameState.currentPlayerIndex + 1) % gameState.players.length;
  const newRound =
    newPlayerIndex === 0 ? gameState.round + 1 : gameState.round;

  const tempGameState = {
    ...gameState,
    currentPlayerIndex: newPlayerIndex,
    round: newRound,
  };

  const newDare = getRandomDare(tempGameState);
  const newPlayer = gameState.players[newPlayerIndex] ?? basicPlayer;
  const partners =
    newDare.partnersCount > 0
      ? getRandomPartners(
          newDare.partnersCount || 1,
          gameState.players,
          newPlayer,
        )
      : [];

  const newDareHistoryEntry: DareHistoryEntry = {
    dare: newDare,
    player: newPlayer,
    round: newRound,
  };

  setGameState((prev) => ({
    ...prev,
    currentPlayerIndex: newPlayerIndex,
    currentDare: newDare,
    currentPartners: partners,
    timeRemaining: newDare.timeLimit,
    dareSkipsLeft: INITIAL_SKIPS,
    partnerSkipsLeft: INITIAL_SKIPS,
    round: newRound,
    dareHistory: [...prev.dareHistory, newDareHistoryEntry],
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
      gameState,
      DARES.filter((el) => el.text !== gameState.currentDare.text),
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
  basicDare,
  basicPlayer,
  getRandomDare,
  getRandomPartners,
  startNewRound,
  startFirstRound,
  handleSkipDare,
  handleSkipPartner,
};
