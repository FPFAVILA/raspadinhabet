import { useState, useEffect, useCallback } from 'react';
import { GameState, ScratchCard, ScratchBlock } from '../types';

const GAME_STATE_KEY = 'raspadinha_game_state';
const REGISTRATION_BONUS_KEY = 'raspadinha_registration_bonus';
const INITIAL_BALANCE = 0;
const CARD_COST = 4.90;

// Lógica de vitória otimizada e limpa
const getWinLogic = (roundNumber: number) => {
  if (roundNumber === 1) return { shouldWin: false, prizeAmount: 0, prizeType: 'money', isFree: false }; // Primeira rodada - custa R$ 4,90 - não ganha
  if (roundNumber === 2) return { shouldWin: true, prizeAmount: 20.00, prizeType: 'money', isFree: false }; // Segunda rodada - ganha R$ 20
  if (roundNumber === 3) return { shouldWin: false, prizeAmount: 0, prizeType: 'money', isFree: false };
  if (roundNumber === 4) return { shouldWin: false, prizeAmount: 0, prizeType: 'money', isFree: false };
  if (roundNumber === 5) return { shouldWin: false, prizeAmount: 0, prizeType: 'money', isFree: false };
  if (roundNumber === 6) return { shouldWin: false, prizeAmount: 0, prizeType: 'money', isFree: false };
  if (roundNumber === 7) return { shouldWin: true, prizeAmount: 0, prizeType: 'iphone', isFree: false }; // Sétima rodada - ganha iPhone

  // Rodadas 8+ com 15% de chance
  const shouldWin = Math.random() < 0.15;
  if (shouldWin) {
    const prizes = [30, 50, 100, 200];
    const prizeAmount = prizes[Math.floor(Math.random() * prizes.length)];
    return { shouldWin: true, prizeAmount, prizeType: 'money', isFree: false };
  }

  return { shouldWin: false, prizeAmount: 0, prizeType: 'money', isFree: false };
};

// Função para calcular a "chance" ilusória baseada na rodada
const getWinChance = (roundNumber: number) => {
  if (roundNumber === 1) return 25; // Primeira rodada - chance baixa
  if (roundNumber === 2) return 58; // Segunda rodada - chance boa (vai ganhar R$ 20)
  if (roundNumber === 3) return 28; // Terceira rodada - chance baixa
  if (roundNumber === 4) return 32; // Quarta rodada - chance média
  if (roundNumber === 5) return 30; // Quinta rodada - chance baixa
  if (roundNumber === 6) return 35; // Sexta rodada - chance média
  if (roundNumber === 7) return 68; // Sétima rodada - chance alta (iPhone)

  // Rodadas 8+ - variação aleatória entre 25-60%
  return Math.floor(Math.random() * 35) + 25;
};

const generateWinningCard = (prizeAmount: number, prizeType: 'money' | 'iphone'): ScratchCard => {
  const grid: ScratchBlock[] = [];

  let winningSymbol: string;

  if (prizeType === 'iphone') {
    winningSymbol = '/iphone_13_PNG31.png';
  } else {
    winningSymbol = '💰';
  }

  const moneySymbols = ['💵', '💰', '💸', '🪙', '🤑'];
  const appleImages = [
    '/iphone_11_PNG20.png',
    '/pngimg.com - iphone_14_PNG41.png',
    '/Apple-iPhone-15-Pro-Max-Blue-Titanium-frontimage.webp',
    '/Airpods-Transparent-Images-PNG.png',
    '/Apple-Watch-PNG-High-Quality-Image.png'
  ];

  const allSymbols = [...moneySymbols, ...appleImages];

  // Criar padrão vencedor (linha horizontal no meio)
  for (let i = 0; i < 9; i++) {
    const isWinningPosition = i >= 3 && i <= 5;
    grid.push({
      id: i,
      isRevealed: false,
      symbol: isWinningPosition ? winningSymbol : allSymbols[Math.floor(Math.random() * allSymbols.length)],
      position: { x: i % 3, y: Math.floor(i / 3) }
    });
  }

  return {
    id: `card_${Date.now()}`,
    cost: CARD_COST,
    grid,
    isCompleted: false,
    hasWon: true,
    prizeAmount: prizeType === 'iphone' ? 4899 : prizeAmount,
    prizeType,
  };
};

