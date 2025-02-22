export interface Player {
  name: string;
  id: string;
}

export interface Dare {
  text: string;
  hasPartner: boolean;
  timeLimit?: number;
  isUnskippable: boolean;
  partnersCount?: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  dareSkipsLeft: number;
  partnerSkipsLeft: number;
  currentDare: Dare | null;
  currentPartners: Player[] | null;
  timeRemaining?: number;
}

export const INITIAL_SKIPS = 3;

// "Take a selfie with your partner and post it on social media",
// "Do your best impression of your partner",
// "Create a 30-second dance routine with your partner",
// "Play rock, paper, scissors with your partner - loser drinks",
// "Tell an embarrassing story about yourself to your partner",
// "Give your partner a compliment and take a drink",
// "Play the staring contest with your partner - first to blink drinks",
// "Make up a short rap about your partner",
// "Switch shirts with your partner for the next round",
// "Do 10 jumping jacks while your partner counts loudly",

const solo_dares: Dare[] = [
  {
    text: "Do your best dance move",
    hasPartner: false,
    isUnskippable: false,
  },
  {
    text: "Tell your most embarrassing drinking story",
    hasPartner: false,
    isUnskippable: false,
  },
];

const partner_dares: Dare[] = [
  {
    text: "Take a selfie with your partner and post it on social media",
    hasPartner: true,
    isUnskippable: false,
  },
  {
    text: "Play rock, paper, scissors with your partner - loser drinks",
    hasPartner: true,
    isUnskippable: false,
  },
];

const timed_dares: Dare[] = [
  {
    text: "Hold a plank position",
    hasPartner: false,
    timeLimit: 30,
    isUnskippable: false,
  },
  {
    text: "Maintain eye contact with your partner",
    hasPartner: true,
    timeLimit: 45,
    isUnskippable: false,
  },
];

const unskippable_dares: Dare[] = [
  {
    text: "Hold a plank position",
    hasPartner: false,
    timeLimit: 30,
    isUnskippable: false,
  },
  {
    text: "Maintain eye contact with your partner",
    hasPartner: true,
    timeLimit: 45,
    isUnskippable: false,
  },
];

const multi_partner_dares: Dare[] = [
  {
    text: "Form a human pyramid with three players",
    hasPartner: true,
    partnersCount: 2,
    isUnskippable: false,
  },
  {
    text: "Create a synchronized dance routine",
    hasPartner: true,
    partnersCount: 2,
    timeLimit: 60,
    isUnskippable: true,
  },
];

export const custom_dares: Dare[] = [];

export const DARES: Dare[] = [
  ...solo_dares,
  ...partner_dares,
  ...timed_dares,
  ...unskippable_dares,
  ...multi_partner_dares,
  ...custom_dares,
];

const dares = [
  { time: 0, solo: true, unskippable: false, dare: "Do your best dance move" },
  { time: 0, solo: true, unskippable: false, dare: "Tell a joke" },
  { time: 0, solo: true, unskippable: false, dare: "Do 10 push-ups" },
  { time: 0, solo: true, unskippable: false, dare: "Sing the chorus of your favorite song" },
  { time: 0, solo: true, unskippable: false, dare: "Do an impression of a celebrity" },
  { time: 0, solo: true, unskippable: false, dare: "Tell an embarrassing story" },
  { time: 0, solo: true, unskippable: false, dare: "Do a handstand (or try to)" },
  { time: 0, solo: true, unskippable: false, dare: "Speak in an accent for the next round" },
  { time: 0, solo: true, unskippable: false, dare: "Show the most embarrassing photo on your phone" },
  { time: 0, solo: true, unskippable: false, dare: "Call a friend and sing them 'Happy Birthday'" },
  { time: 3, solo: false, unskippable: true, dare: "Прошепни на партньора си, че много ти се ебе" },
];
