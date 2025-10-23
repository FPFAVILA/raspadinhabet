import { useState, useEffect, useCallback } from 'react';
import { GameState, ScratchCard, ScratchBlock } from '../types';

const GAME_STATE_KEY = 'raspadinha_game_state';
const CARD_COST = 4.90;

// Lógica de vitória - Rodadas premiadas: 3ª (R$30), 7ª (R$20), 12ª (iPhone)
const getWinLogic = (roundNumber: number) => {
  console.log('🎮 Verificando lógica para rodada:', roundNumber);

  // Rodada 3 - ganha R$ 30,00
  if (roundNumber === 3) {
    console.log('💰 Rodada 3: Vai ganhar R$ 30,00');
    return { shouldWin: true, prizeAmount: 30.00, prizeType: 'money' };
  }

  // Rodada 7 - ganha R$ 20,00
  if (roundNumber === 7) {
    console.log('💰 Rodada 7: Vai ganhar R$ 20,00');
    return { shouldWin: true, prizeAmount: 20.00, prizeType: 'money' };
  }

  // Rodada 12 - ganha iPhone
  if (roundNumber === 12) {
    console.log('📱 Rodada 12: Vai ganhar iPhone');
    return { shouldWin: true, prizeAmount: 0, prizeType: 'iphone' };
  }

  // Todas as outras rodadas não ganham
  console.log('❌ Rodada', roundNumber, ': Não ganha nada');
  return { shouldWin: false, prizeAmount: 0, prizeType: 'money' };
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

  // Criar padrão vencedor (linha horizontal no meio - posições 3, 4, 5)
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
    balance: 0,
    scratchCardsUsed: 0,
    hasWonIphone: false
  });

  const [isNewUser, setIsNewUser] = useState(true);

  // Carregar estado do jogo do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(GAME_STATE_KEY);

      if (saved) {
        const parsedState = JSON.parse(saved);
        console.log('📊 Estado carregado:', parsedState);
        setGameState(parsedState);
        setIsNewUser(false);
      } else {
        console.log('🆕 Novo usuário - sem estado salvo');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar estado do jogo:', error);
    }
  }, []);

  // Salvar estado no localStorage sempre que mudar
  const saveGameState = useCallback((newState: GameState) => {
    try {
      console.log('💾 Salvando estado:', newState);
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(newState));
      setGameState(newState);
    } catch (error) {
      console.error('❌ Erro ao salvar estado do jogo:', error);
    }
  }, []);

  // Iniciar nova carta
  const startNewCard = useCallback((): ScratchCard | null => {
    console.log('🎮 startNewCard - Estado atual:', gameState);
    console.log('🎮 startNewCard - Saldo:', gameState.balance, 'Custo:', CARD_COST);

    // Verificar se tem saldo suficiente - comparação com arredondamento
    const hasEnoughBalance = Math.round(gameState.balance * 100) >= Math.round(CARD_COST * 100);

    if (!hasEnoughBalance) {
      console.log('❌ Saldo insuficiente:', gameState.balance, '<', CARD_COST);
      return null;
    }

    const newRound = gameState.scratchCardsUsed + 1;
    console.log('🎮 Iniciando rodada:', newRound);

    const winLogic = getWinLogic(newRound);

    // Gerar carta baseada na lógica de vitória
    const card = winLogic.shouldWin
      ? generateWinningCard(winLogic.prizeAmount, winLogic.prizeType as 'money' | 'iphone')
      : generateLosingCard();

    // Atualizar estado: descontar o custo e incrementar rodadas
    // Usar arredondamento para evitar problemas de float
    const newBalance = Math.round((gameState.balance - CARD_COST) * 100) / 100;

    const newState: GameState = {
      ...gameState,
      balance: newBalance,
      scratchCardsUsed: newRound
    };

    console.log('💾 Novo estado após jogar:', newState);
    saveGameState(newState);
    return card;
  }, [gameState, saveGameState]);

  // Completar carta e adicionar prêmio
  const completeCard = useCallback((card: ScratchCard) => {
    console.log('✅ Completando carta:', card);

    if (!card.hasWon) {
      console.log('😢 Carta perdedora - sem prêmio');
      return;
    }

    let newState = { ...gameState };

    if (card.prizeType === 'iphone') {
      console.log('🎁 GANHOU IPHONE!');
      newState.hasWonIphone = true;
    } else if (card.prizeAmount && card.prizeAmount > 0) {
      console.log('💰 Ganhou R$', card.prizeAmount);
      // Usar arredondamento para evitar problemas de float
      newState.balance = Math.round((gameState.balance + card.prizeAmount) * 100) / 100;
    }

    console.log('💾 Estado após ganhar prêmio:', newState);
    saveGameState(newState);
  }, [gameState, saveGameState]);

  // Adicionar saldo
  const addBalance = useCallback((amount: number) => {
    console.log('💵 Adicionando saldo:', amount);
    // Usar arredondamento para evitar problemas de float
    const newBalance = Math.round((gameState.balance + amount) * 100) / 100;
    const newState: GameState = {
      ...gameState,
      balance: newBalance
    };
    console.log('💾 Estado após adicionar saldo:', newState);
    saveGameState(newState);
  }, [gameState, saveGameState]);

  return {
    gameState,
    isNewUser,
    startNewCard,
    completeCard,
    addBalance
  };
};