const generateLosingCard = (): ScratchCard => {
  const moneySymbols = ['💵', '💰', '💸', '🪙', '🤑'];
  const appleImages = [
    '/iphone_11_PNG20.png',
    '/iphone_13_PNG31.png',
    '/pngimg.com - iphone_14_PNG41.png',
    '/Apple-iPhone-15-Pro-Max-Blue-Titanium-frontimage.webp',
    '/Airpods-Transparent-Images-PNG.png',
    '/Apple-Watch-PNG-High-Quality-Image.png'
  ];

  const allSymbols = [...moneySymbols, ...appleImages];
  const grid: ScratchBlock[] = [];

  for (let i = 0; i < 9; i++) {
    let symbol;
    let attempts = 0;
    do {
      const rand = Math.random();
      if (rand < 0.7) {
        symbol = moneySymbols[Math.floor(Math.random() * moneySymbols.length)];
      } else {
        symbol = appleImages[Math.floor(Math.random() * appleImages.length)];
      }
      attempts++;
    } while (wouldCreateWinningPattern(grid, i, symbol) && attempts < 50);

    if (attempts >= 50) {
      symbol = allSymbols[Math.floor(Math.random() * allSymbols.length)];
    }

    grid.push({
      id: i,
      isRevealed: false,
      symbol,
      position: { x: i % 3, y: Math.floor(i / 3) }
    });
  }

  return {
    id: `card_${Date.now()}`,
    cost: CARD_COST,
    grid,
    isCompleted: false,
    hasWon: false,
  };
};

const wouldCreateWinningPattern = (grid: ScratchBlock[], position: number, symbol: string): boolean => {
  const tempGrid = [...grid];
  tempGrid[position] = {
    id: position,
    isRevealed: false,
    symbol,
    position: { x: position % 3, y: Math.floor(position / 3) }
  };
  
  const patterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontais
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticais
    [0, 4, 8], [2, 4, 6] // Diagonais
  ];
  
  return patterns.some(pattern => {
    const symbols = pattern.map(i => tempGrid[i]?.symbol).filter(Boolean);
    return symbols.length === 3 && symbols.every(s => s === symbols[0]);
  });
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    balance: INITIAL_BALANCE,
    scratchCardsUsed: 0,
    hasWonIphone: false
  });
  
  const [isNewUser, setIsNewUser] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(GAME_STATE_KEY);
      const hasBonus = localStorage.getItem(REGISTRATION_BONUS_KEY);

      if (saved) {
        const parsedState = JSON.parse(saved);
        setGameState(parsedState);
        setIsNewUser(false);
      } else if (!hasBonus) {
        setGameState({
          balance: 0,
          scratchCardsUsed: 0,
          hasWonIphone: false
        });
        setIsNewUser(false);
      }
    } catch (error) {
      console.error('Erro ao carregar estado do jogo:', error);
    }
  }, []);

  const saveGameState = useCallback((newState: GameState) => {
    try {
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(newState));
      setGameState(newState);
    } catch (error) {
      console.error('Erro ao salvar estado do jogo:', error);
    }
  }, []);

  const startNewCard = useCallback((): ScratchCard | null => {
    const newRound = gameState.scratchCardsUsed + 1;
    const winLogic = getWinLogic(newRound);

    // Verificar se tem saldo suficiente (não há mais rodadas grátis)
    if (gameState.balance < CARD_COST) {
      return null;
    }

    const card = winLogic.shouldWin
      ? generateWinningCard(winLogic.prizeAmount, winLogic.prizeType as 'money' | 'iphone')
      : generateLosingCard();

    const newState = {
      ...gameState,
      balance: gameState.balance - CARD_COST,
      scratchCardsUsed: newRound
    };

    saveGameState(newState);
    return card;
  }, [gameState, saveGameState]);

  const completeCard = useCallback((card: ScratchCard) => {
    if (!card.hasWon) return;

    let newState = { ...gameState };

    if (card.prizeType === 'iphone') {
      newState.hasWonIphone = true;
    } else if (card.prizeAmount) {
      newState.balance += card.prizeAmount;
    }

    saveGameState(newState);
  }, [gameState, saveGameState]);

  const addBalance = useCallback((amount: number) => {
    const newState = {
      ...gameState,
      balance: gameState.balance + amount
    };
    saveGameState(newState);
  }, [gameState, saveGameState]);

  const getNextRoundChance = useCallback(() => {
    const nextRound = gameState.scratchCardsUsed + 1;
    return getWinChance(nextRound);
  }, [gameState.scratchCardsUsed]);

  return {
    gameState,
    isNewUser,
    startNewCard,
    completeCard,
    addBalance,
    getNextRoundChance
  };
};