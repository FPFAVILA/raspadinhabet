export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  registeredAt: Date;
}

export interface GameState {
  balance: number;
  scratchCardsUsed: number;
  hasWonIphone: boolean;
}

export interface ScratchCard {
  id: string;
  cost: number;
  grid: ScratchBlock[];
  isCompleted: boolean;
  hasWon: boolean;
  prizeAmount?: number;
  prizeType?: 'money' | 'iphone';
}

export interface ScratchBlock {
  id: number;
  isRevealed: boolean;
  symbol: string;
  position: { x: number; y: number };
}

export interface SocialProofNotification {
  id: string;
  user: string;
  prize: string;
  timestamp: Date;
}