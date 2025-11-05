export interface Player {
  name: string;
  id: number;
}

export interface Dare {
  text: string;
  bonusText?: string;
  timeLimit?: number;
  isUnskippable: boolean;
  shouldLockDone?: boolean;
  partnersCount: number;
}

export interface DareHistoryEntry {
  dare: Dare;
  player: Player;
  round: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  dareSkipsLeft: number;
  partnerSkipsLeft: number;
  currentDare: Dare;
  currentPartners: Player[];
  timeRemaining?: number;
  round: number;
  dareHistory: DareHistoryEntry[];
}

export const INITIAL_SKIPS = 3;

// "Do your best impression of your partner",
// "Create a 30-second dance routine with your partner",
// "Tell an embarrassing story about yourself to your partner",
// "Give your partner a compliment and take a drink",
// "Play the staring contest with your partner - first to blink drinks",
// "Make up a short rap about your partner",
// "Switch shirts with your partner for the next round",
// "Do 10 jumping jacks while your partner counts loudly",
